"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/lib/router";
import { ArrowRight, BookOpen, Download, FileDown, FileText, Globe2, Headphones, Play, Printer, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { DarkBackdrop, Rise, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "./compat";
import { forms, publications, type Publication } from "./publications";

const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(46,145,61,0.10),transparent_45%)]";
/** Dark spotlight card: the spotlight and the gradient share one background-image (see S4 notes). */
const darkCard = "bg-[#0B1F10] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_50%),linear-gradient(135deg,#0B1F10,#0A4A13)]";
const goldBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]";
const chip = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]";

const coverCls = "mx-auto w-full max-w-[15rem] sm:max-w-none";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const monthly = publications.filter((p) => p.kind === "Monthly report" && /^\d{4}-\d{2}$/.test(p.period));
const quarterly = publications
  .filter((p) => p.kind === "Quarterly report")
  .map((p) => {
    const m = p.period.match(/(\d{4})-Q(\d)/);
    const t = p.title.toLowerCase();
    const q = m ? Number(m[2]) : t.includes("first") ? 1 : t.includes("second") ? 2 : t.includes("third") ? 3 : t.includes("fourth") ? 4 : 0;
    const y = m ? Number(m[1]) : Number(p.title.match(/(20\d\d)/)?.[1] ?? p.year);
    return { ...p, q, qy: y };
  });
const annual = publications.filter((p) => p.kind === "Annual report").sort((a, b) => b.year - a.year);
const accounts = publications.filter((p) => p.kind === "Annual accounts");
const other = publications.filter((p) => p.kind === "Publication");
const booklets = publications
  .filter((p) => p.kind === "FAQ booklet")
  .map((p) => {
    const m = p.title.match(/hausa|yoruba|igbo|pidgin/i)?.[0];
    return { ...p, lang: m ? m[0].toUpperCase() + m.slice(1).toLowerCase() : null };
  });

/* ─────────────────────────── 3D cover ─────────────────────────── */

