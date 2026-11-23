"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { BookOpen, Check, Download, ExternalLink, Gavel, Link2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { ArrowChip, DocHero, DocTools, GhostBtn, Loading, Mark, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, darkCard, glowLight, ring, sizes, useDocJson } from "@/views/docs/kit";
import { spot } from "@/views/theme/ui";

/**
 * Pension Reform Act 2014 as a web page (DES-22; brief §6.2 Regulations: "Pension Reform Act 2014 (full act, key provisions)").
 * Text: OCR of the gazetted PDF (the PDF's own text layer is unreadable), checked against the Act's Arrangement of Sections.
 * Deep links: /regulations/pension-reform-act?s=7
 */

type Block = { m?: string; x: string; sub?: boolean };
type Section = { n: number; title: string; page: number; blocks: Block[] };
type Part = { n: string; title: string; sections: Section[] };
type Act = { parts: Part[]; schedules: { title: string; blocks: Block[] }[] };

const PDF = "/documents/pension-reform-act-2014.pdf";
const POPULAR = [4, 7, 8, 11, 13, 16, 89, 99];
const toolBtn = cn("inline-flex h-9 items-center gap-1.5 rounded-full bg-[#F2F6F0] px-3 text-xs font-semibold text-[#1A3A22] ring-1 ring-black/10 transition hover:bg-[#1A3A22] hover:text-[#F4D27A]", ring);

function Blocks({ blocks, q }: { blocks: Block[]; q: string }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <p key={i} className={cn("font-serif leading-[1.75] text-gray-800", b.sub ? "pl-8 sm:pl-12" : b.m ? "pl-8" : "")}>
          {b.m && <span className={cn("-ml-8 inline-block w-8 font-sans text-sm font-bold", b.sub ? "font-mono text-gray-600" : "font-mono text-[#117F21]")}>{b.m}</span>}
          <Mark text={b.x} q={q} />
        </p>
      ))}
    </div>
  );
}

function SectionCard({ s, q, partN, active }: { s: Section; q: string; partN: string; active: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const url = `${location.origin}/regulations/pension-reform-act?s=${s.n}`;
    navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <motion.article
      id={`s-${s.n}`} aria-labelledby={`s-${s.n}-t`}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, ease }}
      className={cn("group relative scroll-mt-56 md:scroll-mt-44 overflow-hidden rounded-3xl bg-white p-6 ring-1 transition-shadow duration-300 hover:shadow-[0_30px_60px_-34px_rgba(18,51,28,0.35)] sm:p-8 print:break-inside-avoid print:p-0 print:ring-0", active ? "ring-2 ring-[#CB9615]" : "ring-black/10")}
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1 origin-top bg-gradient-to-b from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-y-100 print:hidden", active ? "scale-y-100" : "scale-y-0")} />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1A3A22] px-2 font-mono text-lg font-bold tabular-nums text-[#F4D27A] shadow-[0_12px_26px_-12px_rgba(18,51,28,0.8)] transition duration-300 group-hover:-rotate-6">{s.n}</span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7F5A04]">Part {partN} · Section {s.n}</p>
            <h3 id={`s-${s.n}-t`} className="mt-0.5 text-lg font-extrabold leading-snug tracking-tight text-[#1A3A22] sm:text-xl"><Mark text={s.title} q={q} /></h3>
          </div>
        </div>
        <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 print:hidden">
          <button type="button" onClick={copy} className={toolBtn}>
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Link2 className="h-3.5 w-3.5" aria-hidden="true" />}{copied ? "Copied" : "Link"}<span className="sr-only"> to section {s.n}</span>
          </button>
          {s.page > 0 && (
            <a href={`${PDF}#page=${s.page}`} target="_blank" rel="noopener noreferrer" className={toolBtn}>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> PDF p.{s.page}<span className="sr-only"> (opens the official PDF in a new tab)</span>
            </a>
          )}
        </div>
      </header>
      <div className="mt-5"><Blocks blocks={s.blocks} q={q} /></div>
    </motion.article>
  );
}

