"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight, Award, BookOpen, Check, Download, Feather, Lock, Mail, Megaphone, MessageSquareQuote, Mic,
  Newspaper, PenLine, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { SectionHeading } from "@/views/theme/heading";
import Ghost from "@/views/theme/Ghost";
import { DarkBackdrop, Rise, SectionNav, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { previewPages } from "./PreviewPages";
import { awards, issue, launchSource, sections, shelf } from "./data";

/**
 * PenCom Chronicles, the Commission's magazine (brief §7 "Publications listing and detail": cover, abstract, period,
 * download; questionnaire: news and media centre, easy sharing). No on-page reader: "Read the issue" opens the
 * PDF from /public/magazine in a new tab, and "Download PDF" links to the copy on pencom.gov.ng.
 * The serif masthead is the theme's one deliberate exception to its heavy sans titles.
 */

const glowDark = "[background-image:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_50%)]";
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-36px_rgba(4,20,10,0.45)]";
/** Thin gold-to-green edge drawn with a padding box (the card sits inside it). */
const edge = "bg-gradient-to-br from-[#F4D27A] via-[#2E913D]/60 to-[#117F21] p-px";

/* ─────────────────────────── 3D cover ─────────────────────────── */

function Cover3D() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-28, -8]), { stiffness: 120, damping: 14 });
  const W = 300;
  const H = Math.round(W * (594 / 420));
  const D = 18;
  return (
    <div
      className="relative mx-auto flex h-[500px] items-center justify-center sm:h-[540px]"
      style={{ perspective: 1600 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      {/* gold halo behind the issue */}
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,210,122,0.28),rgba(46,145,61,0.12)_45%,transparent_70%)] blur-2xl" />
      <motion.div aria-hidden="true" animate={reduce ? undefined : { y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative" style={{ width: W, height: H }}>
        <motion.div style={{ rotateX: rx, rotateY: reduce ? -18 : ry, transformStyle: "preserve-3d", width: W, height: H }} className="relative">
          {/* front */}
          <div className="absolute inset-0 overflow-hidden rounded-r-md shadow-[0_50px_90px_-30px_rgba(0,0,0,0.9)]" style={{ transform: `translateZ(${D / 2}px)` }}>
            <div style={{ width: 420, height: 594, transform: `scale(${W / 420})`, transformOrigin: "top left" }}>{previewPages[0].node}</div>
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent" />
            <span className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
          {/* spine */}
          <div className="absolute left-0 top-0 flex items-center justify-center bg-gradient-to-r from-[#04140A] to-[#0A4A13]" style={{ width: D, height: H, transform: `rotateY(-90deg) translateZ(${D / 2}px)`, transformOrigin: "center" }}>
            <span className="-rotate-90 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.3em] text-[#F4D27A]">PenCom Chronicles · 01</span>
          </div>
          {/* page block */}
          <div className="absolute right-0 top-[2px] bg-[repeating-linear-gradient(90deg,#fff,#fff_1px,#e6e0cf_1px,#e6e0cf_2px)]" style={{ width: D - 2, height: H - 4, transform: `rotateY(90deg) translateZ(${W - D / 2}px)`, transformOrigin: "left center", left: 0 }} />
          {/* back */}
          <div className="absolute inset-0 rounded-l-md bg-[#0B1F10]" style={{ transform: `translateZ(-${D / 2}px) rotateY(180deg)` }} />
        </motion.div>
      </motion.div>
      <span aria-hidden="true" className="absolute bottom-4 left-1/2 h-8 w-64 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl" />
      {/* floating sparkles */}
      {!reduce && [0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} aria-hidden="true" className="absolute h-1.5 w-1.5 rounded-full bg-[#F4D27A] shadow-[0_0_12px_rgba(244,210,122,0.9)]" style={{ left: `${15 + i * 17}%`, top: `${20 + ((i * 37) % 60)}%` }} animate={{ y: [0, -24, 0], opacity: [0, 1, 0] }} transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.7 }} />
      ))}
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

const nav = [
  { id: "inside", label: "What’s inside" },
  { id: "launch", label: "The launch" },
  { id: "issues", label: "All issues" },
  { id: "subscribe", label: "Get new issues" },
];

