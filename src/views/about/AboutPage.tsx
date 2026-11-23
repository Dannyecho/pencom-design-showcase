"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Landmark } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";
import { CountUp, scrollToId } from "@/views/about/primitives";
import Ghost from "@/views/theme/Ghost";
import { DarkBackdrop, FramedPanel, SectionNav } from "@/views/theme/ui";
import { heroStats } from "./data";
import { Charter, History, Leadership, MissionValues, Overview, ProfileDialog, Structure } from "./sections";

/**
 * About PenCom, showcase theme. Same language as the home page: a dark hero with glows, grid and a drifting
 * ghost word, a photo in a floating panel, ghost-word section titles with a gradient highlight, white rounded
 * cards and one near-black panel. Sections: overview and mandate → mission,
 * vision and values → history → structure → leadership → Service Charter and visiting us.
 * Menu anchors from the header and footer (#mission, #executive, #structure, #stakeholders, #why-us,
 * #dg-corner, #board, #signing, #charter, #history) all land on the right section.
 */

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

const onThisPage = [
  { id: "overview", label: "Overview" },
  { id: "mission", label: "Mission and values" },
  { id: "history", label: "Our history" },
  { id: "structure", label: "Structure" },
  { id: "executive", label: "Leadership" },
  { id: "charter", label: "Service Charter" },
];

export default function AboutPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [profile, setProfile] = useState<string | null>(null);
  const closeProfile = useCallback(() => setProfile(null), []);

  // Deep links (/about#mission …): scroll once the page has laid out, then correct after images settle.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t1 = window.setTimeout(() => scrollToId(id, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(id, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#1A3A22]">
        <Hero />
        <SectionNav sections={onThisPage} pillId="about-nav-pill" />
        <Overview />
        <MissionValues />
        <History />
        <Structure onSelect={setProfile} />
        <Leadership onSelect={setProfile} />
        <Charter />
        <ProfileDialog id={profile} onClose={closeProfile} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  // Whole title translated, then the highlight found inside it (word order differs by language).
  const T = t("Keeping every Nigerian’s retirement safe");
  const M = t("retirement safe");
  const at = T.toLowerCase().indexOf(M.toLowerCase());
  const heroTitle = at >= 0 ? { before: T.slice(0, at), mark: T.slice(at, at + M.length), after: T.slice(at + M.length), done: lang !== "en" } : { before: T, mark: "", after: "", done: lang !== "en" };
  return (
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-[#12331C] text-white">
      <DarkBackdrop />
      <Ghost word="About" dark className="bottom-0 top-auto sm:top-auto lg:top-auto" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-20 pt-8 sm:pt-10 lg:grid-cols-12 lg:pb-28">
        <div className="lg:col-span-6 lg:pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link to="/" className={cn("rounded hover:text-white hover:underline", focus)}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#F4D27A]/70">/</li>
              <li aria-current="page" className="font-semibold text-white">
                About PenCom
              </li>
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)]">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
            About the Commission
          </motion.p>
          <motion.h1
            id="about-title"
            data-i18n-done={heroTitle.done ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-5 text-[2.5rem] font-black leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            {heroTitle.before}
            <span className="bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-transparent">{heroTitle.mark}</span>
            {heroTitle.after}
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            The National Pension Commission licenses and supervises every pension operator in Nigeria, so that what workers save is invested safely and paid when they retire. Established in 2004, we now work under the Pension Reform Act 2014.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToId("history", !reduce)} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F4D27A] px-6 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)] transition hover:bg-white", focus)}>
              Explore our history
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollToId("structure", !reduce)} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1A3A22]", focus)}>
              How we are organised
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative lg:col-span-6"
        >
          <FramedPanel className="h-[28rem] bg-[#1A3A22] sm:h-[32rem]">
            <img
              src="/images/site/board-meeting-1920.webp"
              srcSet="/images/site/board-meeting-960.webp 960w, /images/site/board-meeting-1920.webp 1920w"
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="Colleagues reviewing figures around a boardroom table"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
            <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)]">
              Since 2004
            </p>
            <dl className="absolute inset-x-3 bottom-3 grid grid-cols-3 divide-x divide-black/10 rounded-2xl bg-white/95 shadow-xl ring-1 ring-black/10 backdrop-blur sm:inset-x-4 sm:bottom-4">
              {heroStats.map((s) => (
                <div key={s.label} className="px-3 py-3.5 sm:px-5 sm:py-4">
                  <dt className="text-xs font-semibold text-gray-600 sm:text-sm">{s.label}</dt>
                  <dd className="mt-0.5 font-mono text-xl font-bold text-[#1A3A22] sm:text-2xl">
                    <CountUp value={s.value} />
                  </dd>
                  <dd className="text-[11px] text-gray-600">{s.note}</dd>
                </div>
              ))}
            </dl>
          </FramedPanel>
        </motion.div>
      </div>
    </section>
  );
}
