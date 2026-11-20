"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Check, Download, Feather, Lock, Mail, Megaphone, MessageSquareQuote, Mic,
  Newspaper, PenLine, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Spotlight, Tilt, ease, reveal, scrollToId } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { SectionNav, focus } from "@/views/theme/ui";
import { previewPages } from "./PreviewPages";
import { awards, issue, launchSource, sections, shelf } from "./data";

/**
 * PenCom Chronicles, the Commission's magazine (brief §7 "Publications listing and detail": cover, abstract, period,
 * download; questionnaire: news and media centre, easy sharing). No on-page reader: "Read the issue" opens the
 * PDF from /public/magazine in a new tab, and "Download PDF" links to the copy on pencom.gov.ng.
 */

const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";
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
      className="relative mx-auto flex h-[520px] items-center justify-center"
      style={{ perspective: 1600 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div aria-hidden="true" animate={reduce ? undefined : { y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative" style={{ width: W, height: H }}>
        <motion.div style={{ rotateX: rx, rotateY: reduce ? -18 : ry, transformStyle: "preserve-3d", width: W, height: H }} className="relative">
          {/* front */}
          <div className="absolute inset-0 overflow-hidden rounded-r-md shadow-2xl" style={{ transform: `translateZ(${D / 2}px)` }}>
            <div style={{ width: 420, height: 594, transform: `scale(${W / 420})`, transformOrigin: "top left" }}>{previewPages[0].node}</div>
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent" />
            <span className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
          {/* spine */}
          <div className="absolute left-0 top-0 flex items-center justify-center bg-gradient-to-r from-[#021A06] to-[#0A4A13]" style={{ width: D, height: H, transform: `rotateY(-90deg) translateZ(${D / 2}px)`, transformOrigin: "center" }}>
            <span className="-rotate-90 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.3em] text-[#F4D27A]">PenCom Chronicles · 01</span>
          </div>
          {/* page block */}
          <div className="absolute right-0 top-[2px] bg-[repeating-linear-gradient(90deg,#fff,#fff_1px,#e6e0cf_1px,#e6e0cf_2px)]" style={{ width: D - 2, height: H - 4, transform: `rotateY(90deg) translateZ(${W - D / 2}px)`, transformOrigin: "left center", left: 0 }} />
          {/* back */}
          <div className="absolute inset-0 rounded-l-md bg-[#0A4A13]" style={{ transform: `translateZ(-${D / 2}px) rotateY(180deg)` }} />
        </motion.div>
      </motion.div>
      <span aria-hidden="true" className="absolute bottom-6 left-1/2 h-8 w-64 -translate-x-1/2 rounded-[50%] bg-[#0A4A13]/40 blur-2xl" />
      {/* floating sparkles */}
      {!reduce && [0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} aria-hidden="true" className="absolute h-1.5 w-1.5 rounded-full bg-[#F4D27A]" style={{ left: `${15 + i * 17}%`, top: `${20 + ((i * 37) % 60)}%` }} animate={{ y: [0, -24, 0], opacity: [0, 1, 0] }} transition={{ duration: 3 + i * 0.6, repeat: Infinity, delay: i * 0.7 }} />
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
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
      {/* Hero */}
      <section aria-labelledby="mag-title" className="relative isolate overflow-hidden bg-[#F2F6F0] text-[#0E2414]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <motion.div
            className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
            animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
          />
          <div className="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li><Link to="/" className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/resources#publications" className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>Resources</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#0E2414]">PenCom Chronicles</li>
            </ol>
          </nav>
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/5 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#CB9615]" aria-hidden="true" /> New · Issue 01 · {issue.date}
              </motion.p>
              <h1 id="mag-title" data-no-translate className="mt-6 font-serif text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
                {"PenCom".split("").map((c, i) => <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: reduce ? 0 : 40, rotateX: reduce ? 0 : -80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.6, delay: 0.05 * i, ease }}>{c}</motion.span>)}
                <br />
                <motion.span initial={{ opacity: 0, x: reduce ? 0 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4, ease }} className="relative inline-block italic text-[#117F21]">
                  Chronicles
                  <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full">
                    <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.9, ease }} />
                  </svg>
                </motion.span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-7 max-w-xl text-lg leading-relaxed text-gray-700">
                The Commission’s magazine: news, interviews, industry updates, human-interest stories, features and commentaries on Nigeria’s pension system.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, ease }} className="mt-8 flex flex-wrap gap-3">
                <a href={issue.localPdf} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A4A13] px-6 font-semibold text-white shadow-[0_18px_40px_-20px_rgba(10,74,19,0.9)] transition hover:bg-[#117F21]", focus)}>
                  <BookOpen className="h-5 w-5" aria-hidden="true" /> Read the issue<span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
                <a href={issue.pdfUrl} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#0A4A13] ring-1 ring-black/10 transition hover:ring-[#117F21]", focus)}>
                  <Download className="h-5 w-5" aria-hidden="true" /> Download PDF<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </motion.div>
              <dl className="mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                {[["Published", issue.date], ["Launched", issue.launched], ["Publisher", "Corporate Communications"]].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/85 p-3.5 ring-1 ring-black/5 backdrop-blur"><dt className="text-xs text-gray-500">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-6"><Cover3D /></div>
          </div>
        </div>
      </section>

      <SectionNav sections={nav} pillId="mag-nav-pill" />

      {/* What's inside */}
      <section id="inside" aria-labelledby="inside-title" className="scroll-mt-[160px] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading id="inside-title" eyebrow="Every edition" title="What you’ll find inside" highlight="inside" intro="Two editorial sections, with space in every edition for stakeholders to share their views." />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s, i) => {
              const Icon = [Newspaper, Mic, TrendingUp, Users, Feather, MessageSquareQuote][i];
              return (
                <motion.li key={s.k} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.55, delay: i * 0.07, ease }}>
                  <Tilt className="h-full">
                    <Spotlight color="rgba(203,150,21,0.16)" className="group h-full rounded-3xl bg-white ring-1 ring-black/5 p-6 transition hover:shadow-[0_24px_50px_-28px_rgba(10,74,19,0.4)]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#117F21] transition group-hover:rotate-6 group-hover:bg-[#117F21] group-hover:text-white"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <h3 className="mt-5 font-serif text-2xl font-bold text-[#0A2E10]">{s.k}</h3>
                      <p className="mt-1 text-gray-600">{s.body}</p>
                    </Spotlight>
                  </Tilt>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Launch */}
      <section id="launch" aria-labelledby="launch-title" className="relative isolate scroll-mt-[160px] overflow-hidden bg-[#04140A] py-20 text-white sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.26),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(46,145,61,0.38),transparent)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div aria-hidden="true" className="absolute -right-40 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-[#CB9615]/20 blur-[140px]" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading stacked id="launch-title" dark eyebrow="The launch" title="Launched in Lagos, October 2026" highlight="October 2026" />
            <figure className="mt-8">
              <blockquote className="relative font-serif text-3xl italic leading-snug text-white">
                <span aria-hidden="true" className="absolute -left-4 -top-6 font-serif text-7xl text-[#CB9615]/40">“</span>
                The beginning of a platform through which PenCom will tell its story.
              </blockquote>
              <figcaption className="mt-4 text-sm text-white/65">Omolola Oloworaran, Director-General, at the launch on {issue.launched}</figcaption>
            </figure>
            <p className="mt-6 leading-relaxed text-white/75">The Director-General said the magazine would help close gaps in public understanding of the pension sector and set the editorial and digital direction for future editions.</p>
            <a href={launchSource.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#F4D27A] hover:underline">Read NAN’s report of the launch <ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">PenCom Media Excellence Awards 2026</p>
            <p className="mt-2 text-white/70">Presented at the launch to journalists whose reporting helps Nigerians understand their pensions.</p>
            <ul className="mt-6 space-y-3">
              {awards.map((a, i) => (
                <motion.li key={a.cat} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12, ease }}>
                  <div className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:border-[#F4D27A]/40 hover:bg-white/[0.1]">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F4D27A] to-[#CB9615] text-[#1A1206] shadow-[0_0_30px_rgba(244,210,122,0.35)] transition group-hover:scale-110">
                      {a.cat === "Online" ? <Megaphone className="h-6 w-6" aria-hidden="true" /> : a.cat === "Print" ? <Newspaper className="h-6 w-6" aria-hidden="true" /> : <Mic className="h-6 w-6" aria-hidden="true" />}
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{a.cat}</span>
                      <span className="block text-lg font-bold">{a.name}</span>
                      {a.outlet && <span className="block text-sm text-white/60">{a.outlet}</span>}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Issues shelf */}
      <section id="issues" aria-labelledby="issues-title" className="scroll-mt-[160px] bg-[#F2F6F0] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading id="issues-title" eyebrow="Archive" title="All issues" highlight="issues" />
          <ul className="mt-12 flex flex-wrap items-end gap-10">
            {shelf.map((s, i) => (
              <motion.li key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12, ease }} className="w-48">
                {s.live ? (
                  <a href={issue.localPdf} target="_blank" rel="noopener noreferrer" className={cn("group block", ring)}>
                    <span className="relative block h-[272px] w-48 overflow-hidden rounded-r-md shadow-[12px_16px_30px_-10px_rgba(0,0,0,0.45)] transition duration-500 [transform:perspective(900px)_rotateY(-12deg)] group-hover:[transform:perspective(900px)_rotateY(0deg)_translateY(-8px)]">
                      <span className="pointer-events-none absolute left-0 top-0 block" style={{ width: 420, height: 594, transform: `scale(${192 / 420})`, transformOrigin: "top left" }}>{previewPages[0].node}</span>
                      <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/40 to-transparent" />
                    </span>
                    <span className="mt-4 block font-bold text-[#0A2E10] group-hover:text-[#117F21]">{s.label}</span>
                    <span className="block text-sm text-gray-500">{s.date} · Read now</span>
                  </a>
                ) : (
                  <div aria-label={`${s.label}, coming soon`}>
                    <span className="flex h-[272px] w-48 flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white/60 text-center text-gray-400">
                      <Lock className="h-6 w-6" aria-hidden="true" />
                      <span className="mt-2 text-sm font-semibold">Next edition</span>
                    </span>
                    <span className="mt-4 block font-bold text-gray-500">{s.label}</span>
                    <span className="block text-sm text-gray-400">{s.date}</span>
                  </div>
                )}
              </motion.li>
            ))}
            <li className="h-3 w-full rounded-full bg-gradient-to-r from-[#C9B48A] via-[#DCC9A0] to-[#C9B48A] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)]" aria-hidden="true" />
          </ul>
        </div>
      </section>

      <Subscribe />
      </div>
    </MotionConfig>
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
    <section id="subscribe" aria-labelledby="sub-title" className="scroll-mt-[160px] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 lg:grid-cols-2">
        <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-8 text-white sm:p-10">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#F4D27A]/20 blur-3xl" />
          <Mail className="relative h-8 w-8 text-[#F4D27A]" aria-hidden="true" />
          <h2 id="sub-title" className="relative mt-5 text-3xl font-bold">Get new issues by email</h2>
          <p className="relative mt-2 text-white/75">We’ll email you when a new edition of PenCom Chronicles is published. Nothing else.</p>
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.p key="ok" role="status" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-6 flex items-center gap-3 rounded-2xl bg-white/15 p-4 font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#0A4A13]"><Check className="h-5 w-5" strokeWidth={3} aria-hidden="true" /></span>
                Thank you. We’ll let you know when Issue 02 is out.
              </motion.p>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate className="relative mt-6 space-y-3">
                <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
                  <label htmlFor="sub-email" className="sr-only">Email address</label>
                  <input ref={input} id="sub-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err && !email} placeholder="name@example.com" className="min-h-12 flex-1 rounded-xl px-3 text-gray-900 placeholder:text-gray-400 focus:outline-none" />
                  <button type="submit" className={cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#CB9615] px-5 font-semibold text-[#1A1206] hover:bg-[#E0AA22]", ring)}>Notify me <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-white/80">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#CB9615]" />
                  <span>I agree that PenCom may use my email address to tell me about new issues. I can unsubscribe at any time. <Link to="/regulations#policies" className="font-semibold text-[#F4D27A] underline">Privacy notice</Link></span>
                </label>
                {err && <p role="alert" className="rounded-lg bg-[#B52026]/30 px-3 py-2 text-sm font-semibold">{err}</p>}
                <p className="text-xs text-white/50">Prototype: no email is sent yet.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="relative overflow-hidden rounded-[2rem] border border-[#CB9615]/30 bg-gradient-to-br from-[#FFF8E1] to-white p-8 sm:p-10">
          <PenLine className="h-8 w-8 text-[#CB9615]" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-bold text-[#0A2E10]">Share your story</h2>
          <p className="mt-2 text-gray-600">Every edition gives stakeholders space to share their views. Contributors, retirees, employers and operators can suggest a story or a commentary for the next issue.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/connect#contact" className={cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#117F21] px-5 font-semibold text-white hover:bg-[#0A4A13]", ring)}>Suggest a story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
            <Link to="/news" className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl border border-gray-300 px-5 font-semibold text-gray-700 hover:border-[#117F21]", ring)}>Latest news</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