export default function ChroniclesPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const a = window.setTimeout(() => scrollToId(id, !reduce), 80);
    const b = window.setTimeout(() => scrollToId(id, false), 900);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <Hero />
        <SectionNav sections={nav} pillId="mag-nav-pill" />
        <Inside />
        <Launch />
        <Issues />
        <Subscribe />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Masthead ─────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="mag-title" className="relative isolate overflow-hidden bg-[#04140A] text-white">
      <DarkBackdrop />
      <Ghost word="Chronicles" dark className="bottom-0 top-auto sm:top-auto lg:top-auto" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pt-10 lg:pb-20">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            <li><Link to="/" className={cn("rounded hover:text-white hover:underline", focus)}>Home</Link></li>
            <li aria-hidden="true" className="text-[#F4D27A]/70">/</li>
            <li><Link to="/resources#publications" className={cn("rounded hover:text-white hover:underline", focus)}>Resources</Link></li>
            <li aria-hidden="true" className="text-[#F4D27A]/70">/</li>
            <li aria-current="page" className="font-semibold text-white">PenCom Chronicles</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> New · Issue 01 · {issue.date}
            </motion.p>
            <h1 id="mag-title" data-no-translate className="mt-6 font-serif text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
              {"PenCom".split("").map((c, i) => <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: reduce ? 0 : 40, rotateX: reduce ? 0 : -80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.6, delay: 0.05 * i, ease }}>{c}</motion.span>)}
              <br />
              <motion.span initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease }} className="relative inline-block pr-3 italic">
                <span className="bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text pr-1 text-transparent">Chronicles</span>
                <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full">
                  <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#F4D27A" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.9, ease }} />
                </svg>
              </motion.span>
            </h1>
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6, ease }} className="mt-7 max-w-xl text-lg leading-relaxed text-white/80">
              The Commission’s magazine: news, interviews, industry updates, human-interest stories, features and commentaries on Nigeria’s pension system.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, ease }} className="mt-8 flex flex-wrap gap-3">
              <a href={issue.localPdf} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 font-bold text-[#1A1206] shadow-[0_18px_40px_-18px_rgba(244,210,122,0.85)] transition hover:bg-[#FFE08F]", focus)}>
                <BookOpen className="h-5 w-5" aria-hidden="true" /> Read the issue<span className="sr-only"> (PDF, opens in a new tab)</span>
                <ArrowChip />
              </a>
              <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-6 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 hover:ring-[#F4D27A]/60", focus)}>
                <Download className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" /> Download PDF<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </motion.div>
            <dl className="mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              {[["Published", issue.date], ["Launched", issue.launched], ["Publisher", "Corporate Communications"]].map(([k, v], i) => (
                <motion.div key={k} onMouseMove={spot} initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 + i * 0.08, ease }} className={cn("rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 backdrop-blur transition hover:ring-[#F4D27A]/40", glowDark)}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F4D27A]">{k}</dt>
                  <dd className="mt-1 font-bold text-white">{v}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6"><Cover3D /></div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── What's inside ─────────────────────────── */

