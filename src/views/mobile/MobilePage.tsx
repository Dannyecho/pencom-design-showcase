"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Accessibility, ArrowRight, Bot, Info, Pause, Play, Smartphone, UserRoundCheck, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero, Rise, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { Tilt } from "@/views/about/primitives";
import { features, type ScreenName } from "./data";
import { Phone, titles } from "./Phone";

/**
 * /mobile in the showcase look: a working preview of the planned PenCom app. In the dark cinematic hero, the feature
 * list is a grid of glass cards with a pointer spotlight; the chosen card expands (like the homepage's "I am a…"
 * cards) with a gold edge and its description, and "Take the tour" steps through them with a gold progress line.
 * The phone floats on a slowly turning gold-and-green halo with a mono "03 / 09" counter. Below, dark portal cards
 * tilt toward the pointer and jump the phone to a feature. Screens: ./screens + ./Phone, tokens: ./skin.
 */

const TOUR_MS = 5000;
const pad = (n: number) => String(n).padStart(2, "0");

const builtFor: { title: string; body: string; icon: typeof Bot; screen: ScreenName }[] = [
  { title: "No sign-in", body: "Everything in the app is public. Open it and start reading, with no account and no password.", icon: UserRoundCheck, screen: "dashboard" },
  { title: "Saved for offline reading", body: "Download circulars and reports once, then read them where the network is weak.", icon: WifiOff, screen: "publications" },
  { title: "Answers show their source", body: "The assistant names the PenCom document each answer comes from.", icon: Bot, screen: "chat" },
  { title: "Text size, contrast and motion", body: "Make words bigger, raise the contrast or turn movement off.", icon: Accessibility, screen: "accessibility" },
];

