"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Link } from "@/lib/router";
import { BookOpen, Download, FileDown, FileText, Globe2, Headphones, Play, Printer, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spotlight, ease, reveal } from "@/views/about/primitives";
import { SectionHeading } from "./compat";
import { forms, publications, type Publication } from "./publications";

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
  const bg = { green: "from-[#0A4A13] via-[#117F21] to-[#2E913D]", gold: "from-[#9A6F06] via-[#CB9615] to-[#F4D27A]", ink: "from-[#0F1A10] via-[#1F2E20] to-[#0A4A13]" }[tone];
  return (
    <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="group block [perspective:1200px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#FFD84D]">
      <motion.span
        className="relative block aspect-[3/4] w-full [transform-style:preserve-3d]"
        initial={{ rotateY: reduce ? 0 : -18 }}
        whileInView={{ rotateY: reduce ? 0 : -12 }}
        whileHover={reduce ? undefined : { rotateY: 0, y: -10 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <span className={cn("absolute inset-0 overflow-hidden rounded-r-2xl rounded-l-md bg-gradient-to-br p-6 text-white shadow-[20px_30px_60px_-20px_rgba(0,0,0,0.55)]", bg)}>
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/30 to-transparent" />
          <span className="relative flex h-full flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">National Pension Commission</span>
            <span className="mt-auto block text-6xl font-black leading-none tracking-tighter text-white/95">{big}</span>
            <span className="mt-3 block text-lg font-bold leading-tight">{label}</span>
            <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF
            </span>
          </span>
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </span>
      </motion.span>
      <span className="mt-4 block text-center text-sm text-gray-500">Published {fmt(p.date)}<span className="sr-only">. {p.title}, opens in a new tab</span></span>
    </a>
  );
}

/* ─────────────────────────── Publications ─────────────────────────── */

const tabs = ["Quarterly reports", "Monthly reports", "Annual reports", "Annual accounts", "Other publications"] as const;

function YearChips({ years, year, setYear, id }: { years: number[]; year: number; setYear: (y: number) => void; id: string }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:thin]" role="group" aria-label="Year">
      {years.map((y) => (
        <button key={y} type="button" aria-pressed={y === year} onClick={() => setYear(y)} className={cn("relative isolate min-h-10 shrink-0 rounded-xl px-3.5 font-mono text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", y === year ? "text-[#F4D27A]" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-[#117F21]")}>
          {y === year && <motion.span layoutId={`year-${id}`} className="absolute inset-0 -z-10 rounded-xl bg-[#0A4A13]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          {y}
        </button>
      ))}
    </div>
  );
}

function DocRow({ p }: { p: Publication }) {
  return (
    <li>
      <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-[#117F21]/40 hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
        <FileText className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
        <span className="flex-1 font-semibold text-[#0A2E10] group-hover:text-[#117F21]">{p.title}</span>
        <span className="hidden font-mono text-xs text-gray-400 sm:block">{fmt(p.date)}</span>
        <Download className="h-4 w-4 text-gray-400 group-hover:text-[#117F21]" aria-hidden="true" />
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
    <section id="publications" aria-labelledby="pub-title" className="relative scroll-mt-[160px] overflow-hidden bg-gradient-to-b from-white to-[#F4F7F2] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="pub-title" eyebrow="Publications" title="Reports on the pension industry" highlight="pension industry" intro={`${publications.length} reports and publications, from monthly figures to annual reports. Every one is the official PDF.`} />
        <Link to="/resources/reports/q1-2026" className="group mt-8 flex flex-col justify-between gap-3 rounded-3xl bg-gradient-to-r from-[#0A4A13] to-[#117F21] p-6 text-white transition hover:shadow-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D] sm:flex-row sm:items-center">
          <span><span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">New · Read online</span><span className="mt-1 block text-lg font-bold">Q1 2026 Quarterly Industry Report</span><span className="block text-sm text-white/70">The dashboard, the Director-General’s read and the priorities for Q2, as a web page.</span></span>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#CB9615] px-4 py-2.5 font-semibold text-[#1A1206]">Read the report <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
        </Link>

        {/* Featured covers */}
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-14 lg:px-10">
          {latestQ && <motion.div {...reveal}><Cover p={latestQ} label={`Quarter ${latestQ.q} report`} big={`Q${latestQ.q} ’${String(latestQ.qy).slice(2)}`} tone="green" /></motion.div>}
          {annual[0] && <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}><Cover p={annual[0]} label="Annual report" big={String(annual[0].year)} tone="ink" /></motion.div>}
          {magazine && <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.2 }}><Cover p={magazine} label={magazine.title} big={String(magazine.year)} tone="gold" /></motion.div>}
        </div>

        {/* Browser */}
        <div className="mt-16 rounded-[2rem] border border-gray-200 bg-white/70 p-4 backdrop-blur sm:p-8">
          <LayoutGroup id="pub-tabs">
            <div role="tablist" aria-label="Publication types" className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
              {tabs.map((t) => (
                <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("relative min-h-12 shrink-0 px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]", tab === t ? "text-[#0A4A13]" : "text-gray-500 hover:text-gray-800")}>
                  {t}
                  {tab === t && <motion.span layoutId="pub-underline" className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" />}
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
                              <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-5 text-white transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(4,36,10,0.8)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                                <span className="relative text-5xl font-black tracking-tight">Q{n}</span>
                                <span className="relative flex items-center justify-between text-sm">
                                  <span>{qYear} report</span>
                                  <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                                </span>
                                <span className="sr-only">{r.title}, PDF, opens in a new tab</span>
                              </a>
                            ) : (
                              <span className="flex aspect-[4/3] flex-col justify-between rounded-2xl border-2 border-dashed border-gray-200 p-5 text-gray-400">
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
                              <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="group flex aspect-square flex-col items-center justify-center rounded-2xl border border-[#117F21]/20 bg-[#F4FAF3] text-[#0A2E10] transition hover:-translate-y-1 hover:border-[#117F21] hover:bg-[#117F21] hover:text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                                <span className="text-xl font-black">{m}</span>
                                <FileDown className="mt-1 h-4 w-4 opacity-60 transition group-hover:opacity-100" aria-hidden="true" />
                                <span className="sr-only">{r.title}, PDF, opens in a new tab</span>
                              </a>
                            ) : (
                              <span className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-300" aria-label={`${m} ${mYear}: not available`}>
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
                        <a href={a.pdf} target="_blank" rel="noopener noreferrer" className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-r-xl rounded-l-sm bg-gradient-to-br from-[#0F1A10] to-[#0A4A13] p-4 text-white shadow-md transition hover:-translate-y-1 hover:rotate-[-1deg] hover:shadow-xl focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-[#CB9615] to-transparent" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Annual report</span>
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
    <section id="downloads" aria-labelledby="dl-title" className="scroll-mt-[160px] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="dl-title" eyebrow="Forms and downloads" title="Forms, booklets and templates" highlight="booklets" />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500">Forms</h3>
            <ul className="mt-4 space-y-2">
              {forms.map((f, i) => (
                <motion.li key={f.pdf} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05, ease }}>
                  <a href={f.pdf} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition hover:border-[#117F21]/40 hover:shadow-md focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] font-bold", f.ext === "PDF" ? "bg-[#FDE8E8] text-[#B52026]" : "bg-[#E3F2FD] text-[#0B4F8A]")}>{f.ext}</span>
                    <span className="flex-1 font-semibold text-[#0A2E10] group-hover:text-[#117F21]">{f.title}</span>
                    <Download className="h-4 w-4 text-gray-400 transition group-hover:translate-y-0.5 group-hover:text-[#117F21]" aria-hidden="true" />
                    <span className="sr-only">({f.ext}, opens in a new tab)</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-500">Employer, benefit and transfer forms are issued by your PFA. Ask your PFA for the current version.</p>
          </div>

          <div className="lg:col-span-5">
            <Spotlight color="rgba(244,210,122,0.2)" className="h-full rounded-3xl bg-gradient-to-br from-[#0A4A13] via-[#0A4A13] to-[#117F21] p-7 text-white">
              <Globe2 className="relative h-9 w-9 text-[#F4D27A]" aria-hidden="true" />
              <h3 className="relative mt-4 text-2xl font-bold">In your language</h3>
              <p className="relative mt-2 text-white/75">Micro Pension questions and answers in Nigerian languages.</p>
              <ul className="relative mt-6 grid grid-cols-2 gap-3">
                {booklets.filter((b) => b.lang).map((b) => (
                  <li key={b.pdf}>
                    <a href={b.pdf} target="_blank" rel="noopener noreferrer" lang={b.lang === "Hausa" ? "ha" : b.lang === "Yoruba" ? "yo" : b.lang === "Igbo" ? "ig" : "pcm"} className="group flex min-h-20 flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:-translate-y-0.5 hover:border-[#F4D27A]/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                      <span className="text-lg font-bold">{langNames[b.lang!]}</span>
                      <span className="flex items-center gap-1 text-xs text-white/70"><Download className="h-3.5 w-3.5" aria-hidden="true" /> PDF</span>
                    </a>
                  </li>
                ))}
              </ul>
              {booklets.filter((b) => !b.lang).map((b) => (
                <a key={b.pdf} href={b.pdf} target="_blank" rel="noopener noreferrer" className="relative mt-3 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm font-semibold transition hover:bg-white/10">
                  <BookOpen className="h-4 w-4 shrink-0 text-[#F4D27A]" aria-hidden="true" />
                  <span className="flex-1">{b.title}</span>
                  <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </Spotlight>
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
    <section id="learning" aria-labelledby="learn-title" className="relative isolate scroll-mt-[160px] overflow-hidden bg-[#04140A] py-20 text-white sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.26),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(46,145,61,0.38),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden="true" className="absolute -right-32 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-[#117F21]/40 blur-[150px]" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="learn-title" dark eyebrow="Learning" title="Watch, listen and learn" highlight="listen and learn" intro="Videos about the scheme, and reading aids for every guide: listen aloud, bigger text, printable checklists." />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
              {playing ? (
                <video key={v.src} ref={ref} controls autoPlay poster={v.poster} className="aspect-video w-full" preload="metadata">
                  <source src={v.src} type="video/mp4" />
                </video>
              ) : (
                <button type="button" onClick={() => setPlaying(true)} className="group relative block aspect-video w-full text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]">
                  <img src={v.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0A4A13] shadow-2xl transition group-hover:scale-110">
                    <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block text-2xl font-bold">{v.title}</span>
                    <span className="mt-1 block text-white/75">{v.body}</span>
                  </span>
                  <span className="sr-only">Play video</span>
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-white/50">Captions and transcripts will be added before launch.</p>
          </div>

          <div className="space-y-3 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Playlist</p>
            {videos.map((x, i) => (
              <button key={x.src} type="button" aria-current={i === current ? "true" : undefined} onClick={() => { setCurrent(i); setPlaying(true); }} className={cn("flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", i === current ? "border-[#F4D27A]/50 bg-white/10" : "border-white/10 hover:bg-white/5")}>
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={x.poster} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30"><Play className="h-5 w-5 fill-white text-white" aria-hidden="true" /></span>
                </span>
                <span>
                  <span className="block font-semibold">{x.title}</span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-white/60">{x.body}</span>
                </span>
              </button>
            ))}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold">Reading aids in every guide</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Listen to the guide read aloud</li>
                <li className="flex items-center gap-2"><Type className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Make the text bigger</li>
                <li className="flex items-center gap-2"><Printer className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Print a checklist to take with you</li>
              </ul>
              <button type="button" onClick={openGuides} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] hover:bg-[#E0AA22]">
                Browse the guides
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
