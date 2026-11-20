"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Calendar, Check, Clock, Landmark, MapPin, Navigation, Phone, Search, Video, Mic, Newspaper, Image as ImageIcon, Megaphone } from "lucide-react";
import { latestNews } from "@/lib/data";
import { newsPath } from "@/views/news/data";
import { cn } from "@/lib/utils";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { DarkBackdrop, Rise, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { abuja, allStates, headOffice, offices, social, topics } from "./data";
import { loadCases } from "./CaseForm";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]";
const chip = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45";

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
    <section id="track" aria-labelledby="track-title" className={cn("relative isolate bg-[#04140A] text-white", sectionCls)}>
      <DarkBackdrop />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading stacked id="track-title" dark eyebrow="Case tracker" title="Track your case" highlight="your case" intro="Enter the reference we gave you. No sign-in needed." />
          {/* Search pill: gold-to-green edge, pointer glow, focus ring on the pill (not inside it) */}
          <div className="relative mt-8 rounded-full p-px [background-image:linear-gradient(120deg,rgba(244,210,122,0.9),rgba(255,255,255,0.15),rgba(17,127,33,0.8))] has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#FFD84D]">
            <form role="search" onMouseMove={spot} onSubmit={(e) => { e.preventDefault(); look(ref); }} className={cn("flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]", glowLight)}>
              <Search className="hidden h-5 w-5 shrink-0 text-[#117F21] sm:block" aria-hidden="true" />
              <label htmlFor="track-ref" className="sr-only">Case reference</label>
              <input id="track-ref" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. PC-2611-AB12C" autoComplete="off" className="min-h-12 w-full min-w-0 bg-transparent font-mono uppercase text-[#0B1F10] placeholder:font-sans placeholder:normal-case placeholder:text-gray-600 focus:outline-none focus-visible:ring-0" />
              <button type="submit" className={cn("group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                Track
                <span aria-hidden="true" className={cn(chip, "h-9 w-9 bg-[#F4D27A] text-[#1A1206]")}><ArrowUpRight className="h-4 w-4" /></span>
              </button>
            </form>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Want to see how it works?{" "}
            <button type="button" onClick={() => { setRef("PC-SAMPLE"); look("PC-SAMPLE"); }} className={cn("inline-flex min-h-11 items-center rounded font-semibold text-[#F4D27A] underline underline-offset-4 hover:text-white", focus)}>Try a sample case</button>
          </p>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait">
            {result === null && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full min-h-56 flex-col items-center justify-center gap-4 rounded-[1.75rem] border border-dashed border-white/25 p-8 text-center text-white/70">
                <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.07] text-[#F4D27A] ring-1 ring-white/15"><Search className="h-6 w-6" /></span>
                Your case progress will appear here.
              </motion.div>
            )}
            {result === "none" && (
              <motion.div key="none" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[1.75rem] border border-[#F28B8F]/50 bg-[#B52026]/20 p-8">
                <p className="text-lg font-bold">We couldn’t find that reference.</p>
                <p className="mt-1 text-white/80">Check it matches the one in your confirmation, including the dashes. Still stuck? Call {headOffice.phone}.</p>
              </motion.div>
            )}
            {result && result !== "none" && (
              <motion.div key={result.ref} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} onMouseMove={spot} className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 backdrop-blur [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_50%)] sm:p-9">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/80 to-transparent" />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xl font-bold text-[#F4D27A]">{result.ref}</p>
                    <p className="mt-1 text-sm text-white/75">{result.topic} · opened {fmt(result.date)}</p>
                  </div>
                  {result.sample && <span className="rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1A1206]">Sample</span>}
                </div>
                <ol className="mt-8 space-y-0">
                  {STAGES.map((s, i) => {
                    const state = i < result.stage ? "done" : i === result.stage ? "now" : "next";
                    return (
                      <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
                        {i < STAGES.length - 1 && (
                          <span aria-hidden="true" className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-0.5 bg-white/15">
                            <motion.span className="block w-full origin-top bg-gradient-to-b from-[#F4D27A] to-[#2E913D]" initial={{ height: 0 }} animate={{ height: i < result.stage ? "100%" : "0%" }} transition={{ duration: reduce ? 0 : 0.5, delay: 0.2 + i * 0.25 }} />
                          </span>
                        )}
                        <motion.span initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.2 }} className={cn("relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2", state === "done" ? "border-[#F4D27A] bg-[#F4D27A] text-[#1A1206]" : state === "now" ? "border-[#F4D27A] bg-[#0B1F10] text-[#F4D27A] shadow-[0_0_24px_rgba(244,210,122,0.45)]" : "border-white/25 text-white/60")}>
                          {state === "done" ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : state === "now" ? <Clock className="h-4 w-4" aria-hidden="true" /> : <span className="font-mono text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>}
                          {state === "now" && !reduce && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full border-2 border-[#F4D27A]/60 [animation-iteration-count:3]" />}
                        </motion.span>
                        <div className="pt-1.5">
                          <p className={cn("font-semibold", state === "next" && "text-white/60")}>{s}</p>
                          <p className="text-sm text-white/70">{state === "done" ? "Complete" : state === "now" ? "In progress" : "Not started"}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                {result.sample && <p className="mt-6 text-xs text-white/65">This is example data. Real case statuses will come from PenCom’s case management system.</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Zonal offices ─────────────────────────── */

/** Map positions (percent of the map box) from the office data. */
const px = (x: number) => 8 + x * 0.84;
const py = (y: number) => 6 + y * 0.86;

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
    <section id="zonal-offices" aria-labelledby="offices-title" className={cn("bg-white", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="offices-title"
          eyebrow="Visit us"
          title="Find your nearest office"
          highlight="nearest office"
          intro="Choose your state and we’ll show you the office that serves it, or pick a pin on the map."
          action={
            <label className="block w-full max-w-xs">
              <span className="text-sm font-semibold text-[#0B1F10]">I live in</span>
              <select value={state} onChange={(e) => setState(e.target.value)} className={cn("mt-1.5 min-h-12 w-full cursor-pointer rounded-full bg-white px-5 font-semibold text-[#0B1F10] shadow-[0_14px_30px_-20px_rgba(4,20,10,0.5)] ring-1 ring-black/10 transition hover:ring-[#117F21]/50", focus)}>
                <option value="">Choose your state</option>
                {allStates.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Map */}
          <Rise className="lg:col-span-7">
            <div onMouseMove={spot} className={cn("relative h-full overflow-hidden rounded-[1.75rem] bg-[#F2F6F0] p-6 ring-1 ring-black/10", glowLight)}>
              <div aria-hidden="true" className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(17,127,33,0.16) 1.2px, transparent 1.2px)", backgroundSize: "18px 18px" }} />
              <div aria-hidden="true" className="absolute left-[12%] top-[10%] h-[80%] w-[76%] rounded-[45%_55%_48%_52%/52%_45%_55%_48%] bg-white/70 ring-1 ring-[#117F21]/15" />
              <div className="relative mx-auto aspect-[0.95] w-full max-w-2xl sm:aspect-[1.25]">
                {/* Route from the head office to the chosen zonal office */}
                <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="office-route" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#CB9615" />
                      <stop offset="100%" stopColor="#117F21" />
                    </linearGradient>
                  </defs>
                  {office && (
                    <motion.path
                      key={office.id}
                      d={`M ${px(abuja.x)} ${py(abuja.y)} L ${px(office.x)} ${py(office.y)}`}
                      fill="none"
                      stroke="url(#office-route)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.7, ease }}
                    />
                  )}
                </svg>
                <ul className="absolute inset-0" aria-label="Office locations">
                  {pins.map((p) => {
                    const on = sel === p.id;
                    return (
                      <li key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${px(p.x)}%`, top: `${py(p.y)}%` }}>
                        <button type="button" onClick={() => setSel(p.id)} aria-pressed={on} className="group relative flex flex-col items-center focus-visible:outline-none">
                          {on && !reduce && <span aria-hidden="true" className="absolute top-0 h-9 w-9 animate-ping rounded-full bg-[#CB9615]/35 [animation-iteration-count:3] sm:h-11 sm:w-11" />}
                          <motion.span animate={{ scale: on ? 1.15 : 1 }} className={cn("relative flex h-9 w-9 items-center justify-center rounded-full shadow-[0_12px_24px_-10px_rgba(4,20,10,0.6)] ring-[3px] transition group-hover:-translate-y-0.5 group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-[#FFD84D] sm:h-11 sm:w-11 sm:ring-4", on ? "bg-[#0B1F10] text-[#F4D27A] ring-[#F4D27A]" : p.hq ? "bg-[#F4D27A] text-[#1A1206] ring-white" : "bg-white text-[#117F21] ring-[#117F21]/25 group-hover:bg-[#E8F5E9]")}>
                            {p.hq ? <Landmark className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" /> : <MapPin className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />}
                          </motion.span>
                          <span className={cn("mt-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm ring-1 sm:mt-1.5 sm:px-2.5 sm:text-xs", on ? "bg-[#0B1F10] text-[#F4D27A] ring-[#0B1F10]" : "bg-white text-[#0B1F10] ring-black/10")}>
                            {p.city}{p.hq && " (HQ)"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="relative mt-2 text-center text-xs text-gray-600">Schematic map. Pins show approximate locations.</p>
              <div className="relative mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
                {pins.map((p) => (
                  <button key={p.id} type="button" onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className={cn("min-h-11 rounded-full px-4 text-sm font-semibold transition", sel === p.id ? "bg-[#0B1F10] text-[#F4D27A]" : "bg-white text-[#0B1F10] ring-1 ring-black/10", focus)}>
                    {p.city}
                  </button>
                ))}
              </div>
            </div>
          </Rise>

          {/* Office card */}
          <div className="lg:col-span-5" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article key={sel} onMouseMove={spot} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -16 }} transition={{ duration: 0.3, ease }} className={cn("relative isolate h-full overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_40px_80px_-40px_rgba(4,20,10,0.8)] sm:p-9", darkCard)}>
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-4 right-3 -z-10 select-none text-[5.5rem] font-black uppercase leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.18)] sm:text-[7rem]">{card.city}</span>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206]">
                  {office ? <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> : <Landmark className="h-3.5 w-3.5" aria-hidden="true" />}
                  {card.title}
                </p>
                <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{card.city}</h3>
                <ul className="mt-6 space-y-4">
                  <li className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F4D27A] ring-1 ring-white/15"><MapPin className="h-4 w-4" aria-hidden="true" /></span>
                    <span className="pt-1.5">{card.address}</span>
                  </li>
                  {card.phone && (
                    <li className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F4D27A] ring-1 ring-white/15"><Phone className="h-4 w-4" aria-hidden="true" /></span>
                      <span className="pt-1.5">
                        <a href={`tel:${card.phone.replace(/\s/g, "")}`} className={cn("rounded font-semibold underline-offset-4 hover:underline", focus)}>{card.phone}</a>
                        {card.confirm && <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">To be confirmed</span>}
                      </span>
                    </li>
                  )}
                </ul>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">Serves</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {card.states.map((s) => (
                    <li key={s} className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", s === state ? "bg-[#F4D27A] text-[#1A1206]" : "bg-white/10 text-white/85 ring-1 ring-white/10")}>{s}</li>
                  ))}
                </ul>
                <a href={mapsUrl(card.address)} target="_blank" rel="noopener noreferrer" className={cn("group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]", focus)}>
                  <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                  <span className="sr-only">(opens Google Maps in a new tab)</span>
                  <span aria-hidden="true" className={cn(chip, "bg-[#0B1F10] text-[#F4D27A]")}><ArrowUpRight className="h-4 w-4" /></span>
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
    <section id="news" aria-labelledby="news-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="news-title"
          eyebrow="News and media"
          title="Newsroom"
          intro="Press releases, statements, speeches, events, photos and videos from the Commission."
          action={
            <Link to="/news" className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              Open the newsroom
              <span aria-hidden="true" className={cn(chip, "h-9 w-9 bg-[#F4D27A] text-[#1A1206]")}><ArrowUpRight className="h-4 w-4" /></span>
            </Link>
          }
        />

        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Media centre sections">
          {media.map((m) => (
            <li key={m.k}>
              {"to" in m && m.to ? (
                <Link to={m.to} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B1F10] py-1 pl-4 pr-1 text-sm font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                  <m.icon className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> {m.k}
                  <span aria-hidden="true" className={cn(chip, "bg-white/10 text-[#F4D27A]")}><ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
              ) : (
                <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#0B1F10] ring-1 ring-black/10">
                  <m.icon className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> {m.k}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Rise className="lg:col-span-7">
            <article className="h-full">
              <Link to={newsPath(lead)} className={cn("group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-[#04140A] text-white", focus)}>
                <img src={lead.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04140A] via-[#04140A]/55 to-transparent" />
                <span className="relative p-7 sm:p-9">
                  <span className="flex items-center gap-3 text-xs"><span className="rounded-full bg-[#F4D27A] px-3 py-1 font-bold uppercase tracking-wider text-[#1A1206]">{lead.category}</span><span className="text-white/80">{fmt(lead.date)}</span></span>
                  <span className="mt-4 block text-2xl font-black leading-tight tracking-tight sm:text-3xl">{lead.title}</span>
                  <span className="mt-3 line-clamp-2 block max-w-xl text-white/80">{lead.excerpt}</span>
                  <span className="mt-5 inline-flex"><ArrowChip dark /></span>
                </span>
              </Link>
            </article>
          </Rise>
          <div className="grid grid-cols-1 gap-5 lg:col-span-5">
            {rest.map((n, i) => (
              <Rise key={n.id} delay={0.08 * (i + 1)}>
                <article className="h-full">
                  <Link to={newsPath(n)} onMouseMove={spot} className={cn("group flex h-full gap-4 rounded-[1.75rem] bg-white p-3 ring-1 ring-black/10", glowLight, lift, focus)}>
                    <span className="relative block min-h-28 flex-none overflow-hidden rounded-[1.3rem] bg-gray-100" style={{ width: "clamp(7rem, 32%, 10rem)" }}>
                      <img src={n.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#117F21]">{n.category} · <span className="font-normal normal-case text-gray-600">{fmt(n.date)}</span></span>
                      <span className="mt-1 block font-bold leading-snug text-[#0B1F10] transition group-hover:text-[#117F21]">{n.title}</span>
                    </span>
                  </Link>
                </article>
              </Rise>
            ))}
            <Rise delay={0.32}>
              <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-[1.75rem] p-6 text-white", darkCard)}>
                <Megaphone aria-hidden="true" className="absolute -bottom-5 -right-3 h-24 w-24 -rotate-12 text-white/[0.06]" />
                <p className="relative font-bold">Media enquiries</p>
                <p className="relative mt-1 text-sm text-white/80">Journalists can contact Corporate Communications at <a href={`mailto:${headOffice.email}`} className={cn("rounded font-semibold text-[#F4D27A] underline underline-offset-2", focus)}>{headOffice.email}</a>.</p>
                <ul className="relative mt-4 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex min-h-9 items-center gap-1 rounded-full bg-white/10 px-3 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)}>{s.name}<ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45" aria-hidden="true" /></a></li>
                  ))}
                </ul>
              </div>
            </Rise>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-600">News items are placeholders until the newsroom is connected to the CMS.</p>
      </div>
    </section>
  );
}
