"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ClipboardCheck, Clock, Download, FileText, FileType, Printer, RotateCcw, Search } from "lucide-react";
import { Rise, sectionCls, spot } from "@/views/theme/ui";
import { cn } from "@/lib/utils";
import { Tilt, ease } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { forms } from "@/views/resources/publications";
import { splitReq } from "@/views/charter/splitReq";
import charter from "@/views/charter/charter.json";
import { ArrowChip, DocHero, VerifyNote, darkCard, glowLight, ring } from "@/views/docs/kit";

/**
 * Forms and application checklists as web pages (DES-22: "forms, application checklists ... available as web pages";
 * DES-41: printable checklists). Checklist items are the documentation requirements in the revised Service Charter (May 2026).
 */

type Std = { dept: string; service: string; time: string; req: string };
type Charter = { standards: Std[] };
type Who = "Contributors" | "Retirees" | "Families" | "Employers";

const PICK: { match: RegExp; title: string; who: Who[]; id: string }[] = [
  { id: "programmed-withdrawal", match: /^Programmed Withdrawal Access/, title: "Retire and start your monthly pension", who: ["Retirees"] },
  { id: "en-bloc", match: /^En bloc Withdrawal/, title: "Withdraw your whole RSA balance (en bloc)", who: ["Retirees"] },
  { id: "job-loss-25", match: /^Request for withdrawal of 25%/, title: "Withdraw 25% after losing your job", who: ["Contributors"] },
  { id: "voluntary", match: /^Withdrawal from Voluntary Contributions/, title: "Withdraw your voluntary contributions", who: ["Contributors"] },
  { id: "mortgage", match: /^Residential Mortgage/, title: "Use your RSA towards a home (mortgage equity)", who: ["Contributors"] },
  { id: "ppp-payment", match: /^Request for Payment of Personal Pension Plan/, title: "Get paid from your Personal Pension Plan", who: ["Contributors", "Retirees"] },
  { id: "death-benefits", match: /^Death Benefits Request/, title: "Claim death benefits for a family member", who: ["Families"] },
  { id: "death-claims-fgn", match: /^Death Benefits Claims/, title: "Claim accrued rights for a deceased federal employee", who: ["Families"] },
  { id: "accrued-rights", match: /^Processing and Payment of Accrued Rights/, title: "Get your accrued rights (federal employees)", who: ["Retirees"] },
  { id: "biodata", match: /^Approval for Update of Contributors/, title: "Update your personal details (biodata)", who: ["Contributors"] },
  { id: "pcc", match: /^Issuance of Pension Clearance Certificate/, title: "Get a Pension Clearance Certificate (PCC)", who: ["Employers"] },
  { id: "employer-code", match: /^Employer Codes Generation/, title: "Get an employer code", who: ["Employers"] },
  { id: "refund", match: /^Approval for refunds of Pension Contributions/, title: "Get a refund of pension contributions", who: ["Employers", "Contributors"] },
];
const WHO: ("All" | Who)[] = ["All", "Contributors", "Retirees", "Families", "Employers"];
const KEY = "pencom:checklists";
const pill = "inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold transition";

function load(): Record<string, number[]> {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
}

