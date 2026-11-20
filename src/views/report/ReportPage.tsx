"use client";

import { useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Download, Flag, Lightbulb, Quote, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, Spotlight, ease, reveal } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { DocHero, DocTools, Loading, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, ring, sizes, useDocJson } from "@/views/docs/kit";

/**
 * Industry report as a web page with the PDF attached (DES-22: "industry reports ... available as web pages").
 * Text and figures: PenCom Q1 2026 Quarterly Industry Report (published April 2026). Tiles and domain statuses are
 * transcribed from the report's Executive Dashboard; chapter text is extracted from the PDF.
 */

type Para = { x: string; b: boolean; insight: boolean };
type Chapter = { n: string; title: string; blocks: Para[]; subs: { n: string; title: string; blocks: Para[] }[] };

const PDF = "/documents/q1-2026-industry-report.pdf";

const STATUS: Record<string, string> = {
  "On track": "bg-[#E8F5E9] text-[#0A4A13]",
  Improving: "bg-[#E0F2F1] text-[#00695C]",
  Watch: "bg-[#FFF3CD] text-[#7A5600]",
  Critical: "bg-[#FDECEC] text-[#9B1C1C]",
  "Strong quarter": "bg-[#FFF8E1] text-[#7A5600]",
  Stable: "bg-[#E8F5E9] text-[#0A4A13]",
  Mixed: "bg-[#FFF3CD] text-[#7A5600]",
};

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
          <aside key={i} className="relative overflow-hidden rounded-2xl border border-[#CB9615]/30 bg-gradient-to-br from-[#FFF8E1] to-white p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#9A6F06]"><Lightbulb className="h-4 w-4" aria-hidden="true" /> Further insight</p>
            <p className="mt-2 font-serif leading-[1.75] text-gray-800">{p.x}</p>
          </aside>
        ) : p.b ? (
          <p key={i} className="flex gap-3 leading-relaxed text-gray-800"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" /><span>{p.x}</span></p>
        ) : (
          <p key={i} className="font-serif leading-[1.75] text-gray-800">{p.x}</p>
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
    { k: "What is working", icon: TrendingUp, tone: "from-[#117F21] to-[#2E913D]", items: bullets.slice(0, 5) },
    { k: "What is at risk", icon: AlertTriangle, tone: "from-[#B52026] to-[#D9534F]", items: bullets.slice(5, 10) },
    { k: "What we will do", icon: Target, tone: "from-[#9A6F06] to-[#CB9615]", items: bullets.slice(10) },
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
          <Link to="/performance" className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 hover:ring-[#117F21]", ring)}><TrendingUp className="h-4 w-4" aria-hidden="true" /> Latest industry figures</Link>
        </>}
      />

      {status === "loading" && <Loading />}
      <div className="bg-[#F2F6F0]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block print:hidden"><div className="sticky top-[120px] space-y-4"><Toc items={toc} title="In this report" /><DocTools size={size} setSize={setSize} /></div></aside>
          <div className="min-w-0 space-y-16" style={{ fontSize: sizes[size] }}>
            {/* At a glance */}
            <section id="glance" aria-labelledby="glance-t" className="scroll-mt-[120px]">
              <SectionHeading id="glance-t" eyebrow="Executive dashboard" title="Q1 2026 at a glance" highlight="at a glance" intro="The industry entered 2026 on a stronger footing. Assets crossed ₦29 trillion for the first time and every reform track moved forward under Pension Revolution 2.0." />
              <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {tiles.map((t, i) => (
                  <motion.li key={t.k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.07, ease }}>
                    <Spotlight color="rgba(244,210,122,0.2)" className="h-full rounded-3xl bg-[#0A4A13] p-5 text-white">
                      <div className="flex flex-col-reverse items-start gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t.k}</p>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS[t.s])}>{t.s}</span>
                      </div>
                      <CountUp value={t.v} className="mt-3 block font-display text-3xl font-bold text-[#F4D27A]" />
                      <p className="mt-2 text-sm leading-snug text-white/70">{t.note}</p>
                    </Spotlight>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
                <p className="border-b border-gray-100 px-5 py-3 text-sm font-bold text-[#0A2E10]">Status by outcome domain</p>
                <ul>
                  {domains.map((d, i) => (
                    <motion.li key={d.d} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="grid grid-cols-1 gap-2 border-t border-gray-100 px-5 py-4 first:border-0 sm:grid-cols-[160px_110px_1fr] sm:items-center">
                      <span className="font-semibold text-[#0A2E10]">{d.d}</span>
                      <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-bold", STATUS[d.s])}>{d.s}</span>
                      <span className="text-sm text-gray-600">{d.r}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>

            {/* DG's read */}
            <section id="dg" aria-labelledby="dg-t" className="scroll-mt-[120px]">
              <SectionHeading id="dg-t" eyebrow="Director-General’s read" title="The quarter in perspective" highlight="perspective" />
              {headline && (
                <motion.figure {...reveal} className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-7 text-white sm:p-10">
                  <Quote className="absolute -right-4 -top-4 h-32 w-32 text-white/[0.06]" aria-hidden="true" />
                  <blockquote className="relative font-serif text-lg leading-relaxed text-white/90 sm:text-xl">{headline}</blockquote>
                </motion.figure>
              )}
              <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
                {cols.map((c, i) => (
                  <motion.div key={c.k} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ease }} className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
                    <p className={cn("flex items-center gap-2 bg-gradient-to-r px-5 py-3 font-bold text-white", c.tone)}><c.icon className="h-5 w-5" aria-hidden="true" />{c.k}</p>
                    <ul className="space-y-3 p-5">
                      {c.items.map((b) => {
                        const [lead, ...rest] = b.x.split(". ");
                        return <li key={b.x.slice(0, 30)} className="text-sm leading-relaxed text-gray-700"><strong className="text-[#0A2E10]">{lead}.</strong> {rest.join(". ")}</li>;
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
                <div role="tablist" aria-label="Outcome domains" className="mt-8 flex gap-2 overflow-x-auto pb-2">
                  {domainChs.map((c, i) => (
                    <button key={c.n} role="tab" type="button" aria-selected={domain === c.n} onClick={() => setDomain(c.n)} className={cn("relative min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition", ring, domain === c.n ? "text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-[#117F21]")}>
                      {domain === c.n && <motion.span layoutId="dom-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0A4A13] to-[#117F21]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      <span className="relative">{domains[i]?.d ?? c.title}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              <AnimatePresence mode="wait">
                {domainChs.filter((c) => c.n === domain).map((c) => (
                  <motion.div key={c.n} role="tabpanel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }} className="mt-4 space-y-4">
                    {c.subs.map((s) => (
                      <article key={s.n} className="rounded-3xl bg-white ring-1 ring-black/5 p-6 sm:p-8">
                        <h3 className="flex items-baseline gap-3 text-xl font-bold text-[#0A2E10]"><span className="font-display text-sm text-[#CB9615]">{s.n}</span>{label(s.title)}</h3>
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
                  <div className={cn("mt-6 rounded-3xl bg-white ring-1 ring-black/5 p-6 sm:p-8", id === "priorities" && "[&_ul]:grid")}>
                    {id === "priorities" ? (
                      <>
                        {c.blocks.filter((b) => !b.b).slice(0, 1).map((b) => <p key="i" className="font-serif leading-[1.75] text-gray-800">{b.x}</p>)}
                        <ol className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                          {c.blocks.filter((b) => b.b).map((b, i) => (
                            <motion.li key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.04 }} className="flex gap-3 rounded-2xl bg-[#F2F6F0] p-4 text-sm leading-relaxed text-gray-700">
                              <Flag className="mt-0.5 h-4 w-4 shrink-0 text-[#CB9615]" aria-hidden="true" />{b.x}
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
              <Link to="/resources#quarterly-reports" className={cn("group flex items-center justify-between rounded-3xl bg-white ring-1 ring-black/5 p-6 font-semibold text-[#0A2E10] hover:border-[#117F21]", ring)}>
                All quarterly reports <ArrowRight className="h-5 w-5 text-[#117F21] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
