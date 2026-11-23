"use client";

import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle, BarChart3, ArrowUpRight, Building2, ChevronDown, Download, FileText, Landmark, Percent,
  Search, Shield, TrendingUp, Users, Wallet, X, Check, ArrowDownUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/views/about/primitives";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { SectionHeading } from "@/views/theme/heading";
import { DarkBackdrop, FramedPanel, PageHero, Rise, ease, sectionCls, spot } from "@/views/theme/ui";
import { AreaChart, Columns, DataPanel, DataTable, Donut, Ticker } from "./charts";
import {
  allocColors, allocation, asAt, assets, contributions, download, fees, fundInfo, fundTypes, funds, headline, members, monthLabel,
  periods, pfaReturns, ppp, sources, type FundKey, type PeriodKey,
} from "./data";

const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";
const tn = (v: number) => `₦${v.toFixed(2)}tn`;
const bn = (v: number) => `₦${v.toFixed(v >= 100 ? 0 : 1)}bn`;
const mil = (v: number) => `${(v / 1e6).toFixed(2)}m`;
/** Gold spotlight for glass tiles on dark bands. */
const glowDark = "[background-image:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_50%)]";
/** White card on the theme: ring, large radius, 4px hover lift with a long soft shadow. */
const card = "rounded-[1.75rem] bg-white ring-1 ring-black/10 shadow-[0_30px_60px_-48px_rgba(18,51,28,0.6)]";
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_70px_-36px_rgba(18,51,28,0.45)]";
const goldText = "bg-gradient-to-r from-[#F4D27A] via-[#FBE6A6] to-[#E8B64A] bg-clip-text text-transparent";
const goldCta = cn("group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 font-bold text-[#1A1206] shadow-[0_14px_34px_-16px_rgba(244,210,122,0.9)] transition hover:bg-[#FBE0A0]", ring);

function Segmented<T extends string>({ value, options, onChange, label, id, dark }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string; id: string; dark?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("inline-flex flex-wrap gap-1 rounded-[1.4rem] p-1", dark ? "bg-white/[0.08] ring-1 ring-white/15 backdrop-blur" : "bg-white shadow-[0_10px_30px_-20px_rgba(18,51,28,0.5)] ring-1 ring-black/10")}>
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)} className={cn("relative min-h-11 rounded-full px-4 text-sm font-semibold transition-colors", ring, value === o ? (dark ? "text-[#1A1206]" : "text-[#F4D27A]") : dark ? "text-white/75 hover:text-white" : "text-gray-700 hover:text-[#117F21]")}>
          {value === o && <motion.span layoutId={`seg-${id}`} className={cn("absolute inset-0 rounded-full", dark ? "bg-[#F4D27A]" : "bg-[#1A3A22]")} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}

