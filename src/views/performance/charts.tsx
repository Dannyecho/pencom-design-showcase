"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Braces, FileSpreadsheet, Table2, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/theme/ui";
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
  const btn = cn(
    "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs font-bold ring-1 transition duration-300 hover:-translate-y-0.5",
    ring,
    dark ? "text-white/85 ring-white/20 hover:bg-[#F4D27A] hover:text-[#1A1206] hover:ring-[#F4D27A]" : "bg-white text-[#1A3A22] ring-black/10 hover:bg-[#1A3A22] hover:text-[#F4D27A] hover:ring-[#1A3A22]",
  );
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label={`${title}: view as`} className={cn("inline-flex rounded-full p-1 ring-1", dark ? "bg-white/[0.08] ring-white/15 backdrop-blur" : "bg-[#F2F6F0] ring-black/10")}>
          {(["chart", "table"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={cn("relative inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs font-bold capitalize transition-colors", ring, view === v ? (dark ? "text-[#1A1206]" : "text-[#F4D27A]") : dark ? "text-white/75 hover:text-white" : "text-gray-700 hover:text-[#117F21]")}>
              {view === v && <motion.span layoutId={`view-${name}`} className={cn("absolute inset-0 -z-0 rounded-full", dark ? "bg-[#F4D27A] shadow-[0_8px_24px_-10px_rgba(244,210,122,0.8)]" : "bg-[#1A3A22] shadow-[0_8px_20px_-10px_rgba(18,51,28,0.8)]")} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative flex items-center gap-1.5">{v === "chart" ? <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> : <Table2 className="h-3.5 w-3.5" aria-hidden="true" />}{v}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn} onClick={() => download(name, rows, "csv")}><FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> CSV<span className="sr-only"> of {title}</span></button>
          <button type="button" className={btn} onClick={() => download(name, rows, "json")}><Braces className="h-4 w-4" aria-hidden="true" /> JSON<span className="sr-only"> of {title}</span></button>
        </div>
      </div>
      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease }}>
            {view === "chart" ? chart : table}
          </motion.div>
        </AnimatePresence>
      </div>
      {caption && <div className={cn("mt-4 text-xs leading-relaxed", dark ? "text-white/70" : "text-gray-600")}>{caption}</div>}
    </div>
  );
}

