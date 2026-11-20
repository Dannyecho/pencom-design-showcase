"use client";

import { useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Building2, Check, ChevronRight, FileCheck, HandCoins, KeyRound, Landmark, Lock,
  MessageSquareWarning, PiggyBank, Scale, ShieldCheck, Undo2, Users, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, Spotlight, ease, reveal } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { library } from "./library";
import { fmtDate, latest, typeStyle } from "./search";
import type { Filters } from "./Library";

/* ─────────────────────────── Latest issued (scroll-snap rail) ─────────────────────────── */

export function LatestRail({ onOpen }: { onOpen: (id: string) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <section id="latest" aria-labelledby="latest-title" className="scroll-mt-[160px] py-20 sm:py-24">
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
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 ring-1 ring-black/10 transition hover:border-[#117F21] hover:text-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
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
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:px-[max(1rem,calc((100vw_-_80rem)/2_+_1rem))] sm:scroll-px-[max(1rem,calc((100vw_-_80rem)/2_+_1rem))] scroll-px-4 [&::-webkit-scrollbar]:hidden"
      >
        {latest.map((d, i) => (
          <motion.li
            key={d.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06, ease }}
            className="w-[300px] shrink-0 snap-start sm:w-[320px]"
          >
            <button
              type="button"
              onClick={() => onOpen(d.id)}
              className={cn(
                "group relative flex h-full min-h-[240px] w-full flex-col overflow-hidden rounded-3xl p-6 text-left transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]",
                i === 0
                  ? "bg-gradient-to-br from-[#0A4A13] via-[#0A4A13] to-[#117F21] text-white shadow-[0_30px_60px_-30px_rgba(4,36,10,0.9)]"
                  : "bg-white ring-1 ring-black/10 hover:shadow-[0_24px_50px_-24px_rgba(10,74,19,0.4)]",
              )}
            >
              {i === 0 && <span aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F4D27A]/20 blur-3xl" />}
              <span className="relative flex items-center justify-between text-xs">
                <span className={cn("rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider", i === 0 ? "bg-white/15 text-[#F4D27A]" : typeStyle[d.type].chip)}>
                  {d.type}
                </span>
                <span className={cn("font-mono", i === 0 ? "text-white/60" : "text-gray-400")}>{fmtDate(d.date)}</span>
              </span>
              <span className={cn("relative mt-5 line-clamp-4 text-lg font-bold leading-snug", i === 0 ? "text-white" : "text-[#0A2E10] group-hover:text-[#117F21]")}>
                {d.title}
              </span>
              <span className={cn("relative mt-auto flex items-center gap-2 pt-5 text-sm font-semibold", i === 0 ? "text-[#F4D27A]" : "text-[#117F21]")}>
                Read details
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </button>
          </motion.li>
        ))}
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
    <section id="act" aria-labelledby="act-title" className="relative isolate scroll-mt-[160px] overflow-hidden bg-[#04140A] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.26),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(46,145,61,0.38),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 h-[480px] w-[480px] rounded-full bg-[#117F21]/40 blur-[150px]" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="act-title"
          dark
          eyebrow="Primary legislation"
          title="The Pension Reform Act 2014, in plain language"
          highlight="in plain language"
          intro="The Act sets up the Contributory Pension Scheme and the Commission. Here is what it means for you."
          action={
            <motion.div {...reveal} className="flex flex-wrap items-center gap-4 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15">
            <Landmark className="h-10 w-10 text-[#F4D27A]" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold">Signed into law</p>
              <p className="text-2xl font-black text-[#F4D27A]">1 July 2014</p>
            </div>
            <Link to="/regulations/pension-reform-act" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">Read the full Act →</Link>
          </motion.div>
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
                    "relative isolate flex min-h-14 shrink-0 items-center gap-3 rounded-2xl px-4 text-left font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
                    on ? "text-[#0A4A13]" : "text-white/70 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {on && (
                    <motion.span layoutId="act-pill" className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-[#F4D27A] to-[#E9B949]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
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
                className="grid h-full grid-cols-1 gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur sm:p-9 md:grid-cols-[1fr_220px]"
              >
                <div>
                  <h3 className="text-2xl font-bold">{p.title}</h3>
                  <ul className="mt-5 space-y-4">
                    {p.points.map((pt, i) => (
                      <motion.li
                        key={pt}
                        initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 + i * 0.07, ease }}
                        className="flex gap-3 leading-relaxed text-white/85"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#117F21] ring-1 ring-[#2E913D]">
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
                    className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-sm font-semibold transition hover:border-[#F4D27A] hover:text-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                  >
                    Related regulations and circulars
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-[#F4D27A] to-[#CB9615] p-6 text-[#1A1206]">
                  <CountUp value={p.stat.value} className="text-6xl font-black tracking-tight" />
                  <p className="mt-2 text-sm font-semibold leading-snug">{p.stat.label}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-xs text-white/50">
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
    <section id="compliance" aria-labelledby="compliance-title" className="scroll-mt-[160px] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="compliance-title"
          eyebrow="Compliance"
          title="Stay compliant with the Act"
          highlight="compliant"
          intro="What employers must do, a quick self-check, and where licensed operators can find the rules that apply to them."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Employer checklist */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A6F06]">
                  <Building2 className="h-4 w-4" aria-hidden="true" /> For employers
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#0A2E10]">Your pension duties: a self-check</h3>
                <p className="mt-1 text-sm text-gray-600">Tick what you already do. Nothing is sent to PenCom.</p>
              </div>
              <div className="relative flex h-32 w-32 shrink-0 items-center justify-center self-center">
                <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90" aria-hidden="true">
                  <circle cx="60" cy="60" r={R} fill="none" stroke="#E8F5E9" strokeWidth="10" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    stroke={pct === 1 ? "#117F21" : "#CB9615"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    animate={{ strokeDashoffset: C * (1 - pct) }}
                    transition={{ duration: reduce ? 0 : 0.6, ease }}
                  />
                </svg>
                <span className="absolute text-center">
                  <span className="block text-3xl font-black text-[#0A2E10]">{score}/{duties.length}</span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500">done</span>
                </span>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {duties.map((d, i) => (
                <li key={d.title}>
                  <label
                    className={cn(
                      "group flex cursor-pointer gap-4 rounded-2xl border p-4 transition duration-300",
                      done[i] ? "border-[#117F21]/40 bg-[#F4FAF3]" : "border-gray-200 hover:border-[#117F21]/30",
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
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#FFD84D]",
                        done[i] ? "bg-[#117F21] text-white" : "bg-[#F4F7F2] text-[#117F21]",
                      )}
                    >
                      {done[i] ? <Check className="h-5 w-5" strokeWidth={3} /> : <d.icon className="h-5 w-5" />}
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-semibold text-[#0A2E10]">
                        <span className="font-mono text-xs text-gray-400">0{i + 1}</span>
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
                className={cn("mt-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center", pct === 1 ? "bg-[#117F21] text-white" : "bg-[#FFF8E1] text-[#5C4300]")}
                aria-live="polite"
              >
                <p className="flex-1 text-sm font-medium">
                  {pct === 1
                    ? "You’re doing everything on the list. Keep your records ready for PenCom inspections."
                    : `${duties.length - score} to go. Late or unpaid contributions attract penalties under the Pension Reform Act 2014.`}
                </p>
                <Link
                  to="/services#pcc"
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
                    pct === 1 ? "bg-white text-[#0A4A13]" : "bg-[#117F21] text-white hover:bg-[#0A4A13]",
                  )}
                >
                  Get your PCC <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-6 lg:col-span-4">
            {/* Operators */}
            <Spotlight color="rgba(244,210,122,0.2)" className="rounded-3xl bg-gradient-to-br from-[#0A4A13] via-[#0A4A13] to-[#117F21] p-6 text-white sm:p-7">
              <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">
                <KeyRound className="h-4 w-4" aria-hidden="true" /> For licensed operators
              </p>
              <h3 className="relative mt-2 text-xl font-bold">The rules that apply to you</h3>
              <ul className="relative mt-5 space-y-2">
                {operatorLinks.map((o) => (
                  <li key={o.label}>
                    <button
                      type="button"
                      onClick={() => {
                        set({ q: "", types: [], years: [], who: [], subjects: [], status: "", ...o.patch });
                        document.getElementById("library")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                      }}
                      className="group flex min-h-12 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-left text-sm font-semibold transition hover:border-[#F4D27A]/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                    >
                      <span className="flex-1">{o.label}</span>
                      <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-xs">{o.n}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </Spotlight>

            {/* Report */}
            <Link
              to="/connect#report"
              className="group flex gap-4 rounded-3xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-[#B52026]/40 hover:shadow-[0_24px_50px_-24px_rgba(181,32,38,0.35)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDE8E8] text-[#B52026] transition group-hover:scale-110">
                <MessageSquareWarning className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-bold text-[#0A2E10]">Report an employer</span>
                <span className="mt-1 block text-sm text-gray-600">Is your employer deducting pension but not remitting it? Tell us and we will follow it up.</span>
              </span>
            </Link>
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
      tone: "green",
    },
    {
      icon: ShieldCheck,
      title: "Information Security (ISMS) Policy",
      body: "How PenCom keeps the information it holds confidential, accurate and available.",
      tone: "gold",
    },
  ];
  return (
    <section id="policies" aria-labelledby="policies-title" className="scroll-mt-[160px] bg-[#F2F6F0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="policies-title" eyebrow="Our own policies" title="How PenCom protects your information" highlight="protects your information" />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((it, i) => (
            <motion.div key={it.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
              <Spotlight
                color={it.tone === "green" ? "rgba(17,127,33,0.12)" : "rgba(203,150,21,0.16)"}
                className="h-full rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(10,74,19,0.35)]"
              >
                <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", it.tone === "green" ? "bg-[#E8F5E9] text-[#117F21]" : "bg-[#FFF8E1] text-[#9A6F06]")}>
                  <it.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-[#0A2E10]">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-gray-600">{it.body}</p>
                <Link
                  to="/connect#contact"
                  className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#117F21] hover:underline"
                >
                  Questions about your data? Contact us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Spotlight>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-gray-500">
          <Scale className="h-4 w-4" aria-hidden="true" />
          Full policy text to be supplied by the Data Protection Officer and ICT before launch.
        </p>
      </div>
    </section>
  );
}