export default function MobilePage() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenName>("dashboard");
  const [touring, setTouring] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const at = Math.max(features.findIndex((f) => f.screen === screen), 0);

  // Tour: move to the next feature every few seconds; stops at the last one.
  useEffect(() => {
    if (!touring) return;
    const id = window.setTimeout(() => {
      if (at >= features.length - 1) setTouring(false);
      else setScreen(features[at + 1].screen);
    }, TOUR_MS);
    return () => window.clearTimeout(id);
  }, [touring, at]);

  const showPhone = () => phoneRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  const pick = (s: ScreenName) => {
    setTouring(false);
    setScreen(s);
    if (window.matchMedia("(max-width: 1023px)").matches) showPhone();
  };
  const tour = () => {
    if (touring) return setTouring(false);
    if (at >= features.length - 1) setScreen(features[0].screen);
    setTouring(true);
  };

  const featureList = (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D27A]">Choose a feature to try</h2>
        <button
          type="button"
          aria-pressed={touring}
          onClick={tour}
          className={cn(
            "group inline-flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-base font-bold transition",
            touring ? "bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/15" : "bg-[#F4D27A] text-[#1A1206] shadow-[0_14px_30px_-12px_rgba(244,210,122,0.7)] hover:bg-[#FFE08F]",
            focus,
          )}
        >
          {touring ? "Pause the tour" : "Take the tour"}
          <span aria-hidden="true" className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-110", touring ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0B1F10] text-[#F4D27A]")}>
            {touring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </span>
        </button>
      </div>
      <LayoutGroup>
        <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {features.map((f, i) => {
            const on = screen === f.screen;
            return (
              <motion.li key={f.screen} layout={!reduce} transition={{ duration: 0.45, ease }} className={cn(on && "col-span-2 sm:col-span-3")}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls="app-screen"
                  onClick={() => pick(f.screen)}
                  onMouseMove={spot}
                  className={cn(
                    "group relative flex h-full w-full overflow-hidden rounded-[1.4rem] p-3.5 text-left text-white ring-1 backdrop-blur transition duration-300",
                    on ? "items-center gap-4 bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] ring-[#F4D27A]/70 shadow-[0_24px_50px_-24px_rgba(244,210,122,0.55)]" : "flex-col gap-3 bg-white/[0.06] ring-white/15 hover:-translate-y-1 hover:bg-white/10 hover:ring-white/30",
                    focus,
                  )}
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.22),transparent_70%)] group-hover:opacity-100" />
                  <span className={cn("relative flex items-start justify-between gap-2", !on && "w-full")}>
                    <span className={cn("flex shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6", on ? "h-14 w-14 bg-[#F4D27A] text-[#1A1206]" : "h-11 w-11 bg-white/10 text-[#F4D27A] ring-1 ring-white/15")}>
                      <f.icon className={on ? "h-7 w-7" : "h-5 w-5"} aria-hidden="true" />
                    </span>
                    {!on && <span aria-hidden="true" className="font-mono text-xs font-bold tabular-nums text-white/45">{pad(i + 1)}</span>}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className={cn("block font-black leading-tight tracking-tight", on ? "text-xl text-white" : "text-base")}>{f.label}</span>
                    {on && (
                      <motion.span initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} className="mt-1 block text-base leading-snug text-white/80">
                        {f.desc}
                      </motion.span>
                    )}
                  </span>
                  {on && <span aria-hidden="true" className="relative hidden font-mono text-sm font-bold tabular-nums text-[#F4D27A] sm:block">{pad(i + 1)} / {pad(features.length)}</span>}
                  {on && touring && (
                    <motion.span
                      key={`tour-${f.screen}`}
                      aria-hidden="true"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: TOUR_MS / 1000, ease: "linear" }}
                      className="absolute inset-x-0 bottom-0 h-1 origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#F4D27A]"
                    />
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </LayoutGroup>
      <p className="mt-5 flex items-start gap-2.5 rounded-[1.4rem] bg-white/[0.06] p-4 text-base leading-relaxed text-white/80 ring-1 ring-white/10">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#F4D27A]" aria-hidden="true" />
        <span>This is a design preview. The app is open to everyone, with no sign-in. Updates shown in it are sample content.</span>
      </p>
    </div>
  );

  const phone = (
    <div ref={phoneRef} className="relative mx-auto w-full max-w-[392px] scroll-mt-[110px]">
      {/* turning halo and glows behind the device */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-14%] top-[8%] -z-10 aspect-square">
        <motion.div
          className="absolute inset-0 rounded-full opacity-60 blur-2xl [background:conic-gradient(from_0deg,#F4D27A,#117F21,#04140A,#CB9615,#2E913D,#F4D27A)]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 h-16 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/60 blur-2xl" />

      {/* counter above the phone */}
      <div aria-hidden="true" className="mb-4 flex items-center justify-center gap-3 text-white">
        <span className="font-mono text-sm font-bold tabular-nums text-[#F4D27A]">{pad(at + 1)}</span>
        <span className="relative h-[2px] w-24 overflow-hidden rounded-full bg-white/15">
          <motion.span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#2E913D] to-[#F4D27A]" animate={{ width: `${((at + 1) / features.length) * 100}%` }} transition={{ duration: 0.5, ease }} />
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-white/50">{pad(features.length)}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={screen} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="text-sm font-bold uppercase tracking-[0.16em] text-white/85">
            {titles[screen]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        style={{ transformPerspective: 1200 }}
        onMouseMove={spot}
        className="group/phone relative rounded-[3.25rem] bg-gradient-to-b from-[#1d3a25] via-[#0B1F10] to-black p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
      >
        {/* glare that follows the pointer along the bezel */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[3.25rem] opacity-0 transition-opacity duration-300 [background:radial-gradient(280px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.35),transparent_65%)] group-hover/phone:opacity-100" />
        <Phone
          screen={screen}
          setScreen={(s) => { setTouring(false); setScreen(s); }}
          className="h-[calc(100svh-250px)] max-h-[760px] min-h-[600px] rounded-[2.6rem] bg-[#F2F6F0] lg:min-h-[620px]"
        />
      </motion.div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-white text-[#0B1F10]">
        <PageHero
          id="mobile-title"
          crumbs={[{ label: "Home", to: "/" }, { label: "Mobile app" }]}
          pill={{ icon: Smartphone, label: "App preview" }}
          title="The PenCom app, in your pocket"
          mark="in your pocket"
          intro={<p>A preview of the PenCom app for Android and iOS. Choose a feature below to see it on the phone, or tap around the phone itself.</p>}
          actions={featureList}
          aside={phone}
        />

        <section aria-labelledby="app-built-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              id="app-built-title"
              eyebrow="Built for everyone"
              title="Made for the way people really read"
              highlight="really read"
              intro="The app follows the same rules as the website: plain words, labelled buttons and nothing behind a login."
            />
            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {builtFor.map((b, i) => (
                <li key={b.title}>
                  <Rise delay={i * 0.07} className="h-full">
                    <Tilt max={6} className="h-full">
                      <div
                        onMouseMove={spot}
                        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] p-6 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)] ring-1 ring-white/10"
                      >
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.2),transparent_70%)] group-hover:opacity-100" />
                        <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-2 select-none font-mono text-[6.5rem] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.16)]">{pad(i + 1)}</span>
                        <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:-rotate-6">
                          <b.icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h3 className="relative mt-6 text-xl font-black tracking-tight">{b.title}</h3>
                        <p className="relative mt-2 flex-1 text-base leading-relaxed text-white/80">{b.body}</p>
                        <button
                          type="button"
                          onClick={() => { setTouring(false); setScreen(b.screen); showPhone(); }}
                          className={cn("group/b relative mt-6 inline-flex min-h-12 items-center gap-3 self-start rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-base font-bold ring-1 ring-white/20 transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)}
                        >
                          Show me on the phone
                          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition group-hover/b:bg-[#0B1F10] group-hover/b:text-[#F4D27A]">
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/b:-rotate-45" />
                          </span>
                        </button>
                      </div>
                    </Tilt>
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
