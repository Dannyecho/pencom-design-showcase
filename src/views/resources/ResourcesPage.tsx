"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, FileText, FolderOpen, HelpCircle, Library as LibraryIcon, Search, Type, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { FramedPanel, PageHero, SectionNav, ease, focus } from "@/views/theme/ui";
import { FaqSection, Glossary } from "./FaqGlossary";
import Guides from "./Guides";
import { Downloads, Learning, Publications } from "./Library";
import { faqs, glossary, guides } from "./data";
import { forms, publications } from "./publications";

/**
 * Resources and knowledge base, "for everyone" theme (brief §6.2 Resources; DES-06, DES-22, DES-24, DES-39, DES-41).
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
          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_20px_40px_-28px_rgba(10,74,19,0.6)] ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#117F21]">
            <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
            <input
              id="kb-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “transfer”, “RSA” or “annual report”"
              autoComplete="off"
              role="combobox"
              aria-expanded={hits.length > 0}
              aria-controls="kb-results"
              className="min-h-14 w-full bg-transparent text-base focus:outline-none"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100", focus)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <AnimatePresence>
            {q.trim().length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease }}
                className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-20px_rgba(10,46,16,0.45)] ring-1 ring-black/10"
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
                            className={cn("group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#F2F6F0]", focus)}
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#117F21]">
                              <I className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-semibold">{h.label}</span>
                              <span className="block text-xs text-gray-500">{h.kind}</span>
                            </span>
                            <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#117F21]" aria-hidden="true" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-gray-600">
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
          <p className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0A4A13]">What’s here</p>
          <ul className="mt-3 space-y-2">
            {tiles.map((t, i) => (
              <motion.li key={t.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease }}>
                <button
                  type="button"
                  onClick={() => jump(t.id)}
                  className={cn("group flex w-full items-center gap-4 rounded-2xl bg-[#F2F6F0] p-3 text-left ring-1 ring-black/5 transition duration-300 hover:bg-[#0A4A13] hover:text-white", focus)}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#117F21] shadow-sm transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                    <t.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{t.label}</span>
                    <span className="block text-xs text-gray-500 transition group-hover:text-white/70">{t.note}</span>
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#0A4A13] transition group-hover:text-[#F4D27A]">{t.n}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </FramedPanel>
      }
    />
  );
}
