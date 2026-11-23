"use client";

import { splitReq } from "./splitReq";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, Award, Check, ChevronDown, Clock, Download, Eye, FileText, HeartHandshake, Lightbulb, Minus, MessageSquareWarning,
  Phone, Plus, Printer, Quote, Scale, Search, ShieldCheck, Sparkles, X, Zap, type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import Headline from "@/views/theme/Headline";
import { ReadingBar } from "@/views/docs/kit";
import { DarkBackdrop, FramedPanel, PageHero, Rise, SectionNav, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import data from "./charter.json";

/**
 * Service Charter / Service Level Agreement, showcase theme (DES-22: important documents as web pages
 * with the signed PDF attached; brief §6.2 About: "Service Charter (HTML + signed PDF)"). The text comes from
 * the revised charter (May 2026) and is built into the page, so it is readable before any script runs.
 * Sections: service standards finder → complaints and disputes (the page's one dark band) → our promise → the full charter.
 */

/** Soft green pointer spotlight for white cards; pair with onMouseMove={spot}. */
const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(54,160,69,0.10),transparent_45%)]";
/** Card hover: 4px lift and a long soft shadow. */
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]";

type Block = { m?: string; x: string; sub?: boolean };
type Std = { division: string; dept: string; sn: number; service: string; time: string; req: string };
type Charter = { foreword: string; forewordList: string[]; sections: { n: number; title: string; blocks: Block[] }[]; standards: Std[] };
const charter = data as Charter;

const PDF = "/documents/service-charter-2026.pdf";

const onThisPage = [
  { id: "standards", label: "Service standards" },
  { id: "complaints", label: "Complaints" },
  { id: "promise", label: "Our promise" },
  { id: "full-text", label: "Full charter" },
];

/** Split a requirements cell into list items where the charter numbers them. */

/** Short badge for the time standard: "5d", "4h" … */
function badge(t: string) {
  const m = t.match(/(\d+)\s*(?:to\s*(\d+))?\s*(working days|days|hours)/i);
  if (!m) return "—";
  const v = Number(m[2] ?? m[1]);
  return /hour/i.test(m[3]) ? `${v}h` : `${v}d`;
}

