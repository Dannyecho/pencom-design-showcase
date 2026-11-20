"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { go } from "@/views/home/SiteSearch";

/**
 * First-visit promotional popup. Shown once per browser (localStorage), a moment after the page loads.
 * Add ?promo=1 to the URL to show it again for testing.
 * Several banners → swipe/drag, arrows, dots and keyboard arrows. One banner → a plain popup.
 * Banners carry optional start/end dates so expired campaigns drop out on their own.
 */
export type Promo = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; href?: string; chat?: boolean; external?: boolean };
  image: string;
  alt: string;
  starts?: string;
  ends?: string;
};

const today = new Date().toISOString().slice(0, 10);

export const promos: Promo[] = [
  {
    id: "pencare-2026",
    eyebrow: "Now open",
    title: "Health cover that continues after you retire",
    text: "Retirees on Programmed Withdrawal can now enrol in Pencare. Find out if you qualify and how to join.",
    cta: { label: "Join Pencare", href: "/services#pencare" },
    image: "/images/site/retiree-health-check-960.webp",
    alt: "A retiree having a health check with a doctor",
  },
  {
    id: "ppp-2026",
    eyebrow: "Personal Pension Plan",
    title: "Self-employed? Start your pension today",
    text: "Save any amount, at your own pace, with a licensed Pension Fund Administrator.",
    cta: { label: "Start saving", href: "/services#ppp" },
    image: "/images/site/market-street-960.webp",
    alt: "Traders at a busy street market",
  },
  {
    id: "remit-deadline",
    eyebrow: "Employers",
    title: "Remit contributions by the 7th of every month",
    text: "Late remittance attracts penalties. Remit online through PCRS and keep your PCC valid.",
    cta: { label: "Remit through PCRS", href: "https://pcrs.pencom.gov.ng", external: true },
    image: "/images/site/signing-document-960.webp",
    alt: "A person signing a document at a desk",
  },
].filter((p: Promo) => (!p.starts || p.starts <= today) && (!p.ends || p.ends >= today));

const KEY = "pencom:promo-seen";

/** The popup is closed (or the page left before it showed): let waiting surprises go ahead. */
function promoDone() {
  if (!document.documentElement.dataset.promo) return;
  delete document.documentElement.dataset.promo;
  window.dispatchEvent(new Event("pencom:promo-done"));
}
const DELAY = 1400;

