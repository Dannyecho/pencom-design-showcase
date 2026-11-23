"use client";

import { useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, BarChart3, CheckCircle2, Download, Flag, Lightbulb, Quote, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, ease, reveal } from "@/views/about/primitives";
import { spot } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { ArrowChip, DocHero, DocTools, Loading, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, darkCard, glowLight, ring, sizes, useDocJson } from "@/views/docs/kit";

/**
 * Industry report as a web page with the PDF attached (DES-22: "industry reports ... available as web pages").
 * Text and figures: PenCom Q1 2026 Quarterly Industry Report (published April 2026). Tiles and domain statuses are
 * transcribed from the report's Executive Dashboard; chapter text is extracted from the PDF.
 */

type Para = { x: string; b: boolean; insight: boolean };
type Chapter = { n: string; title: string; blocks: Para[]; subs: { n: string; title: string; blocks: Para[] }[] };

const PDF = "/documents/q1-2026-industry-report.pdf";

const STATUS: Record<string, string> = {
  "On track": "bg-[#E8F5E9] text-[#105D1D]",
  Improving: "bg-[#E0F2F1] text-[#00695C]",
  Watch: "bg-[#FFF3CD] text-[#7A5600]",
  Critical: "bg-[#FDECEC] text-[#9B1C1C]",
  "Strong quarter": "bg-[#FFF8E1] text-[#7A5600]",
  Stable: "bg-[#E8F5E9] text-[#105D1D]",
  Mixed: "bg-[#FFF3CD] text-[#7A5600]",
};

/** Dot colour per status, for the domain list. */
const DOT: Record<string, string> = { Stable: "bg-[#14892A]", Improving: "bg-[#00897B]", Watch: "bg-[#CB9615]", Mixed: "bg-[#CB9615]", Critical: "bg-[#B52026]" };
const card = "rounded-3xl bg-white ring-1 ring-black/10";

const tiles = [
  { k: "Pension assets (NAV)", v: "₦29.52tn", note: "+7.53% on Q4 2025. Equity revaluation of ₦1.50 trillion drove most of the growth.", s: "On track" },
  { k: "Q1 contributions", v: "₦559.4bn", note: "Public 50.9%, private 49.1%. Lower than Q4’s ₦903.7 billion, which was raised by public-sector arrears.", s: "On track" },
  { k: "New RSAs in Q1", v: "143,248", note: "75.31% under age 40. Cumulative RSAs of 11.18 million.", s: "Improving" },
  { k: "Accrued rights paid", v: "₦11.19bn", note: "4,592 beneficiaries. FGN-funded legacy obligations honoured on schedule.", s: "On track" },
  { k: "Real return (36-month)", v: "Improving", note: "Funds I, II and VI Active now above CPI. The gap to 15.38% inflation narrowed in Q1.", s: "Watch" },
  { k: "PPP funding ratio", v: "8.58%", note: "18,811 funded of 219,316 RSAs. Registrations grew but the funded share barely moved.", s: "Critical" },
  { k: "States fully compliant", v: "8 / 37", note: "25 with CPS legislation. Katsina switched from CDBS to CPS in the quarter.", s: "Improving" },
  { k: "Employer recoveries", v: "₦1.18bn", note: "From 15 defaulters in Q1. ₦33.80 billion recovered since June 2012.", s: "Strong quarter" },
];

const domains = [
  { d: "A. Stability", s: "Stable", r: "Asset base past ₦29.52 trillion, driven by equity revaluation and disciplined contribution flow." },
  { d: "B. Coverage", s: "Mixed", r: "CPS membership expanding at pace; the Personal Pension Plan funding gap remains the binding constraint." },
  { d: "C. Welfare", s: "Stable", r: "Approximately 21,600 retirees served in the quarter; ₦11.19 billion in accrued rights settled." },
  { d: "D. Compliance", s: "Improving", r: "e-PCC issuance more than doubled; ICPC collaboration commenced for recalcitrant defaulters." },
  { d: "E. Investment", s: "Watch", r: "Real returns trajectory clearly positive; FGN concentration at 58.07% now the diversification priority." },
];

