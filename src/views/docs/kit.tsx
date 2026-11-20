"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Check, Copy, Download, FileText, Info, Minus, Plus, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import Ghost from "@/views/theme/Ghost";
import { DarkBackdrop, spot } from "@/views/theme/ui";

/** Shared building blocks for web versions of official documents (DES-22). */

export const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";
/** Green pointer spotlight for white cards (set `--x/--y` with `spot`). */
export const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(46,145,61,0.10),transparent_45%)]";
/** Dark spotlight card: the spotlight and the gradient share one background-image. */
export const darkCard = "bg-[#0B1F10] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_50%),linear-gradient(135deg,#0B1F10,#0A4A13)]";

/** `url` null: the document has no web version; report "error" without a request (no 404 in the console). */
export function useDocJson<T>(url: string | null) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; data: T | null }>({ status: "loading", data: null });
  useEffect(() => {
    let off = false;
    if (!url) {
      setState({ status: "error", data: null });
      return;
    }
    setState({ status: "loading", data: null });
    fetch(url)
      .then((r) => {
        if (!r.ok || !(r.headers.get("content-type") ?? "").includes("json")) throw new Error("missing");
        return r.json();
      })
      .then((d: T) => !off && setState({ status: "ready", data: d }))
      .catch(() => !off && setState({ status: "error", data: null }));
    return () => {
      off = true;
    };
  }, [url]);
  return state;
}

export function useTitle(t: string) {
  useEffect(() => {
    document.title = `${t} | PenCom`;
    return () => {
      document.title = "PenCom Nigeria";
    };
  }, [t]);
}

/** Highlights search matches. */
export function Mark({ text, q }: { text: string; q: string }) {
  const t = q.trim();
  if (t.length < 2) return <>{text}</>;
  const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i} className="rounded bg-[#FFE38A] px-0.5 text-inherit">{p}</mark> : p))}</>;
}

export function ReadingBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" style={{ scaleX: x }} className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615] print:hidden" />;
}

