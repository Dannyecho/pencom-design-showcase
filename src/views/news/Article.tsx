"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Calendar, Check, ChevronRight, Clock, Copy, Download, Facebook, FileText,
  Linkedin, Megaphone, MessageCircle, Mic, Minus, Pause, Plus, Printer, Quote, Scale, Share2, ThumbsDown, ThumbsUp, Twitter, Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, Spotlight, Tilt, ease, reveal } from "@/views/about/primitives";
import { social } from "@/views/connect/data";
import { findArticle, news, newsPath, type Article as A, type Block, type Category } from "./data";

/**
 * News article (brief §7 "News and events"; questionnaire: news and media centre, easy sharing, verified social links).
 * Route: /news/:slug
 */

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const short = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const catIcon: Record<Category, typeof Megaphone> = {
  "Press release": Megaphone,
  Statement: FileText,
  Reports: BarChart3,
  Regulation: Scale,
  Speech: Mic,
  Event: Calendar,
};

const focusRing = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";

/* ─────────────────────────── Sharing ─────────────────────────── */

function useShare(a: A) {
  const [copied, setCopied] = useState(false);
  // Read the address and share support after mount, so the server and browser render the same HTML.
  const [url, setUrl] = useState("");
  const [canNative, setCanNative] = useState(false);
  useEffect(() => {
    setUrl(window.location.href);
    setCanNative("share" in navigator);
  }, []);
  const text = `${a.title} | National Pension Commission`;
  const links = [
    { name: "X", icon: Twitter, href: `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard blocked: nothing else to do */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const native = canNative ? () => navigator.share({ title: text, url }).catch(() => undefined) : null;
  return { links, copy, copied, native };
}

function ShareRail({ a, vertical }: { a: A; vertical?: boolean }) {
  const { links, copy, copied, native } = useShare(a);
  const btn = "group relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:-translate-y-0.5 hover:border-[#117F21] hover:bg-[#117F21] hover:text-white";
  return (
    <div className={cn("flex items-center gap-2", vertical && "flex-col")}>
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400", vertical ? "mb-1" : "mr-1")}>Share</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={cn(btn, focusRing)} aria-label={`Share on ${l.name} (opens in a new tab)`}>
          <l.icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      <button type="button" onClick={copy} className={cn(btn, focusRing)} aria-label="Copy link to this story">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copied ? "y" : "n"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </button>
      {native && !vertical && (
        <button type="button" onClick={native} className={cn(btn, focusRing, "sm:hidden")} aria-label="More ways to share">
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </div>
  );
}

/* ─────────────────────────── Blocks ─────────────────────────── */

function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className={cn("my-10 grid grid-cols-1 gap-3 sm:grid-cols-2", items.length === 3 && "md:grid-cols-3")}>
      {items.map((f, i) => (
        <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: i * 0.08, ease }}>
          <Spotlight color="rgba(244,210,122,0.22)" className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A4A13] via-[#0A4A13] to-[#117F21] p-5 text-white">
            <span aria-hidden="true" className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[10px] border-white/[0.06]" />
            <CountUp value={f.value} className="block break-words font-display text-[1.6rem] font-bold leading-none text-[#F4D27A] sm:text-[1.75rem]" />
            <span className="mt-3 block text-sm leading-snug text-white/75">{f.label}</span>
          </Spotlight>
        </motion.div>
      ))}
    </div>
  );
}

function BlockView({ b, first }: { b: Block; first: boolean }) {
  switch (b.type) {
    case "p":
      return (
        <p className={cn("font-serif text-[1.18em] leading-[1.8] text-gray-800", first && "text-[1.3em] leading-[1.7] text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.6em] first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[#117F21]")}>
          {b.text}
        </p>
      );
    case "h2":
      return (
        <h2 id={b.id} className="group mt-12 scroll-mt-48 text-2xl font-bold text-[#0A2E10] sm:text-[1.75rem]">
          <span aria-hidden="true" className="mb-3 block h-1 w-12 rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-all duration-500 group-hover:w-20" />
          {b.text}
        </h2>
      );
    case "quote":
      return (
        <motion.figure {...reveal} className="relative my-12 overflow-hidden rounded-3xl bg-[#FBF7EC] px-7 py-9 sm:px-10">
          <Quote aria-hidden="true" className="absolute -left-2 -top-3 h-24 w-24 rotate-180 text-[#CB9615]/20" />
          <span aria-hidden="true" className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#CB9615] to-[#117F21]" />
          <blockquote className="relative font-serif text-[1.45em] italic leading-snug text-[#0A2E10]">{b.text}</blockquote>
          {b.by && <figcaption className="relative mt-4 text-sm font-semibold text-[#9A6F06]">{b.by}</figcaption>}
        </motion.figure>
      );
    case "list":
      return (
        <ul className="my-6 space-y-3">
          {b.items.map((it, i) => (
            <motion.li key={it} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease }} className="flex gap-3 font-serif text-[1.12em] leading-relaxed text-gray-800">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#117F21]">
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              {it}
            </motion.li>
          ))}
        </ul>
      );
    case "facts":
      return <Facts items={b.items} />;
    case "callout":
      return (
        <motion.aside {...reveal} aria-label={b.title} className="relative my-12 overflow-hidden rounded-3xl border border-[#117F21]/20 bg-gradient-to-br from-[#F2FAF2] to-white p-7 sm:p-8">
          <span aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#117F21]/10 blur-2xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#117F21]">{b.title}</p>
          <p className="relative mt-2 text-lg leading-relaxed text-[#0A2E10]">{b.text}</p>
          <ul className="relative mt-5 flex flex-wrap gap-3">
            {b.links.map((l, i) => (
              <li key={l.to}>
                <Link to={l.to} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-semibold transition", i === 0 ? "bg-[#117F21] text-white hover:bg-[#0A4A13]" : "border border-[#117F21]/30 bg-white text-[#117F21] hover:border-[#117F21]", focusRing)}>
                  {l.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.aside>
      );
  }
}

/* ─────────────────────────── Contents with scroll-spy ─────────────────────────── */

function Contents({ items, progress }: { items: { id: string; text: string }[]; progress: number }) {
  const [active, setActive] = useState(items[0]?.id);
  // The current section is the last heading that has passed 40% of the viewport, in either scroll direction.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let cur = items[0]?.id;
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top <= line) cur = i.id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items]);
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <nav aria-label="In this story" className="rounded-3xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#E8F5E9" strokeWidth="5" />
          <circle cx="28" cy="28" r={r} fill="none" stroke="url(#ring)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} className="transition-[stroke-dashoffset] duration-200" />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#117F21" /><stop offset="1" stopColor="#CB9615" /></linearGradient>
          </defs>
        </svg>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">In this story</p>
          <p className="text-sm font-semibold text-[#0A2E10]">{Math.round(progress * 100)}% read</p>
        </div>
      </div>
      {items.length > 0 && (
        <ol className="mt-4 space-y-1 border-l-2 border-gray-100">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                aria-current={active === i.id ? "location" : undefined}
                className={cn("relative -ml-0.5 block border-l-2 py-1.5 pl-4 text-sm transition", active === i.id ? "border-[#117F21] font-semibold text-[#117F21]" : "border-transparent text-gray-500 hover:text-gray-800")}
              >
                {i.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

/* ─────────────────────────── Story card ─────────────────────────── */

export function StoryCard({ a, i = 0 }: { a: A; i?: number }) {
  const Icon = catIcon[a.category];
  return (
    <motion.li initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: i * 0.08, ease }}>
      <Tilt className="h-full">
        <Link to={newsPath(a)} className={cn("group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white transition hover:shadow-[0_30px_60px_-30px_rgba(10,74,19,0.45)]", focusRing)}>
          <span className="relative block aspect-[16/10] overflow-hidden bg-gray-100">
            <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0A4A13]">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {a.category}
            </span>
          </span>
          <span className="flex flex-1 flex-col p-5">
            <span className="text-xs text-gray-500">{short(a.date)} · {a.readMins} min read</span>
            <span className="mt-2 block text-lg font-bold leading-snug text-[#0A2E10] group-hover:text-[#117F21]">{a.title}</span>
            <span className="mt-2 line-clamp-2 text-sm text-gray-600">{a.excerpt}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-[#117F21]">
              Read story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </Link>
      </Tilt>
    </motion.li>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function Article({ slug }: { slug: string }) {
  const a = findArticle(slug);
  return <MotionConfig reducedMotion="user">{a ? <Story key={a.slug} a={a} /> : <Missing />}</MotionConfig>;
}

function Story({ a }: { a: A }) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const heroVisible = useInView(heroRef, { margin: "-92px 0px 0px 0px" });
  const [size, setSize] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [useful, setUseful] = useState<null | boolean>(null);
  const [pct, setPct] = useState(0);
  const Icon = catIcon[a.category];

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(heroP, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const imgScale = useTransform(heroP, [0, 1], [1.05, reduce ? 1.05 : 1.18]);
  const fade = useTransform(heroP, [0, 0.8], [1, reduce ? 1 : 0]);

  const { scrollYProgress } = useScroll({ target: bodyRef, offset: ["start 160px", "end end"] });
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  useEffect(() => scrollYProgress.on("change", (v) => setPct(Math.min(1, Math.max(0, v)))), [scrollYProgress]);

  const [canSpeak, setCanSpeak] = useState(false);
  useEffect(() => {
    const ok = "speechSynthesis" in window;
    setCanSpeak(ok);
    return () => {
      if (ok) window.speechSynthesis.cancel();
    };
  }, [a]);

  const listen = () => {
    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const parts = [a.title, a.excerpt, ...a.blocks.flatMap((b) => (b.type === "p" || b.type === "h2" || b.type === "quote" ? [b.text] : b.type === "list" ? b.items : b.type === "facts" ? b.items.map((f) => `${f.label}: ${f.value}`) : [b.title, b.text]))];
    const u = new SpeechSynthesisUtterance(parts.join(". ").replace(/₦/g, "naira "));
    u.lang = "en-NG";
    u.rate = 0.95;
    const voice = synth.getVoices().find((v) => v.lang === "en-NG") ?? synth.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  const toc = useMemo(() => a.blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: b.id, text: b.text })), [a]);
  const idx = news.findIndex((n) => n.slug === a.slug);
  const newer = idx > 0 ? news[idx - 1] : null;
  const older = idx < news.length - 1 ? news[idx + 1] : null;
  const more = news.filter((n) => n.slug !== a.slug).sort((x, y) => Number(y.category === a.category) - Number(x.category === a.category)).slice(0, 3);
  const words = a.title.split(" ");
  const tool = cn("inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#117F21] hover:text-[#117F21]", focusRing);

  return (
    <article aria-labelledby="story-title">
      {/* Sticky reading bar */}
      <AnimatePresence>
        {!heroVisible && (
          <motion.div initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -64, opacity: 0 }} transition={{ duration: 0.35, ease }} className="fixed inset-x-0 top-[92px] z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl print:hidden">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F5E9] text-[#117F21] sm:flex"><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0A2E10]">{a.title}</p>
              <button type="button" onClick={listen} disabled={!canSpeak} className="hidden min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#117F21] hover:bg-[#E8F5E9] sm:inline-flex" aria-pressed={speaking}>
                {speaking ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}{speaking ? "Stop" : "Listen"}
              </button>
              <Link to="/news" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Newsroom</span>
              </Link>
            </div>
            <motion.span aria-hidden="true" style={{ scaleX: bar }} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <header ref={heroRef} className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-[#0A4A13] text-white lg:min-h-[640px]">
        <motion.img src={a.image} alt={a.imageAlt} style={{ y: imgY, scale: imgScale }} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04240A] via-[#04240A]/80 to-[#04240A]/30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04240A]/80 via-transparent to-transparent" />
        <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:pb-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li><Link to="/connect" className="hover:text-white">Connect</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
              <li><Link to="/news" className="hover:text-white">News</Link></li>
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#CB9615] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1A1206]">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {a.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/75"><Calendar className="h-4 w-4" aria-hidden="true" /><time dateTime={a.date}>{fmt(a.date)}</time></span>
            <span className="inline-flex items-center gap-1.5 text-white/75"><Clock className="h-4 w-4" aria-hidden="true" />{a.readMins} min read</span>
          </motion.p>
          <h1 id="story-title" data-no-translate className="mt-6 max-w-4xl text-[2.1rem] font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            {words.map((w, i) => (
              <motion.span key={`${w}-${i}`} initial={{ opacity: 0, y: reduce ? 0 : "0.6em", filter: reduce ? "none" : "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease }} className="mr-[0.25em] inline-block">
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + words.length * 0.05, ease }} className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-white/85">
            {a.excerpt}
          </motion.p>
        </motion.div>
      </header>

      {/* Body */}
      <div className="bg-[#FBFCFA]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[56px_minmax(0,1fr)_280px] lg:gap-12">
          <aside className="hidden lg:block print:hidden" aria-label="Share this story">
            <div className="sticky top-[180px]"><ShareRail a={a} vertical /></div>
          </aside>

          <div ref={bodyRef} className="min-w-0">
            {/* Byline + tools */}
            <div className="flex flex-col gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-[#E8F5E9]">
                  <img src="/pencom-logo.png" alt="" className="h-9 w-9 object-contain" />
                </span>
                <div>
                  <p className="font-semibold text-[#0A2E10]">{a.author}</p>
                  <p className="text-sm text-gray-500">National Pension Commission</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button type="button" onClick={listen} disabled={!canSpeak} aria-pressed={speaking} className={cn(tool, speaking && "border-[#117F21] bg-[#117F21] text-white hover:text-white")}>
                  {speaking ? (
                    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
                      {[0, 1, 2].map((i) => <motion.span key={i} className="w-1 rounded-full bg-current" animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}
                    </span>
                  ) : <Volume2 className="h-4 w-4" aria-hidden="true" />}
                  {speaking ? "Stop" : "Listen"}
                </button>
                <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white" role="group" aria-label="Text size">
                  <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} className={cn("flex h-11 w-10 items-center justify-center text-gray-600 hover:text-[#117F21] disabled:opacity-30", focusRing)} aria-label="Smaller text"><Minus className="h-4 w-4" aria-hidden="true" /></button>
                  <span className="px-1 text-sm font-bold text-gray-700" aria-live="polite">A<span className="sr-only"> text size {size + 1} of 3</span></span>
                  <button type="button" onClick={() => setSize((s) => Math.min(2, s + 1))} disabled={size === 2} className={cn("flex h-11 w-10 items-center justify-center text-gray-600 hover:text-[#117F21] disabled:opacity-30", focusRing)} aria-label="Larger text"><Plus className="h-4 w-4" aria-hidden="true" /></button>
                </div>
                <button type="button" onClick={() => window.print()} className={tool}><Printer className="h-4 w-4" aria-hidden="true" /> Print</button>
              </div>
            </div>
            <div className="mt-5 lg:hidden print:hidden"><ShareRail a={a} /></div>

            {/* Story */}
            <div className="mx-auto mt-10 max-w-[44rem] space-y-6" style={{ fontSize: `${[1, 1.12, 1.25][size]}rem` }}>
              {a.blocks.map((b, i) => <BlockView key={i} b={b} first={i === 0} />)}
            </div>

            <div className="mx-auto mt-12 max-w-[44rem] space-y-6">
              {a.attachment && (
                <motion.a {...reveal} href={a.attachment.url} target="_blank" rel="noopener noreferrer" className={cn("group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-[#0A4A13] p-6 text-white", focusRing)}>
                  <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />
                  <span className="relative flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-[#B52026] shadow-lg transition group-hover:-rotate-6">
                    <FileText className="h-6 w-6" aria-hidden="true" /><span className="text-[10px] font-black">PDF</span>
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Read the full document</span>
                    <span className="mt-1 block font-semibold leading-snug">{a.attachment.title}</span>
                    {a.attachment.size && <span className="mt-0.5 block text-sm text-white/60">{a.attachment.size}</span>}
                  </span>
                  <span className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#CB9615] text-[#1A1206] transition group-hover:scale-110 sm:flex"><Download className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="sr-only">(opens in a new tab)</span>
                </motion.a>
              )}

              {/* Related + sources */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-400">Related on this site</h2>
                  <ul className="mt-3 space-y-1">
                    {a.related.map((r) => (
                      <li key={r.to}><Link to={r.to} className="group flex min-h-10 items-center justify-between gap-2 rounded-lg font-semibold text-[#117F21] hover:underline">{r.label}<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link></li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-6">
                  <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-400">Sources</h2>
                  <ul className="mt-3 space-y-1">
                    {a.sources.map((s) => (
                      <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-10 items-start justify-between gap-2 py-2 text-sm text-gray-700 hover:text-[#117F21]">{s.label}<ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a></li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feedback */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-dashed border-gray-300 p-6 sm:flex-row sm:items-center print:hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {useful === null ? (
                    <motion.div key="ask" exit={{ opacity: 0, y: -8 }} className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <p className="font-semibold text-[#0A2E10]">Was this story useful?</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setUseful(true)} className={tool}><ThumbsUp className="h-4 w-4" aria-hidden="true" /> Yes</button>
                        <button type="button" onClick={() => setUseful(false)} className={tool}><ThumbsDown className="h-4 w-4" aria-hidden="true" /> No</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p key="thanks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex items-center gap-2 font-semibold text-[#117F21]">
                      <Check className="h-5 w-5" aria-hidden="true" />
                      {useful ? "Thank you for your feedback." : <>Thank you. <Link to="/connect#contact" className="underline">Tell us what was missing</Link>.</>}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-[180px] space-y-5">
              <Contents items={toc} progress={pct} />
              <Spotlight color="rgba(244,210,122,0.2)" className="rounded-3xl bg-gradient-to-br from-[#0A4A13] to-[#117F21] p-6 text-white">
                <p className="font-bold">Media enquiries</p>
                <p className="mt-1 text-sm text-white/75">Corporate Communications Department</p>
                <a href="mailto:info@pencom.gov.ng" className="mt-3 block text-sm font-semibold text-[#F4D27A] underline-offset-2 hover:underline">info@pencom.gov.ng</a>
                <p className="mt-5 text-xs text-white/55">Follow PenCom</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {social.map((s) => (
                    <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center rounded-full bg-white/10 px-2.5 text-xs font-semibold hover:bg-white/20">{s.name}<span className="sr-only"> (opens in a new tab)</span></a></li>
                  ))}
                </ul>
              </Spotlight>
            </div>
          </aside>
        </div>
      </div>

      {/* Newer / older */}
      <nav aria-label="More stories" className="border-y border-gray-200 bg-white print:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2">
          {[{ s: older, label: "Previous story", dir: -1 }, { s: newer, label: "Next story", dir: 1 }].map(({ s, label, dir }) =>
            s ? (
              <Link key={label} to={newsPath(s)} className={cn("group flex items-center gap-4 px-4 py-8 transition hover:bg-[#F4FAF3] sm:px-8", dir === 1 && "sm:flex-row-reverse sm:text-right sm:border-l sm:border-gray-200", focusRing)}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#117F21] transition group-hover:border-[#117F21] group-hover:bg-[#117F21] group-hover:text-white">
                  {dir === -1 ? <ArrowLeft className="h-5 w-5" aria-hidden="true" /> : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-gray-400">{label}</span>
                  <span className="mt-1 block font-semibold leading-snug text-[#0A2E10] group-hover:text-[#117F21]">{s.title}</span>
                </span>
              </Link>
            ) : <span key={label} className="hidden sm:block" />,
          )}
        </div>
      </nav>

      {/* More stories */}
      <section aria-labelledby="more-title" className="bg-[#F4F7F2] py-20 print:hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 id="more-title" className="text-3xl font-bold text-[#0A2E10] sm:text-4xl">More from the <span className="bg-gradient-to-r from-[#117F21] to-[#CB9615] bg-clip-text text-transparent">newsroom</span></h2>
            <Link to="/news" className={cn("group inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#117F21]/25 bg-white px-4 text-sm font-semibold text-[#117F21] hover:border-[#117F21]", focusRing)}>
              All news <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {more.map((m, i) => <StoryCard key={m.slug} a={m} i={i} />)}
          </ul>
        </div>
      </section>
    </article>
  );
}

function Missing() {
  return (
    <section className="relative isolate overflow-hidden bg-[#04140A] py-28 text-center text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.26),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(46,145,61,0.38),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="mx-auto max-w-xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">Newsroom</p>
        <h1 className="mt-4 text-4xl font-bold">We can’t find that story</h1>
        <p className="mt-4 text-white/70">It may have been moved or archived. Browse the latest news instead.</p>
        <Link to="/news" className={cn("mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#CB9615] px-6 font-semibold text-[#1A1206] hover:bg-[#E0AA22]", focusRing)}>
          Go to the newsroom <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