/** Highlight the search words in a piece of text. */
function Mark({ text, q }: { text: string; q: string }) {
  const t = q.trim();
  if (t.length < 2) return <>{text}</>;
  const parts = text.split(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === t.toLowerCase() ? (
          <mark key={i} className="rounded bg-[#F4D27A]/70 px-0.5 text-inherit">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function printChecklist(s: Std) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const items = splitReq(s.req).map((r) => `<li><span class="box"></span>${esc(r)}</li>`).join("");
  w.document.write(
    `<!doctype html><title>${esc(s.service)} – checklist</title><style>body{font:16px/1.6 Arial;margin:40px;color:#111}h1{font:bold 22px Verdana;color:#105D1D;margin:0 0 4px}p{margin:0 0 16px;color:#444}ul{list-style:none;padding:0}li{display:flex;gap:12px;margin:0 0 12px}.box{flex:none;width:18px;height:18px;border:2px solid #14892A;border-radius:4px;margin-top:3px}footer{margin-top:32px;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:8px}</style><h1>${esc(s.service)}</h1><p>${esc(s.dept)} · Service standard: ${esc(s.time || "see charter")}</p><ul>${items}</ul><footer>National Pension Commission · Service Charter (revised May 2026) · pencom.gov.ng</footer>`,
  );
  w.document.close();
  w.focus();
  w.print();
}

export default function CharterPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

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

  return (
    <MotionConfig reducedMotion="user">
      <ReadingBar />
      <div className="bg-white text-[#1A3A22]">
        <Hero />
        <SectionNav sections={onThisPage} pillId="charter-nav-pill" />
        <Standards />
        <Complaints />
        <OurPromise />
        <FullText />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  const depts = new Set(charter.standards.map((s) => s.dept)).size;
  return (
    <PageHero
      id="charter-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "About", to: "/about" }, { label: "Service Charter" }]}
      pill={{ icon: HeartHandshake, label: "Service Charter · Revised May 2026" }}
      title="Service you can measure"
      mark="can measure"
      intro="What you can expect from the Commission: how quickly we deliver each service, the documents you need, how to complain, and what we expect from you."
      actions={
        <div className="flex flex-wrap gap-3">
          <a href={PDF} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] pl-6 pr-1.5 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)] transition hover:bg-white", focus)}>
            Signed PDF
            <span className="sr-only">(opens in a new tab)</span>
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1206] text-[#F4D27A] transition-transform duration-300 group-hover:translate-y-0.5">
              <Download className="h-4 w-4" />
            </span>
          </a>
          <Link to="/connect" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10", focus)}>
            <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
            Make a complaint
          </Link>
        </div>
      }
      aside={
        <FramedPanel className="p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#105D1D]">At a glance</p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["2", "working days", "for most benefit approvals"],
              ["3–5", "working days", "to resolve a complaint"],
              ["72", "hours", "to issue a PCC"],
            ].map(([v, u, l]) => (
              <div key={l} onMouseMove={spot} className="relative overflow-hidden rounded-2xl p-4 text-white shadow-[0_18px_40px_-20px_rgba(18,51,28,0.8)] transition duration-300 [background-image:radial-gradient(200px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.18),transparent_55%),linear-gradient(to_bottom_right,#1A3A22,#105D1D)] hover:-translate-y-1">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block text-3xl font-black tabular-nums tracking-tight text-[#F4D27A] sm:text-4xl">{v}</span>
                  <span className="block text-xs text-white/70">{u}</span>
                  <span className="mt-2 block text-sm leading-snug">{l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Services covered", String(charter.standards.length)],
              ["Departments", String(depts)],
              ["Version", "Revised, May 2026"],
              ["Signed by", "Director-General"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[#F2F6F0] px-4 py-3 ring-1 ring-black/10">
                <dt className="text-xs font-semibold text-gray-500">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </FramedPanel>
      }
    />
  );
}

/* ─────────────────────────── Service standards ─────────────────────────── */

function StandardCard({ s, q, open, onToggle }: { s: Std; q: string; open: boolean; onToggle: () => void }) {
  const reqs = splitReq(s.req);
  return (
    <div
      onMouseMove={spot}
      className={cn(
        "group/card overflow-hidden rounded-3xl bg-white ring-1",
        glowLight,
        open ? "shadow-[0_30px_60px_-30px_rgba(18,51,28,0.4)] ring-2 ring-[#14892A]" : cn("ring-black/10", lift),
      )}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className={cn("group flex w-full items-start gap-4 rounded-3xl p-5 text-left sm:p-6", focus)}>
        <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A3A22] to-[#105D1D] text-white shadow-[0_14px_30px_-16px_rgba(18,51,28,0.8)] transition-transform duration-300 group-hover/card:-rotate-6">
          <Clock className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
          <span className="mt-0.5 text-sm font-black tabular-nums leading-none text-[#F4D27A]">{badge(s.time)}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#117F21]">{s.dept}</span>
          <span className="mt-1 block text-[1.05rem] font-bold leading-snug tracking-tight">
            <Mark text={s.service} q={q} />
          </span>
          {s.time && (
            <span className="mt-2 inline-flex items-start gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-semibold text-[#105D1D]">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {s.time}
            </span>
          )}
        </span>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-300", open ? "rotate-180 bg-[#1A3A22] text-[#F4D27A]" : "bg-[#F2F6F0] text-[#105D1D] group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]")}>
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <div className="border-t border-black/10 bg-[#F2F6F0]/80 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">What you need</p>
              <ul className="mt-3 space-y-2.5">
                {reqs.map((r, k) => (
                  <li key={k} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#105D1D] text-[#F4D27A]">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>
                      <Mark text={r} q={q} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => printChecklist(s)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] px-5 text-sm font-semibold text-white transition hover:bg-[#14892A]", focus)}>
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print this checklist
                </button>
                <Link to="/connect" className={cn("group/ask inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#1A3A22] ring-1 ring-black/10 transition hover:ring-[#14892A]/50", focus)}>
                  Ask about this service
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/ask:-rotate-45" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Short forms people type that the charter spells out. */
const aliases: Record<string, string[]> = { pcc: ["pension clearance certificate"] };

function Standards() {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const depts = useMemo(() => ["All", ...Array.from(new Set(charter.standards.map((s) => s.dept)))], []);
  const list = useMemo(() => {
    const t = dq.trim().toLowerCase();
    const terms = [t, ...(aliases[t] ?? [])];
    return charter.standards
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => (dept === "All" || s.dept === dept) && (!t || terms.some((w) => `${s.service} ${s.req} ${s.dept}`.toLowerCase().includes(w))));
  }, [dq, dept]);
  const filtered = !!dq || dept !== "All";
  const visible = showAll || filtered ? list : list.slice(0, 8);

  return (
    <section id="standards" aria-labelledby="std-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline id="std-title" n="01" kicker="Service standards" title="How long each service takes" mark="each service" intro="Find a service to see its timeline and the documents you need. Print the list and take it with you." />
        <div className="mt-10 flex flex-col gap-2 rounded-[1.75rem] bg-white p-2 shadow-[0_30px_60px_-36px_rgba(18,51,28,0.45)] ring-1 ring-black/10 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-full bg-[#F2F6F0] px-4 ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#14892A]">
            <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
            <span className="sr-only">Find a service</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “death benefits”, “25%”, “mortgage”, “PCC”" className="w-full bg-transparent focus:outline-none" />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("flex h-9 w-9 items-center justify-center rounded-full hover:bg-white", focus)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </label>
          <label className="relative sm:w-80">
            <span className="sr-only">Department</span>
            <select value={dept} onChange={(e) => setDept(e.target.value)} className={cn("min-h-12 w-full appearance-none rounded-full bg-[#1A3A22] pl-5 pr-10 font-semibold text-white ring-1 ring-black/10 [&>option]:text-[#1A3A22]", focus)}>
              {depts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All departments" : d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F4D27A]" aria-hidden="true" />
          </label>
        </div>
        <p className="mt-3 px-1 text-sm text-gray-600" aria-live="polite">
          {list.length} service{list.length === 1 ? "" : "s"}
          {dept !== "All" && ` in ${dept}`}
        </p>
        <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {visible.map(({ s, i }) => (
            <li key={i}>
              <StandardCard s={s} q={dq} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            </li>
          ))}
        </ul>
        {list.length === 0 && (
          <div className="mt-4 rounded-[1.75rem] bg-[#F2F6F0] px-6 py-12 text-center ring-1 ring-black/10">
            <p className="font-bold">No service matches</p>
            <button type="button" onClick={() => { setQ(""); setDept("All"); }} className={cn("mt-4 inline-flex min-h-11 items-center rounded-full bg-[#1A3A22] px-5 font-semibold text-white transition hover:bg-[#14892A]", focus)}>
              Clear search
            </button>
          </div>
        )}
        {!showAll && !filtered && list.length > 8 && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setShowAll(true)} className={cn("group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#1A3A22] pl-6 pr-1.5 font-semibold text-white transition hover:bg-[#14892A]", focus)}>
              Show all {list.length} services
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:translate-y-0.5">
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Complaints (dark band) ─────────────────────────── */

function Complaints() {
  const steps = [
    ["Day 1", "We acknowledge your complaint", "By email, phone, letter, walk-in or social media."],
    ["Days 2–3", "We resolve it and reply", "Most complaints are closed within 3 to 5 working days."],
    ["Fair hearing", "We hear both sides", "We get the response of the party you complained about before we decide."],
    ["Still unhappy?", "Take it further", "You can refer the Commission’s decision to arbitration or the National Industrial Court."],
  ];
  return (
    <section id="complaints" aria-labelledby="cmp-title" className={cn(sectionCls, "relative isolate overflow-hidden bg-[#12331C] text-white")}>
      <DarkBackdrop />
      <div className="mx-auto max-w-7xl">
        <Headline id="cmp-title" n="02" kicker="If something goes wrong" title="Complaints and disputes" mark="disputes" intro="How we handle a complaint, and what you can do if you are still not satisfied." dark />
        <ol className="relative mt-12 grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* the path between the steps: green to gold, desktop only */}
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-[46px] hidden h-[3px] rounded-full bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615] md:block" />
          {steps.map(([k, t, b], i) => (
            <li key={k} className="relative">
              <Rise delay={i * 0.08} className="h-full">
                <div
                  onMouseMove={spot}
                  className="group relative h-full overflow-hidden rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur transition duration-300 [background-image:radial-gradient(300px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_50%)] hover:-translate-y-1 hover:ring-[#F4D27A]/40 sm:p-6"
                >
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F4D27A] font-mono text-lg font-black text-[#1A1206] shadow-[0_0_0_6px_#12331C,0_14px_30px_-10px_rgba(244,210,122,0.7)] transition-transform duration-300 group-hover:scale-110">{i + 1}</span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">{k}</p>
                  <p className="mt-1 text-lg font-bold leading-snug">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">{b}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="tel:+2342094603955" onMouseMove={spot} className={cn("group flex min-h-[5.5rem] items-center gap-4 rounded-3xl bg-white/[0.06] p-5 text-white ring-1 ring-white/15 transition duration-300 [background-image:radial-gradient(300px_circle_at_var(--x,50%)_var(--y,0%),rgba(54,160,69,0.25),transparent_50%)] hover:-translate-y-1 hover:ring-white/30", focus)}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#14892A] to-[#105D1D] text-[#F4D27A]">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm text-white/70">0700 CALL PENCOM</span>
              <span className="block text-lg font-bold tabular-nums">02094603955</span>
            </span>
          </a>
          <Link to="/connect" className={cn("group flex min-h-[5.5rem] items-center justify-between gap-4 rounded-3xl bg-[#F4D27A] p-5 pr-4 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.6)] transition duration-300 hover:-translate-y-1 hover:bg-white", focus)}>
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1A1206]/10">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              Complain online and track your case
            </span>
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1206] text-[#F4D27A] transition-transform duration-300 group-hover:-rotate-45">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Our promise ─────────────────────────── */

/** An icon for each core value (by its English name in the charter). */
const valueIcon: Record<string, LucideIcon> = {
  Transparency: Eye,
  Responsiveness: Zap,
  Integrity: Scale,
  Proactivity: Lightbulb,
  Professionalism: Award,
  Empathy: HeartHandshake,
};

function OurPromise() {
  const mission = charter.sections.find((s) => s.n === 3)?.blocks[0]?.x;
  const values = charter.sections.find((s) => s.n === 4)?.blocks.filter((b) => b.sub) ?? [];
  return (
    <section id="promise" aria-labelledby="promise-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline id="promise-title" n="03" kicker="Our promise" title="The values behind every service" mark="every service" />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {mission && (
            <Rise className="lg:col-span-5">
              <div
                onMouseMove={spot}
                className="relative h-full overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_40px_80px_-40px_rgba(18,51,28,0.8)] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_45%),linear-gradient(to_bottom_right,#1A3A22,#105D1D)] sm:p-9"
              >
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#14892A]/60 blur-3xl" />
                <Quote aria-hidden="true" className="absolute right-6 top-6 h-16 w-16 text-[#F4D27A]/20" />
                <p className="relative inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Our mission
                </p>
                <p className="relative mt-6 text-xl font-bold leading-snug tracking-tight sm:text-[1.65rem]">{mission}</p>
              </div>
            </Rise>
          )}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {values.map((v, i) => {
              const [k, ...rest] = v.x.split(":");
              const Icon = valueIcon[k.trim()] ?? Sparkles;
              return (
                <li key={k}>
                  <Rise delay={i * 0.05} className="h-full">
                    <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-black/10", glowLight, lift)}>
                      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A3A22] to-[#105D1D] text-[#F4D27A] transition-transform duration-300 group-hover:-rotate-6">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-4 text-lg font-black tracking-tight">{k}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{rest.join(":").trim()}</p>
                    </div>
                  </Rise>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Full charter ─────────────────────────── */

const sizes = ["1rem", "1.125rem", "1.25rem"];
/** Charter sections shown as running text (mission, values and the standards table have their own sections). */
const narrative = charter.sections.filter((s) => ![3, 4, 10].includes(s.n));

function FullText() {
  const [size, setSize] = useState(0);
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<number | null>(null);

  // Contents: mark the charter section being read (the last one whose top has passed under the header).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let at: number | null = null;
      for (const s of narrative) {
        const el = document.getElementById(`c-${s.n}`);
        if (el && el.getBoundingClientRect().top <= 220) at = s.n;
      }
      setCurrent(at);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section id="full-text" aria-labelledby="full-title" className={cn(sectionCls, "bg-[#F2F6F0] pb-24")}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <Headline id="full-title" n="04" kicker="Read the charter" title="The full charter" mark="full charter" />
          <div role="group" aria-label="Text size" className="flex w-fit shrink-0 items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/10">
            <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} aria-label="Smaller text" className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-[#1A3A22] text-white transition hover:bg-[#14892A] disabled:bg-gray-200 disabled:text-gray-500", focus)}>
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="px-2 text-sm font-semibold">Text size</span>
            <button type="button" onClick={() => setSize((s) => Math.min(sizes.length - 1, s + 1))} disabled={size === sizes.length - 1} aria-label="Larger text" className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-[#1A3A22] text-white transition hover:bg-[#14892A] disabled:bg-gray-200 disabled:text-gray-500", focus)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <nav aria-label="Charter contents" className="hidden lg:block">
            <div className="sticky top-[170px] max-h-[calc(100vh-200px)] overflow-y-auto rounded-[1.75rem] bg-white p-4 shadow-[0_30px_60px_-40px_rgba(18,51,28,0.4)] ring-1 ring-black/10">
              <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Contents</p>
              <ol className="mt-2 space-y-0.5">
                {narrative.map((s) => (
                  <li key={s.n}>
                    <a
                      href={`#c-${s.n}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`c-${s.n}`, !reduce);
                      }}
                      aria-current={current === s.n ? "location" : undefined}
                      className={cn(
                        "flex gap-2 rounded-2xl px-2.5 py-1.5 text-sm transition",
                        current === s.n ? "bg-[#1A3A22] font-semibold text-white" : "text-gray-700 hover:bg-[#F2F6F0] hover:text-[#105D1D]",
                        focus,
                      )}
                    >
                      <span className={cn("w-6 shrink-0 font-mono text-xs font-bold", current === s.n ? "text-[#F4D27A]" : "text-[#7F5A04]")}>{s.n}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="rounded-[1.75rem] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(18,51,28,0.4)] ring-1 ring-black/10 sm:p-10" style={{ fontSize: sizes[size] }}>
            <div className="relative overflow-hidden rounded-3xl bg-[#F2F6F0] p-5 pl-7 ring-1 ring-black/10 sm:p-6 sm:pl-8">
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#14892A] to-[#CB9615]" />
              <p className="inline-flex items-center gap-2 rounded-full bg-[#105D1D] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Foreword</p>
              <p className="mt-2 leading-[1.75] text-gray-800">{charter.foreword.split(" the provision")[0]}</p>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {charter.forewordList.map((f) => (
                  <li key={f} className="flex gap-2 text-gray-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-bold text-[#105D1D]">Omolola Bridget Oloworaran, Director-General</p>
            </div>
            <div className="mt-10 space-y-10">
              {narrative.map((s) => (
                <section key={s.n} id={`c-${s.n}`} aria-labelledby={`c-${s.n}-h`} className="scroll-mt-[170px]">
                  <h3 id={`c-${s.n}-h`} className="flex items-baseline gap-3 text-[1.25em] font-black tracking-tight">
                    <span className="font-mono text-[0.7em] text-[#7F5A04]">{s.n}.0</span>
                    {s.title}
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {s.blocks.map((b, i) => (
                      <p key={i} className={cn("leading-[1.75] text-gray-800", b.sub ? "pl-14" : b.m ? "pl-12" : "")}>
                        {b.m && <span className={cn("-ml-12 inline-block w-12 text-[0.85em] font-bold", b.sub ? "-ml-8 w-8 text-gray-400" : "text-[#117F21]")}>{b.m}</span>}
                        {b.x}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:ml-[18.5rem] sm:grid-cols-2">
          <a href={PDF} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/10", glowLight, lift, focus)}>
            <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B52026] text-xs font-bold text-white">PDF</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-snug">Revised Commission’s Service Charter / Service Level Agreement</span>
              <span className="block text-sm text-gray-500">PDF · 46 pages · May 2026</span>
            </span>
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A] transition-transform duration-300 group-hover:translate-y-0.5">
              <Download className="h-4 w-4" />
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="flex gap-3 rounded-3xl bg-[#E8F5E9] p-5 text-sm leading-relaxed text-[#105D1D] ring-1 ring-black/10">
            <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
            This web version is for easy reading. If it differs from the signed PDF, the signed PDF is the official version.
          </p>
        </div>
      </div>
    </section>
  );
}
