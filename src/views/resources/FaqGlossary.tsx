"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircle, RotateCcw, Search, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "./compat";
import { faqCats, faqs, glossary } from "./data";
import { useI18n } from "@/i18n/context";

const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(46,145,61,0.10),transparent_45%)]";
const darkCard = "bg-[#0B1F10] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_50%),linear-gradient(135deg,#0B1F10,#0A4A13)]";
const goldBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]";
const chip = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]";

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
    <section id="faq" aria-labelledby="faq-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[180px]">
              <SectionHeading stacked id="faq-title" eyebrow="Frequently asked" title="Answers in plain language" highlight="plain language" intro="Short answers to the questions we hear most. Choose a group or search." />
              <div onMouseMove={spot} className={cn("relative isolate mt-8 overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)]", darkCard)}>
                <MessageCircle aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-44 w-44 text-[#F4D27A]/[0.07]" />
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)]">
                  <MessageCircle className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-4 text-lg font-black tracking-tight">Still have a question?</p>
                <p className="mt-1 text-sm text-white/80">PenCom Assistant answers from our published guidance.</p>
                <button type="button" onClick={() => document.getElementById("chat-trigger")?.click()} className={cn(goldBtn, "mt-5", focus)}>
                  Ask PenCom Assistant
                  <span aria-hidden="true" className={cn(chip, "bg-[#0B1F10] text-[#F4D27A]")}><ArrowRight className="h-4 w-4" /></span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LayoutGroup id="faq-cats">
                <div role="group" aria-label="Filter questions" className="flex flex-wrap gap-1 rounded-[1.6rem] bg-white p-1.5 shadow-[0_18px_40px_-30px_rgba(4,20,10,0.5)] ring-1 ring-black/10">
                  {["All", ...faqCats].map((c) => (
                    <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cn("relative isolate min-h-11 rounded-full px-4 text-sm font-semibold transition-colors", focus, cat === c ? "text-[#F4D27A]" : "text-gray-700 hover:text-[#117F21]")}>
                      {cat === c && <motion.span layoutId="faq-pill" className="absolute inset-0 -z-10 rounded-full bg-[#0B1F10] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      {c}
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              <label onMouseMove={spot} className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white py-1 pl-1 pr-4 shadow-[0_18px_40px_-30px_rgba(4,20,10,0.5)] ring-1 ring-black/10 transition [background-image:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.18),transparent_60%)] focus-within:shadow-[0_0_0_3px_#FFD84D] focus-within:ring-transparent">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A]">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="sr-only">Search questions</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="min-h-11 w-full min-w-0 bg-transparent text-sm placeholder:text-gray-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" />
              </label>
            </div>
            <p className="sr-only" aria-live="polite">{t("{n} questions shown", { n: list.length })}</p>

            <ul className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((f) => {
                  const isOpen = openQ === f.q;
                  const id = `faq-${faqs.indexOf(f)}`;
                  return (
                    <motion.li key={f.q} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25, ease }} onMouseMove={spot} className={cn("relative overflow-hidden rounded-3xl bg-white ring-1 transition-shadow duration-300", glowLight, isOpen ? "shadow-[0_30px_60px_-34px_rgba(4,20,10,0.55)] ring-[#117F21]/30" : "ring-black/10 hover:shadow-[0_24px_50px_-34px_rgba(4,20,10,0.45)] hover:ring-[#117F21]/25")}>
                      <span aria-hidden="true" className={cn("absolute inset-y-5 left-0 w-[3px] origin-top rounded-r-full bg-gradient-to-b from-[#117F21] to-[#CB9615] transition-transform duration-500", isOpen ? "scale-y-100" : "scale-y-0")} />
                      <h3>
                        <button id={`${id}-btn`} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpenQ(isOpen ? null : f.q)} className="group flex min-h-14 w-full items-center gap-4 rounded-3xl px-5 py-4 text-left font-semibold text-[#0B1F10] focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D] sm:px-6">
                          <span aria-hidden="true" className="font-mono text-sm font-bold tabular-nums text-[#7F5A04]">{String(faqs.indexOf(f) + 1).padStart(2, "0")}</span>
                          <span className="flex-1">
                            <span className="mb-1 hidden w-fit rounded-full bg-[#F2F6F0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0A4A13] sm:block">{f.cat}</span>
                            <span className="block">{f.q}</span>
                          </span>
                          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300", isOpen ? "rotate-180 bg-[#0B1F10] text-[#F4D27A]" : "bg-[#F2F6F0] text-[#0B1F10] group-hover:bg-[#0B1F10] group-hover:text-[#F4D27A]")}>
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </button>
                      </h3>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div id={id} role="region" aria-labelledby={`${id}-btn`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                            <div className="px-5 pb-6 sm:pl-[3.75rem] sm:pr-6">
                              <p className="leading-relaxed text-gray-700">{f.a}</p>
                              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 text-sm text-gray-600">
                                <span>Was this helpful?</span>
                                {(["up", "down"] as const).map((v) => {
                                  const I = v === "up" ? ThumbsUp : ThumbsDown;
                                  return (
                                    <button key={v} type="button" aria-pressed={vote[f.q] === v} aria-label={v === "up" ? "Yes" : "No"} onClick={() => setVote((x) => ({ ...x, [f.q]: v }))} className={cn("flex h-11 w-11 items-center justify-center rounded-full ring-1 transition duration-300", focus, vote[f.q] === v ? "bg-[#0B1F10] text-[#F4D27A] ring-[#0B1F10]" : "bg-white ring-black/10 hover:-translate-y-0.5 hover:ring-[#117F21] hover:text-[#117F21]")}>
                                      <I className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                  );
                                })}
                                <span aria-live="polite" className="font-semibold text-[#117F21]">{vote[f.q] ? "Thanks for your feedback." : ""}</span>
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
            {list.length === 0 && <p className="mt-6 rounded-3xl border border-dashed border-black/15 bg-white p-8 text-center text-gray-600">No questions match. Try another word, or ask PenCom Assistant.</p>}
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
    <section id="glossary" aria-labelledby="glossary-title" className={cn(sectionCls, "bg-white")}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="glossary-title"
          eyebrow="Glossary"
          title="Pension words, explained"
          highlight="explained"
          intro="Tap a card to see what a term means. Letters with no terms are greyed out."
          action={
            <button type="button" onClick={() => setFlipped(Object.fromEntries(list.map((g) => [g.term, !Object.values(flipped).some(Boolean)])))} className={cn("group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#0B1F10] px-5 text-sm font-semibold text-white transition hover:bg-[#117F21]", focus)}>
            <RotateCcw className="h-4 w-4 text-[#F4D27A] transition-transform duration-500 group-hover:-rotate-180" aria-hidden="true" /> {Object.values(flipped).some(Boolean) ? "Show terms" : "Show all meanings"}
          </button>
          }
        />

        <nav aria-label="Glossary letters" className="mt-10 flex flex-wrap gap-1 rounded-[1.6rem] bg-[#F2F6F0] p-1.5 lg:gap-0.5">
          {["All", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")].map((l) => {
            const has = l === "All" || letters.includes(l);
            return (
              <button key={l} type="button" disabled={!has} aria-pressed={letter === l} onClick={() => setLetter(l)} className={cn("flex h-11 min-w-11 items-center justify-center rounded-full px-2.5 font-mono text-sm font-semibold transition duration-300", focus, letter === l ? "bg-[#0B1F10] text-[#F4D27A] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" : has ? "bg-white text-[#0B1F10] ring-1 ring-black/10 hover:-translate-y-0.5 hover:text-[#117F21] hover:ring-[#117F21]/40" : "text-gray-400")}>
                {l}
              </button>
            );
          })}
        </nav>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((g) => {
              const on = !!flipped[g.term];
              return (
                <motion.li key={g.term} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease }} className="h-48 [perspective:1000px]">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFlipped((f) => ({ ...f, [g.term]: !f[g.term] }))}
                    onMouseMove={spot}
                    className="group relative h-full w-full rounded-[1.75rem] text-left transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
                  >
                    <motion.span aria-hidden="true" className="absolute inset-0 block [transform-style:preserve-3d]" animate={{ rotateY: on && !reduce ? 180 : 0 }} transition={{ duration: 0.6, ease }}>
                      {/* Front */}
                      <span className={cn("absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-white p-5 ring-1 ring-black/10 transition-shadow duration-300 [backface-visibility:hidden] group-hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)] group-hover:ring-[#117F21]/30", glowLight, reduce && on && "invisible")}>
                        <span aria-hidden="true" className="absolute -right-3 -top-8 select-none text-9xl font-black text-transparent transition duration-500 [-webkit-text-stroke:1.5px_rgba(10,74,19,0.13)] group-hover:-translate-y-1 group-hover:[-webkit-text-stroke:1.5px_rgba(203,150,21,0.35)]">{g.term[0]}</span>
                        <span className="relative pr-12 text-2xl font-black tracking-tight text-[#0B1F10]">{g.term}</span>
                        <span className="relative">
                          {g.full && <span className="block text-sm text-gray-600">{g.full}</span>}
                          <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#0B1F10]">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-500 group-hover:-rotate-180"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /></span>
                            What it means
                          </span>
                        </span>
                      </span>
                      {/* Back */}
                      <span className={cn("absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] p-5 text-white shadow-[0_30px_60px_-30px_rgba(4,20,10,0.8)] [backface-visibility:hidden] [transform:rotateY(180deg)]", darkCard, reduce && "[transform:none]", reduce && !on && "invisible")}>
                        <span aria-hidden="true" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-[#2E913D] to-[#F4D27A]" />
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