function Paras({ blocks }: { blocks: Para[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((p, i) =>
        p.insight ? (
          <aside key={i} className="relative overflow-hidden rounded-2xl bg-[#F2F6F0] p-5 pl-6">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F4D27A] to-[#CB9615]" />
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]"><span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A]"><Lightbulb className="h-3.5 w-3.5" /></span> Further insight</p>
            <p className="mt-2 font-serif leading-[1.75] text-[#1A3A22]/90">{p.x}</p>
          </aside>
        ) : p.b ? (
          <p key={i} className="flex gap-3 leading-relaxed text-[#1A3A22]/90"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" /><span>{p.x}</span></p>
        ) : (
          <p key={i} className="font-serif leading-[1.75] text-[#1A3A22]/90">{p.x}</p>
        ),
      )}
    </div>
  );
}

export default function ReportPage() {
  const { status, data } = useDocJson<Chapter[]>("/documents/text/q1-2026-industry-report.json");
  const [size, setSize] = useState(0);
  const [domain, setDomain] = useState("04");

  const ch = (n: string) => data?.find((c) => c.n === n);
  const dg = ch("02");
  const bullets = dg?.blocks.filter((b) => b.b) ?? [];
  const headline = dg?.blocks.find((b) => !b.b)?.x.replace(/^HEADLINE, Q1 2026\s*/, "");
  const cols = [
    { k: "What is working", icon: TrendingUp, tone: "from-[#14892A] to-[#36A045]", chip: "bg-[#14892A]", items: bullets.slice(0, 5) },
    { k: "What is at risk", icon: AlertTriangle, tone: "from-[#B52026] to-[#D9534F]", chip: "bg-[#B52026]", items: bullets.slice(5, 10) },
    { k: "What we will do", icon: Target, tone: "from-[#9A6F06] to-[#F4D27A]", chip: "bg-[#9A6F06]", items: bullets.slice(10) },
  ];
  const domainChs = data?.filter((c) => ["04", "05", "06", "07", "08"].includes(c.n)) ?? [];
  const toc = [
    { id: "glance", label: "Q1 2026 at a glance" }, { id: "dg", label: "Director-General’s read" }, { id: "domains", label: "Five outcome domains" },
    { id: "environment", label: "Operating environment" }, { id: "outlook", label: "Outlook for Q2 2026" }, { id: "priorities", label: "Strategic priorities" },
  ];
  const label = (s: string) => s.replace(/^\w/, (c) => c.toUpperCase());

  return (
    <MotionConfig reducedMotion="user">
      <ReadingBar />
      <DocHero
        crumbs={[{ label: "Home", to: "/" }, { label: "Resources", to: "/resources" }, { label: "Quarterly reports", to: "/resources#quarterly-reports" }, { label: "Q1 2026" }]}
        kind="Quarterly industry report"
        icon={<BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />}
        title="Nigerian Pension Industry Quarterly Report, Q1 2026"
        lead="The Commission’s consolidated view of the pension industry for January to March 2026, organised around the five outcome domains of the PenCom Insight Framework."
        meta={[
          { label: "Period", value: "1 Jan – 31 Mar 2026" },
          { label: "Published", value: "April 2026" },
          { label: "Framework", value: "PenCom Insight" },
          { label: "Length", value: "33 pages" },
        ]}
        actions={<>
          <PrimaryBtn href={PDF} external><Download className="h-4 w-4" aria-hidden="true" /> Full report (PDF)</PrimaryBtn>
          <Link to="/performance" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-6 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white hover:text-[#1A3A22]", ring)}><TrendingUp className="h-4 w-4" aria-hidden="true" /> Latest industry figures</Link>
        </>}
      />

      {status === "loading" && <Loading />}
      <div className="bg-[#F2F6F0]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block print:hidden"><div className="sticky top-[120px] space-y-4"><Toc items={toc} title="In this report" /><DocTools size={size} setSize={setSize} /></div></aside>
          <div className="min-w-0 space-y-20 sm:space-y-24" style={{ fontSize: sizes[size] }}>
            {/* At a glance */}
            <section id="glance" aria-labelledby="glance-t" className="scroll-mt-[120px]">
              <SectionHeading id="glance-t" eyebrow="Executive dashboard" title="Q1 2026 at a glance" highlight="at a glance" intro="The industry entered 2026 on a stronger footing. Assets crossed ₦29 trillion for the first time and every reform track moved forward under Pension Revolution 2.0." />
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {tiles.map((t, i) => (
                  <motion.li key={t.k} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07, duration: 0.6, ease }}>
                    <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-3xl p-5 text-white shadow-[0_24px_50px_-30px_rgba(18,51,28,0.8)] transition duration-300 hover:-translate-y-1", darkCard)}>
                      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#F4D27A] to-[#36A045] transition-transform duration-500 group-hover:scale-x-100" />
                      <div className="flex flex-col-reverse items-start gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{t.k}</p>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS[t.s])}>{t.s}</span>
                      </div>
                      <CountUp value={t.v} className="mt-3 block bg-gradient-to-r from-[#FFE9A8] to-[#F4D27A] bg-clip-text font-display text-3xl font-black tracking-tight text-transparent tabular-nums" />
                      <p className="mt-2 text-sm leading-snug text-white/75">{t.note}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className={cn("mt-6 overflow-hidden", card)}>
                <p className="border-b border-[#1A3A22]/[0.07] px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">Status by outcome domain</p>
                <ul>
                  {domains.map((d, i) => (
                    <motion.li key={d.d} onMouseMove={spot} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={cn("grid grid-cols-1 gap-2 border-t border-[#1A3A22]/[0.07] px-5 py-4 transition-colors first:border-0 hover:bg-[#F2F6F0]/60 sm:grid-cols-[170px_110px_1fr] sm:items-center", glowLight)}>
                      <span className="flex items-center gap-2.5 font-bold text-[#1A3A22]"><span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-black/[0.04]", DOT[d.s])} />{d.d}</span>
                      <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-bold", STATUS[d.s])}>{d.s}</span>
                      <span className="text-sm text-[#1A3A22]/75">{d.r}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>

            {/* DG's read */}
            <section id="dg" aria-labelledby="dg-t" className="scroll-mt-[120px]">
              <SectionHeading id="dg-t" eyebrow="Director-General’s read" title="The quarter in perspective" highlight="perspective" />
              {headline && (
                <motion.figure {...reveal} onMouseMove={spot} className={cn("relative mt-8 overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_40px_80px_-40px_rgba(18,51,28,0.8)] sm:p-10", darkCard)}>
                  <span aria-hidden="true" className="absolute inset-y-8 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#F4D27A] to-[#36A045]" />
                  <Quote className="absolute -right-4 -top-4 h-32 w-32 text-[#F4D27A]/[0.12]" aria-hidden="true" />
                  <blockquote className="relative font-serif text-lg leading-relaxed text-white/90 sm:text-xl">{headline}</blockquote>
                </motion.figure>
              )}
              <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                {cols.map((c, i) => (
                  <motion.div key={c.k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease }} className={cn("relative overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]", card)}>
                    <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", c.tone)} />
                    <p className="flex items-center gap-3 px-5 pb-2 pt-6 text-lg font-black tracking-tight text-[#1A3A22]"><span aria-hidden="true" className={cn("flex h-9 w-9 items-center justify-center rounded-full text-white", c.chip)}><c.icon className="h-4 w-4" /></span>{c.k}</p>
                    <ul className="space-y-3 p-5 pt-3">
                      {c.items.map((b) => {
                        const [lead, ...rest] = b.x.split(". ");
                        return <li key={b.x.slice(0, 30)} className="text-sm leading-relaxed text-[#1A3A22]/80"><strong className="text-[#1A3A22]">{lead}.</strong> {rest.join(". ")}</li>;
                      })}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Domains */}
            <section id="domains" aria-labelledby="dom-t" className="scroll-mt-[120px]">
              <SectionHeading id="dom-t" eyebrow="PenCom Insight Framework" title="Five outcome domains" highlight="outcome domains" />
              <LayoutGroup id="dom">
                <div role="tablist" aria-label="Outcome domains" className="mt-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 ring-1 ring-black/10 [scrollbar-width:none]">
                  {domainChs.map((c, i) => (
                    <button key={c.n} role="tab" type="button" aria-selected={domain === c.n} onClick={() => setDomain(c.n)} className={cn("relative min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition", ring, domain === c.n ? "text-[#F4D27A]" : "text-[#1A3A22]/75 hover:text-[#1A3A22]")}>
                      {domain === c.n && <motion.span layoutId="dom-pill" className="absolute inset-0 rounded-full bg-[#1A3A22] shadow-[0_10px_24px_-12px_rgba(18,51,28,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      <span className="relative">{domains[i]?.d ?? c.title}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              <AnimatePresence mode="wait">
                {domainChs.filter((c) => c.n === domain).map((c) => (
                  <motion.div key={c.n} role="tabpanel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }} className="mt-4 space-y-4">
                    {c.subs.map((s) => (
                      <article key={s.n} className={cn("p-6 sm:p-8", card)}>
                        <h3 className="flex items-baseline gap-3 text-xl font-black tracking-tight text-[#1A3A22]"><span className="font-mono text-sm font-bold tabular-nums text-[#7F5A04]">{s.n}</span>{label(s.title)}</h3>
                        <div className="mt-4"><Paras blocks={s.blocks} /></div>
                      </article>
                    ))}
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>

            {[["environment", "09", "Operating environment"], ["outlook", "10", "Outlook for Q2 2026"], ["priorities", "11", "Strategic priorities for Q2 2026"]].map(([id, n, t]) => {
              const c = ch(n);
              if (!c) return null;
              return (
                <section key={id} id={id} aria-labelledby={`${id}-t`} className="scroll-mt-[120px]">
                  <SectionHeading n={n} id={`${id}-t`} eyebrow={`Chapter ${n}`} title={t} />
                  <div className={cn("mt-6 p-6 sm:p-8", card, id === "priorities" && "[&_ul]:grid")}>
                    {id === "priorities" ? (
                      <>
                        {c.blocks.filter((b) => !b.b).slice(0, 1).map((b) => <p key="i" className="font-serif leading-[1.75] text-[#1A3A22]/90">{b.x}</p>)}
                        <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                          {c.blocks.filter((b) => b.b).map((b, i) => (
                            <motion.li key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.04 }} className="group flex gap-3 rounded-2xl bg-[#F2F6F0] p-4 text-sm leading-relaxed text-[#1A3A22]/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_40px_-26px_rgba(18,51,28,0.4)] hover:ring-1 hover:ring-black/10">
                              <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A] transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]"><Flag className="h-3.5 w-3.5" /></span>{b.x}
                            </motion.li>
                          ))}
                        </ol>
                      </>
                    ) : <Paras blocks={c.blocks.filter((b) => !b.x.startsWith("Sources:"))} />}
                  </div>
                </section>
              );
            })}

            <div className="space-y-4">
              <VerifyNote>This web version presents the report’s dashboard, commentary and priorities in an accessible format. Charts, the risk register and the statistical annex are in the full PDF.</VerifyNote>
              <PdfCard href={PDF} title="Nigerian Pension Industry Quarterly Report, Q1 2026" meta="PDF · 33 pages · 0.8 MB" />
              <Link to="/resources#quarterly-reports" onMouseMove={spot} className={cn("group flex items-center justify-between p-6 font-bold text-[#1A3A22] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]", card, glowLight, ring)}>
                All quarterly reports <ArrowChip />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