function AsAt({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", dark ? "bg-white/10 text-white/80 ring-1 ring-white/15" : "bg-[#F2F6F0] text-[#105D1D] ring-1 ring-[#14892A]/15")}><span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-[#F4D27A]" : "bg-[#14892A]")} />{children}</span>;
}

/* ─────────────────────────── Hero ─────────────────────────── */

export function PerfHero() {
  const reduce = useReducedMotion();
  const spark = assets.slice(-12);
  const lo = Math.min(...spark.map((s) => s.v));
  const hi = Math.max(...spark.map((s) => s.v));
  const pts = spark.map((s, i) => `${(i / (spark.length - 1)) * 300},${70 - ((s.v - lo) / (hi - lo)) * 60}`).join(" ");
  const stats = [
    { icon: Users, v: mil(headline.members), l: "RSA holders" },
    { icon: TrendingUp, v: `+${headline.ytd}%`, l: "Asset growth this year" },
    { icon: Landmark, v: headline.retirees.toLocaleString("en-NG"), l: "Retirees on monthly pension*" },
  ];
  return (
    <PageHero
      id="perf-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Operators", to: "/operators" }, { label: "Industry performance" }]}
      pill={{ icon: BarChart3, label: `Latest data: ${asAt}` }}
      title="The pension industry in numbers"
      mark="in numbers"
      intro="How much Nigerians have saved, where it is invested, how each fund is growing and how PFAs compare. Every chart can be read as a table and downloaded."
      actions={
        <ul className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.li key={s.l} onMouseMove={spot} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08, ease }} className={cn("relative overflow-hidden rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-[#F4D27A]/50", glowDark)}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4D27A]/15 text-[#F4D27A]"><s.icon className="h-5 w-5" aria-hidden="true" /></span>
              <p className="mt-3 font-mono text-xl font-black text-[#F4D27A]"><CountUp value={s.v} duration={1.4} /></p>
              <p className="text-xs text-white/75">{s.l}</p>
            </motion.li>
          ))}
        </ul>
      }
      aside={
        <FramedPanel className="p-7 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7F5A04]">Total pension assets</p>
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14892A] opacity-50 [animation-iteration-count:3]" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#14892A]" />
            </span>
          </div>
          <p className="mt-2 text-5xl font-black tracking-tight text-[#1A3A22] sm:text-6xl">
            <Ticker value={headline.assets} fmt={(v) => `₦${v.toFixed(2)}`} />
            <span className="ml-1 text-2xl font-bold text-gray-600 sm:text-3xl">trillion</span>
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1A3A22] px-3 py-1 font-bold text-[#F4D27A]">▲ {headline.ytd}% since January</span>
            <span className="text-gray-600">about ${headline.usd}bn</span>
          </p>
          <svg viewBox="0 0 300 80" className="mt-6 h-28 w-full overflow-visible" aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hero-spark" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#14892A" /><stop offset="1" stopColor="#CB9615" /></linearGradient>
              <linearGradient id="hero-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#14892A" stopOpacity="0.18" /><stop offset="1" stopColor="#14892A" stopOpacity="0" /></linearGradient>
            </defs>
            <motion.polygon points={`0,80 ${pts} 300,80`} fill="url(#hero-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} />
            <motion.polyline points={pts} fill="none" stroke="url(#hero-spark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.8, delay: 0.4, ease }} />
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[11px] text-gray-600"><span>{monthLabel(spark[0].m)}</span><span>{monthLabel(spark[spark.length - 1].m)}</span></div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <p className="rounded-2xl bg-[#F2F6F0] p-3"><span className="block text-gray-600">Paid in benefits to date*</span><span className="font-mono text-base font-black text-[#1A3A22]">₦{headline.benefitsPaid}tn</span></p>
            <p className="rounded-2xl bg-[#F2F6F0] p-3"><span className="block text-gray-600">New members in two years*</span><span className="font-mono text-base font-black text-[#1A3A22]">{headline.joined2y.toLocaleString("en-NG")}</span></p>
          </div>
          <p className="mt-4 text-[11px] text-gray-600">Unaudited. *As at July 2026.</p>
        </FramedPanel>
      }
    />
  );
}

const ranges = ["6 months", "12 months", "Since Jan 2025"] as const;

