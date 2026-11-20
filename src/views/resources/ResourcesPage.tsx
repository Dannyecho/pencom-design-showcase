"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, FolderOpen, HelpCircle, Library as LibraryIcon, Search, Type, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { FramedPanel, PageHero, SectionNav, ease, focus, spot } from "@/views/theme/ui";
import { FaqSection, Glossary } from "./FaqGlossary";
import Guides from "./Guides";
import { Downloads, Learning, Publications } from "./Library";
import { faqs, glossary, guides } from "./data";
import { forms, publications } from "./publications";

/**
 * Resources and knowledge base, showcase theme (brief §6.2 Resources; DES-06, DES-22, DES-24, DES-39, DES-41).
 * Hero with one search across guides, questions, terms and publications → guides (read aloud, enlarge, print;
 * ?guide=<id> makes each shareable) → FAQs → glossary → publications → forms → learning.
 * /resources/faq lands on the questions; old anchors (#annual-reports, #circulars …) still work.
 */

const onThisPage = [
  { id: "guides", label: "Guides" },
  { id: "faq", label: "FAQs" },
  { id: "glossary", label: "Glossary" },
  { id: "publications", label: "Publications" },
  { id: "downloads", label: "Forms" },
  { id: "learning", label: "Learning" },
];

export default function ResourcesPage() {
  const { pathname, hash } = useLocation();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [openQ, setOpenQ] = useState<string | null>(null);
  const [focusTerm, setFocusTerm] = useState<string | null>(null);
  const [pubHint, setPubHint] = useState<string | null>(null);

  const go = useCallback((id: string) => window.setTimeout(() => scrollToId(id, !reduce), 60), [reduce]);

  const setGuide = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("guide", id);
    else next.delete("guide");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (id === "circulars") {
      navigate("/regulations?type=Circular#library", { replace: true });
      return;
    }
    const pubTab: Record<string, string> = { "annual-reports": "annual report", "monthly-reports": "monthly", "quarterly-reports": "quarterly", general: "other" };
    if (id in pubTab) {
      setPubHint(pubTab[id]);
      const t = go("publications");
      return () => window.clearTimeout(t);
    }
    if (id === "presentations" || id === "seminars") {
      const t = go("learning");
      return () => window.clearTimeout(t);
    }
    if (id) {
      const t1 = go(id);
      const t2 = window.setTimeout(() => scrollToId(id, false), 900);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
    if (pathname.endsWith("/faq")) {
      const t = go("faq");
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [hash, pathname, go, navigate]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <Hero
          openGuide={(id) => setGuide(id)}
          openFaq={(q) => {
            setOpenQ(q);
            go("faq");
          }}
          openTerm={(t) => {
            setFocusTerm(t);
            go("glossary");
          }}
          findPublication={(t) => {
            setPubHint(t);
            go("publications");
          }}
          jump={(id) => go(id)}
        />
        <SectionNav sections={onThisPage} pillId="res-nav-pill" />
        <Guides openId={params.get("guide")} setOpenId={setGuide} />
        <FaqSection openQ={openQ} setOpenQ={setOpenQ} />
        <Glossary focusTerm={focusTerm} />
        <Publications key={pubHint ?? "pubs"} highlight={pubHint} />
        <Downloads />
        <Learning openGuides={() => go("guides")} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero + knowledge search ─────────────────────────── */

type Hit = { label: string; kind: "Guide" | "Question" | "Term" | "Publication"; go: () => void };
const kindIcon = { Guide: BookOpen, Question: HelpCircle, Term: Type, Publication: FileText };

function Hero({
  openGuide,
  openFaq,
  openTerm,
  findPublication,
  jump,
}: {
  openGuide: (id: string) => void;
  openFaq: (q: string) => void;
  openTerm: (term: string) => void;
  findPublication: (q: string) => void;
  jump: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const hits = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const m = (s: string) => s.toLowerCase().includes(term);
    return [
      ...guides.filter((g) => m(g.title) || m(g.intro)).map((g) => ({ label: g.title, kind: "Guide" as const, go: () => openGuide(g.id) })),
      ...glossary.filter((g) => m(g.term) || m(g.full ?? "")).map((g) => ({ label: g.full ? `${g.term}: ${g.full}` : g.term, kind: "Term" as const, go: () => openTerm(g.term) })),
      ...faqs.filter((f) => m(f.q) || m(f.a)).map((f) => ({ label: f.q, kind: "Question" as const, go: () => openFaq(f.q) })),
      ...publications.filter((p) => m(p.title)).slice(0, 4).map((p) => ({ label: p.title, kind: "Publication" as const, go: () => findPublication(p.title) })),
    ].slice(0, 8);
  }, [q, openGuide, openFaq, openTerm, findPublication]);

  const tiles = [
    { id: "guides", icon: BookOpen, n: guides.length, label: "Step-by-step guides", note: "Read, listen or print" },
    { id: "faq", icon: HelpCircle, n: faqs.length, label: "Common questions", note: "Answered in plain language" },
    { id: "glossary", icon: Type, n: glossary.length, label: "Pension words", note: "Explained simply" },
    { id: "publications", icon: LibraryIcon, n: publications.length, label: "Reports and publications", note: "Monthly to annual" },
    { id: "downloads", icon: FolderOpen, n: forms.length, label: "Forms and templates", note: "Ready to download" },
  ];

  return (
    <PageHero
      id="res-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Resources" }]}
      pill={{ icon: LibraryIcon, label: "Knowledge base" }}
      title="Understand your pension, step by step"
      mark="step by step"
      intro="Plain-language guides you can read, listen to or print, answers to common questions, a glossary of pension terms, and every report and form we publish."
      actions={
        <div className="relative max-w-xl">
          <label htmlFor="kb-q" className="sr-only">
            Search guides, questions, terms and publications
          </label>
          <div aria-hidden="true" className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-[#F4D27A]/80 via-white/10 to-[#117F21]/70" />
          <div
            onMouseMove={spot}
            className="relative flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)] transition focus-within:shadow-[0_0_0_3px_#FFD84D,0_30px_60px_-24px_rgba(0,0,0,0.85)] [background-image:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.18),transparent_60%)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A]">
              <Search className="h-5 w-5" aria-hidden="true" />
            </span>
            <input
              id="kb-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “transfer”, “RSA” or “annual report”"
              autoComplete="off"
              role="combobox"
              aria-expanded={hits.length > 0}
              aria-controls="kb-results"
              className="min-h-11 w-full min-w-0 bg-transparent text-base placeholder:text-gray-500 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:rotate-90 hover:bg-[#F2F6F0]", focus)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {q.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease }}
                className="absolute inset-x-0 top-full z-40 mt-3 overflow-hidden rounded-3xl bg-white p-1.5 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75)] ring-1 ring-black/10"
              >
                {hits.length ? (
                  <ul id="kb-results" role="listbox" aria-label="Results">
                    {hits.map((h) => {
                      const I = kindIcon[h.kind];
                      return (
                        <li key={`${h.kind}-${h.label}`} role="option" aria-selected="false">
                          <button
                            type="button"
                            onClick={() => {
                              h.go();
                              setQ("");
                            }}
                            className={cn("group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-[#F2F6F0]", focus)}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F2F6F0] text-[#117F21] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#0B1F10] group-hover:to-[#0A4A13] group-hover:text-[#F4D27A]">
                              <I className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold">{h.label}</span>
                              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-[#7F5A04]">{h.kind}</span>
                            </span>
                            <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F6F0] text-[#0B1F10] transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-gray-700">
                    Nothing found. Try another word, or{" "}
                    <button type="button" onClick={() => document.getElementById("chat-trigger")?.click()} className={cn("rounded font-semibold text-[#117F21] underline", focus)}>
                      ask PenCom Assistant
                    </button>
                    .
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
      aside={
        <FramedPanel className="p-4 sm:p-5">
          <p className="flex items-center gap-2 px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0A4A13]"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#CB9615]" />What’s here</p>
          <ul className="mt-3 space-y-2">
            {tiles.map((t, i) => (
              <motion.li key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease }}>
                <button
                  type="button"
                  onClick={() => jump(t.id)}
                  className={cn("group relative flex min-h-[4.25rem] w-full items-center gap-4 overflow-hidden rounded-2xl bg-[#F2F6F0] p-3 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-white hover:shadow-[0_20px_40px_-24px_rgba(4,20,10,0.8)] hover:ring-[#0B1F10]", focus)}
                >
                  <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] origin-center scale-y-0 rounded-r-full bg-gradient-to-b from-[#F4D27A] to-[#117F21] transition-transform duration-300 group-hover:scale-y-100" />
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#117F21] shadow-sm transition duration-300 group-hover:rotate-[-6deg] group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                    <t.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{t.label}</span>
                    <span className="block text-xs text-gray-600 transition group-hover:text-white/75">{t.note}</span>
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums text-[#0A4A13] transition group-hover:text-[#F4D27A]">{t.n}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </FramedPanel>
      }
    />
  );
}
