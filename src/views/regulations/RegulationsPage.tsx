"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Gavel, Scale, Search } from "lucide-react";
import { Link, useLocation, useSearchParams } from "@/lib/router";
import { cn } from "@/lib/utils";
import { CountUp, scrollToId } from "@/views/about/primitives";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { FramedPanel, PageHero, SectionNav, ease, focus, spot } from "@/views/theme/ui";
import DocDrawer from "./DocDrawer";
import Library, { type Filters } from "./Library";
import { ActSpotlight, Compliance, LatestRail, Policies } from "./Sections";
import { library } from "./library";
import { fmtDate, latest, typeStyle } from "./search";

/**
 * Regulations and compliance, showcase theme (brief §7 "Regulatory library" + "Regulatory item").
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
          {/* Search pill: gold-to-green edge, pointer glow, focus ring on the pill (not inside it) */}
          <div className="relative rounded-full p-px [background-image:linear-gradient(120deg,rgba(244,210,122,0.9),rgba(255,255,255,0.15),rgba(17,127,33,0.8))] has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#FFD84D]">
            <form
              role="search"
              onMouseMove={spot}
              onSubmit={(e) => {
                e.preventDefault();
                onSearch(q.trim());
              }}
              className={cn("flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]", glowLight)}
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
                className="min-h-12 w-full min-w-0 bg-transparent text-base placeholder:text-gray-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              />
              <button type="submit" className={cn("group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                Search
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </form>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span>Try:</span>
            {examples.map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => {
                  setQ(x);
                  onSearch(x);
                }}
                className={cn("min-h-9 rounded-full bg-white/[0.08] px-3.5 font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-[#F4D27A] hover:text-[#1A1206] hover:ring-[#F4D27A]", focus)}
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
                  onMouseMove={spot}
                  className={cn(
                    "group relative w-full overflow-hidden rounded-3xl bg-white/[0.06] p-4 text-left text-white ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-[#F4D27A]/60 [background-image:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.18),transparent_60%)]",
                    focus,
                  )}
                >
                  <CountUp value={String(c.n)} className="block bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text font-mono text-3xl font-bold tabular-nums text-transparent" />
                  <span className="mt-1 flex items-center gap-2 text-sm text-white/75 group-hover:text-white">
                    <span aria-hidden="true" className={cn("h-2 w-2 rounded-full ring-2 ring-white/20", typeStyle[c.t].dot)} />
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
          <div className="flex items-center justify-between gap-3 px-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">Latest issued</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A4A13]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#117F21]/60 motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-[#117F21]" />
              </span>
              Updated {fmtDate(latest[0].date)}
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {latest.slice(0, 4).map((d, i) => (
              <motion.li key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease }}>
                <button
                  type="button"
                  onClick={() => onOpen(d.id)}
                  className={cn("group flex w-full items-start gap-3 rounded-2xl bg-[#F2F6F0] p-3.5 text-left ring-1 ring-black/10 transition duration-300 hover:bg-[#0B1F10] hover:text-white", focus)}
                >
                  <span className={cn("mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", typeStyle[d.type].chip)}>{d.type}</span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 font-semibold leading-snug">{d.title}</span>
                    <span className="mt-0.5 block font-mono text-xs text-gray-600 transition group-hover:text-white/70">{fmtDate(d.date)}</span>
                  </span>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[#0B1F10]/40 transition duration-300 group-hover:rotate-45 group-hover:text-[#F4D27A]" aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </ul>
          <Link
            to="/regulations/pension-reform-act"
            onMouseMove={spot}
            className={cn("group relative mt-3 flex items-center gap-4 overflow-hidden rounded-2xl p-4 text-white shadow-[0_24px_50px_-28px_rgba(4,20,10,0.9)] transition duration-300 hover:-translate-y-0.5", darkCard, focus)}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4D27A]/15 text-[#F4D27A] ring-1 ring-[#F4D27A]/40">
              <Gavel className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold">Pension Reform Act 2014</span>
              <span className="block text-xs text-white/70">Read every section online, or download it</span>
            </span>
            <ArrowChip dark />
          </Link>
        </FramedPanel>
      }
    />
  );
}