export default function FormsPage() {
  const reduce = useReducedMotion();
  // Bundled with the page, so the checklists are in the server-rendered HTML.
  const data = charter as unknown as Charter;
  const [who, setWho] = useState<"All" | Who>("All");
  const [sel, setSel] = useState(PICK[0].id);
  // Ticks live on this device; read after mount so server and browser render the same.
  const [ticks, setTicks] = useState<Record<string, number[]>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTicks(load());
    setReady(true);
  }, []);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(ticks)); } catch { /* storage unavailable */ }
  }, [ticks, ready]);

  const lists = useMemo(() => {
    if (!data) return [];
    return PICK.map((p) => {
      const s = data.standards.find((x) => p.match.test(x.service));
      return s ? { ...p, std: s, items: splitReq(s.req) } : null;
    }).filter(Boolean) as (typeof PICK[number] & { std: Std; items: string[] })[];
  }, [data]);
  const shown = lists.filter((l) => who === "All" || l.who.includes(who as Who));
  const cur = lists.find((l) => l.id === sel) ?? shown[0];
  const done = cur ? (ticks[cur.id] ?? []) : [];
  const pct = cur ? Math.round((done.length / cur.items.length) * 100) : 0;
  const toggle = (i: number) => cur && setTicks((t) => ({ ...t, [cur.id]: done.includes(i) ? done.filter((x) => x !== i) : [...done, i] }));

  const printList = () => {
    if (!cur) return;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`<!doctype html><title>${cur.title}</title><style>body{font:16px/1.6 Arial;margin:40px}h1{font:bold 22px Verdana;color:#0A4A13;margin:0}p{color:#444}ul{list-style:none;padding:0}li{display:flex;gap:12px;margin-bottom:12px}.b{flex:none;width:18px;height:18px;border:2px solid #117F21;border-radius:4px;margin-top:3px;text-align:center;line-height:14px;font-weight:bold;color:#117F21}footer{margin-top:30px;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:8px}</style><h1>${cur.title}</h1><p>${cur.std.dept}${cur.std.time ? ` · Service standard: ${cur.std.time}` : ""}</p><ul>${cur.items.map((t, i) => `<li><span class="b">${done.includes(i) ? "✓" : ""}</span>${t.replace(/</g, "&lt;")}</li>`).join("")}</ul><footer>National Pension Commission · From the Service Charter (revised May 2026) · pencom.gov.ng</footer>`);
    w.document.close(); w.focus(); w.print();
  };

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  const fq = q.trim().toLowerCase();
  const fl = forms.filter((f) => !fq || f.title.toLowerCase().includes(fq));
  const R = 30, C = 2 * Math.PI * R;

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
      <DocHero
        crumbs={[{ label: "Home", to: "/" }, { label: "Resources", to: "/resources" }, { label: "Forms and checklists" }]}
        kind="Forms and checklists"
        icon={<ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />}
        title="Get your documents ready"
        lead="Checklists for the most common requests, taken from the documentation requirements in our Service Charter. Tick items off as you go, then print the list or take it on your phone."
        meta={[
          { label: "Checklists", value: lists.length || PICK.length },
          { label: "Forms", value: forms.length },
          { label: "Source", value: "Service Charter" },
          { label: "Updated", value: "May 2026" },
        ]}
        actions={<>
          <button type="button" onClick={() => jump("checklists")} className={cn(pill, "bg-[#F4D27A] font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.9)] hover:bg-white", ring)}><ClipboardCheck className="h-4 w-4" aria-hidden="true" /> Start a checklist</button>
          <button type="button" onClick={() => jump("forms")} className={cn(pill, "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white hover:text-[#0B1F10]", ring)}><FileText className="h-4 w-4" aria-hidden="true" /> Download forms</button>
        </>}
      />

      <section id="checklists" aria-labelledby="cl-t" className={cn(sectionCls, "bg-[#F2F6F0]")}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="cl-t"
            eyebrow="Application checklists"
            title="What do you need to do?"
            highlight="need to do"
            action={
              <LayoutGroup id="who">
              <div role="radiogroup" aria-label="Who is this for" className="flex flex-wrap gap-2">
                {WHO.map((w) => (
                  <button key={w} type="button" role="radio" aria-checked={who === w} onClick={() => { setWho(w); const first = lists.find((l) => w === "All" || l.who.includes(w as Who)); if (first) setSel(first.id); }} className={cn("relative min-h-11 rounded-full px-4 text-sm font-semibold transition", ring, who === w ? "text-[#F4D27A]" : "bg-white text-[#0B1F10]/75 ring-1 ring-black/10 hover:text-[#0B1F10] hover:ring-[#117F21]/40")}>
                    {who === w && <motion.span layoutId="who-pill" className="absolute inset-0 rounded-full bg-[#0B1F10] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className="relative">{w}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            }
          />

          {cur && (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
              <ul className="space-y-2 lg:col-span-5" aria-label="Checklists">
                {shown.map((l, i) => {
                  const on = l.id === cur.id;
                  const n = (ticks[l.id] ?? []).length;
                  return (
                    <motion.li key={l.id} layout={!reduce} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                      <button type="button" onClick={() => setSel(l.id)} onMouseMove={spot} aria-pressed={on} className={cn("group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-3 text-left transition duration-300", ring, on ? cn(darkCard, "text-white shadow-[0_24px_50px_-28px_rgba(4,20,10,0.9)]") : cn("bg-white ring-1 ring-black/10 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(4,20,10,0.4)]", glowLight))}>
                        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold tabular-nums", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0B1F10] text-[#F4D27A]")}>{n === l.items.length ? <Check className="h-5 w-5" aria-hidden="true" /> : l.items.length}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug">{l.title}</span>
                          <span className={cn("block text-xs", on ? "text-white/70" : "text-[#0B1F10]/65")}>{l.who.join(" · ")}{n > 0 && ` · ${n} of ${l.items.length} ready`}</span>
                        </span>
                        <ArrowRight className={cn("h-4 w-4 shrink-0 transition duration-300", on ? "text-[#F4D27A]" : "-rotate-45 text-[#0B1F10]/40 group-hover:rotate-0 group-hover:text-[#117F21]")} aria-hidden="true" />
                        {n > 0 && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-black/5"><span className="block h-full origin-left bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500" style={{ transform: `scaleX(${n / l.items.length})` }} /></span>}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <AnimatePresence mode="wait">
                <motion.article key={cur.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3, ease }} aria-labelledby="cl-cur" className="lg:col-span-7">
                  <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-50px_rgba(4,20,10,0.55)] ring-1 ring-black/10">
                    <div onMouseMove={spot} className={cn("relative flex items-center gap-5 overflow-hidden p-6 text-white", darkCard)}>
                      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_80%_50%,black,transparent_70%)]" />
                      <div className="relative h-20 w-20 shrink-0 rounded-full shadow-[0_0_40px_-8px_rgba(244,210,122,0.45)]">
                        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
                          <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                          <motion.circle cx="36" cy="36" r={R} fill="none" stroke="#F4D27A" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - pct / 100) }} transition={{ duration: 0.6, ease }} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold tabular-nums text-[#F4D27A]" aria-live="polite">{pct}%</span>
                      </div>
                      <div className="relative min-w-0">
                        <h3 id="cl-cur" className="text-xl font-black leading-snug tracking-tight sm:text-2xl">{cur.title}</h3>
                        <p className="mt-1 text-sm text-white/70">{cur.std.dept}</p>
                        {cur.std.time && <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/15"><Clock className="h-3.5 w-3.5 text-[#F4D27A]" aria-hidden="true" />PenCom’s service standard: {cur.std.time}</p>}
                      </div>
                    </div>
                    <ul className="divide-y divide-[#0B1F10]/[0.07]">
                      {cur.items.map((it, i) => {
                        const on = done.includes(i);
                        return (
                          <li key={i}>
                            <label className={cn("flex cursor-pointer gap-4 px-6 py-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:-outline-offset-[3px] has-[:focus-visible]:outline-[#FFD84D]", on ? "bg-[#F2F6F0]" : "hover:bg-[#F2F6F0]/60")}>
                              <input type="checkbox" checked={on} onChange={() => toggle(i)} className="sr-only" />
                              <motion.span animate={{ scale: on ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.3 }} aria-hidden="true" className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition", on ? "border-[#117F21] bg-[#117F21] text-white" : "border-[#0B1F10]/30 bg-white")}>
                                {on && <Check className="h-4 w-4" strokeWidth={3} />}
                              </motion.span>
                              <span className={cn("text-[15px] leading-relaxed transition", on ? "text-[#0B1F10]/60 line-through decoration-[#117F21]/50" : "text-[#0B1F10]/90")}>{it}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex flex-wrap items-center gap-2 border-t border-[#0B1F10]/[0.07] p-5">
                      <button type="button" onClick={printList} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B1F10] px-5 text-sm font-semibold text-white transition hover:bg-[#117F21]", ring)}><Printer className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> Print checklist</button>
                      <button type="button" onClick={() => setTicks((t) => ({ ...t, [cur.id]: [] }))} disabled={!done.length} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0B1F10] ring-1 ring-black/15 transition hover:ring-[#117F21] disabled:opacity-40", ring)}><RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" aria-hidden="true" /> Start again</button>
                      <Link to="/about/service-charter#standards" className={cn("group ml-auto inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-[#0A4A13] hover:underline", ring)}>See it in the Service Charter <ArrowChip /></Link>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#0B1F10]/70">Your ticks are saved on this device only.</p>
                </motion.article>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <section id="forms" aria-labelledby="forms-t" className={cn(sectionCls, "bg-white")}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="forms-t"
            eyebrow="Forms"
            title="Official forms"
            highlight="forms"
            intro="Download, complete and submit as the form instructs. Most services now start online through the right portal."
            action={
              <label className="relative flex w-full max-w-sm items-center rounded-full bg-white p-1 shadow-[0_18px_40px_-28px_rgba(4,20,10,0.5)] ring-1 ring-black/15 transition focus-within:ring-[3px] focus-within:ring-[#FFD84D]">
              <span className="sr-only">Find a form</span>
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]"><Search className="h-4 w-4" /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a form" className="min-h-10 w-full min-w-0 bg-transparent px-3 text-[#0B1F10] placeholder:text-[#0B1F10]/55 focus:outline-none focus-visible:outline-none focus-visible:ring-0" />
            </label>
            }
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {fl.map((f, i) => (
              <motion.li key={f.pdf} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07, ease }}>
                <Tilt className="h-full">
                  <a href={f.pdf} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]", glowLight, ring)}>
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="flex items-center justify-between">
                      <span className={cn("flex h-12 w-11 flex-col items-center justify-center rounded-lg text-[10px] font-black text-white shadow", f.ext === "PDF" ? "bg-[#B52026]" : "bg-[#2E7DAF]")}><FileType className="h-4 w-4" aria-hidden="true" />{f.ext}</span>
                      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F6F0] text-[#0B1F10] transition duration-300 group-hover:bg-[#0B1F10] group-hover:text-[#F4D27A]"><Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /></span>
                    </span>
                    <span className="mt-5 block flex-1 font-bold leading-snug text-[#0B1F10]">{f.title}</span>
                    <span className="mt-3 block text-xs font-medium uppercase tracking-[0.14em] text-[#0B1F10]/60">Published {new Date(f.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Tilt>
              </motion.li>
            ))}
          </ul>
          <Rise className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <VerifyNote>Checklists reproduce the documentation requirements in the revised Service Charter (May 2026). Your PFA or the relevant PenCom department may ask for more in particular cases.</VerifyNote>
            <Link to="/services#portals" onMouseMove={spot} className={cn("group flex items-center justify-between gap-4 rounded-3xl p-6 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.6)]", darkCard, ring)}>
              <span><span className="block text-lg font-black tracking-tight">Applying online?</span><span className="mt-1 block text-sm text-white/70">Find the right portal: eHub, PCRS, PENCAP and more</span></span>
              <ArrowChip dark />
            </Link>
          </Rise>
        </div>
      </section>
      </div>
    </MotionConfig>
  );
}
