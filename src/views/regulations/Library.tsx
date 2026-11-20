"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownWideNarrow, ArrowUpRight, Check, Download, FileText, MessageCircle, Search, SlidersHorizontal, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { library, type RegDoc } from "./library";
import { fmtDate, matchQuery, statusStyle, typeStyle, years } from "./search";

export type Filters = {
  q: string;
  types: string[];
  years: number[];
  who: string[];
  subjects: string[];
  status: string;
  sort: "new" | "old" | "az";
};

const TYPES: RegDoc["type"][] = ["Regulation", "Guideline", "Circular", "Framework", "Code"];
const WHO = ["PFAs", "PFCs", "Employers", "Contributors", "Retirees", "Informal sector", "Pension agents", "States & LGs", "Closed schemes", "All operators"];
const SUBJECTS = ["Investment", "Contributions & RSAs", "Benefits & retirement", "Governance & licensing", "Coverage & PPP", "Fees", "Technology & data", "Health"];
const STATUSES = ["Latest version", "Amended", "Revised version available", "Draft"];
const PAGE = 12;

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function applyFilters(f: Filters) {
  const { test, used } = matchQuery(f.q);
  const out = library.filter(
    (d) =>
      (!f.q.trim() || test(d)) &&
      (!f.types.length || f.types.includes(d.type)) &&
      (!f.years.length || f.years.includes(d.year)) &&
      (!f.who.length || d.appliesTo.some((w) => f.who.includes(w))) &&
      (!f.subjects.length || d.subjects.some((s) => f.subjects.includes(s))) &&
      (!f.status || d.status === f.status),
  );
  if (f.sort === "old") out.sort((a, b) => a.date.localeCompare(b.date));
  else if (f.sort === "az") out.sort((a, b) => a.title.localeCompare(b.title));
  else out.sort((a, b) => b.date.localeCompare(a.date));
  return { results: out, used };
}

