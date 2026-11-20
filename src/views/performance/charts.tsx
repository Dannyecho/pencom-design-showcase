"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Braces, FileSpreadsheet, Table2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { download } from "./data";

const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/* ─────────────────────────── Chart / table switch + downloads ─────────────────────────── */

export function DataPanel({
  title, name, rows, chart, table, dark, caption,
}: {
  title: string;
  name: string;
  rows: Record<string, string | number | boolean | undefined>[];
  chart: ReactNode;
  table: ReactNode;
  dark?: boolean;
  caption?: ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const btn = cn("inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition", ring, dark ? "text-white/75 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-[#117F21]");
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label={`${title}: view as`} className={cn("inline-flex rounded-xl p-1", dark ? "bg-white/10" : "bg-gray-100")}>
          {(["chart", "table"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("relative inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold capitalize transition", ring, view === v ? (dark ? "text-[#0A4A13]" : "text-white") : dark ? "text-white/70" : "text-gray-600")}>
              {view === v && <motion.span layoutId={`view-${name}`} className={cn("absolute inset-0 -z-0 rounded-lg", dark ? "bg-[#F4D27A]" : "bg-[#117F21]")} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative flex items-center gap-1.5">{v === "chart" ? <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> : <Table2 className="h-3.5 w-3.5" aria-hidden="true" />}{v}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button type="button" className={btn} onClick={() => download(name, rows, "csv")}><FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> CSV<span className="sr-only"> of {title}</span></button>
          <button type="button" className={btn} onClick={() => download(name, rows, "json")}><Braces className="h-4 w-4" aria-hidden="true" /> JSON<span className="sr-only"> of {title}</span></button>
        </div>
      </div>
      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }}>
            {view === "chart" ? chart : table}
          </motion.div>
        </AnimatePresence>
      </div>
      {caption && <div className={cn("mt-3 text-xs", dark ? "text-white/50" : "text-gray-500")}>{caption}</div>}
    </div>
  );
}

export function DataTable({ head, rows, dark }: { head: string[]; rows: (string | number)[][]; dark?: boolean }) {
  return (
    <div className={cn("max-h-[420px] overflow-auto rounded-2xl border", dark ? "border-white/15" : "border-gray-200")}>
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className={cn("sticky top-0", dark ? "bg-[#0A3A10]" : "bg-gray-50")}>
          <tr>{head.map((h, i) => <th key={h} scope="col" className={cn("px-4 py-3 font-semibold", i > 0 && "text-right", dark ? "text-white/80" : "text-gray-600")}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={cn("border-t", dark ? "border-white/10" : "border-gray-100")}>
              {r.map((c, j) => j === 0 ? <th key={j} scope="row" className={cn("px-4 py-2.5 font-medium", dark ? "text-white" : "text-gray-800")}>{c}</th> : <td key={j} className={cn("px-4 py-2.5 text-right tabular-nums", dark ? "text-white/85" : "text-gray-700")}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────── Area chart with crosshair ─────────────────────────── */

export function AreaChart({ data, fmt, label, dark, height = 320 }: { data: { label: string; long: string; v: number }[]; fmt: (v: number) => string; label: string; dark?: boolean; height?: number }) {
  const [wrap, w] = useWidth<HTMLDivElement>();
  const inView = useInView(wrap, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");
  const pad = { t: 24, r: 16, b: 34, l: 48 };
  const W = Math.max(w, 280);
  const H = height;
  const vs = data.map((d) => d.v);
  const lo = Math.floor(Math.min(...vs) * 0.97);
  const hi = Math.ceil(Math.max(...vs) * 1.02);
  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
  const ticks = Array.from({ length: 4 }, (_, i) => lo + ((hi - lo) * i) / 3);
  const every = Math.ceil(data.length / Math.max(2, Math.floor(W / 90)));
  const h = hover ?? data.length - 1;
  const tone = dark ? { grid: "rgba(255,255,255,0.08)", txt: "rgba(255,255,255,0.55)", line: "#F4D27A" } : { grid: "#EDF1EC", txt: "#6B7280", line: "#117F21" };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  return (
    <div ref={wrap} className="relative">
      {w > 0 && (
        <svg
          viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${label}. ${data[0].long}: ${fmt(data[0].v)}; ${data[data.length - 1].long}: ${fmt(data[data.length - 1].v)}. Use left and right arrow keys to read each month.`}
          tabIndex={0} onPointerMove={onMove} onPointerLeave={() => setHover(null)}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") setHover((p) => Math.max(0, (p ?? data.length - 1) - 1)); if (e.key === "ArrowRight") setHover((p) => Math.min(data.length - 1, (p ?? data.length - 1) + 1)); }}
          className={cn("block touch-none rounded-xl", ring)}
        >
          <defs>
            <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tone.line} stopOpacity={dark ? 0.35 : 0.25} />
              <stop offset="100%" stopColor={tone.line} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`stroke-${gid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={dark ? "#7BC67E" : "#2E913D"} />
              <stop offset="100%" stopColor={dark ? "#F4D27A" : "#CB9615"} />
            </linearGradient>
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={tone.grid} />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={tone.txt}>{fmt(t).replace(/tn$/, "")}</text>
            </g>
          ))}
          {data.map((d, i) => i % every === 0 || i === data.length - 1 ? <text key={d.label} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={tone.txt}>{d.label}</text> : null)}
          <motion.path d={area} fill={`url(#fill-${gid})`} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 1, delay: reduce ? 0 : 0.6 }} />
          <motion.path d={line} fill="none" stroke={`url(#stroke-${gid})`} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1.6, ease }} />
          {inView && (
            <g>
              <line x1={x(h)} x2={x(h)} y1={pad.t} y2={H - pad.b} stroke={tone.line} strokeDasharray="4 4" opacity={0.5} />
              <motion.circle cx={x(h)} cy={y(data[h].v)} r={6} fill={dark ? "#0A4A13" : "#fff"} stroke={tone.line} strokeWidth={3} animate={{ cx: x(h), cy: y(data[h].v) }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            </g>
          )}
        </svg>
      )}
      {w > 0 && inView && (
        <motion.div
          aria-hidden="true"
          className={cn("pointer-events-none absolute top-0 rounded-xl px-3 py-2 text-xs shadow-xl", dark ? "bg-white text-[#0A4A13]" : "bg-[#0A4A13] text-white")}
          animate={{ left: Math.min(Math.max(x(h) - 60, 0), W - 130) }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          <span className="block opacity-70">{data[h].long}</span>
          <span className="block text-base font-bold">{fmt(data[h].v)}</span>
          {h > 0 && <span className={cn("block font-semibold", data[h].v >= data[h - 1].v ? (dark ? "text-[#117F21]" : "text-[#7BC67E]") : "text-[#E57373]")}>{data[h].v >= data[h - 1].v ? "▲" : "▼"} {(((data[h].v - data[h - 1].v) / data[h - 1].v) * 100).toFixed(2)}% on month</span>}
        </motion.div>
      )}
      <p className="sr-only" aria-live="polite">{hover !== null ? `${data[hover].long}: ${fmt(data[hover].v)}` : ""}</p>
    </div>
  );
}

/* ─────────────────────────── Donut ─────────────────────────── */

export function Donut({ items, colors, total, unit }: { items: { k: string; v: number }[]; colors: Record<string, string>; total: number; unit: (v: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [on, setOn] = useState<string | null>(null);
  const shown = items.filter((i) => i.v > 0);
  const R = 42;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const segs = shown.map((it) => {
    const frac = it.v / total;
    const s = { ...it, frac, start: acc };
    acc += frac;
    return s;
  });
  const cur = segs.find((s) => s.k === on);
  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[240px_1fr]">
      <div className="relative mx-auto h-60 w-60">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#EEF2ED" strokeWidth="12" />
          {segs.map((s, i) => (
            <motion.circle
              key={s.k} cx="50" cy="50" r={R} fill="none" stroke={colors[s.k]} strokeWidth={on === s.k ? 15 : 12}
              strokeDasharray={`${Math.max(0, s.frac * C - 0.8)} ${C}`}
              initial={{ strokeDashoffset: -s.start * C, opacity: 0 }}
              animate={{ strokeDashoffset: -s.start * C, opacity: inView ? (on && on !== s.k ? 0.35 : 1) : 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.1 + i * 0.12 }}
              onPointerEnter={() => setOn(s.k)} onPointerLeave={() => setOn(null)}
              className="cursor-pointer transition-[stroke-width]"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div key={cur?.k ?? "total"} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{cur ? cur.k : "Total"}</p>
              <p className="font-display text-3xl font-bold text-[#0A2E10]">{unit(cur ? cur.v : total)}</p>
              {cur && <p className="text-sm font-semibold" style={{ color: colors[cur.k] }}>{(cur.frac * 100).toFixed(1)}%</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((it) => {
          const pct = (it.v / total) * 100;
          return (
            <li key={it.k}>
              <button type="button" onFocus={() => setOn(it.k)} onBlur={() => setOn(null)} onPointerEnter={() => setOn(it.k)} onPointerLeave={() => setOn(null)} disabled={it.v === 0} className={cn("w-full rounded-xl p-3 text-left transition", ring, on === it.k ? "bg-gray-50" : "hover:bg-gray-50", it.v === 0 && "opacity-50")}>
                <span className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-gray-800"><span className="h-3 w-3 rounded-full" style={{ background: colors[it.k] }} />{it.k}</span>
                  <span className="tabular-nums text-gray-600">{it.v ? `${unit(it.v)} · ${pct.toFixed(1)}%` : "in Other"}</span>
                </span>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <motion.span className="block h-full rounded-full" style={{ background: colors[it.k] }} initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }} transition={{ duration: reduce ? 0 : 0.9, ease }} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────────────────────── Column chart ─────────────────────────── */

export function Columns({ data, fmt, color = "#117F21", dark, highlightLast = true }: { data: { label: string; v: number; note?: string }[]; fmt: (v: number) => string; color?: string; dark?: boolean; highlightLast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const base = min > max * 0.85 ? min * 0.97 : 0;
  return (
    <div ref={ref} className="flex h-56 items-end gap-2 sm:gap-4" role="img" aria-label={data.map((d) => `${d.label}: ${fmt(d.v)}`).join("; ")}>
      {data.map((d, i) => {
        const hgt = ((d.v - base) / (max - base)) * 100;
        const last = highlightLast && i === data.length - 1;
        return (
          <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end">
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: inView ? 1 : 0, y: 0 }} transition={{ delay: reduce ? 0 : 0.5 + i * 0.08 }} className={cn("mb-1.5 whitespace-nowrap text-[11px] font-bold tabular-nums sm:text-xs", dark ? "text-white" : "text-[#0A2E10]")}>
              {fmt(d.v)}{d.note && <sup className="ml-0.5 text-[#CB9615]">*</sup>}
            </motion.span>
            <motion.span
              className={cn("relative w-full max-w-[64px] overflow-hidden rounded-t-xl", d.note && "opacity-70")}
              style={{ background: last ? `linear-gradient(180deg, #F4D27A, #CB9615)` : `linear-gradient(180deg, ${color}, ${color}cc)` }}
              initial={{ height: 0 }} animate={{ height: inView ? `${Math.max(4, hgt * 0.78)}%` : 0 }} transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.08, ease }}
            >
              <span aria-hidden="true" className="absolute inset-0 -translate-y-full bg-gradient-to-b from-white/30 to-transparent transition duration-700 group-hover:translate-y-0" />
            </motion.span>
            <span className={cn("mt-2 text-center text-[11px] leading-tight sm:text-xs", dark ? "text-white/60" : "text-gray-500")}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Animated number ─────────────────────────── */

export function Ticker({ value, fmt, className }: { value: number; fmt: (v: number) => string; className?: string }) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);
  useEffect(() => {
    if (reduce) {
      setV(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const e = 1 - Math.pow(1 - p, 3);
      setV(a + (value - a) * e);
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <span className={className}>{fmt(v)}</span>;
}

export function useSorted<T>(rows: T[], key: (r: T) => number, dir: "desc" | "asc") {
  return useMemo(() => [...rows].sort((a, b) => (dir === "desc" ? key(b) - key(a) : key(a) - key(b))), [rows, key, dir]);
}