export function AssetsSection() {
  const [range, setRange] = useState<(typeof ranges)[number]>("12 months");
  const data = useMemo(() => {
    const n = range === "6 months" ? 6 : range === "12 months" ? 12 : assets.length;
    return assets.slice(-n).map((a) => ({ label: monthLabel(a.m), long: monthLabel(a.m, true), v: a.v, m: a.m }));
  }, [range]);
  const first = data[0];
  const last = data[data.length - 1];
  const growth = ((last.v - first.v) / first.v) * 100;
  const avg = ((Math.pow(last.v / first.v, 1 / Math.max(1, data.length - 1)) - 1) * 100);
  const best = data.slice(1).reduce((b, d, i) => (d.v - data[i].v > b.d ? { d: d.v - data[i].v, m: d.long } : b), { d: -Infinity, m: "" });

  return (
    <section id="assets" aria-labelledby="assets-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="assets-title" eyebrow="Total assets" title="How pension savings have grown" highlight="grown" intro="The total value of all pension funds at the end of each month, after investment gains and new contributions." action={<Segmented value={range} options={ranges} onChange={setRange} label="Time period" id="assets" />} />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Rise className="lg:col-span-9">
          <div onMouseMove={spot} className={cn("relative overflow-hidden p-5 sm:p-7", card, glowLight)}>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615]" />
            <DataPanel
              title="Total pension assets" name={`assets-${range.replace(/\s/g, "-").toLowerCase()}`}
              rows={data.map((d) => ({ month: d.m, assets_naira_trillion: d.v }))}
              chart={<AreaChart key={range} data={data} fmt={tn} label="Total pension assets, ₦ trillion" />}
              table={<DataTable head={["Month", "Assets (₦ trillion)", "Change on month"]} rows={data.map((d, i) => [d.long, d.v.toFixed(2), i ? `${(((d.v - data[i - 1].v) / data[i - 1].v) * 100).toFixed(2)}%` : "—"])} />}
              caption="Source: PenCom unaudited monthly portfolio reports. Hover, tap or use arrow keys on the chart to read each month."
            />
          </div>
          </Rise>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1">
            {[
              { l: `Growth over ${range.toLowerCase()}`, v: `+${growth.toFixed(1)}%`, s: `${tn(first.v)} → ${tn(last.v)}` },
              { l: "Average monthly growth", v: `${avg.toFixed(2)}%`, s: "Compound, month on month" },
              { l: "Biggest monthly rise", v: `+₦${best.d.toFixed(2)}tn`, s: best.m },
            ].map((c, i) => (
              <Rise key={c.l} delay={i * 0.1} className="h-full">
                <div onMouseMove={spot} className={cn("relative h-full overflow-hidden rounded-3xl p-5", lift, i === 0 ? cn(darkCard, "text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)]") : cn("bg-white ring-1 ring-black/10", glowLight))}>
                  <p className={cn("text-xs font-bold uppercase tracking-[0.16em]", i === 0 ? "text-[#F4D27A]" : "text-[#7F5A04]")}>{c.l}</p>
                  <AnimatePresence mode="wait"><motion.p key={c.v} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={cn("mt-2 font-mono text-2xl font-black tabular-nums", i === 0 ? goldText : "text-[#1A3A22]")}>{c.v}</motion.p></AnimatePresence>
                  <p className={cn("mt-1 text-sm", i === 0 ? "text-white/75" : "text-gray-600")}>{c.s}</p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Asset allocation ─────────────────────────── */

export function AllocationSection() {
  const [p, setP] = useState(allocation[allocation.length - 1].label);
  const a = allocation.find((x) => x.label === p)!;
  return (
    <section id="allocation" aria-labelledby="alloc-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="alloc-title" eyebrow="Investments" title="Where pension money is invested" highlight="invested" intro="PFAs must invest within the limits in the Regulation on Investment of Pension Fund Assets. Most savings sit in Federal Government securities." action={<Segmented value={p} options={allocation.map((x) => x.label)} onChange={setP} label="Reporting month" id="alloc" />} />
        <Rise className="mt-10">
        <div onMouseMove={spot} className={cn("relative overflow-hidden p-5 sm:p-8", card, glowLight)}>
          <DataPanel
            title="Asset allocation" name={`allocation-${a.period}`}
            rows={a.items.map((i) => ({ period: a.period, asset_class: i.k, naira_trillion: i.v, share_percent: +((i.v / a.total) * 100).toFixed(2) }))}
            chart={<Donut key={a.period} items={a.items} colors={allocColors} total={a.total} unit={tn} />}
            table={<DataTable head={["Asset class", "₦ trillion", "Share"]} rows={[...a.items.map((i) => [i.k, i.v ? i.v.toFixed(2) : "in Other", i.v ? `${((i.v / a.total) * 100).toFixed(1)}%` : "—"]), ["Total", a.total.toFixed(2), "100%"]]} />}
            caption={<>{a.note && <span className="mr-1">{a.note}</span>}Other includes mutual funds, real estate, infrastructure and private equity funds, and cash.</>}
          />
        </div>
        </Rise>
      </div>
    </section>
  );
}

/* ─────────────────────────── Fund types ─────────────────────────── */

export function FundsSection() {
  const [p, setP] = useState(fundTypes[0].label);
  const f = fundTypes.find((x) => x.label === p)!;
  const reduce = useReducedMotion();
  const max = Math.max(...f.rows.map((r) => r.v));
  return (
    <section id="funds" aria-labelledby="funds-title" className={cn("relative isolate bg-[#12331C] text-white", sectionCls)}>
      <DarkBackdrop />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading id="funds-title" dark eyebrow="Fund types" title="Savings by fund type" highlight="fund type" intro="Your PFA places your savings in a fund that matches your age and appetite for risk. Fund II holds the largest share." action={<Segmented dark value={p} options={fundTypes.map((x) => x.label)} onChange={setP} label="Reporting month" id="funds" />} />
        <Rise className="mt-10">
        <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-[1.75rem] bg-white/[0.05] p-5 ring-1 ring-white/15 backdrop-blur sm:p-8", glowDark)}>
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
          <DataPanel
            dark title="Assets by fund type" name={`fund-types-${f.period}`}
            rows={f.rows.map((r) => ({ period: f.period, fund: r.k, naira_trillion: r.v, share_percent: +((r.v / f.total) * 100).toFixed(2) }))}
            chart={
              <ul className="space-y-4" aria-label={`Assets by fund type, ${f.label}`}>
                {f.rows.map((r, i) => (
                  <li key={`${f.period}-${r.k}`} className="group grid grid-cols-1 gap-2 rounded-2xl p-2 transition-colors hover:bg-white/[0.05] sm:grid-cols-[200px_1fr_140px] sm:items-center">
                    <div>
                      <p className="font-bold">{r.k}</p>
                      <p className="text-xs text-white/70">{r.who}</p>
                    </div>
                    <div className="h-4 rounded-full bg-white/10">
                      <motion.div className="relative h-full rounded-full bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#F4D27A]" initial={{ width: 0 }} whileInView={{ width: `${(r.v / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1, delay: reduce ? 0 : i * 0.1, ease }}>
                        <span aria-hidden="true" className="absolute -right-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#F4D27A] shadow-[0_0_18px_4px_rgba(244,210,122,0.45)] ring-4 ring-[#12331C] transition-transform duration-300 group-hover:scale-110" />
                      </motion.div>
                    </div>
                    <p className="font-mono font-black tabular-nums sm:text-right"><span className={goldText}>{tn(r.v)}</span> <span className="text-xs font-normal text-white/70">{((r.v / f.total) * 100).toFixed(0)}%</span></p>
                  </li>
                ))}
              </ul>
            }
            table={<DataTable dark head={["Fund", "₦ trillion", "Share"]} rows={[...f.rows.map((r) => [r.k, r.v.toFixed(2), `${((r.v / f.total) * 100).toFixed(1)}%`]), ["Total", f.total.toFixed(2), "100%"]]} />}
            caption="Other funds are worked out as total assets minus the funds listed. Source: PenCom monthly portfolio reports."
          />
        </div>
        </Rise>
        <p className="mt-6 text-sm text-white/75">Not sure which fund you are in? <Link to="/resources/faq" className="font-semibold text-[#F4D27A] underline underline-offset-2">Read the FAQ</Link> or ask your PFA.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────── Coverage and flows ─────────────────────────── */

export function CoverageSection() {
  const reduce = useReducedMotion();
  const pct = (ppp.funded / ppp.registered) * 100;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <section id="coverage" aria-labelledby="cov-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="cov-title" eyebrow="Coverage and contributions" title="Who is saving, and how much is coming in" highlight="coming in" />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Rise className="h-full">
          <div onMouseMove={spot} className={cn("h-full p-6 sm:p-8", card, lift, glowLight)}>
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-black tracking-tight text-[#1A3A22]">RSA holders</h3><AsAt>{asAt}</AsAt></div>
            <p className="mt-1 text-sm text-gray-600">People with a Retirement Savings Account.</p>
            <div className="mt-6">
              <DataPanel title="RSA holders" name="rsa-holders" rows={members.map((m) => ({ period: m.label, rsa_holders: m.v }))}
                chart={<Columns data={members} fmt={mil} />}
                table={<DataTable head={["Period", "RSA holders"]} rows={members.map((m) => [m.label, m.v.toLocaleString("en-NG")])} />}
                caption="Bars start at about 10.5 million, not zero, so the change is easier to see."
              />
            </div>
          </div>
          </Rise>
          <Rise delay={0.1} className="h-full">
          <div onMouseMove={spot} className={cn("h-full p-6 sm:p-8", card, lift, glowLight)}>
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-black tracking-tight text-[#1A3A22]">Contributions received</h3><AsAt>Q1 2026</AsAt></div>
            <p className="mt-1 text-sm text-gray-600">Money paid in by employers and workers each quarter.</p>
            <div className="mt-6">
              <DataPanel title="Contributions" name="contributions" rows={contributions.map((c) => ({ quarter: c.label, naira_billion: c.v, derived: !!c.derived }))}
                chart={<Columns data={contributions.map((c) => ({ ...c, note: c.derived ? "derived" : undefined }))} fmt={bn} color="#1A3A22" />}
                table={<DataTable head={["Quarter", "₦ billion"]} rows={contributions.map((c) => [c.label + (c.derived ? " *" : ""), c.v.toFixed(2)])} />}
                caption="* Worked out from the published Q3 2025 increase of 18%. Q4 2025 included one-off public-sector payments."
              />
            </div>
          </div>
          </Rise>

          <Rise className="h-full">
          <div onMouseMove={spot} className={cn("relative h-full overflow-hidden p-6 sm:p-8", card, lift, glowLight)}>
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#F4D27A] via-[#CB9615] to-[#14892A]" />
            <div className="flex items-start justify-between gap-3"><h3 className="text-xl font-black tracking-tight text-[#1A3A22]">Personal Pension Plan</h3><AsAt>{ppp.asAt}</AsAt></div>
            <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row">
              <div className="relative h-36 w-36 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${pct.toFixed(1)}% of Personal Pension Plan accounts have received a contribution`}>
                  <defs><linearGradient id="ppp-ring" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#14892A" /><stop offset="1" stopColor="#CB9615" /></linearGradient></defs>
                  <circle cx="60" cy="60" r={R} fill="none" stroke="#E6ECE4" strokeWidth="12" />
                  <motion.circle cx="60" cy="60" r={R} fill="none" stroke="url(#ppp-ring)" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - pct / 100) }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1.4, ease }} />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono text-2xl font-black text-[#1A3A22]">{pct.toFixed(1)}%</span><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7F5A04]">funded</span></span>
              </div>
              <div>
                <p className="text-gray-700"><strong className="text-[#1A3A22]">{ppp.registered.toLocaleString("en-NG")}</strong> accounts opened, but only <strong className="text-[#1A3A22]">{ppp.funded.toLocaleString("en-NG")}</strong> have received a contribution.</p>
                <Link to="/services#ppp" className={cn(goldCta, "mt-5")}>Start saving in a PPP <ArrowChip /></Link>
              </div>
            </div>
          </div>
          </Rise>

          <Rise delay={0.1} className="h-full">
          <div onMouseMove={spot} className={cn("relative h-full overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)] sm:p-8", darkCard, lift)}>
            <div className="relative flex items-start justify-between gap-3"><h3 className="text-xl font-black tracking-tight">Retirees</h3><AsAt dark>July 2026</AsAt></div>
            <div className="relative mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div><p className={cn("font-mono text-4xl font-black", goldText)}><Ticker value={headline.retirees} fmt={(v) => Math.round(v).toLocaleString("en-NG")} /></p><p className="mt-1 text-sm text-white/75">retirees receiving a monthly pension</p></div>
              <div><p className={cn("font-mono text-4xl font-black", goldText)}><CountUp value={`₦${headline.benefitsPaid}tn`} /></p><p className="mt-1 text-sm text-white/75">paid in retirement benefits since the scheme began</p></div>
            </div>
            <p className="relative mt-6 border-t border-white/10 pt-4 text-sm text-white/75">Up from 658,811 retirees and ₦2.3tn in July 2024.</p>
          </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PFA comparison (SAMPLE) ─────────────────────────── */

export function CompareSection() {
  const [fund, setFund] = useState<FundKey>("Fund II");
  const [period, setPeriod] = useState<PeriodKey>("Year to date");
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const [picked, setPicked] = useState<string[]>([]);
  const reduce = useReducedMotion();
  const all = useMemo(() => pfaReturns(fund, period), [fund, period]);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return all.filter((r) => !t || r.name.toLowerCase().includes(t)).sort((a, b) => (dir === "desc" ? b.ret - a.ret : a.ret - b.ret));
  }, [all, q, dir]);
  const sorted = [...all].sort((a, b) => a.ret - b.ret);
  const median = sorted[Math.floor(sorted.length / 2)]?.ret ?? 0;
  const max = Math.max(...all.map((r) => r.ret));
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? [...p.slice(1), id] : [...p, id]));
  const chosen = all.filter((r) => picked.includes(r.id));

  return (
    <section id="compare" aria-labelledby="cmp-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="cmp-title" eyebrow="Compare PFAs" title="How PFA funds have performed" highlight="performed" intro="Returns show how much a fund’s unit price has changed. Past returns do not guarantee future returns, and service quality matters too." />

        <div role="note" className="mt-8 flex gap-3 rounded-3xl border-2 border-dashed border-[#CB9615] bg-[repeating-linear-gradient(135deg,#FFF8E1,#FFF8E1_12px,#FFF3CF_12px,#FFF3CF_24px)] p-4 text-sm text-[#5C4300]">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p><strong>Sample figures for design review.</strong> The PFA names are real; the returns, unit prices and fund sizes are placeholders. PenCom’s Research and Statistics team will supply validated figures before this section goes live.</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Segmented value={fund} options={funds} onChange={setFund} label="Fund" id="cmp-fund" />
          <div className="flex flex-wrap gap-3">
            <label className="relative">
              <span className="sr-only">Period</span>
              <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodKey)} className="min-h-11 appearance-none rounded-full border border-[#7A8A7E] bg-white pl-5 pr-10 font-semibold shadow-[0_10px_30px_-20px_rgba(18,51,28,0.5)] focus:border-[#14892A] focus:outline-none focus:ring-4 focus:ring-[#FFD84D]">
                {periods.map((p) => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            </label>
            <label className="relative">
              <span className="sr-only">Find a PFA</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#117F21]" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a PFA" className="min-h-11 w-52 rounded-full border border-[#7A8A7E] bg-white pl-10 pr-4 shadow-[0_10px_30px_-20px_rgba(18,51,28,0.5)] placeholder:text-gray-600 focus:border-[#14892A] focus:outline-none focus:ring-4 focus:ring-[#FFD84D]" />
            </label>
            <button type="button" onClick={() => setDir((d) => (d === "desc" ? "asc" : "desc"))} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] pl-1.5 pr-5 text-sm font-semibold text-white transition hover:bg-[#14892A]", ring)}>
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-180"><ArrowDownUp className="h-4 w-4" /></span> {dir === "desc" ? "Highest first" : "Lowest first"}
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">{fundInfo[fund].who} · {fundInfo[fund].risk}. Tick up to three PFAs to compare them side by side.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className={cn("p-4 sm:p-6 lg:col-span-8", card)}>
            <DataPanel
              title="PFA returns" name={`pfa-returns-sample-${fund.replace(" ", "-").toLowerCase()}`}
              rows={rows.map((r) => ({ pfa: r.name, fund, period, return_percent: r.ret, unit_price: r.price, fund_size_naira_trillion: r.size, sample: true }))}
              chart={
                <LayoutGroup id="pfa-race">
                  <div className="relative pt-6">
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-0 top-6 z-10 w-0 border-l-2 border-dashed border-[#CB9615]" style={{ left: `calc(11.75rem + (100% - 16.25rem) * ${median / max})` }}>
                    <span className="absolute -top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1A3A22] px-2 py-0.5 font-mono text-[10px] font-bold text-[#F4D27A] shadow">median {median.toFixed(1)}%</span>
                  </span>
                  <ul className="space-y-1.5" aria-label={`${fund} returns, ${period}, sample data`}>
                    {rows.map((r, i) => {
                      const on = picked.includes(r.id);
                      return (
                        <motion.li key={r.id} layout={!reduce} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                          <label className={cn("group grid cursor-pointer grid-cols-[1.25rem_9rem_1fr_3.5rem] items-center gap-2 rounded-xl px-2 py-1.5 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", on ? "bg-[#FFF8E1] ring-1 ring-[#CB9615]/40" : "hover:bg-[#F2F6F0]")}>
                            <input type="checkbox" checked={on} onChange={() => toggle(r.id)} className="sr-only" />
                            <span aria-hidden="true" className={cn("flex h-5 w-5 items-center justify-center rounded-md border-2 transition", on ? "border-[#1A3A22] bg-[#1A3A22] text-[#F4D27A]" : "border-[#7A8A7E]")}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                            <span className="truncate text-sm font-semibold text-[#1A3A22]" title={r.name}><span className="mr-1.5 font-mono text-xs text-gray-600">{String(i + 1).padStart(2, "0")}</span>{r.short}</span>
                            <span className="h-3 overflow-hidden rounded-full bg-[#E6ECE4]">
                              <motion.span className={cn("block h-full rounded-full", on ? "bg-gradient-to-r from-[#CB9615] to-[#F4D27A]" : "bg-gradient-to-r from-[#1A3A22] via-[#105D1D] to-[#36A045]")} initial={{ width: 0 }} animate={{ width: `${(r.ret / max) * 100}%` }} transition={{ duration: reduce ? 0 : 0.7, ease }} />
                            </span>
                            <span className="text-right font-mono text-sm font-bold tabular-nums text-[#1A3A22]">{r.ret.toFixed(1)}%</span>
                          </label>
                        </motion.li>
                      );
                    })}
                    {rows.length === 0 && <li className="py-10 text-center text-gray-600">No PFA matches “{q}”.</li>}
                  </ul>
                  </div>
                </LayoutGroup>
              }
              table={<DataTable head={["PFA", "Return", "Unit price (₦)", "Fund size"]} rows={rows.map((r) => [r.name, `${r.ret.toFixed(2)}%`, r.price.toFixed(4), `₦${(r.size * 1000).toFixed(0)}bn`])} />}
              caption={`Sample data. ${period === "3 years (a year)" ? "Three-year figures are average yearly returns." : ""}`}
            />
          </div>

          <aside className="lg:col-span-4" aria-label="Your comparison">
            <div onMouseMove={spot} className={cn("sticky top-[180px] overflow-hidden rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)]", darkCard)}>
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
              <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Your comparison</p>
              <AnimatePresence initial={false}>
                {chosen.length === 0 ? (
                  <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative mt-4 text-sm text-white/75">Tick up to three PFAs in the list to see them side by side.</motion.p>
                ) : (
                  <motion.ul key="list" className="relative mt-4 space-y-3">
                    {chosen.map((c) => (
                      <motion.li key={c.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold leading-snug">{c.name}</p>
                          <button type="button" onClick={() => toggle(c.id)} aria-label={`Remove ${c.name}`} className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10", ring)}><X className="h-4 w-4" aria-hidden="true" /></button>
                        </div>
                        <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                          <div><dt className="text-white/70">Return</dt><dd className="font-mono text-base font-black text-[#F4D27A]">{c.ret.toFixed(1)}%</dd></div>
                          <div><dt className="text-white/70">vs median</dt><dd className={cn("font-bold", c.ret >= median ? "text-[#B9F0C2]" : "text-[#F2A7A7]")}>{c.ret >= median ? "+" : ""}{(c.ret - median).toFixed(1)}</dd></div>
                          <div><dt className="text-white/70">Size</dt><dd className="font-bold">₦{(c.size * 1000).toFixed(0)}bn</dd></div>
                        </dl>
                        <Link to={`/operators?op=${c.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#F4D27A] hover:underline">Contact details <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              <div className="relative mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-white/75">Want to move your savings?</p>
                <Link to="/services#rsa-transfer" className={cn(goldCta, "mt-3 w-full justify-between")}>Transfer your RSA <ArrowChip /></Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Fees ─────────────────────────── */

export function FeesSection() {
  const icons = [Percent, Shield, Building2, Landmark, Wallet];
  return (
    <section id="fees" aria-labelledby="fees-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="fees-title" eyebrow="Fees" title="What you pay for managing your pension" highlight="What you pay" intro="Fees are deducted from the fund before unit prices are published, so the returns above are after fees. PenCom sets the maximum each party can charge." />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fees.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={f.title}>
                <Rise delay={i * 0.07} className="h-full">
                  <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10", lift, glowLight)}>
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A3A22] text-[#F4D27A] transition-transform duration-300 group-hover:-rotate-6"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <span className="rounded-full bg-[#FFF8E1] px-3 py-1 font-mono text-xs font-bold text-[#7A5600] ring-1 ring-[#CB9615]/30">{f.tag}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-black tracking-tight text-[#1A3A22]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{f.body}</p>
                  </div>
                </Rise>
              </li>
            );
          })}
          <li>
            <Rise delay={fees.length * 0.07} className="h-full">
            <Link to="/regulations?q=fees#library" onMouseMove={spot} className={cn("group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)]", darkCard, lift, ring)}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4D27A]/15 text-[#F4D27A]"><FileText className="h-6 w-6" aria-hidden="true" /></span>
              <span><span className="mt-6 block text-lg font-black tracking-tight">Read the fee regulations</span><span className="mt-1 block text-sm text-white/75">Regulation on Fees Structure and later circulars, in the library.</span></span>
              <span className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-[#F4D27A]">Open the library <ArrowChip dark /></span>
            </Link>
            </Rise>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── Methodology and downloads ─────────────────────────── */

const notes = [
  { q: "Where do these figures come from?", a: "From the unaudited monthly portfolio reports PFAs and custodians file with PenCom, the quarterly industry reports and the industry dashboards. Monthly figures can be revised when audited accounts are published." },
  { q: "When are they published?", a: "Monthly figures usually appear four to six weeks after the end of the month. Quarterly reports follow the end of each quarter. The date on each chart shows the period it covers." },
  { q: "How are PFA returns worked out?", a: "A return is the change in a fund’s unit price over the period, after fees. Three-year figures are average yearly returns. Funds of different sizes and risk levels should not be compared directly." },
  { q: "Why are some values marked as worked out?", a: "Where PenCom has published a total and some of its parts, the remaining part is total minus the parts shown. These values are marked in the tables." },
];

export function MethodSection() {
  const [open, setOpen] = useState<number | null>(0);
  const everything = () =>
    download("industry-data", [
      ...assets.map((a) => ({ dataset: "total_assets", period: a.m, item: "Total", value: a.v, unit: "NGN trillion" })),
      ...allocation.flatMap((a) => a.items.map((i) => ({ dataset: "allocation", period: a.period, item: i.k, value: i.v, unit: "NGN trillion" }))),
      ...fundTypes.flatMap((f) => f.rows.map((r) => ({ dataset: "fund_types", period: f.period, item: r.k, value: r.v, unit: "NGN trillion" }))),
      ...members.map((m) => ({ dataset: "rsa_holders", period: m.label, item: "RSA holders", value: m.v, unit: "people" })),
      ...contributions.map((c) => ({ dataset: "contributions", period: c.label, item: c.derived ? "Contributions (derived)" : "Contributions", value: c.v, unit: "NGN billion" })),
    ], "csv");
  return (
    <section id="method" aria-labelledby="method-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading id="method-title" eyebrow="About this data" title="Methodology" stacked />
          <ul className="mt-8 space-y-3">
            {notes.map((n, i) => (
              <li key={n.q} className={cn("overflow-hidden rounded-3xl bg-white ring-1 transition-shadow duration-300", open === i ? "shadow-[0_30px_60px_-40px_rgba(18,51,28,0.6)] ring-[#14892A]/30" : "ring-black/10")}>
                <h3>
                  <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className={cn("flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left font-bold text-[#1A3A22]", ring)}>
                    <span className="flex items-center gap-4"><span aria-hidden="true" className={cn("font-mono text-sm font-black tabular-nums transition-colors", open === i ? "text-[#7F5A04]" : "text-gray-600")}>{String(i + 1).padStart(2, "0")}</span>{n.q}</span>
                    <span aria-hidden="true" className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition", open === i ? "rotate-180 bg-[#1A3A22] text-[#F4D27A]" : "bg-[#F2F6F0] text-[#1A3A22]")}><ChevronDown className="h-4 w-4" /></span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                      <p className="px-5 pb-5 pl-[3.25rem] leading-relaxed text-gray-700">{n.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-5 lg:col-span-5">
          <Rise>
          <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)]", darkCard)}>
            <Download aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 text-white/[0.05]" />
            <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Open data</p>
            <p className="relative mt-2 text-xl font-black tracking-tight">Download every series on this page</p>
            <p className="relative mt-1 text-sm text-white/75">One CSV file with assets, allocation, fund types, membership and contributions.</p>
            <button type="button" onClick={everything} className={cn(goldCta, "relative mt-5")}>Download CSV <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A] transition-transform duration-300 group-hover:translate-y-0.5"><Download className="h-4 w-4" /></span></button>
            <div className="relative mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5 text-sm">
              {([["/resources#monthly-reports", "Monthly reports"], ["/resources#quarterly-reports", "Quarterly reports"], ["/resources#annual-reports", "Annual reports"]] as const).map(([to, l]) => (
                <Link key={to} to={to} className={cn("inline-flex min-h-11 items-center rounded-full bg-white/10 px-4 font-semibold ring-1 ring-white/15 transition hover:bg-[#F4D27A] hover:text-[#1A1206]", ring)}>{l}</Link>
              ))}
            </div>
          </div>
          </Rise>
          <Rise delay={0.1}>
          <div className={cn("p-6", card)}>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#7F5A04]">Sources</h3>
            <ul className="mt-3 divide-y divide-black/5">
              {sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className={cn("group flex min-h-11 items-center justify-between gap-3 py-2 text-sm font-medium text-[#1A3A22] transition-colors hover:text-[#117F21]", ring)}>{s.label}<span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F6F0] transition duration-300 group-hover:rotate-45 group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]"><ArrowUpRight className="h-4 w-4" /></span><span className="sr-only">(opens in a new tab)</span></a></li>
              ))}
            </ul>
          </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