export default function PensionAct() {
  const reduce = useReducedMotion();
  const { status, data } = useDocJson<Act>("/documents/text/pension-reform-act-2014.json");
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const dq = useDeferredValue(q);
  const [size, setSize] = useState(0);

  const all = useMemo(() => (data ? data.parts.flatMap((p) => p.sections.map((s) => ({ ...s, part: p }))) : []), [data]);
  const matches = useMemo(() => {
    const t = dq.trim().toLowerCase();
    if (t.length < 2) return null;
    return all.filter((s) => `${s.n} ${s.title} ${s.blocks.map((b) => b.x).join(" ")}`.toLowerCase().includes(t)).map((s) => s.n);
  }, [all, dq]);
  const shown = useMemo(() => (matches ? new Set(matches) : null), [matches]);

  const toc = useMemo(
    () => (data ? data.parts.flatMap((p) => [{ id: `part-${p.n}`, label: `Part ${p.n} · ${p.title}`, level: 1 }, ...p.sections.filter((s) => !shown || shown.has(s.n)).map((s) => ({ id: `s-${s.n}`, label: `${s.n}. ${s.title}`, level: 2 }))]).concat(data.schedules.map((s, i) => ({ id: `sch-${i}`, label: s.title, level: 1 }))) : []),
    [data, shown],
  );

  // Deep link to a section
  useEffect(() => {
    const s = params.get("s");
    if (!s || status !== "ready") return;
    const t = window.setTimeout(() => document.getElementById(`s-${s}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 120);
    return () => window.clearTimeout(t);
  }, [params, status, reduce]);

  const go = (n: number) => {
    setQ("");
    const next = new URLSearchParams(params);
    next.set("s", String(n));
    setParams(next, { replace: true, preventScrollReset: true });
    window.setTimeout(() => document.getElementById(`s-${n}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 60);
  };

  return (
    <MotionConfig reducedMotion="user">
      <ReadingBar />
      <DocHero
        crumbs={[{ label: "Home", to: "/" }, { label: "Regulations", to: "/regulations" }, { label: "Pension Reform Act 2014" }]}
        kind="Act of the National Assembly"
        icon={<Gavel className="h-3.5 w-3.5" aria-hidden="true" />}
        title="Pension Reform Act 2014"
        badge={<span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#105D1D] ring-1 ring-[#14892A]/20"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#14892A]" />In force</span>}
        lead="This Act repeals the Pension Reform Act No. 2, 2004 and enacts the Pension Reform Act, 2014 to continue to govern and regulate the administration of the uniform contributory pension scheme for both the public and private sectors in Nigeria."
        meta={[
          { label: "Signed into law", value: "1 July 2014" },
          { label: "Repeals", value: "Pension Reform Act 2004" },
          { label: "Parts", value: data ? data.parts.length : 15 },
          { label: "Sections", value: data ? all.length : 121 },
        ]}
        actions={<>
          <PrimaryBtn href={PDF} external><Download className="h-4 w-4" aria-hidden="true" /> Official PDF</PrimaryBtn>
          <GhostBtn href="/regulations#act"><BookOpen className="h-4 w-4" aria-hidden="true" /> Key provisions in plain English</GhostBtn>
        </>}
      />

      <div className="bg-[#F2F6F0] text-[#1A3A22]">
        {/* Search bar: floats over the reading column */}
        <div className="sticky top-[92px] z-20 mx-auto max-w-7xl px-4 pt-4 print:hidden">
          <div className="flex flex-col gap-2 rounded-[1.75rem] bg-white/90 p-1.5 shadow-[0_24px_50px_-30px_rgba(18,51,28,0.55)] ring-1 ring-black/10 backdrop-blur-xl md:flex-row md:items-center md:rounded-full">
            <label className="flex flex-1 items-center gap-3 rounded-full pl-4 pr-1 has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-[#FFD84D]">
              <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
              <span className="sr-only">Search the Act</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the Act, e.g. “retirement savings account”, “penalty”, “death”" className="min-h-12 w-full min-w-0 bg-transparent text-base placeholder:text-gray-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:rotate-90 hover:bg-[#F2F6F0] hover:text-[#1A3A22]", ring)}><X className="h-4 w-4" aria-hidden="true" /></button>}
            </label>
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-1 md:justify-end md:px-0 md:pb-0">
              <p className={cn("text-sm text-gray-600 md:w-52", !matches && "hidden sm:block")} aria-live="polite">
                {matches ? <><strong className="rounded-full bg-[#1A3A22] px-2 py-0.5 font-mono tabular-nums text-[#F4D27A]">{matches.length}</strong> section{matches.length === 1 ? "" : "s"} mention “{dq.trim()}”</> : "Search across all 121 sections"}
              </p>
              <DocTools size={size} setSize={setSize} />
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-20 pt-10 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-[184px] space-y-4">
              {data && <Toc items={toc} title={matches ? "Matching sections" : "Arrangement of sections"} />}
            </div>
          </aside>

          <div className="min-w-0 space-y-10">
            {status === "ready" && !matches && (
              <section aria-labelledby="pop-title" className="print:hidden">
                <h2 id="pop-title" className="text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">Most looked-up sections</h2>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  {POPULAR.map((n, i) => {
                    const s = all.find((x) => x.n === n);
                    if (!s) return null;
                    return (
                      <motion.li key={n} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.5, ease }} className="h-full">
                        <button type="button" onClick={() => go(n)} onMouseMove={spot} className={cn("group relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-3xl bg-white p-4 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]", glowLight, ring)}>
                          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                          <span className="flex items-center justify-between gap-2">
                            <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#F2F6F0] px-2 font-mono text-sm font-bold tabular-nums text-[#105D1D] transition group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]">§{n}</span>
                            <ArrowChip />
                          </span>
                          <span className="text-sm font-bold leading-snug text-[#1A3A22]">{s.title}</span>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </section>
            )}

            {status === "loading" && <Loading />}
            {status === "error" && <p className="rounded-3xl bg-white p-8 text-center ring-1 ring-black/10">The web version could not be loaded. <a href={PDF} className="font-semibold text-[#117F21] underline">Open the official PDF</a>.</p>}

            {data && (
              <div className="space-y-12" style={{ fontSize: sizes[size] }}>
                {data.parts.map((p) => {
                  const secs = p.sections.filter((s) => !shown || shown.has(s.n));
                  if (!secs.length) return null;
                  return (
                    <section key={p.n} id={`part-${p.n}`} aria-labelledby={`part-${p.n}-t`} className="scroll-mt-56 md:scroll-mt-44">
                      <motion.div
                        onMouseMove={spot}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease }}
                        className={cn("relative isolate overflow-hidden rounded-[1.75rem] px-6 py-8 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)] sm:px-9 print:bg-none print:text-black print:shadow-none", darkCard)}
                      >
                        <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-2 -z-10 select-none text-[7rem] font-black leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.22)] sm:text-[9rem] print:hidden">{p.n}</span>
                        <p className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1A1206]">Part {p.n}</p>
                        <h2 id={`part-${p.n}-t`} className="mt-3 max-w-2xl text-2xl font-black leading-tight tracking-tight sm:text-3xl">{p.title}</h2>
                        <p className="mt-3 flex items-center gap-3 text-sm text-white/70">
                          <span aria-hidden="true" className="h-0.5 w-10 rounded-full bg-gradient-to-r from-[#F4D27A] to-[#14892A]" />
                          Sections {p.sections[0].n}–{p.sections[p.sections.length - 1].n}
                        </p>
                      </motion.div>
                      <div className="mt-4 space-y-4">
                        {secs.map((s) => <SectionCard key={s.n} s={s} q={dq} partN={p.n} active={params.get("s") === String(s.n)} />)}
                      </div>
                    </section>
                  );
                })}
                {!matches && data.schedules.map((s, i) => (
                  <section key={s.title} id={`sch-${i}`} className="relative scroll-mt-56 md:scroll-mt-44 overflow-hidden rounded-[1.75rem] bg-white p-6 ring-1 ring-black/10 sm:p-8">
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615]" />
                    <p className="inline-flex rounded-full bg-[#105D1D] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4D27A]">Schedule</p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight text-[#1A3A22]">{s.title}</h2>
                    <div className="mt-5"><Blocks blocks={s.blocks} q="" /></div>
                    {i === 1 && <p className="mt-4 text-sm text-gray-600">The formula tables in this Schedule are easier to read in the <a href={`${PDF}#page=60`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#117F21] underline">official PDF</a>.</p>}
                  </section>
                ))}
                <AnimatePresence>
                  {matches && matches.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-3xl bg-white p-10 text-center ring-1 ring-black/10">
                      <p className="text-lg font-bold text-[#1A3A22]">No section mentions “{dq.trim()}”.</p>
                      <p className="mt-1 text-gray-600">Try a shorter word, or ask the PenCom Assistant.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="space-y-4 print:hidden">
              <VerifyNote>This web version was prepared from the gazetted copy of the Act using text recognition, so it is easier to read, search and link to. Legal Services will check it against the gazette before publication. If the two ever differ, the gazetted text is authoritative.</VerifyNote>
              <PdfCard href={PDF} title="Pension Reform Act 2014 (gazetted copy)" meta="PDF · 62 pages · 1.2 MB" />
              <Link to="/regulations#library" onMouseMove={spot} className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-white p-6 font-bold text-[#1A3A22] ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]", glowLight, ring)}>
                Regulations, guidelines and circulars issued under the Act
                <ArrowChip />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