export default function PromoPopup({ items = promos }: { items?: Promo[] }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const many = items.length > 1;

  // Show once, a moment after the first load.
  useEffect(() => {
    if (!items.length) return;
    let seen = false;
    try {
      const force = /[?&]promo=1/.test(window.location.href);
      seen = !force && localStorage.getItem(KEY) === "1";
    } catch {
      /* storage unavailable: show it */
    }
    if (seen) return;
    // Other first-load surprises (the notices preview) wait until the popup is done.
    document.documentElement.dataset.promo = "pending";
    const id = window.setTimeout(() => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      document.documentElement.dataset.promo = "open";
      setOpen(true);
    }, DELAY);
    return () => {
      window.clearTimeout(id);
      promoDone();
    };
  }, [items.length]);

  const close = useCallback(() => {
    setOpen(false);
    promoDone();
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => lastFocus.current?.focus?.(), 0);
  }, []);

  const paginate = useCallback(
    (d: number) => setPage(([i]) => [(i + d + items.length) % items.length, d]),
    [items.length],
  );
  const jump = (i: number) => setPage(([cur]) => [i, i > cur ? 1 : -1]);

  // Keyboard: Escape closes, arrows slide, Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t0 = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (many && e.key === "ArrowRight") paginate(1);
      if (many && e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]")].filter((el) => !el.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t0);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, many, close, paginate]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -60) paginate(1);
    else if (swipe > 60) paginate(-1);
  };

  const p = items[index];
  const focus = "focus-visible:outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

  return (
    <AnimatePresence>
      {open && p && (
        <motion.div
          key="promo"
          className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={t("Close")}
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-[#04140A]/60 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-roledescription={many ? t("carousel") : undefined}
            aria-labelledby="promo-title"
            className="relative max-h-[calc(100svh-1.5rem)] w-full max-w-[880px] overflow-y-auto overflow-x-hidden rounded-[28px] bg-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.55)]"
            initial={{ y: reduce ? 0 : 60, scale: reduce ? 1 : 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("Close")}
              className={cn(
                "absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-[#0B1F10] shadow-lg backdrop-blur transition hover:rotate-90 hover:bg-white",
                focus,
              )}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative min-h-[39rem] sm:min-h-0 sm:h-[31rem]">
              <AnimatePresence initial={false} custom={dir} mode="wait">
                <motion.div
                  key={p.id}
                  custom={dir}
                  className={cn("grid min-h-[39rem] sm:min-h-0 sm:h-[31rem] sm:grid-cols-[1.05fr_1fr]", many && "touch-pan-y")}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {/* Image */}
                  <motion.div
                    className="relative h-56 overflow-hidden sm:h-full"
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: reduce ? 0 : d * 80, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: reduce ? 0 : d * -80, opacity: 0 }),
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    drag={many ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={many ? onDragEnd : undefined}
                  >
                    <motion.img
                      src={p.image}
                      alt={t(p.alt)}
                      draggable={false}
                      className="h-full w-full select-none object-cover"
                      initial={{ scale: reduce ? 1 : 1.12 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04140A]/70 via-transparent to-transparent sm:hidden" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#FFD84D] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#04140A] shadow">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#007E2F]" />
                      {t(p.eyebrow)}
                    </span>
                  </motion.div>

                  {/* Copy */}
                  <motion.div
                    className="flex flex-col justify-center gap-4 p-6 sm:p-9"
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: reduce ? 0 : d * 40, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: reduce ? 0 : d * -40, opacity: 0 }),
                    }}
                    transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                    drag={many ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={many ? onDragEnd : undefined}
                  >
                    {many && (
                      <p className="font-mono text-sm font-semibold text-[#007E2F]" aria-live="polite">
                        <span className="text-xl font-bold text-[#0B1F10]">{String(index + 1).padStart(2, "0")}</span>
                        {" / "}
                        {String(items.length).padStart(2, "0")}
                        <span className="sr-only">{t(p.title)}</span>
                      </p>
                    )}
                    <h2 id="promo-title" className="text-2xl font-black leading-tight text-[#0B1F10] sm:text-[2rem]">
                      {t(p.title)}
                    </h2>
                    <p className="text-base leading-relaxed text-[#3B4A40] sm:text-lg">{t(p.text)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        data-autofocus
                        onClick={() => {
                          close();
                          go(p.cta, navigate);
                        }}
                        className={cn(
                          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#007E2F] py-3 pl-6 pr-2 text-base font-bold text-white shadow-[0_14px_30px_-10px_rgba(0,126,47,0.7)] transition hover:bg-[#006626]",
                          focus,
                        )}
                      >
                        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 motion-safe:animate-[promo-shine_2.8s_ease-in-out_1.2s_2]" />
                        {t(p.cta.label)}
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFD84D] text-[#04140A] transition group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={close}
                        className={cn("rounded-full px-4 py-3 text-base font-semibold text-[#3B4A40] underline-offset-4 hover:underline", focus)}
                      >
                        {t("Maybe later")}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {many && (
              <div className="flex items-center justify-between gap-4 border-t border-[#E3EBE5] px-6 py-4 sm:px-9">
                <div className="flex items-center gap-2" role="group" aria-label={t("Choose a banner")}>
                  {items.map((it, i) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => jump(i)}
                      aria-label={t("Show banner {n}", { n: i + 1 })}
                      aria-current={i === index ? "true" : undefined}
                      className={cn("grid h-8 place-items-center rounded-full", focus)}
                    >
                      <span
                        className={cn(
                          "block h-2.5 rounded-full transition-all duration-300",
                          i === index ? "w-9 bg-[#007E2F]" : "w-2.5 bg-[#C7D6CC] hover:bg-[#8FB09A]",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-1 hidden text-sm text-[#5B6B60] sm:inline">{t("Swipe or use the arrows")}</span>
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    aria-label={t("Previous banner")}
                    className={cn("grid h-11 w-11 place-items-center rounded-full border border-[#C7D6CC] text-[#0B1F10] transition hover:border-[#007E2F] hover:bg-[#EAF5EE]", focus)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    aria-label={t("Next banner")}
                    className={cn("grid h-11 w-11 place-items-center rounded-full bg-[#0B1F10] text-white transition hover:bg-[#007E2F]", focus)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
          <style>{`@keyframes promo-shine{0%{left:-50%}60%,100%{left:130%}}`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
