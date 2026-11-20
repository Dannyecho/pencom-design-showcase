"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ClipboardCheck, Clock, Download, FileText, FileType, Printer, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tilt, ease } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { forms } from "@/views/resources/publications";
import { splitReq } from "@/views/charter/splitReq";
import charter from "@/views/charter/charter.json";
import { DocHero, VerifyNote, ring } from "@/views/docs/kit";

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
          <button type="button" onClick={() => jump("checklists")} className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#CB9615] px-5 font-semibold text-[#1A1206] shadow-[0_15px_40px_-15px_rgba(203,150,21,0.9)] hover:bg-[#E0AA22]", ring)}><ClipboardCheck className="h-4 w-4" aria-hidden="true" /> Start a checklist</button>
          <button type="button" onClick={() => jump("forms")} className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 hover:ring-[#117F21]", ring)}><FileText className="h-4 w-4" aria-hidden="true" /> Download forms</button>
        </>}
      />

      <section id="checklists" aria-labelledby="cl-t" className="scroll-mt-[160px] bg-[#F2F6F0] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            id="cl-t"
            eyebrow="Application checklists"
            title="What do you need to do?"
            highlight="need to do"
            action={
              <LayoutGroup id="who">
              <div role="radiogroup" aria-label="Who is this for" className="flex flex-wrap gap-2">
                {WHO.map((w) => (
                  <button key={w} type="button" role="radio" aria-checked={who === w} onClick={() => { setWho(w); const first = lists.find((l) => w === "All" || l.who.includes(w as Who)); if (first) setSel(first.id); }} className={cn("relative min-h-10 rounded-full px-4 text-sm font-semibold transition", ring, who === w ? "text-white" : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-[#117F21]")}>
                    {who === w && <motion.span layoutId="who-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0A4A13] to-[#117F21]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
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
                    <motion.li key={l.id} layout={!reduce} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <button type="button" onClick={() => setSel(l.id)} aria-pressed={on} className={cn("group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition", ring, on ? "bg-[#0A4A13] text-white shadow-lg" : "bg-white ring-1 ring-gray-200 hover:ring-[#117F21]/40")}>
                        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold", on ? "bg-[#F4D27A] text-[#0A4A13]" : "bg-[#E8F5E9] text-[#117F21]")}>{n === l.items.length ? <Check className="h-5 w-5" aria-hidden="true" /> : l.items.length}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug">{l.title}</span>
                          <span className={cn("block text-xs", on ? "text-white/60" : "text-gray-500")}>{l.who.join(" · ")}{n > 0 && ` · ${n} of ${l.items.length} ready`}</span>
                        </span>
                        <ArrowRight className={cn("h-4 w-4 shrink-0 transition", on ? "text-[#F4D27A]" : "text-gray-300 group-hover:translate-x-1 group-hover:text-[#117F21]")} aria-hidden="true" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>

              <AnimatePresence mode="wait">
                <motion.article key={cur.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3, ease }} aria-labelledby="cl-cur" className="lg:col-span-7">
                  <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-black/5 shadow-[0_40px_80px_-50px_rgba(10,74,19,0.5)]">
                    <div className="flex items-center gap-5 bg-gradient-to-r from-[#0A4A13] to-[#117F21] p-6 text-white">
                      <div className="relative h-20 w-20 shrink-0">
                        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
                          <circle cx="36" cy="36" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
                          <motion.circle cx="36" cy="36" r={R} fill="none" stroke="#F4D27A" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - pct / 100) }} transition={{ duration: 0.6, ease }} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold" aria-live="polite">{pct}%</span>
                      </div>
                      <div className="min-w-0">
                        <h3 id="cl-cur" className="text-xl font-bold leading-snug">{cur.title}</h3>
                        <p className="mt-1 text-sm text-white/65">{cur.std.dept}</p>
                        {cur.std.time && <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold"><Clock className="h-3.5 w-3.5 text-[#F4D27A]" aria-hidden="true" />PenCom’s service standard: {cur.std.time}</p>}
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {cur.items.map((it, i) => {
                        const on = done.includes(i);
                        return (
                          <li key={i}>
                            <label className={cn("flex cursor-pointer gap-4 px-6 py-4 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:-outline-offset-[3px] has-[:focus-visible]:outline-[#FFD84D]", on ? "bg-[#F4FAF3]" : "hover:bg-gray-50")}>
                              <input type="checkbox" checked={on} onChange={() => toggle(i)} className="sr-only" />
                              <motion.span animate={{ scale: on ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.3 }} aria-hidden="true" className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition", on ? "border-[#117F21] bg-[#117F21] text-white" : "border-gray-300 bg-white")}>
                                {on && <Check className="h-4 w-4" strokeWidth={3} />}
                              </motion.span>
                              <span className={cn("text-[15px] leading-relaxed transition", on ? "text-gray-500 line-through decoration-[#117F21]/50" : "text-gray-800")}>{it}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="flex flex-wrap gap-2 border-t border-gray-100 p-5">
                      <button type="button" onClick={printList} className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white hover:bg-[#0A4A13]", ring)}><Printer className="h-4 w-4" aria-hidden="true" /> Print checklist</button>
                      <button type="button" onClick={() => setTicks((t) => ({ ...t, [cur.id]: [] }))} disabled={!done.length} className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-700 hover:border-[#117F21] disabled:opacity-40", ring)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Start again</button>
                      <Link to="/about/service-charter#standards" className={cn("ml-auto inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#117F21] hover:underline", ring)}>See it in the Service Charter <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">Your ticks are saved on this device only.</p>
                </motion.article>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <section id="forms" aria-labelledby="forms-t" className="scroll-mt-[160px] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            id="forms-t"
            eyebrow="Forms"
            title="Official forms"
            highlight="forms"
            intro="Download, complete and submit as the form instructs. Most services now start online through the right portal."
            action={
              <label className="relative w-full max-w-sm">
              <span className="sr-only">Find a form</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a form" className="min-h-12 w-full rounded-2xl border border-gray-300 pl-12 pr-4 focus:border-[#117F21] focus:outline-none focus:ring-4 focus:ring-[#117F21]/15" />
            </label>
            }
          />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {fl.map((f, i) => (
              <motion.li key={f.pdf} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07, ease }}>
                <Tilt className="h-full">
                  <a href={f.pdf} target="_blank" rel="noopener noreferrer" className={cn("group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-black/5 transition hover:ring-[#117F21]/40 hover:shadow-[0_24px_50px_-30px_rgba(10,74,19,0.45)]", ring)}>
                    <span className="flex items-center justify-between">
                      <span className={cn("flex h-12 w-11 flex-col items-center justify-center rounded-lg text-[10px] font-black text-white shadow", f.ext === "PDF" ? "bg-[#B52026]" : "bg-[#2E7DAF]")}><FileType className="h-4 w-4" aria-hidden="true" />{f.ext}</span>
                      <Download className="h-5 w-5 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:text-[#117F21]" aria-hidden="true" />
                    </span>
                    <span className="mt-5 block flex-1 font-semibold leading-snug text-[#0A2E10] group-hover:text-[#117F21]">{f.title}</span>
                    <span className="mt-3 block text-xs text-gray-500">Published {new Date(f.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </Tilt>
              </motion.li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <VerifyNote>Checklists reproduce the documentation requirements in the revised Service Charter (May 2026). Your PFA or the relevant PenCom department may ask for more in particular cases.</VerifyNote>
            <Link to="/services#portals" className={cn("group flex items-center justify-between gap-4 rounded-3xl bg-[#0A4A13] p-6 text-white", ring)}>
              <span><span className="block font-bold">Applying online?</span><span className="block text-sm text-white/65">Find the right portal: eHub, PCRS, PENCAP and more</span></span>
              <ArrowRight className="h-5 w-5 text-[#F4D27A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      </div>
    </MotionConfig>
  );
}
