"use client";

import { splitReq } from "./splitReq";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Clock, Download, FileText, HeartHandshake, Minus, MessageSquareWarning, Phone, Plus,
  Printer, Quote, Search, ShieldCheck, X,
} from "lucide-react";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import Headline from "@/views/theme/Headline";
import { FramedPanel, PageHero, Rise, SectionNav, ease, focus, sectionCls } from "@/views/theme/ui";
import data from "./charter.json";

/**
 * Service Charter / Service Level Agreement, "for everyone" theme (DES-22: important documents as web pages
 * with the signed PDF attached; brief §6.2 About: "Service Charter (HTML + signed PDF)"). The text comes from
 * the revised charter (May 2026) and is built into the page, so it is readable before any script runs.
 * Sections: service standards finder → complaints and disputes → our promise → the full charter.
 */

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
    `<!doctype html><title>${esc(s.service)} – checklist</title><style>body{font:16px/1.6 Arial;margin:40px;color:#111}h1{font:bold 22px Verdana;color:#0A4A13;margin:0 0 4px}p{margin:0 0 16px;color:#444}ul{list-style:none;padding:0}li{display:flex;gap:12px;margin:0 0 12px}.box{flex:none;width:18px;height:18px;border:2px solid #117F21;border-radius:4px;margin-top:3px}footer{margin-top:32px;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:8px}</style><h1>${esc(s.service)}</h1><p>${esc(s.dept)} · Service standard: ${esc(s.time || "see charter")}</p><ul>${items}</ul><footer>National Pension Commission · Service Charter (revised May 2026) · pencom.gov.ng</footer>`,
  );
  w.document.close();
  w.focus();
  w.print();
}

