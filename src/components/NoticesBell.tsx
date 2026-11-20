"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, Bell, CheckCheck, CheckCircle2, ChevronDown, Info, RotateCcw, ShieldAlert, X } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { siteNotices, type NoticeType } from "@/lib/alerts";
import { cn } from "@/lib/utils";

const look: Record<NoticeType, { icon: typeof Info; label: string; chip: string; text: string; dot: string }> = {
  critical: { icon: ShieldAlert, label: "Critical", chip: "bg-[#FCEBEB] text-[#A32D2D]", text: "text-[#A32D2D]", dot: "bg-[#D32F2F]" },
  warning: { icon: AlertTriangle, label: "Warning", chip: "bg-[#FAEEDA] text-[#854F0B]", text: "text-[#854F0B]", dot: "bg-[#D97706]" },
  info: { icon: Info, label: "Information", chip: "bg-[#E6F1FB] text-[#185FA5]", text: "text-[#185FA5]", dot: "bg-[#1E88E5]" },
  success: { icon: CheckCircle2, label: "Update", chip: "bg-[#E8F5E9] text-[#117F21]", text: "text-[#117F21]", dot: "bg-[#2E913D]" },
};

const READ = "pencom:notices-read";
const PREVIEWED = "pencom:notices-previewed"; // per browser session: the preview opens once per visit
const GONE = "pencom:alerts-closed"; // same key the old banner used, so earlier dismissals carry over
const load = (k: string): string[] => {
  try {
    return JSON.parse(window.localStorage.getItem(k) ?? "[]");
  } catch {
    return [];
  }
};
const save = (k: string, v: string[]) => {
  try {
    window.localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage unavailable: lasts for this visit */
  }
};

/**
 * Header bell with a notices panel (all pages). A badge counts unread notices; a critical
 * unread notice turns the badge red and gives the bell a brief shake when the page loads.
 * Readers can mark everything read, dismiss single notices, and bring dismissed ones back.
 * On the first page load of a visit, the panel opens by itself showing the top notice only, with a
 * button to expand the full list. It never closes on its own: readers close it with ×, the bell or Escape.
 * Opening it from the bell shows the full list.
 */