/* ─────────────────────────── Facets ─────────────────────────── */

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-gray-100 pt-5 first:border-0 first:pt-0">
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckRow({ label, count, checked, onChange, dot }: { label: string; count: number; checked: boolean; onChange: () => void; dot?: string }) {
  return (
    <label
      className={cn(
        "group flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm transition hover:bg-[#F4F7F2]",
        count === 0 && !checked && "opacity-40",
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#FFD84D]",
          checked ? "border-[#117F21] bg-[#117F21] text-white" : "border-gray-300 bg-white group-hover:border-[#117F21]",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      {dot && <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", dot)} />}
      <span className="flex-1 text-gray-700">{label}</span>
      <span className="font-mono text-xs text-gray-400">{count}</span>
    </label>
  );
}

function Facets({ f, set }: { f: Filters; set: (p: Partial<Filters>) => void }) {
  // Counts reflect the other active filters, so users can see what each choice would return.
  const countFor = (patch: Partial<Filters>) => applyFilters({ ...f, ...patch }).results;
  const typeBase = countFor({ types: [] });
  const yearBase = countFor({ years: [] });
  const whoBase = countFor({ who: [] });
  const subjBase = countFor({ subjects: [] });
  const statusBase = countFor({ status: "" });
  const maxYear = Math.max(...years.map((y) => yearBase.filter((d) => d.year === y).length), 1);

  return (
    <div className="space-y-5">
      <FacetGroup title="Document type">
        {TYPES.map((t) => (
          <CheckRow
            key={t}
            label={t === "Code" ? "Codes" : `${t}s`}
            dot={typeStyle[t].dot}
            count={typeBase.filter((d) => d.type === t).length}
            checked={f.types.includes(t)}
            onChange={() => set({ types: toggle(f.types, t) })}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Year issued">
        {/* Interactive histogram: each bar is a year; click to filter */}
        <div className="flex h-24 items-end gap-[3px]" role="group" aria-label="Filter by year">
          {years.map((y) => {
            const n = yearBase.filter((d) => d.year === y).length;
            const on = f.years.includes(y);
            return (
              <button
                key={y}
                type="button"
                aria-pressed={on}
                aria-label={`${y}: ${n} documents`}
                title={`${y} · ${n}`}
                disabled={n === 0 && !on}
                onClick={() => set({ years: toggle(f.years, y) })}
                className="group relative flex h-full flex-1 items-end focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
              >
                <motion.span
                  layout
                  className={cn(
                    "block w-full rounded-t-[3px] transition-colors",
                    on ? "bg-[#CB9615]" : f.years.length ? "bg-gray-200 group-hover:bg-[#117F21]/60" : "bg-[#117F21]/70 group-hover:bg-[#117F21]",
                  )}
                  style={{ height: `${Math.max(n ? 6 : 2, (n / maxYear) * 100)}%` }}
                />
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-gray-400">
          <span>{years[0]}</span>
          <span>{years[years.length - 1]}</span>
        </div>
        {f.years.length > 0 && (
          <p className="mt-2 text-xs text-gray-600">
            {f.years.slice().sort().join(", ")}{" "}
            <button type="button" onClick={() => set({ years: [] })} className="font-semibold text-[#117F21] underline underline-offset-2">
              clear
            </button>
          </p>
        )}
      </FacetGroup>

      <FacetGroup title="Who it applies to">
        {WHO.map((w) => (
          <CheckRow key={w} label={w} count={whoBase.filter((d) => d.appliesTo.includes(w)).length} checked={f.who.includes(w)} onChange={() => set({ who: toggle(f.who, w) })} />
        ))}
      </FacetGroup>

      <FacetGroup title="Subject">
        {SUBJECTS.map((s) => (
          <CheckRow key={s} label={s} count={subjBase.filter((d) => d.subjects.includes(s)).length} checked={f.subjects.includes(s)} onChange={() => set({ subjects: toggle(f.subjects, s) })} />
        ))}
      </FacetGroup>

      <FacetGroup title="Status">
        {STATUSES.map((s) => (
          <CheckRow key={s} label={s} count={statusBase.filter((d) => d.status === s).length} checked={f.status === s} onChange={() => set({ status: f.status === s ? "" : s })} />
        ))}
      </FacetGroup>
    </div>
  );
}

/* ─────────────────────────── Result card ─────────────────────────── */

function ResultCard({ d, onOpen, i }: { d: RegDoc; onOpen: (id: string) => void; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      layout={!reduce}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.03, ease }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white has-[button:focus-visible]:ring-[3px] has-[button:focus-visible]:ring-[#FFD84D] transition-shadow duration-300 hover:border-[#117F21]/30 hover:shadow-[0_24px_50px_-26px_rgba(10,74,19,0.45)]"
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100", typeStyle[d.type].dot)} />
      <div className="flex gap-4 p-5 sm:p-6">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4F7F2] text-[#117F21] transition group-hover:bg-[#117F21] group-hover:text-white sm:flex">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={cn("rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider", typeStyle[d.type].chip)}>{d.type}</span>
            <span className={cn("rounded-full px-2.5 py-0.5 font-semibold ring-1", statusStyle[d.status])}>{d.status}</span>
            <span className="font-mono text-gray-500">
              <span className="sr-only">Issued </span>
              {fmtDate(d.date)}
            </span>
          </div>
          <h3 className="mt-2.5 text-[1.05rem] font-bold leading-snug text-[#0A2E10]">
            <button
              type="button"
              onClick={() => onOpen(d.id)}
              className="text-left after:absolute after:inset-0 after:content-[''] hover:text-[#117F21] focus-visible:outline-none group-has-[:focus-visible]:underline"
            >
              {d.title}
            </button>
          </h3>
          {d.summary && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">{d.summary}</p>}
          <p className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-gray-500">
            {[...d.appliesTo, ...d.subjects.filter((s) => s !== "General")].slice(0, 4).map((t) => (
              <span key={t} className="rounded-md bg-gray-100 px-2 py-0.5">{t}</span>
            ))}
          </p>
        </div>
        <a
          href={d.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 hidden h-11 shrink-0 items-center gap-1.5 self-center rounded-xl border border-gray-200 px-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#117F21] hover:text-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D] md:inline-flex"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          PDF
          <span className="sr-only">of {d.title} (opens in a new tab)</span>
        </a>
      </div>
    </motion.li>
  );
}

/* ─────────────────────────── Library ─────────────────────────── */

export default function Library({ f, set, onOpen }: { f: Filters; set: (p: Partial<Filters>) => void; onOpen: (id: string) => void }) {
  const [shown, setShown] = useState(PAGE);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [draft, setDraft] = useState(f.q);
  const { results, used } = useMemo(() => applyFilters(f), [f]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setDraft(f.q), [f.q]);
  useEffect(() => setShown(PAGE), [f]);
  // Search as you type (debounced) – results update live and the count is announced.
  useEffect(() => {
    if (draft === f.q) return;
    const t = window.setTimeout(() => set({ q: draft }), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const chips = [
    ...(f.q ? [{ label: `“${f.q}”`, clear: () => set({ q: "" }) }] : []),
    ...f.types.map((t) => ({ label: t, clear: () => set({ types: f.types.filter((x) => x !== t) }) })),
    ...f.years.map((y) => ({ label: String(y), clear: () => set({ years: f.years.filter((x) => x !== y) }) })),
    ...f.who.map((w) => ({ label: w, clear: () => set({ who: f.who.filter((x) => x !== w) }) })),
    ...f.subjects.map((s) => ({ label: s, clear: () => set({ subjects: f.subjects.filter((x) => x !== s) }) })),
    ...(f.status ? [{ label: f.status, clear: () => set({ status: "" }) }] : []),
  ];
  const clearAll = () => set({ q: "", types: [], years: [], who: [], subjects: [], status: "" });

  return (
    <section id="library" aria-labelledby="library-title" className="scroll-mt-[160px] bg-[#F2F6F0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="library-title"
          eyebrow="Regulatory library"
          title="Find any regulation, guideline or circular"
          highlight="regulation, guideline or circular"
          intro="Filter by type, year, who it applies to and subject. Abbreviations like RSA, PFA and PCC work too."
        />

        {/* Search + sort bar */}
        <div className="sticky top-[152px] z-20 mt-10 rounded-2xl border border-gray-200 bg-white/90 p-2 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#117F21]/30">
              <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
              <span className="sr-only">Search the library</span>
              <input
                ref={inputRef}
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Search titles, subjects or abbreviations"
                className="min-h-12 w-full bg-transparent text-base placeholder:text-gray-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {draft && (
                <button type="button" onClick={() => setDraft("")} aria-label="Clear search" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <label className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-gray-600 sm:flex-none">
                <ArrowDownWideNarrow className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <span className="sr-only">Sort by</span>
                <select value={f.sort} onChange={(e) => set({ sort: e.target.value as Filters["sort"] })} className="min-h-10 flex-1 bg-transparent font-semibold text-gray-800 focus:outline-none">
                  <option value="new">Newest first</option>
                  <option value="old">Oldest first</option>
                  <option value="az">Title A–Z</option>
                </select>
              </label>
              <button
                type="button"
                onClick={() => setMobileFilters((o) => !o)}
                aria-expanded={mobileFilters}
                aria-controls="reg-facets"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters{chips.length ? ` (${chips.length})` : ""}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Facets */}
          <aside
            id="reg-facets"
            aria-label="Filters"
            className={cn("rounded-3xl border border-gray-200 bg-white p-5 lg:col-span-3 lg:block lg:self-start", mobileFilters ? "block" : "hidden")}
          >
            <Facets f={f} set={set} />
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-2 text-sm text-gray-600" aria-live="polite">
                <strong className="text-lg text-[#0A2E10]">{results.length}</strong> of {library.length} documents
              </p>
              <LayoutGroup>
                <AnimatePresence initial={false}>
                  {chips.map((c) => (
                    <motion.button
                      layout
                      key={c.label}
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={c.clear}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#0A4A13] pl-3 pr-2 text-xs font-semibold text-white transition hover:bg-[#B52026] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                    >
                      {c.label}
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Remove filter</span>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
              {chips.length > 1 && (
                <button type="button" onClick={clearAll} className="text-xs font-semibold text-[#117F21] underline underline-offset-2">
                  Clear all
                </button>
              )}
            </div>
            {used.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">Also matching: {used.join(" · ")}</p>
            )}

            {results.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <Search className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-[#0A2E10]">No documents match</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                  Try fewer words, remove a filter, or search for a topic such as “transfer”, “investment” or “benefits”.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={clearAll} className="min-h-11 rounded-xl bg-[#117F21] px-5 text-sm font-semibold text-white">
                    Clear all filters
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("chat-trigger")?.click()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Ask PenCom Assistant
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <ul className="mt-5 space-y-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {results.slice(0, shown).map((d, i) => (
                      <ResultCard key={d.id} d={d} i={i} onOpen={onOpen} />
                    ))}
                  </AnimatePresence>
                </ul>
                {shown < results.length && (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200" aria-hidden="true">
                      <motion.div className="h-full bg-[#117F21]" animate={{ width: `${(shown / results.length) * 100}%` }} />
                    </div>
                    <p className="text-xs text-gray-500">Showing {shown} of {results.length}</p>
                    <button
                      type="button"
                      onClick={() => setShown((s) => s + PAGE)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#117F21]/30 bg-white px-6 text-sm font-semibold text-[#117F21] transition hover:border-[#117F21] hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                    >
                      Show {Math.min(PAGE, results.length - shown)} more
                      <ArrowUpRight className="h-4 w-4 rotate-90" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
