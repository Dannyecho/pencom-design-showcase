"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Check, Clock, Landmark, MapPin, Navigation, Phone, Search, Video, Mic, Newspaper, Image as ImageIcon, Megaphone } from "lucide-react";
import { latestNews } from "@/lib/data";
import { newsPath } from "@/views/news/data";
import { cn } from "@/lib/utils";
import { Spotlight, ease, reveal } from "@/views/about/primitives";
import { SectionHeading } from "@/views/theme/heading";
import { abuja, allStates, headOffice, offices, social, topics } from "./data";
import { loadCases } from "./CaseForm";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

/* ─────────────────────────── Case tracker ─────────────────────────── */

const STAGES = ["Received", "Assigned to a team", "Under review", "Resolved"];

export function Tracker({ prefill }: { prefill: string | null }) {
  const [ref, setRef] = useState("");
  const [result, setResult] = useState<null | { ref: string; stage: number; date: string; topic: string; sample?: boolean } | "none">(null);
  const reduce = useReducedMotion();

  const look = (r: string) => {
    const q = r.trim().toUpperCase();
    if (!q) return;
    if (q === "PC-SAMPLE") {
      setResult({ ref: q, stage: 2, date: new Date(Date.now() - 6 * 864e5).toISOString(), topic: "Complain about a PFA", sample: true });
      return;
    }
    const c = loadCases().find((x) => x.ref === q);
    setResult(c ? { ref: c.ref, stage: 0, date: c.date, topic: topics.find((t) => t.id === c.topic)?.label ?? "" } : "none");
  };

  useEffect(() => {
    if (prefill) {
      setRef(prefill);
      look(prefill);
    }
  }, [prefill]);

  return (
    <section id="track" aria-labelledby="track-title" className="relative isolate scroll-mt-[160px] overflow-hidden bg-[#04140A] py-20 text-white sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.26),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(46,145,61,0.38),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div aria-hidden="true" className="absolute -right-32 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#117F21]/40 blur-[140px]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading stacked id="track-title" dark eyebrow="Case tracker" title="Track your case" highlight="your case" intro="Enter the reference we gave you. No sign-in needed." />
          <form role="search" onSubmit={(e) => { e.preventDefault(); look(ref); }} className="mt-8 flex gap-2 rounded-2xl bg-white p-2">
            <label htmlFor="track-ref" className="sr-only">Case reference</label>
            <input id="track-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. PC-2611-AB12C" autoComplete="off" className="min-h-12 w-full rounded-xl px-3 font-mono uppercase text-gray-900 placeholder:font-sans placeholder:normal-case placeholder:text-gray-400 focus:outline-none" />
            <button type="submit" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#117F21] px-5 font-semibold text-white hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
              <Search className="h-4 w-4" aria-hidden="true" /> Track
            </button>
          </form>
          <p className="mt-3 text-sm text-white/55">
            Want to see how it works?{" "}
            <button type="button" onClick={() => { setRef("PC-SAMPLE"); look("PC-SAMPLE"); }} className="font-semibold text-[#F4D27A] underline underline-offset-2">Try a sample case</button>
          </p>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait">
            {result === null && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-56 items-center justify-center rounded-[2rem] border border-dashed border-white/20 p-8 text-center text-white/50">
                Your case progress will appear here.
              </motion.div>
            )}
            {result === "none" && (
              <motion.div key="none" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[2rem] border border-[#B52026]/50 bg-[#B52026]/15 p-8">
                <p className="text-lg font-bold">We couldn’t find that reference.</p>
                <p className="mt-1 text-white/70">Check it matches the one in your confirmation, including the dashes. Still stuck? Call {headOffice.phone}.</p>
              </motion.div>
            )}
            {result && result !== "none" && (
              <motion.div key={result.ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="rounded-[2rem] border border-white/15 bg-white/[0.07] p-7 backdrop-blur sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xl font-bold text-[#F4D27A]">{result.ref}</p>
                    <p className="text-sm text-white/65">{result.topic} · opened {fmt(result.date)}</p>
                  </div>
                  {result.sample && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">Sample</span>}
                </div>
                <ol className="mt-8 space-y-0">
                  {STAGES.map((s, i) => {
                    const state = i < result.stage ? "done" : i === result.stage ? "now" : "next";
                    return (
                      <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
                        {i < STAGES.length - 1 && (
                          <span aria-hidden="true" className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5 bg-white/15">
                            <motion.span className="block w-full origin-top bg-[#F4D27A]" initial={{ height: 0 }} animate={{ height: i < result.stage ? "100%" : "0%" }} transition={{ duration: reduce ? 0 : 0.5, delay: 0.2 + i * 0.25 }} />
                          </span>
                        )}
                        <motion.span initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.2 }} className={cn("relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2", state === "done" ? "border-[#F4D27A] bg-[#F4D27A] text-[#0A4A13]" : state === "now" ? "border-[#F4D27A] bg-[#0A4A13] text-[#F4D27A]" : "border-white/20 text-white/40")}>
                          {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : state === "now" ? <Clock className="h-4 w-4" aria-hidden="true" /> : <span className="text-xs font-bold">{i + 1}</span>}
                          {state === "now" && !reduce && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border-2 border-[#F4D27A]/60 [animation-iteration-count:3]" />}
                        </motion.span>
                        <div className="pt-1.5">
                          <p className={cn("font-semibold", state === "next" && "text-white/45")}>{s}</p>
                          <p className="text-sm text-white/55">{state === "done" ? "Complete" : state === "now" ? "In progress" : "Not started"}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {result.sample && <p className="mt-6 text-xs text-white/50">This is example data. Real case statuses will come from PenCom’s case management system.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Zonal offices ─────────────────────────── */

export function Offices() {
  const [state, setState] = useState("");
  const [sel, setSel] = useState<string>("hq");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!state) return;
    if (state.startsWith("FCT")) setSel("hq");
    else setSel(offices.find((o) => o.states.includes(state))?.id ?? "hq");
  }, [state]);

  const office = offices.find((o) => o.id === sel);
  const card = office
    ? { title: `${office.zone} zonal office`, city: office.city, address: office.address, phone: office.phone, confirm: office.confirm, states: office.states }
    : { title: "Head office", city: "Abuja", address: headOffice.address, phone: headOffice.phone, confirm: false, states: ["FCT (Abuja)", "and anywhere in Nigeria"] };

  const pins = useMemo(() => [{ id: "hq", city: "Abuja", x: abuja.x, y: abuja.y, hq: true }, ...offices.map((o) => ({ id: o.id, city: o.city, x: o.x, y: o.y, hq: false }))], []);

  return (
    <section id="zonal-offices" aria-labelledby="offices-title" className="scroll-mt-[160px] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="offices-title"
          eyebrow="Visit us"
          title="Find your nearest office"
          highlight="nearest office"
          intro="Choose your state and we’ll show you the office that serves it, or pick a pin on the map."
          action={
            <label className="w-full max-w-xs">
            <span className="text-sm font-semibold text-[#0A2E10]">I live in</span>
            <select value={state} onChange={(e) => setState(e.target.value)} className="mt-1.5 min-h-12 w-full rounded-xl border border-gray-300 bg-white shadow-sm px-4 font-semibold focus:border-[#117F21] focus:outline-none focus:ring-4 focus:ring-[#117F21]/15">
              <option value="">Choose your state</option>
              {allStates.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Map */}
          <motion.div {...reveal} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#E8F5E9] via-[#F4F7F2] to-white p-6 ring-1 ring-gray-200 lg:col-span-7">
            <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(17,127,33,0.16) 1.2px, transparent 1.2px)", backgroundSize: "18px 18px" }} />
            <div aria-hidden="true" className="absolute left-[12%] top-[10%] h-[80%] w-[76%] rounded-[45%_55%_48%_52%/52%_45%_55%_48%] bg-[#117F21]/[0.07] ring-1 ring-[#117F21]/10" />
            <ul className="relative mx-auto aspect-[0.95] w-full max-w-2xl sm:aspect-[1.25]" aria-label="Office locations">
              {pins.map((p) => {
                const on = sel === p.id;
                return (
                  <li key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${8 + p.x * 0.84}%`, top: `${6 + p.y * 0.86}%` }}>
                    <button type="button" onClick={() => setSel(p.id)} aria-pressed={on} className="group relative flex flex-col items-center focus-visible:outline-none">
                      {on && !reduce && <span aria-hidden="true" className="absolute top-0 h-9 w-9 animate-ping sm:h-11 sm:w-11 rounded-full bg-[#117F21]/30 [animation-iteration-count:3]" />}
                      <motion.span animate={{ scale: on ? 1.15 : 1 }} className={cn("relative flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-[3px] sm:h-11 sm:w-11 sm:ring-4 transition group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-[#FFD84D]", on ? "bg-[#117F21] text-white ring-white" : p.hq ? "bg-[#CB9615] text-white ring-white/80" : "bg-white text-[#117F21] ring-[#117F21]/20 group-hover:bg-[#E8F5E9]")}>
                        {p.hq ? <Landmark className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <MapPin className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
                      </motion.span>
                      <span className={cn("mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm sm:mt-1.5 sm:px-2.5 sm:text-xs", on ? "bg-[#0A4A13] text-[#F4D27A]" : "bg-white text-[#0A2E10]")}>
                        {p.city}{p.hq && " (HQ)"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="relative mt-2 text-center text-xs text-gray-500">Schematic map. Pins show approximate locations.</p>
            <div className="relative mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
              {pins.map((p) => (
                <button key={p.id} type="button" onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className={cn("min-h-10 rounded-full px-3.5 text-sm font-semibold transition", sel === p.id ? "bg-[#117F21] text-white" : "bg-white text-[#0A2E10] ring-1 ring-gray-200")}>
                  {p.city}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Office card */}
          <div className="lg:col-span-5" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article key={sel} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -16 }} transition={{ duration: 0.3, ease }} className="relative h-full overflow-hidden rounded-[2rem] bg-[#0A4A13] p-7 text-white sm:p-9">
                <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">{card.title}</p>
                <h3 className="relative mt-2 text-4xl font-black">{card.city}</h3>
                <ul className="relative mt-6 space-y-4">
                  <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B9F0C2]" aria-hidden="true" /><span>{card.address}</span></li>
                  {card.phone && (
                    <li className="flex gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#B9F0C2]" aria-hidden="true" />
                      <span>
                        <a href={`tel:${card.phone.replace(/\s/g, "")}`} className="font-semibold underline-offset-2 hover:underline">{card.phone}</a>
                        {card.confirm && <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">To be confirmed</span>}
                      </span>
                    </li>
                  )}
                </ul>
                <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Serves</p>
                <ul className="relative mt-2 flex flex-wrap gap-1.5">
                  {card.states.map((s) => (
                    <li key={s} className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", s === state ? "bg-[#F4D27A] text-[#0A4A13]" : "bg-white/10 text-white/85")}>{s}</li>
                  ))}
                </ul>
                <a href={mapsUrl(card.address)} target="_blank" rel="noopener noreferrer" className="relative mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-5 font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                  <span className="sr-only">(opens Google Maps in a new tab)</span>
                </a>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── News and media centre ─────────────────────────── */

const media = [
  { k: "Press releases", icon: Megaphone },
  { k: "Speeches", icon: Mic },
  { k: "Events", icon: Calendar },
  { k: "Photos", icon: ImageIcon, to: "/media#photos" },
  { k: "Videos", icon: Video, to: "/media#videos" },
  { k: "In the news", icon: Newspaper },
];

export function Newsroom() {
  const [lead, ...rest] = latestNews.slice(0, 4);
  return (
    <section id="news" aria-labelledby="news-title" className="scroll-mt-[160px] bg-[#F2F6F0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading id="news-title" eyebrow="News and media" title="Newsroom" intro="Press releases, statements, speeches, events, photos and videos from the Commission." />

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Media centre sections">
          {media.map((m) => (
            <li key={m.k}>
              {"to" in m && m.to ? (
                <Link to={m.to} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#117F21]/40 bg-[#E8F5E9] px-4 text-sm font-semibold text-[#0A4A13] transition hover:bg-[#117F21] hover:text-white">
                  <m.icon className="h-4 w-4" aria-hidden="true" /> {m.k} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700">
                  <m.icon className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> {m.k}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <motion.article {...reveal} className="lg:col-span-7">
            <Link to={newsPath(lead)} className="group relative block h-full min-h-[380px] overflow-hidden rounded-[2rem] bg-[#0A4A13] text-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
              <img src={lead.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-[1.2s] group-hover:scale-105" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0A4A13] via-[#0A4A13]/50 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <span className="flex items-center gap-3 text-xs"><span className="rounded-full bg-[#CB9615] px-2.5 py-1 font-bold uppercase tracking-wider text-[#1A1206]">{lead.category}</span><span className="text-white/70">{fmt(lead.date)}</span></span>
                <span className="mt-4 block text-2xl font-bold leading-tight sm:text-3xl">{lead.title}</span>
                <span className="mt-3 block max-w-xl text-white/75">{lead.excerpt}</span>
              </span>
            </Link>
          </motion.article>
          <div className="grid grid-cols-1 gap-5 lg:col-span-5">
            {rest.map((n, i) => (
              <motion.article key={n.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1, ease }}>
                <Link to={newsPath(n)} className="group flex h-full gap-4 rounded-3xl bg-white p-3 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <span className="relative block flex-none overflow-hidden rounded-2xl bg-gray-100" style={{ width: "clamp(7rem, 32%, 10rem)" }}>
                    <img src={n.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  </span>
                  <span className="py-2 pr-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#117F21]">{n.category} · <span className="font-normal normal-case text-gray-500">{fmt(n.date)}</span></span>
                    <span className="mt-1 block font-semibold leading-snug text-[#0A2E10] group-hover:text-[#117F21]">{n.title}</span>
                  </span>
                </Link>
              </motion.article>
            ))}
            <Spotlight color="rgba(244,210,122,0.2)" className="rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-6 text-white">
              <p className="font-bold">Media enquiries</p>
              <p className="mt-1 text-sm text-white/75">Journalists can contact Corporate Communications at <a href={`mailto:${headOffice.email}`} className="font-semibold underline">{headOffice.email}</a>.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {social.map((s) => (
                  <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-full bg-white/10 px-3 text-xs font-semibold hover:bg-white/20">{s.name}<ArrowRight className="h-3 w-3 -rotate-45" aria-hidden="true" /></a></li>
                ))}
              </ul>
            </Spotlight>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-500">News items are placeholders until the newsroom is connected to the CMS.</p>
          <Link to="/news" className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white transition hover:bg-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
            Open the newsroom
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