export default function NoticesBell() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false); // opened by itself: one notice + expand button
  // Saved read/dismissed lists are loaded after the first render, so the server and browser HTML match.
  const [read, setRead] = useState<string[]>([]);
  const [gone, setGone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const shown = siteNotices.filter((n) => !gone.includes(n.id));
  const unread = shown.filter((n) => !read.includes(n.id));
  const urgent = unread.some((n) => n.type === "critical");

  // First load of the visit: open the panel with the top notice, if there is anything unread.
  useEffect(() => {
    let done = false;
    try {
      done = window.sessionStorage.getItem(PREVIEWED) === "1";
    } catch {
      /* storage unavailable */
    }
    const readNow = load(READ);
    const goneNow = load(GONE);
    setRead(readNow);
    setGone(goneNow);
    setReady(true);
    const unreadNow = siteNotices.filter((n) => !goneNow.includes(n.id) && !readNow.includes(n.id));
    if (done || unreadNow.length === 0) return;
    let id = 0;
    const show = () => {
      setPreview(true);
      setOpen(true);
      try {
        window.sessionStorage.setItem(PREVIEWED, "1");
      } catch {
        /* ignore */
      }
    };
    const afterPromo = () => {
      window.clearTimeout(id);
      id = window.setTimeout(show, 600);
    };
    id = window.setTimeout(() => {
      // A first-visit popup is on its way or open: wait for it to close.
      if (document.documentElement.dataset.promo) window.addEventListener("pencom:promo-done", afterPromo, { once: true });
      else show();
    }, 900);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("pencom:promo-done", afterPromo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) save(READ, read);
  }, [read, ready]);
  useEffect(() => {
    if (ready) save(GONE, gone);
  }, [gone, ready]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !preview && !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    if (!preview) panel.current?.focus(); // don't pull focus away when it opened by itself
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, preview]);

  const markAll = () => setRead((r) => Array.from(new Set([...r, ...shown.map((n) => n.id)])));
  const markOne = (id: string) => setRead((r) => (r.includes(id) ? r : [...r, id]));
  const dismiss = (id: string) => setGone((g) => [...g, id]);

  const label = unread.length ? t("Notices, {n} unread", { n: unread.length }) : t("Notices");

  return (
    <div ref={wrap} className="relative">
      <motion.button
        ref={btn}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="notices-panel"
        aria-label={label}
        title={label}
        data-i18n-done
        onClick={() => {
          setPreview(false);
          setOpen((o) => !o);
        }}
        animate={urgent && !reduce ? { rotate: [0, -14, 12, -10, 8, -4, 0] } : undefined}
        transition={{ duration: 0.9, delay: 1.2, repeat: 1, repeatDelay: 2.5 }}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
          open ? "border-[#117F21] bg-[#E8F5E9] text-[#117F21]" : "border-gray-200 text-gray-700 hover:border-[#117F21] hover:bg-[#F4F7F2] hover:text-[#117F21]",
        )}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <AnimatePresence>
          {unread.length > 0 && (
            <motion.span
              key={unread.length}
              initial={{ scale: reduce ? 1 : 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              aria-hidden="true"
              className={cn(
                "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white ring-2 ring-white",
                urgent ? "bg-[#D32F2F]" : "bg-[#117F21]",
              )}
            >
              {unread.length}
              {urgent && !reduce && <span className="absolute inset-0 animate-ping rounded-full bg-[#D32F2F]/50 [animation-iteration-count:3]" />}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="notices-panel"
            role="dialog"
            aria-label={t("Notices")}
            tabIndex={-1}
            initial={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-3 top-[96px] z-[70] origin-top-right overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_30px_70px_-20px_rgba(4,36,10,0.5)] ring-1 ring-black/5 focus:outline-none sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[25rem]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-[#0A2E10]">
                  <Bell className="h-4 w-4 text-[#117F21]" aria-hidden="true" />
                  {t("Notices")}
                </p>
                <p className="text-xs text-gray-500" data-i18n-done>
                  {unread.length ? t("{n} unread", { n: unread.length }) : t("You're up to date")}
                </p>
              </div>
              <div className="flex items-center gap-1">
              {unread.length > 0 && !preview && (
                <button type="button" onClick={markAll} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#117F21] hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                  {t("Mark all as read")}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPreview(false);
                  btn.current?.focus();
                }}
                aria-label={t("Close notices")}
                title={t("Close notices")}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              </div>
            </div>

            <ul className="max-h-[min(60vh,26rem)] overflow-y-auto">
              <AnimatePresence initial={false}>
                {(preview ? shown.slice(0, 1) : shown).map((n) => {
                  const s = look[n.type];
                  const Icon = s.icon;
                  const isNew = !read.includes(n.id);
                  return (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                      className={cn("relative border-b border-gray-100 last:border-0", isNew && "bg-[#F7FAF6]")}
                    >
                      <div className="flex gap-3 px-4 py-3.5">
                        <span className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", s.chip)}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-x-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                            <span className={s.text}>{t(s.label)}</span>
                            {isNew && (
                              <span className="inline-flex items-center gap-1 text-[#117F21]">
                                <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} aria-hidden="true" />
                                {t("New")}
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-[#0A2E10]">{t(n.title)}</p>
                          <p className="mt-0.5 text-sm leading-snug text-gray-600">{t(n.message)}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {n.link && (
                              <Link
                                to={n.link.to}
                                onClick={() => {
                                  markOne(n.id);
                                  setOpen(false);
                                }}
                                className={cn("group inline-flex items-center gap-1 text-sm font-semibold hover:underline", s.text)}
                              >
                                {t(n.link.label)}
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                              </Link>
                            )}
                            {isNew && (
                              <button type="button" onClick={() => markOne(n.id)} className="text-xs font-semibold text-gray-500 hover:text-gray-900 hover:underline">
                                {t("Mark as read")}
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismiss(n.id)}
                          aria-label={`${t("Dismiss notice")}: ${t(n.title)}`}
                          title={t("Dismiss notice")}
                          data-i18n-done
                          className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:rotate-90 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
              {shown.length === 0 && (
                <li className="px-4 py-10 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-[#117F21]">
                    <CheckCheck className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#0A2E10]">{t("No notices right now")}</p>
                </li>
              )}
            </ul>

            {preview && shown.length > 1 && (
              <button
                type="button"
                onClick={() => setPreview(false)}
                aria-expanded="false"
                aria-controls="notices-panel"
                data-i18n-done
                className="group flex w-full items-center justify-center gap-2 border-t border-gray-100 bg-[#F4F7F2] px-4 py-3 text-sm font-semibold text-[#117F21] transition hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]"
              >
                {t("Show all {n} notices", { n: shown.length })}
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
            )}

            {!preview && gone.some((id) => siteNotices.some((n) => n.id === id)) && (
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5">
                <button type="button" onClick={() => setGone([])} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("Show dismissed notices")}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite" data-i18n-done>
        {unread.length ? t("Notices, {n} unread", { n: unread.length }) : ""}
      </span>
    </div>
  );
}