export function DocHero({
  crumbs, kind, title, lead, meta, badge, actions, icon,
}: {
  crumbs: { label: string; to?: string }[];
  kind: string;
  title: string;
  lead?: ReactNode;
  meta: { label: string; value: ReactNode }[];
  badge?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <header className="relative isolate overflow-hidden bg-[#04140A] text-white print:bg-white print:text-black">
      <DarkBackdrop />
      <Ghost word={kind} dark className="bottom-0 top-auto sm:top-auto lg:top-auto print:hidden" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pt-10 lg:pb-20">
        <nav aria-label="Breadcrumb" className="print:hidden">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true" className="text-[#F4D27A]/70">/</span>}
                {c.to ? (
                  <Link to={c.to} className={cn("rounded hover:text-white hover:underline", ring)}>{c.label}</Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-white">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-6 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)] [&_svg]:h-3.5 [&_svg]:w-3.5">
                {icon ?? <FileText className="h-4 w-4" aria-hidden="true" />} {kind}
              </span>
              {badge}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="mt-5 text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              {title}
            </motion.h1>
            <span aria-hidden="true" className="mt-4 block h-1 w-24 rounded-full bg-gradient-to-r from-[#F4D27A] to-[#117F21] print:hidden" />
            {lead && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80 print:text-gray-700">{lead}</motion.div>}
            {actions && <motion.div initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 flex flex-wrap gap-3 print:hidden">{actions}</motion.div>}
          </div>
          <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease }} className="relative text-[#0B1F10] lg:col-span-4">
            <div aria-hidden="true" className="absolute -inset-px -z-10 rounded-[calc(1.6rem+1px)] bg-gradient-to-br from-[#F4D27A]/70 via-white/10 to-[#117F21]/60 print:hidden" />
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.6rem] bg-[#0B1F10]/10 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] ring-1 ring-black/10">
              {meta.map((m) => (
                <div key={m.label} onMouseMove={spot} className={cn("bg-white p-4 transition-colors hover:bg-[#F2F6F0]", glowLight)}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7F5A04]">{m.label}</dt>
                  <dd className="mt-1 font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export function PrimaryBtn({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const cls = cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F4D27A] px-6 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)] transition hover:bg-white", ring);
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<span className="sr-only"> (opens in a new tab)</span></a> : <Link to={href} className={cls}>{children}</Link>;
}
export function GhostBtn({ onClick, children, href }: { onClick?: () => void; children: ReactNode; href?: string }) {
  const cls = cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[#0B1F10] ring-1 ring-black/10 transition hover:bg-[#F2F6F0]", ring);
  if (href) return <a href={href} onClick={onClick} className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** Circular arrow chip that turns on hover (put inside a `group`). */
export function ArrowChip({ dark }: { dark?: boolean }) {
  return (
    <span aria-hidden="true" className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45", dark ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0B1F10] text-[#F4D27A]")}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );
}

/** Text size, print and copy-link tools. */
export function DocTools({ size, setSize }: { size: number; setSize: (n: number) => void }) {
  const [copied, setCopied] = useState(false);
  const btn = cn("flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B1F10] ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-[#F4D27A] disabled:pointer-events-none disabled:opacity-30", ring);
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <div role="group" aria-label="Text size" className="flex items-center gap-1">
        <button type="button" className={btn} onClick={() => setSize(Math.max(0, size - 1))} disabled={size === 0} aria-label="Smaller text"><Minus className="h-4 w-4" aria-hidden="true" /></button>
        <span className="w-8 text-center text-sm font-bold text-[#0B1F10]/75" aria-live="polite">A<span className="sr-only"> size {size + 1} of 3</span></span>
        <button type="button" className={btn} onClick={() => setSize(Math.min(2, size + 1))} disabled={size === 2} aria-label="Larger text"><Plus className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      <button type="button" className={btn} onClick={() => window.print()} aria-label="Print"><Printer className="h-4 w-4" aria-hidden="true" /></button>
      <button type="button" className={btn} aria-label="Copy link to this page" onClick={() => { navigator.clipboard?.writeText(location.href).catch(() => undefined); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
        {copied ? <Check className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </div>
  );
}
export const sizes = ["1rem", "1.125rem", "1.25rem"];

/** Contents list with a scroll-spy that works in both directions. */
export function Toc({ items, title = "Contents", className }: { items: { id: string; label: string; level?: number }[]; title?: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let cur = items[0]?.id;
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top <= line) cur = i.id;
      }
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [items]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);
  return (
    <nav aria-label={title} className={cn("rounded-3xl bg-white p-4 ring-1 ring-black/10", className)}>
      <p className="px-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">{title}</p>
      <ol ref={listRef} className="mt-3 max-h-[60vh] space-y-0.5 overflow-y-auto border-l-2 border-[#0B1F10]/10 pr-1 [scrollbar-width:thin]">
        {items.map((i) => (
          <li key={i.id} data-id={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("-ml-0.5 block rounded-r-xl border-l-2 py-1.5 pr-2 text-sm leading-snug transition", (i.level ?? 1) > 1 ? "pl-7 text-[13px]" : "pl-4", active === i.id ? "border-[#CB9615] bg-[#F2F6F0] font-semibold text-[#0B1F10]" : "border-transparent text-[#0B1F10]/65 hover:bg-[#F2F6F0]/60 hover:text-[#0B1F10]")}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PdfCard({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group relative flex items-center gap-5 overflow-hidden rounded-3xl p-6 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_40px_70px_-34px_rgba(4,20,10,0.9)]", darkCard, ring)}>
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />
      <span className="relative flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-[#B52026] shadow-lg ring-2 ring-[#F4D27A]/0 transition group-hover:-rotate-6 group-hover:ring-[#F4D27A]/70">
        <FileText className="h-6 w-6" aria-hidden="true" /><span className="text-[10px] font-black">PDF</span>
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Official signed copy</span>
        <span className="mt-1 block font-semibold leading-snug">{title}</span>
        <span className="mt-0.5 block text-sm text-white/60">{meta}</span>
      </span>
      <span className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.9)] transition group-hover:scale-110 sm:flex"><Download className="h-5 w-5" aria-hidden="true" /></span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function VerifyNote({ children }: { children?: ReactNode }) {
  return (
    <p className="relative flex gap-4 overflow-hidden rounded-3xl bg-white p-5 text-sm leading-relaxed text-[#0B1F10]/80 ring-1 ring-black/10">
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F4D27A] to-[#CB9615]" />
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]"><Info className="h-4 w-4" /></span>
      <span>{children ?? "This web version was prepared from the official PDF so it is easier to read, search and link to. If the two ever differ, the signed PDF is the authoritative text."}</span>
    </p>
  );
}

export function Loading({ label = "Loading the document" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-[#0B1F10]/70" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#117F21]/20 border-t-[#CB9615]" aria-hidden="true" />
      {label}…
    </div>
  );
}
