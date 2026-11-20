"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone, Pause, Play } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { slides } from "@/views/home/data";
import { go } from "@/views/home/SiteSearch";

const SLIDE_MS = 8000;
const pad = (n: number) => String(n).padStart(2, "0");
const wipe = [0.77, 0, 0.18, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

/**
 * Cinematic banner (brief §7.1): each photo wipes in like a curtain over the last and slowly settles,
 * the headline rises word by word, and a numbered rail (desktop) shows every slide with a filling
 * progress line. Pause, previous/next, swipe, holds on hover/focus, announces changes, never
 * auto-advances under reduced motion (fades instead of wiping). Slides expire by their end date.
 */
export default function Banner() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [layer, setLayer] = useState(1);
  const [dir, setDir] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [announce, setAnnounce] = useState("");
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    if (!next) return;
    const img = new Image();
    img.srcset = next.srcSet;
    img.sizes = "100vw";
    img.src = next.image;
  }, [index]);

  const goTo = (i: number, user = true) => {
    const n = (i + slides.length) % slides.length;
    if (n === index) return;
    setDir(i < index ? -1 : 1);
    setLayer((l) => l + 1);
    setIndex(n);
    if (user) setAnnounce(t("Slide {n} of {total}: {title}", { n: n + 1, total: slides.length, title: t(slides[n].title) }));
  };

  const s = slides[index];
  if (!s) return null;
  const running = playing && !hold && !reduce;
  const words = t(s.title).split(" ");
  const round = cn("flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#0B1F10]", focus);

  return (
    <section
      aria-label="Featured"
      className="relative isolate h-[min(90svh,820px)] min-h-[640px] overflow-hidden bg-[#04140A] text-white"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <h1 className="sr-only">National Pension Commission</h1>

      {/* Photos: curtain wipe over the previous slide */}
      <AnimatePresence initial={false}>
        <motion.div
          key={s.id}
          className="absolute inset-0 -z-20"
          style={{ zIndex: layer - 1000 }}
          initial={reduce ? { opacity: 0 } : { clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0 0%)" }}
          exit={{ opacity: 1, transition: { duration: 1.2 } }}
          transition={{ duration: reduce ? 0.6 : 1.2, ease: wipe }}
        >
          <motion.img
            src={s.image}
            srcSet={s.srcSet}
            sizes="100vw"
            alt={t(s.alt)}
            initial={{ scale: reduce ? 1 : 1.18 }}
            animate={{ scale: reduce ? 1 : running ? 1.02 : 1.06 }}
            transition={{ duration: running ? SLIDE_MS / 1000 + 1.2 : 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
            style={{ objectPosition: s.position }}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#007E2F]/80 via-[#04140A]/45 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#04140A] via-[#04140A]/40 to-transparent" />

      <div
        className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-36 sm:pb-40"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured announcements"
      >
        <div className="grid w-full grid-cols-1 items-end gap-10 lg:grid-cols-12">
          {/* Words */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={s.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${slides.length}`} exit={{ opacity: 0, y: reduce ? 0 : -16, transition: { duration: 0.3 } }}>
                <motion.p
                  initial={{ opacity: 0, x: reduce ? 0 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-[#F4D27A]"
                >
                  {s.kind === "campaign" ? <Megaphone className="h-4 w-4" aria-hidden="true" /> : <span className="h-[2px] w-10 bg-[#F4D27A]" aria-hidden="true" />}
                  {s.eyebrow}
                </motion.p>
                <h2 data-i18n-done={lang !== "en" ? "" : undefined} className="mt-5 max-w-3xl text-[2.6rem] font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.6rem]">
                  {words.map((w, i) => (
                    <span key={i}>
                      <span className="inline-block overflow-hidden pb-1.5 align-bottom">
                        <motion.span
                          className="inline-block"
                          initial={{ y: reduce ? 0 : "110%", rotate: reduce ? 0 : 4 }}
                          animate={{ y: 0, rotate: 0 }}
                          transition={{ duration: 0.8, delay: 0.35 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {w}
                        </motion.span>
                      </span>{" "}
                    </span>
                  ))}
                </h2>
                <motion.p
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-5 max-w-xl text-lg leading-relaxed text-white/85"
                >
                  {s.summary}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }} className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(s.cta, navigate)}
                    className={cn("group relative inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-[#F4D27A] pl-7 pr-2 text-base font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)]", focus)}
                  >
                    <span className="relative z-10">{s.cta.label}</span>
                    <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1206] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                      <ArrowRight className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-white/50 transition-transform duration-500 group-hover:translate-x-0" />
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rail: every slide, numbered, with progress */}
          <div className="hidden lg:col-span-4 lg:block">
            <ol className="space-y-1" aria-label="Slides">
              {slides.map((x, i) => {
                const on = i === index;
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on ? "true" : undefined}
                      aria-label={t("Go to slide {n}: {title}", { n: i + 1, title: t(x.title) })}
                      className={cn("group relative flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition", on ? "bg-white/10 backdrop-blur-md" : "hover:bg-white/5", focus)}
                    >
                      <span className={cn("font-mono text-sm tabular-nums", on ? "text-[#F4D27A]" : "text-white/55")}>{pad(i + 1)}</span>
                      <span className={cn("flex-1 truncate text-sm font-semibold", on ? "text-white" : "text-white/65 group-hover:text-white")}>{x.eyebrow}</span>
                      <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/10">
                        {on && (
                          <motion.span
                            key={`${index}-${running}`}
                            className="absolute inset-y-0 left-0 bg-[#F4D27A]"
                            initial={{ width: running ? "0%" : "100%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                            onAnimationComplete={() => running && window.matchMedia("(min-width: 1024px)").matches && goTo(index + 1, false)}
                          />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-20 right-4 flex items-center gap-2 sm:bottom-24">
          <span className="mr-2 font-mono text-sm tabular-nums text-white/80">
            <span className="sr-only">Slide </span>
            <span className="text-2xl font-bold text-white">{pad(index + 1)}</span>
            <span className="sr-only"> of </span>
            <span aria-hidden="true"> / </span>
            {pad(slides.length)}
          </span>
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide" className={round}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slides" : "Play slides"} className={round}>
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Next slide" className={round}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile progress (the rail is desktop only) */}
        <div className="absolute inset-x-4 bottom-[4.25rem] flex gap-1.5 lg:hidden" aria-hidden="true">
          {slides.map((x, i) => (
            <span key={x.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25">
              {i < index && <span className="absolute inset-0 bg-white" />}
              {i === index && (
                <motion.span
                  key={`m-${index}-${running}`}
                  className="absolute inset-y-0 left-0 bg-[#F4D27A]"
                  initial={{ width: running ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                  onAnimationComplete={() => running && window.matchMedia("(max-width: 1023px)").matches && goTo(index + 1, false)}
                />
              )}
            </span>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  );
}
