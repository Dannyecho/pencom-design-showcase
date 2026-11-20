"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gavel, Scale, Search } from "lucide-react";
import { Link, useLocation, useSearchParams } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { FramedPanel, PageHero, SectionNav, ease, focus } from "@/views/theme/ui";
import DocDrawer from "./DocDrawer";
import Library, { type Filters } from "./Library";
import { ActSpotlight, Compliance, LatestRail, Policies } from "./Sections";
import { library } from "./library";
import { fmtDate, latest, typeStyle } from "./search";

/**
 * Regulations and compliance, "for everyone" theme (brief §7 "Regulatory library" + "Regulatory item").
 * Hero search → latest issued → filterable library → the Act in plain language → compliance → PenCom's own
 * policies. Filters and the open document (?doc=) live in the URL, so any view can be shared or bookmarked.
 */

const sections = [
  { id: "latest", label: "Latest" },
  { id: "library", label: "Library" },
  { id: "act", label: "Pension Reform Act" },
  { id: "compliance", label: "Compliance" },
  { id: "policies", label: "Our policies" },
];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export default function RegulationsPage() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  const f: Filters = useMemo(
    () => ({
      q: params.get("q") ?? "",
      types: list(params.get("type")),
      years: list(params.get("year")).map(Number),
      who: list(params.get("who")),
      subjects: list(params.get("subject")),
      status: params.get("status") ?? "",
      sort: (params.get("sort") as Filters["sort"]) || "new",
    }),
    [params],
  );

  const set = useCallback(
    (p: Partial<Filters>) => {
      const n = { ...f, ...p };
      const next = new URLSearchParams();
      if (n.q) next.set("q", n.q);
      if (n.types.length) next.set("type", n.types.join(","));
      if (n.years.length) next.set("year", n.years.join(","));
      if (n.who.length) next.set("who", n.who.join(","));
      if (n.subjects.length) next.set("subject", n.subjects.join(","));
      if (n.status) next.set("status", n.status);
      if (n.sort !== "new") next.set("sort", n.sort);
      const doc = params.get("doc");
      if (doc) next.set("doc", doc);
      setParams(next, { replace: true, preventScrollReset: true });
    },
    [f, params, setParams],
  );

  const openDoc = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("doc", id);
    else next.delete("doc");
    setParams(next, { preventScrollReset: true });
  };

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t1 = window.setTimeout(() => scrollToId(id, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(id, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  const toLibrary = () => window.setTimeout(() => scrollToId("library", !reduce), 60);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <Hero
          onSearch={(q) => {
            set({ q });
            toLibrary();
          }}
          onType={(t) => {
            set({ types: [t] });
            toLibrary();
          }}
          onOpen={openDoc}
        />
        <SectionNav sections={sections} pillId="reg-nav-pill" />
        <LatestRail onOpen={openDoc} />
        <Library f={f} set={set} onOpen={openDoc} />
        <ActSpotlight set={set} />
        <Compliance set={set} />
        <Policies />
        <DocDrawer id={params.get("doc")} onClose={() => openDoc(null)} onOpen={openDoc} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

const counts = (["Regulation", "Guideline", "Circular", "Framework"] as const).map((t) => ({ t, n: library.filter((d) => d.type === t).length }));
const examples = ["RSA transfer", "investment", "PPP", "annuity"];

function Hero({ onSearch, onType, onOpen }: { onSearch: (q: string) => void; onType: (t: string) => void; onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  return (
    <PageHero
      id="reg-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Regulations and compliance" }]}
      pill={{ icon: Scale, label: "Regulatory library" }}
      title="Regulations and compliance"
      mark="compliance"
      intro={`All ${library.length} regulations, guidelines, frameworks and circulars issued under the Pension Reform Act, in one place. Search by title, subject or abbreviation, then read the summary or download the signed document.`}
      actions={
        <div className="max-w-xl">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(q.trim());
            }}
            className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-[0_20px_40px_-28px_rgba(10,74,19,0.6)] ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#117F21]"
          >
            <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
            <label htmlFor="reg-hero-q" className="sr-only">
              Search the regulatory library
            </label>
            <input
              id="reg-hero-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. “RSA transfer”, “PPP”"
              className="min-h-12 w-full min-w-0 bg-transparent text-base placeholder:text-gray-400 focus:outline-none"
            />
            <button type="submit" className={cn("min-h-12 shrink-0 rounded-xl bg-[#117F21] px-5 font-semibold text-white transition hover:bg-[#0A4A13]", focus)}>
              Search
            </button>
          </form>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span>Try:</span>
            {examples.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => {
                  setQ(x);
                  onSearch(x);
                }}
                className={cn("rounded-full bg-white/80 px-3 py-1 font-medium text-[#0A4A13] ring-1 ring-black/10 transition hover:bg-[#0A4A13] hover:text-white", focus)}
              >
                {x}
              </button>
            ))}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {counts.map((c, i) => (
              <motion.li key={c.t} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease }}>
                <button
                  type="button"
                  onClick={() => onType(c.t)}
                  className={cn("group w-full rounded-2xl bg-white/80 p-4 text-left ring-1 ring-black/5 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(10,74,19,0.5)]", focus)}
                >
                  <span className="block font-mono text-3xl font-bold text-[#0A4A13]">{c.n}</span>
                  <span className="mt-1 flex items-center gap-2 text-sm text-gray-600 group-hover:text-[#0A4A13]">
                    <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", typeStyle[c.t].dot)} />
                    {c.t}s
                  </span>
                  <span className="sr-only">, show only {c.t.toLowerCase()}s</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      }
      aside={
        <FramedPanel className="p-4 sm:p-5">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A4A13]">Latest issued</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#117F21]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#117F21]" aria-hidden="true" />
              Updated {fmtDate(latest[0].date)}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {latest.slice(0, 4).map((d, i) => (
              <motion.li key={d.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease }}>
                <button
                  type="button"
                  onClick={() => onOpen(d.id)}
                  className={cn("group flex w-full items-start gap-3 rounded-2xl bg-[#F2F6F0] p-3.5 text-left ring-1 ring-black/5 transition duration-300 hover:bg-[#0A4A13] hover:text-white", focus)}
                >
                  <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", typeStyle[d.type].chip)}>{d.type}</span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 font-semibold leading-snug">{d.title}</span>
                    <span className="mt-0.5 block font-mono text-xs text-gray-500 transition group-hover:text-white/70">{fmtDate(d.date)}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#F4D27A]" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </ul>
          <Link
            to="/regulations/pension-reform-act"
            className={cn("group mt-3 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#0A4A13] to-[#117F21] p-4 text-white transition hover:shadow-lg", focus)}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4D27A] text-[#1A1206]">
              <Gavel className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">Pension Reform Act 2014</span>
              <span className="block text-xs text-white/70">Read every section online, or download it</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </FramedPanel>
      }
    />
  );
}