function Cover({ p, label, big, tone }: { p: Publication; label: string; big: string; tone: "green" | "gold" | "ink" }) {
  const reduce = useReducedMotion();
  const bg = { green: "from-[#0A4A13] via-[#0A4A13] to-[#117F21] text-white", gold: "from-[#CB9615] via-[#E9B949] to-[#F4D27A] text-[#1A1206]", ink: "from-[#04140A] via-[#0B1F10] to-[#0A4A13] text-white" }[tone];
  const light = tone === "gold";
  return (
    <a href={p.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className="group block rounded-xl [perspective:1200px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#FFD84D]">
      <motion.span
        className="relative block aspect-[3/4] w-full [transform-style:preserve-3d]"
        initial={{ rotateY: reduce ? 0 : -18 }}
        whileInView={{ rotateY: reduce ? 0 : -12 }}
        whileHover={reduce ? undefined : { rotateY: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <span className={cn("absolute inset-0 overflow-hidden rounded-r-3xl rounded-l-md bg-gradient-to-br p-6 shadow-[20px_30px_60px_-20px_rgba(4,20,10,0.6)]", bg)}>
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
          <span aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background-image:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,0%),rgba(255,255,255,0.22),transparent_60%)]" />
          <span className="relative flex h-full flex-col">
            <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", light ? "text-[#1A1206]/80" : "text-white/75")}>National Pension Commission</span>
            <span aria-hidden="true" className={cn("mt-4 h-[3px] w-10 rounded-full transition-all duration-500 group-hover:w-20", light ? "bg-[#0B1F10]" : "bg-[#F4D27A]")} />
            <span className="mt-auto block text-6xl font-black leading-none tracking-tighter">{big}</span>
            <span className="mt-3 block text-lg font-bold leading-tight">{label}</span>
            <span className={cn("mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur", light ? "bg-[#0B1F10] text-[#F4D27A]" : "bg-white/15")}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
            </span>
          </span>
        </span>
      </motion.span>
      <span className="mt-5 block text-center text-sm text-gray-600">Published {fmt(p.date)}<span className="sr-only">. {p.title}, opens in a new tab</span></span>
    </a>
  );
}

/* ─────────────────────────── Publications ─────────────────────────── */

const tabs = ["Quarterly reports", "Monthly reports", "Annual reports", "Annual accounts", "Other publications"] as const;

function YearChips({ years, year, setYear, id }: { years: number[]; year: number; setYear: (y: number) => void; id: string }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto p-1 pb-2 [scrollbar-width:thin]" role="group" aria-label="Year">
      {years.map((y) => (
        <button key={y} type="button" aria-pressed={y === year} onClick={() => setYear(y)} className={cn("relative isolate min-h-11 shrink-0 rounded-full px-4 font-mono text-sm font-semibold tabular-nums transition-colors", focus, y === year ? "text-[#F4D27A]" : "bg-[#F2F6F0] text-gray-700 hover:text-[#117F21]")}>
          {y === year && <motion.span layoutId={`year-${id}`} className="absolute inset-0 -z-10 rounded-full bg-[#0B1F10] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          {y}
        </button>
      ))}
    </div>
  );
}

function DocRow({ p }: { p: Publication }) {
  return (
    <li>
      <a href={p.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(4,20,10,0.4)] hover:ring-[#117F21]/30", glowLight, focus)}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F6F0] text-[#117F21] transition duration-300 group-hover:bg-[#0B1F10] group-hover:text-[#F4D27A]">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1 font-semibold text-[#0B1F10] group-hover:text-[#117F21]">{p.title}</span>
        <span className="hidden font-mono text-xs tabular-nums text-gray-600 sm:block">{fmt(p.date)}</span>
        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F6F0] text-[#0B1F10] transition duration-300 group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
          <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
        </span>
        <span className="sr-only">(PDF, opens in a new tab)</span>
      </a>
    </li>
  );
}

export function Publications({ highlight }: { highlight: string | null }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>(
    highlight && /annual report/i.test(highlight) ? "Annual reports" : highlight && /monthly/i.test(highlight) ? "Monthly reports" : highlight && /^other$/i.test(highlight) ? "Other publications" : "Quarterly reports",
  );
  const qYears = useMemo(() => Array.from(new Set(quarterly.map((q) => q.qy))).sort((a, b) => b - a), []);
  const mYears = useMemo(() => Array.from(new Set(monthly.map((m) => Number(m.period.slice(0, 4))))).sort((a, b) => b - a), []);
  const [qYear, setQYear] = useState(qYears[0]);
  const [mYear, setMYear] = useState(mYears[0]);
  const reduce = useReducedMotion();

  const latestQ = quarterly.slice().sort((a, b) => b.qy - a.qy || b.q - a.q)[0];
  const magazine = other.find((o) => /chronicles/i.test(o.title)) ?? other[0];

  return (
    <section id="publications" aria-labelledby="pub-title" className={cn(sectionCls, "relative bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="pub-title" eyebrow="Publications" title="Reports on the pension industry" highlight="pension industry" intro={`${publications.length} reports and publications, from monthly figures to annual reports. Every one is the official PDF.`} />
        <Rise className="mt-10">
          <Link to="/resources/reports/q1-2026" onMouseMove={spot} className={cn("group relative flex flex-col justify-between gap-5 overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)] transition duration-300 hover:-translate-y-1 sm:flex-row sm:items-center sm:p-8", darkCard, focus)}>
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-4 select-none text-[9rem] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.18)] sm:right-56">Q1</span>
            <span className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A1206]">New · Read online</span>
              <span className="mt-3 block text-xl font-black tracking-tight sm:text-2xl">Q1 2026 Quarterly Industry Report</span>
              <span className="mt-1 block text-sm text-white/75">The dashboard, the Director-General’s read and the priorities for Q2, as a web page.</span>
            </span>
            <span className={cn(goldBtn, "relative w-fit shrink-0")}>
              Read the report
              <span aria-hidden="true" className={cn(chip, "bg-[#0B1F10] text-[#F4D27A]")}><ArrowRight className="h-4 w-4" /></span>
            </span>
          </Link>
        </Rise>

        {/* Featured covers */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-14 lg:px-10">
          {latestQ && <Rise className={coverCls}><Cover p={latestQ} label={`Quarter ${latestQ.q} report`} big={`Q${latestQ.q} ’${String(latestQ.qy).slice(2)}`} tone="green" /></Rise>}
          {annual[0] && <Rise delay={0.1} className={coverCls}><Cover p={annual[0]} label="Annual report" big={String(annual[0].year)} tone="ink" /></Rise>}
          {magazine && <Rise delay={0.2} className={coverCls}><Cover p={magazine} label={magazine.title} big={String(magazine.year)} tone="gold" /></Rise>}
        </div>

        {/* Browser */}
        <div className="mt-16 rounded-[1.75rem] bg-white p-4 shadow-[0_30px_60px_-40px_rgba(4,20,10,0.35)] ring-1 ring-black/10 sm:p-8">
          <LayoutGroup id="pub-tabs">
            <div role="tablist" aria-label="Publication types" className="flex gap-1 overflow-x-auto rounded-full bg-[#F2F6F0] p-1.5 [scrollbar-width:none]">
              {tabs.map((t) => (
                <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("relative isolate min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]", tab === t ? "text-[#F4D27A]" : "text-gray-700 hover:text-[#117F21]")}>
                  {tab === t && <motion.span layoutId="pub-underline" className="absolute inset-0 -z-10 rounded-full bg-[#0B1F10] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  {t}
                </button>
              ))}
            </div>
          </LayoutGroup>

          <div role="tabpanel" aria-label={tab} className="pt-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={tab} initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -12 }} transition={{ duration: 0.25, ease }}>
                {tab === "Quarterly reports" && (
                  <>
                    <YearChips years={qYears} year={qYear} setYear={setQYear} id="q" />
                    <ul className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                      {[1, 2, 3, 4].map((n) => {
                        const r = quarterly.find((x) => x.qy === qYear && x.q === n);
                        return (
                          <motion.li key={`${qYear}-${n}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: n * 0.05, ease }}>
                            {r ? (
                              <a href={r.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-3xl p-5 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(4,36,10,0.8)]", darkCard, focus)}>
                                <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-[#2E913D] to-[#F4D27A] transition-transform duration-500 group-hover:scale-x-100" />
                                <span className="relative bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-5xl font-black tracking-tight text-transparent">Q{n}</span>
                                <span className="relative flex items-center justify-between text-sm text-white/85">
                                  <span className="font-mono tabular-nums">{qYear} report</span>
                                  <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition duration-300 group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                                    <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                                  </span>
                                </span>
                                <span className="sr-only">{r.title}, PDF, opens in a new tab</span>
                              </a>
                            ) : (
                              <span className="flex aspect-[4/3] flex-col justify-between rounded-3xl border-2 border-dashed border-black/10 p-5 text-gray-500">
                                <span className="text-5xl font-black">Q{n}</span>
                                <span className="text-sm">Not published</span>
                              </span>
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {tab === "Monthly reports" && (
                  <>
                    <YearChips years={mYears} year={mYear} setYear={setMYear} id="m" />
                    <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                      {MONTHS.map((m, i) => {
                        const r = monthly.find((x) => x.period === `${mYear}-${String(i + 1).padStart(2, "0")}`);
                        return (
                          <motion.li key={`${mYear}-${m}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: i * 0.025, ease }}>
                            {r ? (
                              <a href={r.pdf} target="_blank" rel="noopener noreferrer" className={cn("group flex aspect-square flex-col items-center justify-center rounded-2xl bg-[#F2F6F0] text-[#0B1F10] ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#0B1F10] hover:text-[#F4D27A] hover:shadow-[0_20px_40px_-22px_rgba(4,20,10,0.8)]", focus)}>
                                <span className="text-xl font-black">{m}</span>
                                <FileDown className="mt-1 h-4 w-4 opacity-60 transition group-hover:opacity-100" aria-hidden="true" />
                                <span className="sr-only">{r.title}, PDF, opens in a new tab</span>
                              </a>
                            ) : (
                              <span className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 text-gray-400" aria-label={`${m} ${mYear}: not available`}>
                                <span className="text-xl font-black">{m}</span>
                              </span>
                            )}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </>
                )}

                {tab === "Annual reports" && (
                  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {annual.map((a, i) => (
                      <motion.li key={a.pdf} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03, ease }}>
                        <a href={a.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-r-2xl rounded-l-sm p-4 text-white shadow-[0_18px_36px_-20px_rgba(4,20,10,0.8)] transition duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-[0_30px_50px_-24px_rgba(4,20,10,0.9)]", darkCard, focus)}>
                          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#CB9615] to-transparent" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">Annual report</span>
                          <span className="text-3xl font-black text-[#F4D27A]">{a.year}</span>
                          <span className="sr-only">{a.title}, PDF, opens in a new tab</span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {tab === "Annual accounts" && <ul className="space-y-2">{accounts.map((a) => <DocRow key={a.pdf} p={a} />)}</ul>}
                {tab === "Other publications" && <ul className="space-y-2">{other.map((a) => <DocRow key={a.pdf} p={a} />)}</ul>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Forms & downloads ─────────────────────────── */

const langNames: Record<string, string> = { Hausa: "Hausa", Yoruba: "Yorùbá", Igbo: "Igbo", Pidgin: "Naijá (Pidgin)" };

export function Downloads() {
  return (
    <section id="downloads" aria-labelledby="dl-title" className={cn(sectionCls, "bg-white")}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="dl-title" eyebrow="Forms and downloads" title="Forms, booklets and templates" highlight="booklets" />
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">Forms</h3>
            <ul className="mt-4 space-y-2">
              {forms.map((f, i) => (
                <motion.li key={f.pdf} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.05, ease }}>
                  <a href={f.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group flex items-center gap-4 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(4,20,10,0.4)] hover:ring-[#117F21]/30", glowLight, focus)}>
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] font-bold transition duration-300 group-hover:rotate-[-6deg]", f.ext === "PDF" ? "bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A]" : "bg-[#E8F5E9] text-[#0A4A13]")}>{f.ext}</span>
                    <span className="flex-1 font-semibold text-[#0B1F10] group-hover:text-[#117F21]">{f.title}</span>
                    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F6F0] text-[#0B1F10] transition duration-300 group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                      <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                    </span>
                    <span className="sr-only">({f.ext}, opens in a new tab)</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">Employer, benefit and transfer forms are issued by your PFA. Ask your PFA for the current version.</p>
          </div>

          <div className="lg:col-span-5">
            <Rise className="h-full">
            <div onMouseMove={spot} className={cn("relative isolate h-full overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)]", darkCard)}>
              <Globe2 aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 -z-10 h-56 w-56 text-[#F4D27A]/[0.07]" />
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)]">
                <Globe2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 text-2xl font-black tracking-tight">In your language</h3>
              <p className="relative mt-2 text-white/75">Micro Pension questions and answers in Nigerian languages.</p>
              <ul className="relative mt-6 grid grid-cols-2 gap-3">
                {booklets.filter((b) => b.lang).map((b) => (
                  <li key={b.pdf}>
                    <a href={b.pdf} target="_blank" rel="noopener noreferrer" lang={b.lang === "Hausa" ? "ha" : b.lang === "Yoruba" ? "yo" : b.lang === "Igbo" ? "ig" : "pcm"} className={cn("group flex min-h-20 flex-col justify-between rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:ring-[#F4D27A]/60", focus)}>
                      <span className="text-lg font-bold">{langNames[b.lang!]}</span>
                      <span className="flex items-center gap-1 text-xs text-white/75"><Download className="h-3.5 w-3.5 text-[#F4D27A] transition-transform group-hover:translate-y-0.5" aria-hidden="true" /> PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
              {booklets.filter((b) => !b.lang).map((b) => (
                <a key={b.pdf} href={b.pdf} target="_blank" rel="noopener noreferrer" className={cn("group relative mt-3 flex min-h-11 items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/10 hover:ring-[#F4D27A]/60", focus)}>
                  <BookOpen className="h-4 w-4 shrink-0 text-[#F4D27A]" aria-hidden="true" />
                  <span className="flex-1">{b.title}</span>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Learning ─────────────────────────── */

const videos = [
  // Titles and descriptions to be confirmed by Corporate Communications.
  { src: "/highlight-video2.mp4", poster: "/images/site/video-poster-team.webp", title: "PenCom at work", body: "A short film from the National Pension Commission." },
  { src: "/highlight-video.mp4", poster: "/images/site/video-poster-elders.webp", title: "PenCom highlights", body: "A short highlights film from the National Pension Commission." },
];

export function Learning({ openGuides }: { openGuides: () => void }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const v = videos[current];

  return (
    <section id="learning" aria-labelledby="learn-title" className={cn(sectionCls, "relative isolate bg-[#04140A] text-white")}>
      <DarkBackdrop />
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="learn-title" dark eyebrow="Learning" title="Watch, listen and learn" highlight="listen and learn" intro="Videos about the scheme, and reading aids for every guide: listen aloud, bigger text, printable checklists." />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-[#F4D27A]/60 via-white/10 to-[#117F21]/60 p-px shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-black">
              {playing ? (
                <video key={v.src} ref={ref} controls autoPlay poster={v.poster} className="aspect-video w-full" preload="metadata">
                  <source src={v.src} type="video/mp4" />
                </video>
              ) : (
                <button type="button" onClick={() => setPlaying(true)} className="group relative block aspect-video w-full text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]">
                  <img src={v.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04140A] via-[#04140A]/20 to-transparent" />
                  <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4D27A]/40 motion-safe:animate-ping" />
                  <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] shadow-[0_20px_50px_-12px_rgba(244,210,122,0.8)] transition duration-300 group-hover:scale-110">
                    <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <span className="block text-xl font-black tracking-tight sm:text-3xl">{v.title}</span>
                    <span className="mt-1 block text-sm text-white/80 sm:text-base">{v.body}</span>
                  </span>
                  <span className="sr-only">Play video</span>
                </button>
              )}
            </div>
            </div>
            <p className="mt-3 text-xs text-white/70">Captions and transcripts will be added before launch.</p>
          </div>

          <div className="space-y-3 lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4D27A]">Playlist</p>
            {videos.map((x, i) => (
              <button key={x.src} type="button" aria-current={i === current ? "true" : undefined} onClick={() => { setCurrent(i); setPlaying(true); }} className={cn("group flex w-full items-center gap-4 rounded-2xl p-3 text-left ring-1 backdrop-blur transition duration-300 hover:-translate-y-0.5", focus, i === current ? "bg-white/10 ring-[#F4D27A]/60" : "bg-white/[0.03] ring-white/10 hover:bg-white/[0.07]")}>
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={x.poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <span className="absolute inset-0 flex items-center justify-center bg-[#04140A]/40"><Play className={cn("h-5 w-5", i === current ? "fill-[#F4D27A] text-[#F4D27A]" : "fill-white text-white")} aria-hidden="true" /></span>
                </span>
                <span>
                  <span className="block font-semibold">{x.title}</span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-white/70">{x.body}</span>
                </span>
              </button>
            ))}

            <div className="mt-6 rounded-3xl bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur">
              <p className="font-bold">Reading aids in every guide</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Listen to the guide read aloud</li>
                <li className="flex items-center gap-2"><Type className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Make the text bigger</li>
                <li className="flex items-center gap-2"><Printer className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Print a checklist to take with you</li>
              </ul>
              <button type="button" onClick={openGuides} className={cn(goldBtn, "mt-5", focus)}>
                Browse the guides
                <span aria-hidden="true" className={cn(chip, "bg-[#0B1F10] text-[#F4D27A]")}><ArrowRight className="h-4 w-4" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
