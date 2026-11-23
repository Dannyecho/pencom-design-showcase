"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import Ghost from "./Ghost";

/**
 * Building blocks shared by every inner page of the showcase theme, so pages stay consistent with the home
 * page: the dark cinematic page hero (glows, grid, drifting ghost word, gold gradient title), the floating
 * panel, the sticky "On this page" bar, a scroll reveal, and accessible modal and drawer.
 */

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
/** Section spacing; scroll margin clears the header and the section bar. */
export const sectionCls = "scroll-mt-[170px] overflow-x-clip px-4 py-20 sm:py-28";

export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Track the pointer in CSS variables so a soft spotlight follows it across a card. */
export const spot = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

/** The near-black band with gold and green glows and a faint grid (hero, document hero, dark bands). */
export function DarkBackdrop({ animate = true }: { animate?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 print:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.30),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(54,160,69,0.40),transparent)]" />
      {animate && (
        <motion.div
          className="absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full bg-[#14892A]/25 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 80, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
    </div>
  );
}

/* ─────────────────────────── Page hero ─────────────────────────── */

export function PageHero({
  id,
  crumbs,
  pill,
  title,
  mark,
  intro,
  actions,
  aside,
}: {
  id: string;
  crumbs: { label: string; to?: string }[];
  pill: { icon: LucideIcon; label: string };
  title: string;
  /** Words in the title filled with the gold gradient. */
  mark: string;
  intro: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  // Translate the whole title, then find the translated highlight in it (word order differs by language).
  const T = t(title);
  const M = t(mark);
  const at = M ? T.toLowerCase().indexOf(M.toLowerCase()) : -1;
  const has = at >= 0;
  const shown = has ? T.slice(at, at + M.length) : "";
  const [before, after] = has ? [T.slice(0, at), T.slice(at + M.length)] : [T, ""];
  const Pill = pill.icon;
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-[#12331C] text-white">
      <DarkBackdrop />
      <Ghost word={pill.label} dark className="bottom-0 top-auto sm:top-auto lg:top-auto" />
      <div className={cn("relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-8 sm:pt-10 lg:pb-28", aside && "lg:grid-cols-12")}>
        <div className={cn(aside ? "lg:col-span-6 lg:pt-6" : "max-w-3xl")}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="text-[#F4D27A]/70">/</span>}
                  {c.to ? (
                    <Link to={c.to} className={cn("rounded hover:text-white hover:underline", focus)}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)]"
          >
            <Pill className="h-3.5 w-3.5" aria-hidden="true" />
            {pill.label}
          </motion.p>
          <motion.h1
            id={id}
            data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="mt-5 text-[2.5rem] font-black leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            {before}
            {has && <span className="bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-transparent">{shown}</span>}
            {after}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/80"
          >
            {intro}
          </motion.div>
          {actions && (
            <motion.div initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease }} className="mt-8 text-[#1A3A22]">
              {actions}
            </motion.div>
          )}
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="relative text-[#1A3A22] lg:col-span-6"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** White panel that floats over the dark hero, with a gold spotlight that follows the pointer. */
export function FramedPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-px -z-10 rounded-[calc(1.75rem+1px)] bg-gradient-to-br from-[#F4D27A]/70 via-white/10 to-[#14892A]/60" />
      <div
        onMouseMove={spot}
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_45%)]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────── On this page ─────────────────────────── */

export function SectionNav({ sections, pillId }: { sections: { id: string; label: string }[]; pillId: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(sections[0].id);

  // Current section: the last one whose top has passed just under the header and this bar.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 200) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-[92px] z-30 px-4 py-3">
      <div className="mx-auto max-w-7xl">
        <ul className="flex gap-1 overflow-x-auto rounded-full bg-white/90 p-1.5 shadow-[0_24px_50px_-30px_rgba(18,51,28,0.7)] ring-1 ring-black/10 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s.id);
                    scrollToId(s.id, !reduce);
                    history.replaceState(null, "", `#${s.id}`);
                  }}
                  aria-current={on ? "location" : undefined}
                  className={cn("relative flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition", on ? "text-[#F4D27A]" : "text-gray-700 hover:bg-[#F2F6F0]", focus)}
                >
                  {on && <motion.span layoutId={pillId} className="absolute inset-0 rounded-full bg-[#1A3A22]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/* ─────────────────────────── Modal ─────────────────────────── */

/**
 * Accessible modal: Escape and the backdrop close it, focus moves to the close button and returns to
 * the control that opened it, and the page behind does not scroll.
 */
export function Modal({ open, onClose, labelledBy, children, className }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      if (opener.current) {
        const el = opener.current;
        opener.current = null;
        window.setTimeout(() => el.focus(), 0);
      }
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (active && !active.closest("[role=dialog]")) opener.current = active;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="modal" className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#12331C]/70 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: reduce ? 0 : 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn("relative max-h-[calc(100svh-1.5rem)] w-full overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)]", className)}
          >
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className={cn("absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1A3A22] shadow transition hover:rotate-90", focus)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── Drawer ─────────────────────────── */

/** Side panel that slides in from the right (full width on phones); same behaviour as Modal. */
export function Drawer({ open, onClose, labelledBy, children }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      if (opener.current) {
        const el = opener.current;
        opener.current = null;
        window.setTimeout(() => el.focus(), 0);
      }
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (active && !active.closest("[role=dialog]")) opener.current = active;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="fixed inset-0 z-[120] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#12331C]/60 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ x: reduce ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl sm:rounded-l-[1.75rem]"
          >
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className={cn("absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:rotate-90 hover:bg-white/25", focus)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
