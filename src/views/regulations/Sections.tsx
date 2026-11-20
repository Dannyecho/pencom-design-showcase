"use client";

import { useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Building2, Check, ChevronRight, FileCheck, HandCoins, KeyRound, Landmark, Lock,
  MessageSquareWarning, PiggyBank, Scale, ShieldCheck, Undo2, Users, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, ease } from "@/views/about/primitives";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { SectionHeading } from "@/views/theme/heading";
import { DarkBackdrop, Rise, focus, sectionCls, spot } from "@/views/theme/ui";

const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]";
const darkBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#117F21]";
const goldBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]";
const chip = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45";
import { library } from "./library";
import { fmtDate, latest, typeStyle } from "./search";
import type { Filters } from "./Library";

/* ─────────────────────────── Latest issued (scroll-snap rail) ─────────────────────────── */

export function LatestRail({ onOpen }: { onOpen: (id: string) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <section id="latest" aria-labelledby="latest-title" className="scroll-mt-[170px] overflow-x-clip bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="latest-title"
          eyebrow="Just issued"
          title="The latest from the Commission"
          highlight="latest"
          intro="New regulations, guidelines and circulars, newest first. Open one for a summary and the signed PDF."
          action={
            <div className="hidden gap-2 sm:flex">
              {[
                { d: -1, I: ArrowLeft, l: "Scroll back" },
                { d: 1, I: ArrowRight, l: "Scroll forward" },
              ].map(({ d, I, l }) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => scroll(d)}
                  aria-label={l}
                  className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0B1F10] ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-[#F4D27A]", focus)}
                >
                  <I className="h-5 w-5" aria-hidden="true" />
                </button>
              ))}
            </div>
          }
        />
      </div>
      <ul
        ref={rail}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-8 pt-2 [scrollbar-width:none] sm:px-[max(1rem,calc((100vw_-_80rem)/2_+_1rem))] sm:scroll-px-[max(1rem,calc((100vw_-_80rem)/2_+_1rem))] scroll-px-4 [&::-webkit-scrollbar]:hidden"
      >
        {latest.map((d, i) => {
          const first = i === 0;
          return (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06, ease }}
              className="w-[290px] shrink-0 snap-start sm:w-[320px]"
            >
              <button
                type="button"
                onClick={() => onOpen(d.id)}
                onMouseMove={spot}
                className={cn(
                  "group relative flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-3xl p-6 text-left",
                  lift,
                  focus,
                  first ? cn(darkCard, "text-white shadow-[0_30px_60px_-30px_rgba(4,20,10,0.9)]") : cn("bg-white ring-1 ring-black/10", glowLight),
                )}
              >
                {/* growing top line */}
                <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-500 group-hover:scale-x-100", first ? "from-[#F4D27A] to-[#E9B949]" : "from-[#117F21] to-[#CB9615]")} />
                <span className="relative flex items-center justify-between gap-2 text-xs">
                  <span className={cn("rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider", first ? "bg-[#F4D27A] text-[#1A1206]" : typeStyle[d.type].chip)}>
                    {d.type}
                  </span>
                  <span className={cn("font-mono", first ? "text-white/70" : "text-gray-600")}>{fmtDate(d.date)}</span>
                </span>
                {first && <span className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4D27A]">Newest</span>}
                <span className={cn("relative line-clamp-4 text-lg font-bold leading-snug", first ? "mt-2 text-white" : "mt-5 text-[#0B1F10] group-hover:text-[#0A4A13]")}>
                  {d.title}
                </span>
                <span className={cn("relative mt-auto flex items-center justify-between gap-2 pt-5 text-sm font-semibold", first ? "text-[#F4D27A]" : "text-[#0A4A13]")}>
                  Read details
                  <ArrowChip dark={first} />
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

/* ─────────────────────────── Pension Reform Act 2014 ─────────────────────────── */

const provisions = [
  {
    id: "cover",
    icon: Users,
    tab: "Who it covers",
    title: "Who the Act covers",
    points: [
      "Employees of the Federal Government, the FCT, States and Local Governments.",
      "Private-sector organisations with three or more employees.",
      "Self-employed people and staff of smaller organisations can join voluntarily.",
    ],
    stat: { value: "3+", label: "employees brings a private employer into the scheme" },
    q: "coverage",
  },
  {
    id: "contrib",
    icon: Wallet,
    tab: "Contributions",
    title: "How much is saved",
    points: [
      "A minimum of 18% of monthly pay: 10% from the employer and 8% from the employee.",
      "Contributions go into the employee’s own Retirement Savings Account (RSA).",
      "Employees can add voluntary contributions on top.",
    ],
    stat: { value: "18%", label: "minimum monthly contribution" },
    q: "contribution",
  },
  {
    id: "benefits",
    icon: PiggyBank,
    tab: "Retirement benefits",
    title: "Getting your benefits",
    points: [
      "Benefits are paid on retirement, generally from age 50.",
      "Retirees choose programmed withdrawal through their PFA or an annuity from an insurer.",
      "If you lose your job before 50, you may access part of your RSA after four months without work.",
    ],
    stat: { value: "50", label: "years, the usual minimum age to access benefits" },
    q: "benefits",
  },
  {
    id: "choice",
    icon: Undo2,
    tab: "Choice & transfers",
    title: "Your choice of PFA",
    points: [
      "Every employee chooses the Pension Fund Administrator (PFA) that manages their RSA.",
      "Your RSA stays yours when you change jobs.",
      "You can transfer your RSA to another PFA under PenCom’s transfer regulations.",
    ],
    stat: { value: "19", label: "licensed PFAs to choose from" },
    q: "transfer",
  },
  {
    id: "safe",
    icon: ShieldCheck,
    tab: "Keeping funds safe",
    title: "How your savings are protected",
    points: [
      "PFAs invest the money; separate Pension Fund Custodians (PFCs) hold the assets.",
      "Investments must follow PenCom’s investment regulations.",
      "PenCom licenses, supervises and inspects every operator.",
    ],
    stat: { value: "3", label: "licensed PFCs hold pension assets" },
    q: "investment",
  },
];

export function ActSpotlight({ set }: { set: (p: Partial<Filters>) => void }) {
  const [tab, setTab] = useState(provisions[0].id);
  const reduce = useReducedMotion();
  const p = provisions.find((x) => x.id === tab)!;

  return (
    <section id="act" aria-labelledby="act-title" className={cn("relative isolate overflow-hidden bg-[#04140A] text-white", sectionCls)}>
      <DarkBackdrop />
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="act-title"
          dark
          eyebrow="Primary legislation"
          title="The Pension Reform Act 2014, in plain language"
          highlight="in plain language"
          intro="The Act sets up the Contributory Pension Scheme and the Commission. Here is what it means for you."
          action={
            <Rise>
              <div onMouseMove={spot} className="relative overflow-hidden rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur [background-image:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_60%)]">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4D27A]/15 text-[#F4D27A] ring-1 ring-[#F4D27A]/40">
                    <Landmark className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Signed into law</p>
                    <p className="bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-2xl font-black text-transparent">1 July 2014</p>
                  </div>
                </div>
                <Link to="/regulations/pension-reform-act" className={cn(goldBtn, "mt-4", focus)}>
                  Read the full Act
                  <span aria-hidden="true" className={cn(chip, "bg-[#0B1F10] text-[#F4D27A]")}><ArrowUpRight className="h-4 w-4" /></span>
                </Link>
              </div>
            </Rise>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div role="tablist" aria-label="Key provisions" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible">
            {provisions.map((x, i) => {
              const on = x.id === tab;
              return (
                <button
                  key={x.id}
                  id={`act-tab-${x.id}`}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  aria-controls="act-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(x.id)}
                  onKeyDown={(e) => {
                    const n = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 0;
                    if (!n) return;
                    e.preventDefault();
                    const next = provisions[(i + n + provisions.length) % provisions.length];
                    setTab(next.id);
                    document.getElementById(`act-tab-${next.id}`)?.focus();
                  }}
                  className={cn(
                    "relative isolate flex min-h-14 shrink-0 items-center gap-3 rounded-full px-5 text-left font-semibold transition-colors",
                    focus,
                    on ? "text-[#1A1206]" : "text-white/75 ring-1 ring-white/10 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  {on && (
                    <motion.span layoutId="act-pill" className="absolute inset-0 -z-10 rounded-full shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] bg-gradient-to-r from-[#F4D27A] to-[#E9B949]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <x.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {x.tab}
                  <ChevronRight className={cn("ml-auto hidden h-4 w-4 lg:block", on ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div id="act-panel" role="tabpanel" aria-labelledby={`act-tab-${p.id}`} className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                transition={{ duration: 0.3, ease }}
                onMouseMove={spot}
                className="relative grid h-full grid-cols-1 gap-5 overflow-hidden rounded-[1.75rem] bg-white/[0.06] p-6 ring-1 ring-white/15 backdrop-blur [background-image:radial-gradient(480px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.12),transparent_55%)] sm:p-9 md:grid-cols-[1fr_220px]"
              >
                <p.icon aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-6 h-44 w-44 text-white/[0.04]" />
                <div>
                  <h3 className="text-2xl font-bold">{p.title}</h3>
                  <ul className="mt-5 space-y-4">
                    {p.points.map((pt, i) => (
                      <motion.li
                        key={pt}
                        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 + i * 0.07, ease }}
                        className="flex gap-3 leading-relaxed text-white/85"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206]">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        {pt}
                      </motion.li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      set({ q: p.q, types: [], years: [], who: [], subjects: [], status: "" });
                      document.getElementById("library")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                    }}
                    className={cn("group relative mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-5 pr-1.5 text-sm font-semibold ring-1 ring-white/25 transition hover:bg-white hover:text-[#0B1F10]", focus)}
                  >
                    Related regulations and circulars
                    <span aria-hidden="true" className={cn(chip, "bg-[#F4D27A] text-[#1A1206]")}><ArrowUpRight className="h-4 w-4" /></span>
                  </button>
                </div>
                <div className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-[#0B1F10] p-6 ring-1 ring-[#F4D27A]/40 [background-image:linear-gradient(135deg,#0B1F10,#0A4A13)]">
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F4D27A] via-[#E9B949] to-[#117F21]" />
                  <span aria-hidden="true" className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#F4D27A]/20 blur-2xl" />
                  <CountUp value={p.stat.value} className="relative bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-6xl font-black tracking-tight text-transparent" />
                  <p className="relative mt-2 text-sm font-semibold leading-snug text-white/85">{p.stat.label}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-xs text-white/65">
              A plain-language summary. The wording of the Pension Reform Act 2014 is the legal text and takes precedence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Compliance ─────────────────────────── */

const duties = [
  { icon: Users, title: "Register every employee", body: "Make sure each employee has a Retirement Savings Account with a PFA of their choice." },
  { icon: HandCoins, title: "Deduct and add contributions", body: "Deduct the employee’s 8% and add your 10%, at least 18% of monthly pay in total." },
  { icon: Wallet, title: "Remit on time", body: "Pay contributions to each employee’s Pension Fund Custodian promptly after paying salaries, using PCRS." },
  { icon: ShieldCheck, title: "Keep group life insurance", body: "Maintain a group life insurance policy for your employees, as the Act requires." },
  { icon: FileCheck, title: "Hold a Pension Clearance Certificate", body: "You need a valid PCC to bid for government contracts. Apply on eHub." },
];

export function Compliance({ set }: { set: (p: Partial<Filters>) => void }) {
  const [done, setDone] = useState<boolean[]>(duties.map(() => false));
  const reduce = useReducedMotion();
  const score = done.filter(Boolean).length;
  const pct = score / duties.length;
  const R = 52;
  const C = 2 * Math.PI * R;

  const operatorLinks = [
    { label: "Circulars for PFAs", n: library.filter((d) => d.type === "Circular" && d.appliesTo.includes("PFAs")).length, patch: { types: ["Circular"], who: ["PFAs"] } },
    { label: "Investment rules", n: library.filter((d) => d.subjects.includes("Investment")).length, patch: { subjects: ["Investment"] } },
    { label: "Governance and licensing", n: library.filter((d) => d.subjects.includes("Governance & licensing")).length, patch: { subjects: ["Governance & licensing"] } },
    { label: "Codes of conduct and governance", n: library.filter((d) => d.type === "Code").length, patch: { types: ["Code"] } },
  ];

  return (
    <section id="compliance" aria-labelledby="compliance-title" className={cn("bg-white", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="compliance-title"
          eyebrow="Compliance"
          title="Stay compliant with the Act"
          highlight="compliant"
          intro="What employers must do, a quick self-check, and where licensed operators can find the rules that apply to them."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Employer checklist */}
          <Rise className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(4,20,10,0.45)] ring-1 ring-black/10 sm:p-8">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[#E8F5E9]">
                <motion.span className="block h-full origin-left bg-gradient-to-r from-[#117F21] to-[#CB9615]" animate={{ scaleX: pct }} initial={false} transition={{ duration: reduce ? 0 : 0.6, ease }} />
              </span>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#7F5A04]">
                    <Building2 className="h-4 w-4" aria-hidden="true" /> For employers
                  </p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-[#0B1F10]">Your pension duties: a self-check</h3>
                  <p className="mt-1 text-sm text-gray-600">Tick what you already do. Nothing is sent to PenCom.</p>
                </div>
                <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center rounded-full bg-[#0B1F10] shadow-[0_24px_50px_-24px_rgba(4,20,10,0.8)]">
                  <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90" aria-hidden="true">
                    <defs>
                      <linearGradient id="comp-ring" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F4D27A" />
                        <stop offset="100%" stopColor={pct === 1 ? "#2E913D" : "#E9B949"} />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="9" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r={R}
                      fill="none"
                      stroke="url(#comp-ring)"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      initial={false}
                      animate={{ strokeDashoffset: C * (1 - pct) }}
                      transition={{ duration: reduce ? 0 : 0.6, ease }}
                    />
                  </svg>
                  <span className="absolute text-center">
                    <span className="block font-mono text-3xl font-black tabular-nums text-[#F4D27A]">{score}/{duties.length}</span>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/70">done</span>
                  </span>
                </div>
              </div>

              <ol className="mt-6 space-y-3">
                {duties.map((d, i) => (
                  <li key={d.title}>
                    <label
                      onMouseMove={spot}
                      className={cn(
                        "group flex cursor-pointer gap-4 rounded-3xl p-4 ring-1 transition duration-300 hover:-translate-y-0.5",
                        glowLight,
                        done[i] ? "bg-[#F2F6F0] ring-[#117F21]/35" : "bg-white ring-black/10 hover:ring-[#117F21]/30",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={done[i]}
                        onChange={() => setDone((x) => x.map((v, j) => (j === i ? !v : v)))}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition duration-300 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FFD84D]",
                          done[i] ? "scale-105 bg-[#0B1F10] text-[#F4D27A]" : "bg-[#F2F6F0] text-[#0A4A13] group-hover:bg-[#E8F5E9]",
                        )}
                      >
                        {done[i] ? <Check className="h-5 w-5" strokeWidth={3} /> : <d.icon className="h-5 w-5" />}
                      </span>
                      <span className="flex-1">
                        <span className="flex items-center gap-2 font-semibold text-[#0B1F10]">
                          <span className="font-mono text-xs tabular-nums text-[#7F5A04]">0{i + 1}</span>
                          {d.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-gray-600">{d.body}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ol>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pct === 1 ? "all" : "some"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={cn(
                    "relative mt-6 flex flex-col gap-4 overflow-hidden rounded-3xl p-5 sm:flex-row sm:items-center",
                    pct === 1 ? cn(darkCard, "text-white") : "bg-[#F2F6F0] text-[#0B1F10] ring-1 ring-black/10",
                  )}
                  aria-live="polite"
                >
                  {pct !== 1 && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F4D27A] to-[#CB9615]" />}
                  <p className="flex-1 text-sm font-medium">
                    {pct === 1
                      ? "You’re doing everything on the list. Keep your records ready for PenCom inspections."
                      : `${duties.length - score} to go. Late or unpaid contributions attract penalties under the Pension Reform Act 2014.`}
                  </p>
                  <Link to="/services#pcc" className={cn(pct === 1 ? goldBtn : darkBtn, "shrink-0 self-start sm:self-auto", focus)}>
                    Get your PCC
                    <span aria-hidden="true" className={cn(chip, pct === 1 ? "bg-[#0B1F10] text-[#F4D27A]" : "bg-[#F4D27A] text-[#1A1206]")}>
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </Rise>

          <div className="space-y-6 lg:col-span-4">
            {/* Operators */}
            <Rise delay={0.08}>
              <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-30px_rgba(4,20,10,0.9)] sm:p-7", darkCard)}>
                <KeyRound aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 text-white/[0.05]" />
                <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">
                  <KeyRound className="h-4 w-4" aria-hidden="true" /> For licensed operators
                </p>
                <h3 className="relative mt-2 text-xl font-black tracking-tight">The rules that apply to you</h3>
                <ul className="relative mt-5 space-y-2">
                  {operatorLinks.map((o) => (
                    <li key={o.label}>
                      <button
                        type="button"
                        onClick={() => {
                          set({ q: "", types: [], years: [], who: [], subjects: [], status: "", ...o.patch });
                          document.getElementById("library")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                        }}
                        className={cn("group flex min-h-12 w-full items-center gap-3 rounded-full bg-white/[0.06] py-1.5 pl-4 pr-1.5 text-left text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/[0.12] hover:ring-[#F4D27A]/50", focus)}
                      >
                        <span className="flex-1">{o.label}</span>
                        <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-xs tabular-nums">{o.n}</span>
                        <span aria-hidden="true" className={cn(chip, "bg-[#F4D27A] text-[#1A1206]")}><ArrowUpRight className="h-4 w-4" /></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Rise>

            {/* Report */}
            <Rise delay={0.16}>
              <Link
                to="/connect#report"
                onMouseMove={spot}
                className={cn("group relative flex gap-4 overflow-hidden rounded-[1.75rem] bg-white p-6 ring-1 ring-black/10 hover:ring-[#B52026]/30", glowLight, lift, focus)}
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#B52026] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] text-[#B52026] transition group-hover:scale-110">
                  <MessageSquareWarning className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-black tracking-tight text-[#0B1F10]">Report an employer</span>
                  <span className="mt-1 block text-sm text-gray-600">Is your employer deducting pension but not remitting it? Tell us and we will follow it up.</span>
                </span>
                <ArrowChip />
              </Link>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Policies ─────────────────────────── */

export function Policies() {
  const items = [
    {
      icon: Lock,
      title: "Data Protection Policy",
      body: "How PenCom collects, uses, stores and protects personal data, in line with the Nigeria Data Protection Act 2023.",
    },
    {
      icon: ShieldCheck,
      title: "Information Security (ISMS) Policy",
      body: "How PenCom keeps the information it holds confidential, accurate and available.",
    },
  ];
  return (
    <section id="policies" aria-labelledby="policies-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="policies-title" eyebrow="Our own policies" title="How PenCom protects your information" highlight="protects your information" />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((it, i) => (
            <Rise key={it.title} delay={i * 0.1} className="h-full">
              <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-[1.75rem] bg-white p-7 ring-1 ring-black/10 sm:p-8", glowLight, lift)}>
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                <it.icon aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 text-[#0A4A13]/[0.05] transition duration-500 group-hover:-translate-y-2" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] shadow-[0_16px_30px_-16px_rgba(4,20,10,0.8)] transition duration-300 group-hover:-rotate-6">
                  <it.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative mt-5 text-xl font-black tracking-tight text-[#0B1F10]">{it.title}</h3>
                <p className="relative mt-2 leading-relaxed text-gray-600">{it.body}</p>
                <Link to="/connect#contact" className={cn(darkBtn, "relative mt-6", focus)}>
                  Questions about your data? Contact us
                  <span aria-hidden="true" className={cn(chip, "bg-[#F4D27A] text-[#1A1206]")}><ArrowUpRight className="h-4 w-4" /></span>
                </Link>
              </div>
            </Rise>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-gray-600">
          <Scale className="h-4 w-4" aria-hidden="true" />
          Full policy text to be supplied by the Data Protection Officer and ICT before launch.
        </p>
      </div>
    </section>
  );
}
