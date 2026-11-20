"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Calculator as CalcIcon, Info } from "lucide-react";
import Headline from "@/views/theme/Headline";
import { cn } from "@/lib/utils";
import { DarkBackdrop, Rise, ease, sectionCls, spot } from "@/views/theme/ui";

const naira = (n: number, compact = false) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(n);

function Money({
  value,
  compact = true,
  className,
}: {
  value: number;
  compact?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (v) => naira(Math.max(0, v), compact));
  useEffect(() => {
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [value, reduce, spring]);
  return (
    <span className={className}>
      <motion.span aria-hidden="true">{text}</motion.span>
      <span className="sr-only">{naira(value, compact)}</span>
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-3 text-sm font-semibold text-[#0B1F10]"
      >
        {label}
        <span className="rounded-full bg-[#0B1F10] px-2.5 py-0.5 font-mono text-sm tabular-nums text-[#F4D27A]">
          {format(value)}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#FFD84D]"
        style={{
          background: `linear-gradient(to right, #117F21 ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />
      {hint && <p className="mt-1 text-xs text-gray-600">{hint}</p>}
    </div>
  );
}

const W = 600;
const H = 240;

/** Illustrative RSA projection: 18% of pay (10% employer + 8% employee) plus voluntary contributions, compounded monthly. */
export default function Calculator() {
  const [age, setAge] = useState(30);
  const [retire, setRetire] = useState(60);
  const [salary, setSalary] = useState(250_000);
  const [balance, setBalance] = useState(500_000);
  const [voluntary, setVoluntary] = useState(0);
  const [ret, setRet] = useState(10);
  const [growth, setGrowth] = useState(5);
  const reduce = useReducedMotion();

  const r = useMemo(() => {
    const years = Math.max(1, retire - age);
    let bal = balance;
    let pay = salary;
    let employee = 0;
    let employer = 0;
    let vol = 0;
    const series: number[] = [bal];
    const paidIn: number[] = [bal];
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        bal *= 1 + ret / 100 / 12;
        bal += pay * 0.18 + voluntary;
        employee += pay * 0.08;
        employer += pay * 0.1;
        vol += voluntary;
      }
      series.push(bal);
      paidIn.push(balance + employee + employer + vol);
      pay *= 1 + growth / 100;
    }
    return {
      years,
      total: bal,
      employee,
      employer,
      vol,
      start: balance,
      growthAmt: bal - balance - employee - employer - vol,
      series,
      paidIn,
    };
  }, [age, retire, salary, balance, voluntary, ret, growth]);

  // Fixed 41-point paths so framer can morph between them.
  const toPath = (vals: number[], close: boolean) => {
    const max = Math.max(...r.series, 1);
    const pts = Array.from({ length: 41 }, (_, i) => {
      const t = (i / 40) * (vals.length - 1);
      const lo = Math.floor(t);
      const hi = Math.min(vals.length - 1, lo + 1);
      const v = vals[lo] + (vals[hi] - vals[lo]) * (t - lo);
      return [(i / 40) * W, H - (v / max) * (H - 16)];
    });
    const line = pts
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(" ");
    return close ? `${line} L${W},${H} L0,${H} Z` : line;
  };

  const parts = [
    { k: "Starting balance", v: r.start, c: "bg-white/40" },
    { k: "Your 8%", v: r.employee, c: "bg-[#8FD19E]" },
    { k: "Employer’s 10%", v: r.employer, c: "bg-[#2E913D]" },
    { k: "Voluntary", v: r.vol, c: "bg-[#5EC4C4]" },
    { k: "Investment growth", v: Math.max(0, r.growthAmt), c: "bg-[#F4D27A]" },
  ];
  const sum = parts.reduce((a, p) => a + p.v, 0) || 1;

  return (
    <section
      id="calculator"
      aria-labelledby="calc-title"
      className={cn(
        sectionCls,
        "relative isolate overflow-hidden bg-[#04140A] text-white",
      )}
    >
      <DarkBackdrop />
      <div className="mx-auto max-w-7xl">
        <Headline
          id="calc-title"
          n="02"
          kicker="Pension calculator"
          title="See how your savings could grow"
          mark="could grow"
          dark
          intro="Move the sliders to estimate your RSA balance when you retire. It’s an illustration, not a promise: real returns go up and down."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Rise className="lg:col-span-5">
            <div className="relative h-full">
              <div
                aria-hidden="true"
                className="absolute -inset-px -z-10 rounded-[calc(1.75rem+1px)] bg-gradient-to-br from-[#F4D27A]/70 via-white/10 to-[#117F21]/60"
              />
              <div className="h-full space-y-6 rounded-[1.75rem] bg-white p-6 text-[#0B1F10] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:p-8">
                <Slider
                  label="Your age"
                  value={age}
                  min={18}
                  max={64}
                  step={1}
                  onChange={(v) => {
                    setAge(v);
                    if (retire <= v) setRetire(v + 1);
                  }}
                  format={(v) => `${v}`}
                />
                <Slider
                  label="Retire at"
                  value={retire}
                  min={Math.max(50, age + 1)}
                  max={70}
                  step={1}
                  onChange={setRetire}
                  format={(v) => `${v}`}
                />
                <Slider
                  label="Monthly pay"
                  value={salary}
                  min={30_000}
                  max={3_000_000}
                  step={10_000}
                  onChange={setSalary}
                  format={(v) => naira(v)}
                />
                <Slider
                  label="Current RSA balance"
                  value={balance}
                  min={0}
                  max={50_000_000}
                  step={50_000}
                  onChange={setBalance}
                  format={(v) => naira(v, true)}
                />
                <Slider
                  label="Voluntary contribution a month"
                  value={voluntary}
                  min={0}
                  max={500_000}
                  step={5_000}
                  onChange={setVoluntary}
                  format={(v) => naira(v)}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Slider
                    label="Yearly return"
                    value={ret}
                    min={0}
                    max={20}
                    step={0.5}
                    onChange={setRet}
                    format={(v) => `${v}%`}
                    hint="An assumption, not a forecast"
                  />
                  <Slider
                    label="Yearly pay rise"
                    value={growth}
                    min={0}
                    max={15}
                    step={0.5}
                    onChange={setGrowth}
                    format={(v) => `${v}%`}
                  />
                </div>
              </div>
            </div>
          </Rise>

          <Rise delay={0.08} className="lg:col-span-7">
            {/* Results: glass card whose gold edge follows the pointer, as on the home page's figures */}
            <div
              onMouseMove={spot}
              className="relative h-full overflow-hidden rounded-[1.75rem] p-[1px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] [background-image:radial-gradient(320px_circle_at_var(--x,70%)_var(--y,0%),rgba(244,210,122,0.75),rgba(255,255,255,0.12)_45%)]"
            >
              <div className="relative isolate h-full overflow-hidden rounded-[calc(1.75rem-1px)] bg-[#0A1C10]/95 p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#117F21]/50 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-[#CB9615]/25 blur-3xl"
                />
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">
                  <CalcIcon className="h-4 w-4" aria-hidden="true" /> Estimated
                  balance at {retire}
                </p>
                <p className="mt-2" aria-live="polite">
                  <Money
                    value={r.total}
                    className="bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text text-5xl font-black tabular-nums tracking-tight text-transparent sm:text-6xl"
                  />
                </p>
                <p className="mt-2 text-sm text-white/75">
                  After {r.years} years of contributions. That could pay roughly{" "}
                  <Money
                    value={r.total / 240}
                    compact={false}
                    className="font-semibold text-white"
                  />{" "}
                  a month over 20 years, before any further returns.
                </p>

                {/* Growth chart */}
                <figure className="mt-6">
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="h-48 w-full sm:h-56"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="calc-fill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#F4D27A"
                          stopOpacity="0.55"
                        />
                        <stop
                          offset="100%"
                          stopColor="#F4D27A"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={false}
                      d={toPath(r.series, true)}
                      fill="url(#calc-fill)"
                      animate={{ d: toPath(r.series, true) }}
                      transition={{ duration: reduce ? 0 : 0.6, ease }}
                    />
                    <motion.path
                      initial={false}
                      d={toPath(r.series, false)}
                      fill="none"
                      stroke="#F4D27A"
                      strokeWidth="3"
                      animate={{ d: toPath(r.series, false) }}
                      transition={{ duration: reduce ? 0 : 0.6, ease }}
                    />
                    <motion.path
                      initial={false}
                      d={toPath(r.paidIn, false)}
                      fill="none"
                      stroke="rgba(255,255,255,0.55)"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      animate={{ d: toPath(r.paidIn, false) }}
                      transition={{ duration: reduce ? 0 : 0.6, ease }}
                    />
                  </svg>
                  <figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-white/70">
                    <span>Age {age}</span>
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-5 bg-[#F4D27A]" /> Balance
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-0.5 w-5 border-t-2 border-dashed border-white/60" />{" "}
                        Money paid in
                      </span>
                    </span>
                    <span>Age {retire}</span>
                  </figcaption>
                </figure>

                {/* Breakdown */}
                <div className="mt-6">
                  <div
                    className="flex h-3 overflow-hidden rounded-full bg-white/10"
                    aria-hidden="true"
                  >
                    {parts.map((p) => (
                      <motion.span
                        key={p.k}
                        className={p.c}
                        animate={{ width: `${(p.v / sum) * 100}%` }}
                        transition={{ duration: reduce ? 0 : 0.6, ease }}
                      />
                    ))}
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                    {parts
                      .filter((p) => p.v > 0)
                      .map((p) => (
                        <div key={p.k}>
                          <dt className="flex items-center gap-2 text-white/70">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${p.c}`}
                              aria-hidden="true"
                            />
                            {p.k}
                          </dt>
                          <dd className="mt-0.5 font-bold">
                            <Money value={p.v} />
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
                <p className="mt-6 flex gap-2 rounded-2xl bg-white/5 p-3 text-xs text-white/70 ring-1 ring-white/10">
                  <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Assumes the minimum 18% contribution every month, the return
                  and pay rise you chose, and no withdrawals or fees. Your PFA
                  can give you your actual balance and projections.
                </p>
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
