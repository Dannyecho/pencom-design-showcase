"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircle, RotateCcw, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { SectionHeading } from "./compat";
import { faqCats, faqs, glossary } from "./data";
import { useI18n } from "@/i18n/context";

/* ─────────────────────────── FAQ ─────────────────────────── */

export function FaqSection({ openQ, setOpenQ }: { openQ: string | null; setOpenQ: (q: string | null) => void }) {
  const { t, t: tr } = useI18n();
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [vote, setVote] = useState<Record<string, "up" | "down">>({});

  // When opened from search, make sure its category is visible.
  useEffect(() => {
    if (openQ) {
      setCat("All");
      setQ("");
    }
  }, [openQ]);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    // Search the English and the translated wording, so readers can type in their own language.
    const has = (s: string) => s.toLowerCase().includes(t) || tr(s).toLowerCase().includes(t);
    return faqs.filter((f) => (cat === "All" || f.cat === cat) && (!t || has(f.q) || has(f.a)));
  }, [cat, q, tr]);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[160px] bg-[#F2F6F0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[180px]">
              <SectionHeading stacked id="faq-title" eyebrow="Frequently asked" title="Answers in plain language" highlight="plain language" intro="Short answers to the questions we hear most. Choose a group or search." />
              <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-6 text-white">
                <MessageCircle className="h-8 w-8 text-[#F4D27A]" aria-hidden="true" />
                <p className="mt-3 font-bold">Still have a question?</p>
                <p className="mt-1 text-sm text-white/75">PenCom Assistant answers from our published guidance.</p>
                <button type="button" onClick={() => document.getElementById("chat-trigger")?.click()} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  Ask PenCom Assistant
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LayoutGroup id="faq-cats">
                <div role="group" aria-label="Filter questions" className="flex flex-wrap gap-1 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-gray-200">
                  {["All", ...faqCats].map((c) => (
                    <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("relative isolate min-h-10 rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", cat === c ? "text-white" : "text-gray-600 hover:text-[#117F21]")}>
                      {cat === c && <motion.span layoutId="faq-pill" className="absolute inset-0 -z-10 rounded-xl bg-[#117F21]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      {c}
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              <label className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-3 shadow-sm ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#117F21]/40">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <span className="sr-only">Search questions</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="min-h-12 w-full bg-transparent text-sm focus:outline-none" />
              </label>
            </div>
            <p className="sr-only" aria-live="polite">{t("{n} questions shown", { n: list.length })}</p>

            <ul className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((f) => {
                  const isOpen = openQ === f.q;
                  const id = `faq-${faqs.indexOf(f)}`;
                  return (
                    <motion.li key={f.q} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25, ease }} className={cn("overflow-hidden rounded-2xl border bg-white transition-colors", isOpen ? "border-[#117F21]/40 shadow-[0_20px_40px_-28px_rgba(10,74,19,0.6)]" : "border-gray-200 hover:border-[#117F21]/30")}>
                      <h3>
                        <button id={`${id}-btn`} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpenQ(isOpen ? null : f.q)} className="flex min-h-14 w-full items-center gap-4 px-5 py-4 text-left font-semibold text-[#0A2E10] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]">
                          <span className="hidden rounded-md bg-[#F4F7F2] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#117F21] sm:inline">{f.cat}</span>
                          <span className="flex-1">{f.q}</span>
                          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition", isOpen ? "rotate-180 bg-[#117F21] text-white" : "bg-gray-100 text-gray-500")}>
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div id={id} role="region" aria-labelledby={`${id}-btn`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                            <div className="px-5 pb-5">
                              <p className="leading-relaxed text-gray-700">{f.a}</p>
                              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <span>Was this helpful?</span>
                                {(["up", "down"] as const).map((v) => {
                                  const I = v === "up" ? ThumbsUp : ThumbsDown;
                                  return (
                                    <button key={v} type="button" aria-pressed={vote[f.q] === v} aria-label={v === "up" ? "Yes" : "No"} onClick={() => setVote((x) => ({ ...x, [f.q]: v }))} className={cn("flex h-10 w-10 items-center justify-center rounded-full border transition", vote[f.q] === v ? "border-[#117F21] bg-[#117F21] text-white" : "border-gray-200 hover:border-[#117F21] hover:text-[#117F21]")}>
                                      <I className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                  );
                                })}
                                <span aria-live="polite" className="text-[#117F21]">{vote[f.q] ? "Thanks for your feedback." : ""}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            {list.length === 0 && <p className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">No questions match. Try another word, or ask PenCom Assistant.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Glossary: flip cards ─────────────────────────── */

export function Glossary({ focusTerm }: { focusTerm: string | null }) {
  const { t } = useI18n();
  const [letter, setLetter] = useState("All");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const reduce = useReducedMotion();
  const letters = Array.from(new Set(glossary.map((g) => g.term[0].toUpperCase()))).sort();
  const list = glossary.filter((g) => letter === "All" || g.term[0].toUpperCase() === letter);

  useEffect(() => {
    if (focusTerm) {
      setLetter("All");
      setFlipped((f) => ({ ...f, [focusTerm]: true }));
    }
  }, [focusTerm]);

  return (
    <section id="glossary" aria-labelledby="glossary-title" className="scroll-mt-[160px] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="glossary-title"
          eyebrow="Glossary"
          title="Pension words, explained"
          highlight="explained"
          intro="Tap a card to see what a term means. Letters with no terms are greyed out."
          action={
            <button type="button" onClick={() => setFlipped(Object.fromEntries(list.map((g) => [g.term, !Object.values(flipped).some(Boolean)])))} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white ring-1 ring-black/10 px-4 text-sm font-semibold text-gray-700 hover:ring-[#117F21] hover:text-[#117F21]">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> {Object.values(flipped).some(Boolean) ? "Show terms" : "Show all meanings"}
          </button>
          }
        />

        <nav aria-label="Glossary letters" className="mt-8 flex flex-wrap gap-1.5">
          {["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")].map((l) => {
            const has = l === "All" || letters.includes(l);
            return (
              <button key={l} type="button" disabled={!has} aria-pressed={letter === l} onClick={() => setLetter(l)} className={cn("flex h-10 min-w-10 items-center justify-center rounded-xl px-2 font-mono text-sm font-semibold transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]", letter === l ? "bg-[#0A4A13] text-[#F4D27A]" : has ? "bg-[#F4F7F2] text-[#0A2E10] hover:bg-[#E8F5E9]" : "text-gray-300")}>
                {l}
              </button>
            );
          })}
        </nav>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((g) => {
              const on = !!flipped[g.term];
              return (
                <motion.li key={g.term} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease }} className="h-48 [perspective:1000px]">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFlipped((f) => ({ ...f, [g.term]: !f[g.term] }))}
                    className="relative h-full w-full rounded-3xl text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
                  >
                    <motion.span aria-hidden="true" className="absolute inset-0 block [transform-style:preserve-3d]" animate={{ rotateY: on && !reduce ? 180 : 0 }} transition={{ duration: 0.6, ease }}>
                      {/* Front */}
                      <span className={cn("absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl ring-1 ring-black/10 bg-white p-5 [backface-visibility:hidden]", reduce && on && "invisible")}>
                        <span aria-hidden="true" className="absolute -right-4 -top-6 select-none text-8xl font-black text-[#117F21]/[0.06]">{g.term[0]}</span>
                        <span className="relative text-2xl font-black tracking-tight text-[#0A2E10]">{g.term}</span>
                        <span className="relative">
                          {g.full && <span className="block text-sm text-gray-600">{g.full}</span>}
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#117F21]"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> What it means</span>
                        </span>
                      </span>
                      {/* Back */}
                      <span className={cn("absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-5 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]", reduce && "[transform:none]", reduce && !on && "invisible")}>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{g.term}</span>
                        <span className="mt-2 text-[0.95rem] leading-relaxed">{g.def}</span>
                      </span>
                    </motion.span>
                    <span className="sr-only">{on ? `${g.term}: ${t(g.def)}` : `${g.term}${g.full ? `, ${g.full}` : ""}. ${t("Show meaning")}`}</span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