export default function CharterPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

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
      {/* reading progress, just under the header */}
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="fixed inset-x-0 top-[92px] z-40 h-1 origin-left bg-gradient-to-r from-[#117F21] to-[#CB9615]" />
      <div className="bg-white text-[#0B1F10]">
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
          <a href={PDF} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F4D27A] px-6 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)] transition hover:bg-white", focus)}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Signed PDF
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <Link to="/connect" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#0B1F10] ring-1 ring-black/10 transition hover:bg-[#F2F6F0]", focus)}>
            <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
            Make a complaint
          </Link>
        </div>
      }
      aside={
        <FramedPanel className="p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A4A13]">At a glance</p>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["2", "working days", "for most benefit approvals"],
              ["3–5", "working days", "to resolve a complaint"],
              ["72", "hours", "to issue a PCC"],
            ].map(([v, u, l]) => (
              <div key={l} className="rounded-2xl bg-[#0A4A13] p-4 text-white">
                <dt className="sr-only">{l}</dt>
                <dd>
                  <span className="block font-mono text-3xl font-bold text-[#F4D27A]">{v}</span>
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
              <div key={k} className="rounded-2xl bg-[#F2F6F0] px-4 py-3 ring-1 ring-black/5">
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

/* ─────────────────────────── 01 Service standards ─────────────────────────── */

function StandardCard({ s, q, open, onToggle }: { s: Std; q: string; open: boolean; onToggle: () => void }) {
  const reqs = splitReq(s.req);
  return (
    <div className={cn("overflow-hidden rounded-3xl bg-white ring-1 transition", open ? "ring-[#117F21] shadow-[0_24px_50px_-34px_rgba(10,46,16,0.6)]" : "ring-black/10")}>
      <button type="button" onClick={onToggle} aria-expanded={open} className={cn("group flex w-full items-start gap-4 p-5 text-left transition hover:bg-[#F2F6F0] sm:p-6", focus)}>
        <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#0A4A13] text-white">
          <Clock className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
          <span className="mt-0.5 font-mono text-xs font-bold leading-none">{badge(s.time)}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#117F21]">{s.dept}</span>
          <span className="mt-1 block font-bold leading-snug">
            <Mark text={s.service} q={q} />
          </span>
          {s.time && (
            <span className="mt-2 inline-flex items-start gap-1.5 rounded-xl bg-[#FFF8E1] px-2.5 py-1 text-xs font-semibold text-[#7A5600]">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {s.time}
            </span>
          )}
        </span>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition", open ? "rotate-180 bg-[#0A4A13] text-white" : "bg-gray-100 text-gray-600")}>
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <div className="border-t border-black/5 bg-[#F2F6F0] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">What you need</p>
              <ul className="mt-3 space-y-2.5">
                {reqs.map((r, k) => (
                  <li key={k} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E8F5E9] text-[#117F21]">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>
                      <Mark text={r} q={q} />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => printChecklist(s)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A4A13] px-4 text-sm font-semibold text-white hover:bg-[#117F21]", focus)}>
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  Print this checklist
                </button>
                <Link to="/connect" className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-gray-700 ring-1 ring-black/10 hover:bg-[#E8F5E9]", focus)}>
                  Ask about this service
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Standards() {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [dept, setDept] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const depts = useMemo(() => ["All", ...Array.from(new Set(charter.standards.map((s) => s.dept)))], []);
  const list = useMemo(() => {
    const t = dq.trim().toLowerCase();
    return charter.standards.map((s, i) => ({ s, i })).filter(({ s }) => (dept === "All" || s.dept === dept) && (!t || `${s.service} ${s.req} ${s.dept}`.toLowerCase().includes(t)));
  }, [dq, dept]);
  const filtered = !!dq || dept !== "All";
  const visible = showAll || filtered ? list : list.slice(0, 8);

  return (
    <section id="standards" aria-labelledby="std-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline id="std-title" n="01" kicker="Service standards" title="How long each service takes" mark="each service" intro="Find a service to see its timeline and the documents you need. Print the list and take it with you." />
        <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-white p-2 ring-1 ring-black/10 sm:flex-row">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl bg-[#F2F6F0] px-4 ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#117F21]">
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
            <select value={dept} onChange={(e) => setDept(e.target.value)} className={cn("min-h-12 w-full appearance-none rounded-2xl bg-[#F2F6F0] pl-4 pr-10 font-semibold ring-1 ring-black/5", focus)}>
              {depts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All departments" : d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
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
          <div className="mt-4 rounded-3xl bg-white px-6 py-12 text-center ring-1 ring-black/10">
            <p className="font-bold">No service matches</p>
            <button type="button" onClick={() => { setQ(""); setDept("All"); }} className={cn("mt-4 inline-flex min-h-11 items-center rounded-xl bg-[#0A4A13] px-5 font-semibold text-white hover:bg-[#117F21]", focus)}>
              Clear search
            </button>
          </div>
        )}
        {!showAll && !filtered && list.length > 8 && (
          <div className="mt-6 text-center">
            <button type="button" onClick={() => setShowAll(true)} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/10 transition hover:bg-[#0A4A13] hover:text-white", focus)}>
              Show all {list.length} services
              <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── 02 Complaints ─────────────────────────── */

function Complaints() {
  const steps = [
    ["Day 1", "We acknowledge your complaint", "By email, phone, letter, walk-in or social media."],
    ["Days 2–3", "We resolve it and reply", "Most complaints are closed within 3 to 5 working days."],
    ["Fair hearing", "We hear both sides", "We get the response of the party you complained about before we decide."],
    ["Still unhappy?", "Take it further", "You can refer the Commission’s decision to arbitration or the National Industrial Court."],
  ];
  return (
    <section id="complaints" aria-labelledby="cmp-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <Headline id="cmp-title" n="02" kicker="If something goes wrong" title="Complaints and disputes" mark="disputes" intro="How we handle a complaint, and what you can do if you are still not satisfied." />
        <ol className="relative mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[44px] hidden h-[3px] rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615] md:block" />
          {steps.map(([k, t, b], i) => (
            <li key={k} className="relative">
              <Rise delay={i * 0.08} className="h-full rounded-3xl bg-white p-5 ring-1 ring-black/10">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0A4A13] font-mono text-lg font-bold text-[#F4D27A] ring-4 ring-[#F2F6F0]">{i + 1}</span>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#9A6F06]">{k}</p>
                <p className="mt-1 font-bold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{b}</p>
              </Rise>
            </li>
          ))}
        </ol>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href="tel:+2342094603955" className={cn("group flex items-center gap-4 rounded-3xl bg-[#0A4A13] p-5 text-white transition hover:bg-[#117F21]", focus)}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A]">
              <Phone className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm text-white/70">0700 CALL PENCOM</span>
              <span className="block text-lg font-bold">02094603955</span>
            </span>
          </a>
          <Link to="/connect" className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-[#F4D27A] p-5 font-semibold text-[#1A1206] transition hover:bg-[#FFE08F]", focus)}>
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/60">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              Complain online and track your case
            </span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 03 Our promise ─────────────────────────── */

function OurPromise() {
  const mission = charter.sections.find((s) => s.n === 3)?.blocks[0]?.x;
  const values = charter.sections.find((s) => s.n === 4)?.blocks.filter((b) => b.sub) ?? [];
  return (
    <section id="promise" aria-labelledby="promise-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline id="promise-title" n="03" kicker="Our promise" title="The values behind every service" mark="every service" />
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {mission && (
            <Rise className="relative overflow-hidden rounded-[2rem] bg-[#0A4A13] p-7 text-white shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)] sm:p-9 lg:col-span-5">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#117F21] blur-3xl" />
              <Quote aria-hidden="true" className="absolute right-6 top-6 h-14 w-14 text-white/10" />
              <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-[#F4D27A]">Our mission</p>
              <p className="relative mt-5 text-xl font-semibold leading-snug sm:text-2xl">{mission}</p>
            </Rise>
          )}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {values.map((v, i) => {
              const [k, ...rest] = v.x.split(":");
              return (
                <li key={k}>
                  <Rise delay={i * 0.05} className="group h-full rounded-3xl bg-white p-5 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:ring-[#CB9615]/40">
                    <span className="font-mono text-sm font-bold text-[#CB9615]">0{i + 1}</span>
                    <p className="mt-1 text-lg font-bold">{k}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{rest.join(":").trim()}</p>
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

/* ─────────────────────────── 04 Full charter ─────────────────────────── */

const sizes = ["1rem", "1.125rem", "1.25rem"];

function FullText() {
  const [size, setSize] = useState(0);
  const reduce = useReducedMotion();
  const narrative = charter.sections.filter((s) => ![3, 4, 10].includes(s.n));
  return (
    <section id="full-text" aria-labelledby="full-title" className={cn(sectionCls, "bg-[#F2F6F0] pb-24")}>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <Headline id="full-title" n="04" kicker="Read the charter" title="The full charter" mark="full charter" />
          <div role="group" aria-label="Text size" className="flex w-fit items-center gap-1 rounded-2xl bg-white p-1 ring-1 ring-black/10">
            <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} aria-label="Smaller text" className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-[#F2F6F0] disabled:opacity-30", focus)}>
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="px-2 text-sm font-semibold">Text size</span>
            <button type="button" onClick={() => setSize((s) => Math.min(sizes.length - 1, s + 1))} disabled={size === sizes.length - 1} aria-label="Larger text" className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-[#F2F6F0] disabled:opacity-30", focus)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <nav aria-label="Charter contents" className="hidden lg:block">
            <div className="sticky top-[170px] max-h-[calc(100vh-200px)] overflow-y-auto rounded-3xl bg-white p-4 ring-1 ring-black/10">
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
                      className={cn("flex gap-2 rounded-xl px-2 py-1.5 text-sm text-gray-700 hover:bg-[#F2F6F0] hover:text-[#0A4A13]", focus)}
                    >
                      <span className="w-6 shrink-0 font-mono text-xs font-bold text-[#CB9615]">{s.n}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="rounded-[2rem] bg-white p-6 ring-1 ring-black/10 sm:p-10" style={{ fontSize: sizes[size] }}>
            <div className="rounded-3xl bg-[#FFF8E1] p-5 ring-1 ring-[#CB9615]/25 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A6F06]">Foreword</p>
              <p className="mt-2 leading-[1.75] text-gray-800">{charter.foreword.split(" the provision")[0]}</p>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {charter.forewordList.map((f) => (
                  <li key={f} className="flex gap-2 text-gray-700">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm font-semibold text-gray-600">Omolola Bridget Oloworaran, Director-General</p>
            </div>
            <div className="mt-10 space-y-10">
              {narrative.map((s) => (
                <section key={s.n} id={`c-${s.n}`} aria-labelledby={`c-${s.n}-h`} className="scroll-mt-[170px]">
                  <h3 id={`c-${s.n}-h`} className="flex items-baseline gap-3 text-[1.25em] font-bold">
                    <span className="font-mono text-[0.7em] text-[#CB9615]">{s.n}.0</span>
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
          <a href={PDF} target="_blank" rel="noopener noreferrer" className={cn("group flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/10 transition hover:ring-[#117F21]/40", focus)}>
            <span className="flex h-14 w-12 shrink-0 items-center justify-center rounded-xl bg-[#B52026] text-xs font-bold text-white">PDF</span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold leading-snug">Revised Commission’s Service Charter / Service Level Agreement</span>
              <span className="block text-sm text-gray-500">PDF · 46 pages · May 2026</span>
            </span>
            <Download className="h-5 w-5 text-[#117F21] transition group-hover:translate-y-0.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <p className="flex gap-3 rounded-3xl bg-[#E8F5E9] p-5 text-sm text-[#0A4A13]">
            <FileText className="h-5 w-5 shrink-0" aria-hidden="true" />
            This web version is for easy reading. If it differs from the signed PDF, the signed PDF is the official version.
          </p>
        </div>
      </div>
    </section>
  );
}