export function DataTable({ head, rows, dark }: { head: string[]; rows: (string | number)[][]; dark?: boolean }) {
  return (
    <div className={cn("max-h-[420px] overflow-auto rounded-2xl ring-1", dark ? "ring-white/15" : "bg-white ring-black/10")}>
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className={cn("sticky top-0", dark ? "bg-[#1A3A22]" : "bg-[#F2F6F0]")}>
          <tr>{head.map((h, i) => <th key={h} scope="col" className={cn("px-4 py-3 text-xs font-bold uppercase tracking-[0.12em]", i > 0 && "text-right", dark ? "text-[#F4D27A]" : "text-[#1A3A22]")}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={cn("border-t transition-colors", dark ? "border-white/10 hover:bg-white/[0.05]" : "border-black/[0.06] hover:bg-[#F2F6F0]/70")}>
              {r.map((c, j) => j === 0 ? <th key={j} scope="row" className={cn("px-4 py-2.5 font-semibold", dark ? "text-white" : "text-[#1A3A22]")}>{c}</th> : <td key={j} className={cn("px-4 py-2.5 text-right font-mono tabular-nums", dark ? "text-white/85" : "text-gray-700")}>{c}</td>)}
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
  // Axis text: gray-600 on white (7.6:1), white/70 on the dark band. Point colour: green on white, light gold on dark.
  const tone = dark
    ? { grid: "rgba(255,255,255,0.1)", base: "rgba(255,255,255,0.25)", txt: "rgba(255,255,255,0.7)", line: "#F4D27A", dot: "#1A3A22" }
    : { grid: "#DFE7DC", base: "#B9C6B6", txt: "#4B5563", line: "#14892A", dot: "#fff" };
  const up = h > 0 && data[h].v >= data[h - 1].v;

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
          className={cn("block touch-none rounded-2xl", ring)}
        >
          <defs>
            <linearGradient id={`fill-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dark ? "#F4D27A" : "#2E913D"} stopOpacity={dark ? 0.32 : 0.26} />
              <stop offset="60%" stopColor={dark ? "#F4D27A" : "#CB9615"} stopOpacity={dark ? 0.08 : 0.07} />
              <stop offset="100%" stopColor={tone.line} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`stroke-${gid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={dark ? "#7BC67E" : "#14892A"} />
              <stop offset="55%" stopColor={dark ? "#B9DB8A" : "#2E913D"} />
              <stop offset="100%" stopColor={dark ? "#F4D27A" : "#CB9615"} />
            </linearGradient>
            <filter id={`glow-${gid}`} x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {ticks.map((t, i) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={i === 0 ? tone.base : tone.grid} strokeDasharray={i === 0 ? undefined : "3 6"} />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill={tone.txt}>{fmt(t).replace(/tn$/, "")}</text>
            </g>
          ))}
          {data.map((d, i) => i % every === 0 || i === data.length - 1 ? <text key={d.label} x={i === data.length - 1 ? W - 2 : x(i)} y={H - 10} textAnchor={i === data.length - 1 ? "end" : "middle"} fontSize="11" fontWeight={i === h ? 700 : 400} fill={i === h ? (dark ? "#F4D27A" : "#1A3A22") : tone.txt}>{d.label}</text> : null)}
          <motion.path d={area} fill={`url(#fill-${gid})`} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 1, delay: reduce ? 0 : 0.6 }} />
          {/* soft glow under the line, the chart's one effect */}
          <motion.path d={line} fill="none" stroke={`url(#stroke-${gid})`} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${gid})`} initial={{ opacity: 0 }} animate={{ opacity: inView ? (dark ? 0.55 : 0.35) : 0 }} transition={{ duration: 1, delay: reduce ? 0 : 1 }} />
          <motion.path d={line} fill="none" stroke={`url(#stroke-${gid})`} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: reduce ? 0 : 1.6, ease }} />
          {inView && (
            <g>
              <motion.line x1={x(h)} x2={x(h)} y1={pad.t} y2={H - pad.b} stroke={tone.line} strokeDasharray="2 5" strokeLinecap="round" opacity={0.6} animate={{ x1: x(h), x2: x(h) }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              <motion.circle cx={x(h)} cy={y(data[h].v)} r={14} fill={tone.line} opacity={0.16} animate={{ cx: x(h), cy: y(data[h].v) }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
              <motion.circle cx={x(h)} cy={y(data[h].v)} r={6} fill={tone.dot} stroke={tone.line} strokeWidth={3} animate={{ cx: x(h), cy: y(data[h].v) }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />
            </g>
          )}
        </svg>
      )}
      {w > 0 && inView && (
        <motion.div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-2xl px-3.5 py-2.5 text-xs",
            dark ? "bg-white text-[#1A3A22] shadow-[0_20px_40px_-18px_rgba(0,0,0,0.7)]" : "bg-[#1A3A22] text-white ring-1 ring-white/10 shadow-[0_20px_40px_-18px_rgba(18,51,28,0.75)]",
          )}
          // sits below the point when it is high on the chart, above it when low, so it never hides the point
          animate={{ left: Math.min(Math.max(x(h) - 64, 0), W - 140), top: y(data[h].v) < H / 2 ? y(data[h].v) + 22 : Math.max(0, y(data[h].v) - 92) }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        >
          <span className={cn("block font-semibold uppercase tracking-[0.12em] text-[10px]", dark ? "text-gray-600" : "text-white/70")}>{data[h].long}</span>
          <span className={cn("block font-mono text-base font-black tabular-nums", dark ? "text-[#1A3A22]" : "text-[#F4D27A]")}>{fmt(data[h].v)}</span>
          {/* up/down: green #7BC67E / rose #F19B9B on ink; green #14892A / red #B42318 on white (all 5:1 or more) */}
          {h > 0 && <span className={cn("block font-semibold", up ? (dark ? "text-[#117F21]" : "text-[#7BC67E]") : dark ? "text-[#B42318]" : "text-[#F19B9B]")}>{up ? "▲" : "▼"} {(((data[h].v - data[h - 1].v) / data[h - 1].v) * 100).toFixed(2)}% on month</span>}
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
    <div ref={ref} className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[260px_1fr] lg:gap-12">
      <div className="relative mx-auto h-60 w-60 sm:h-64 sm:w-64">
        <span aria-hidden="true" className="absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(244,210,122,0.28),transparent_70%)] blur-xl" />
        <svg viewBox="0 0 100 100" className="relative h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#E6ECE4" strokeWidth="12" />
          <circle cx="50" cy="50" r="33" fill="#fff" />
          {segs.map((s, i) => (
            <motion.circle
              key={s.k} cx="50" cy="50" r={R} fill="none" stroke={colors[s.k]} strokeWidth={on === s.k ? 15 : 12}
              strokeDasharray={`${Math.max(0, s.frac * C - 0.8)} ${C}`}
              initial={{ strokeDashoffset: -s.start * C, opacity: 0 }}
              animate={{ strokeDashoffset: -s.start * C, opacity: inView ? (on && on !== s.k ? 0.3 : 1) : 0 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.1 + i * 0.12 }}
              onPointerEnter={() => setOn(s.k)} onPointerLeave={() => setOn(null)}
              style={{ filter: on === s.k ? `drop-shadow(0 0 2.5px ${colors[s.k]})` : undefined }}
              className="cursor-pointer transition-[stroke-width]"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={cur?.k ?? "total"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-600">{cur ? cur.k : "Total"}</p>
              <p className="mt-0.5 font-mono text-3xl font-black tabular-nums tracking-tight text-[#1A3A22]">{unit(cur ? cur.v : total)}</p>
              {cur && <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#1A3A22] px-2.5 py-0.5 font-mono text-xs font-bold text-[#F4D27A]"><span className="h-2 w-2 rounded-full" style={{ background: colors[cur.k] }} />{(cur.frac * 100).toFixed(1)}%</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((it) => {
          const pct = (it.v / total) * 100;
          const act = on === it.k;
          return (
            <li key={it.k}>
              <button type="button" onFocus={() => setOn(it.k)} onBlur={() => setOn(null)} onPointerEnter={() => setOn(it.k)} onPointerLeave={() => setOn(null)} disabled={it.v === 0} className={cn("w-full rounded-2xl p-3 text-left ring-1 transition duration-300", ring, act ? "-translate-y-0.5 bg-[#F2F6F0] ring-black/10 shadow-[0_18px_36px_-28px_rgba(18,51,28,0.6)]" : "ring-transparent hover:bg-[#F2F6F0]", it.v === 0 && "opacity-50")}>
                <span className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2.5 font-bold text-[#1A3A22]"><span className={cn("h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-2 transition", act ? "ring-[#1A3A22]/20" : "ring-transparent")} style={{ background: colors[it.k] }} />{it.k}</span>
                  <span className="font-mono text-xs tabular-nums text-gray-700 sm:text-sm">{it.v ? `${unit(it.v)} · ${pct.toFixed(1)}%` : "in Other"}</span>
                </span>
                <span className="mt-2.5 block h-2 overflow-hidden rounded-full bg-[#E6ECE4]">
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

export function Columns({ data, fmt, color = "#14892A", dark, highlightLast = true }: { data: { label: string; v: number; note?: string }[]; fmt: (v: number) => string; color?: string; dark?: boolean; highlightLast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const base = min > max * 0.85 ? min * 0.97 : 0;
  return (
    <div ref={ref} className="flex h-60 items-stretch gap-2 sm:gap-4" role="img" aria-label={data.map((d) => `${d.label}: ${fmt(d.v)}`).join("; ")}>
      {data.map((d, i) => {
        const hgt = Math.max(4, ((d.v - base) / (max - base)) * 100 * 0.8);
        const last = highlightLast && i === data.length - 1;
        return (
          <div key={d.label} className="group flex h-full min-w-0 flex-1 flex-col items-center">
            {/* track: a faint full-height column the bar grows inside */}
            <div className={cn("relative w-full max-w-[64px] flex-1 rounded-t-2xl", dark ? "bg-white/[0.06]" : "bg-[#F2F6F0]")}>
              <motion.span
                className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-2xl transition-shadow duration-300"
                style={{
                  background: last ? "linear-gradient(180deg, #F4D27A, #CB9615)" : `linear-gradient(180deg, ${color}, ${color}d9)`,
                  boxShadow: last ? "0 14px 30px -12px rgba(203,150,21,0.7)" : undefined,
                }}
                initial={{ height: 0 }} animate={{ height: inView ? `${hgt}%` : 0 }} transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : i * 0.08, ease }}
              >
                {d.note && <span aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.35)_0_4px,transparent_4px_9px)]" />}
                <span aria-hidden="true" className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/30 to-transparent transition duration-700 group-hover:translate-y-0" />
              </motion.span>
              <motion.span
                aria-hidden="true"
                className="absolute -inset-x-3 flex justify-center"
                style={{ bottom: `calc(${hgt}% + 6px)` }}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 6 }} transition={{ delay: reduce ? 0 : 0.5 + i * 0.08 }}
              >
                <span className={cn(
                  "whitespace-nowrap font-mono text-[11px] font-bold tabular-nums sm:text-xs",
                  last ? "rounded-full bg-[#1A3A22] px-2 py-0.5 text-[#F4D27A] shadow-[0_8px_18px_-8px_rgba(18,51,28,0.7)]" : dark ? "text-white" : "text-[#1A3A22]",
                )}>
                  {fmt(d.v)}{d.note && <sup className={cn("ml-0.5", last ? "text-[#F4D27A]" : dark ? "text-[#F4D27A]" : "text-[#7F5A04]")}>*</sup>}
                </span>
              </motion.span>
            </div>
            <span className={cn("w-full border-t pt-2 text-center text-[11px] leading-tight sm:text-xs", last ? "font-bold" : "", dark ? "border-white/25 text-white/75" : "border-[#B9C6B6] text-gray-600", last && !dark && "text-[#1A3A22]")}>{d.label}</span>
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