function Inside() {
  return (
    <section id="inside" aria-labelledby="inside-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="inside-title" eyebrow="Every edition" title="What you’ll find inside" highlight="inside" intro="Two editorial sections, with space in every edition for stakeholders to share their views." />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => {
            const Icon = [Newspaper, Mic, TrendingUp, Users, Feather, MessageSquareQuote][i];
            return (
              <motion.li key={s.k} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: i * 0.07, ease }}>
                <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10", glowLight, lift)}>
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                  {/* magazine initial, outlined like the ghost words */}
                  <span aria-hidden="true" data-no-translate className="pointer-events-none absolute -bottom-10 right-3 select-none font-serif text-[9rem] font-bold italic leading-none text-transparent transition-transform duration-500 [-webkit-text-stroke:1.5px_rgba(10,74,19,0.13)] group-hover:-translate-y-2 group-hover:[-webkit-text-stroke:1.5px_rgba(203,150,21,0.45)]">{s.k[0]}</span>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F10] text-[#F4D27A] transition duration-300 group-hover:rotate-6 group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <h3 className="relative mt-5 text-xl font-black tracking-tight">{s.k}</h3>
                  <p className="relative mt-1 max-w-[85%] text-gray-600">{s.body}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── The launch (the page's dark band) ─────────────────────────── */

function Launch() {
  return (
    <section id="launch" aria-labelledby="launch-title" className={cn("relative isolate bg-[#04140A] text-white", sectionCls)}>
      <DarkBackdrop />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading stacked id="launch-title" dark eyebrow="The launch" title="Launched in Lagos, October 2026" highlight="October 2026" />
          <Rise>
            <figure onMouseMove={spot} className={cn("relative mt-8 overflow-hidden rounded-3xl bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur sm:p-8", glowDark)}>
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] shadow-[0_0_30px_rgba(244,210,122,0.35)]"><MessageSquareQuote className="h-5 w-5" /></span>
              <blockquote className="mt-5 font-serif text-2xl italic leading-snug text-white sm:text-3xl">
                The beginning of a platform through which PenCom will tell its story.
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm text-white/70">
                <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-[#F4D27A] to-transparent" />
                <span>Omolola Oloworaran, Director-General, at the launch on {issue.launched}</span>
              </figcaption>
            </figure>
          </Rise>
          <p className="mt-6 leading-relaxed text-white/80">The Director-General said the magazine would help close gaps in public understanding of the pension sector and set the editorial and digital direction for future editions.</p>
          <a href={launchSource.url} target="_blank" rel="noopener noreferrer" className={cn("group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-white/10 py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15 hover:ring-[#F4D27A]/50", focus)}>
            Read NAN’s report of the launch<span className="sr-only">(opens in a new tab)</span>
            <ArrowChip dark />
          </a>
        </div>
        <div className="lg:col-span-6 lg:pt-24">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">
            <Award className="h-4 w-4" aria-hidden="true" /> PenCom Media Excellence Awards 2026
          </p>
          <p className="mt-2 text-white/75">Presented at the launch to journalists whose reporting helps Nigerians understand their pensions.</p>
          <ul className="mt-6 space-y-3">
            {awards.map((a, i) => (
              <motion.li key={a.cat} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: i * 0.12, ease }}>
                <div onMouseMove={spot} className={cn("group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09] hover:ring-[#F4D27A]/40", glowDark)}>
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-[#F4D27A] to-[#117F21] transition-transform duration-500 group-hover:scale-y-100" />
                  {/* medal: gold disc inside a slowly turning gold ring */}
                  <span aria-hidden="true" className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                    <motion.span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#F4D27A,transparent_35%,#CB9615_55%,transparent_80%,#F4D27A)] opacity-80" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                    <span className="absolute inset-[3px] rounded-full bg-[#04140A]" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#F4D27A] to-[#CB9615] text-[#1A1206] shadow-[0_0_30px_rgba(244,210,122,0.35)] transition duration-300 group-hover:scale-110">
                      {a.cat === "Online" ? <Megaphone className="h-5 w-5" /> : a.cat === "Print" ? <Newspaper className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </span>
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{a.cat}</span>
                    <span className="block text-lg font-black tracking-tight">{a.name}</span>
                    {a.outlet && <span className="block text-sm text-white/70">{a.outlet}</span>}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Issues shelf ─────────────────────────── */

function Issues() {
  return (
    <section id="issues" aria-labelledby="issues-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="issues-title" eyebrow="Archive" title="All issues" highlight="issues" />
        <ul className="mt-12 flex flex-wrap items-end gap-10">
          {shelf.map((s, i) => (
            <motion.li key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12, ease }} className="w-48">
              {s.live ? (
                <a href={issue.localPdf} target="_blank" rel="noopener noreferrer" className={cn("group block rounded-md", focus)}>
                  <span className="relative block h-[272px] w-48 overflow-hidden rounded-r-md shadow-[12px_16px_30px_-10px_rgba(4,20,10,0.5)] transition duration-500 [transform:perspective(900px)_rotateY(-12deg)] group-hover:shadow-[0_30px_50px_-18px_rgba(203,150,21,0.55)] group-hover:[transform:perspective(900px)_rotateY(0deg)_translateY(-8px)]">
                    <span className="pointer-events-none absolute left-0 top-0 block" style={{ width: 420, height: 594, transform: `scale(${192 / 420})`, transformOrigin: "top left" }}>{previewPages[0].node}</span>
                    <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
                    {/* light sweep on hover */}
                    <span className="absolute inset-0 -translate-y-full bg-gradient-to-b from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-y-full" />
                    <span className="absolute right-2 top-2 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowChip dark /></span>
                  </span>
                  <span className="mt-4 block text-lg font-black tracking-tight transition group-hover:text-[#117F21]">{s.label}</span>
                  <span className="block text-sm text-gray-600">{s.date} · Read now</span>
                </a>
              ) : (
                <div aria-label={`${s.label}, coming soon`}>
                  <span className="flex h-[272px] w-48 flex-col items-center justify-center rounded-md border-2 border-dashed border-[#0B1F10]/25 bg-white/70 text-center text-gray-600">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B1F10] text-[#F4D27A]"><Lock className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="mt-3 text-sm font-semibold">Next edition</span>
                  </span>
                  <span className="mt-4 block text-lg font-black tracking-tight text-gray-700">{s.label}</span>
                  <span className="block text-sm text-gray-600">{s.date}</span>
                </div>
              )}
            </motion.li>
          ))}
          <li className="h-3 w-full rounded-full bg-gradient-to-r from-[#0B1F10] via-[#0A4A13] to-[#0B1F10] shadow-[inset_0_1px_0_rgba(244,210,122,0.7),0_14px_24px_-10px_rgba(4,20,10,0.55)]" aria-hidden="true" />
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── Subscribe + contribute ─────────────────────────── */

function Subscribe() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Enter an email address like name@example.com");
      input.current?.focus();
      return;
    }
    if (!consent) {
      setErr("Tick the box to agree to receive emails");
      return;
    }
    setErr(null);
    setDone(true);
  };
  return (
    <section id="subscribe" aria-labelledby="sub-title" className={sectionCls}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        <Rise className="h-full">
          <div onMouseMove={spot} className={cn("relative h-full overflow-hidden rounded-[1.75rem] p-8 text-white shadow-[0_40px_80px_-40px_rgba(4,20,10,0.8)] sm:p-10", darkCard)}>
            <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206]"><Mail className="h-6 w-6" /></span>
            <h2 id="sub-title" className="relative mt-5 text-3xl font-black tracking-tight">Get new issues by email</h2>
            <p className="relative mt-2 text-white/80">We’ll email you when a new edition of PenCom Chronicles is published. Nothing else.</p>
            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.p key="ok" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-semibold ring-1 ring-[#F4D27A]/40">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#0B1F10]"><Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /></span>
                  Thank you. We’ll let you know when Issue 02 is out.
                </motion.p>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="relative mt-6 space-y-4">
                  <div className="flex flex-col gap-2 rounded-[1.5rem] bg-white p-1.5 ring-[3px] ring-transparent transition focus-within:ring-[#FFD84D] sm:flex-row sm:rounded-full">
                    <label htmlFor="sub-email" className="sr-only">Email address</label>
                    <input ref={input} id="sub-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err && !email} placeholder="name@example.com" className="min-h-12 flex-1 rounded-full bg-transparent px-4 text-[#0B1F10] placeholder:text-gray-500 focus:outline-none" />
                    <button type="submit" className={cn("group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 font-bold text-[#1A1206] transition hover:bg-[#FFE08F]", focus)}>
                      Notify me
                      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-[-45deg]"><ArrowRight className="h-4 w-4" /></span>
                    </button>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/80">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#F4D27A]" />
                    <span>I agree that PenCom may use my email address to tell me about new issues. I can unsubscribe at any time. <Link to="/regulations#policies" className={cn("rounded font-semibold text-[#F4D27A] underline underline-offset-4", focus)}>Privacy notice</Link></span>
                  </label>
                  {err && <p role="alert" className="rounded-2xl bg-[#B52026]/35 px-4 py-2.5 text-sm font-semibold ring-1 ring-[#FF8A80]/40">{err}</p>}
                  <p className="text-xs text-white/70">Prototype: no email is sent yet.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Rise>

        <Rise delay={0.1} className="h-full">
          <div className={cn("h-full rounded-[1.75rem] shadow-[0_30px_70px_-45px_rgba(4,20,10,0.5)]", edge)}>
            <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-[calc(1.75rem-1px)] bg-white p-8 sm:p-10", glowLight)}>
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 right-2 select-none font-serif text-[11rem] font-bold italic leading-none text-transparent transition-transform duration-500 [-webkit-text-stroke:1.5px_rgba(10,74,19,0.12)] group-hover:-translate-y-2">“</span>
              <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B1F10] text-[#F4D27A] transition duration-300 group-hover:rotate-6"><PenLine className="h-6 w-6" /></span>
              <h2 className="relative mt-5 text-3xl font-black tracking-tight">Share your story</h2>
              <p className="relative mt-2 text-gray-600">Every edition gives stakeholders space to share their views. Contributors, retirees, employers and operators can suggest a story or a commentary for the next issue.</p>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <Link to="/connect#contact" className={cn("group/btn inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                  Suggest a story
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover/btn:rotate-[-45deg]"><ArrowRight className="h-4 w-4" /></span>
                </Link>
                <Link to="/news" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold text-[#0B1F10] ring-1 ring-black/15 transition hover:bg-[#0B1F10] hover:text-[#F4D27A] hover:ring-[#0B1F10]", focus)}>Latest news</Link>
              </div>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
