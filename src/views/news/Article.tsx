"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Calendar, Check, ChevronRight, Clock, Copy, Download, Facebook, FileText,
  Linkedin, Megaphone, MessageCircle, Mic, Minus, Pause, Plus, Printer, Quote, Scale, Share2, ThumbsDown, ThumbsUp, Twitter, Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CountUp, Tilt, reveal } from "@/views/about/primitives";
import { DarkBackdrop, Rise, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { ArrowChip, darkCard, glowLight } from "@/views/docs/kit";
import { social } from "@/views/connect/data";
import { findArticle, news, newsPath, type Article as A, type Block, type Category } from "./data";

/**
 * News article (brief §7 "News and events"; questionnaire: news and media centre, easy sharing, verified social links).
 * Route: /news/:slug
 * Showcase look: the dark photo header is a deliberate exception; the body is white with ring cards, ink pills,
 * dark spotlight cards for figures, the PDF and media enquiries, and "More from the newsroom" on the soft band.
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

const focusRing = focus;
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]";
const eyebrowCls = "text-[11px] font-bold uppercase tracking-[0.16em] text-[#7F5A04]";

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
  const btn = "group relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0B1F10] ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-[#F4D27A] hover:ring-[#0B1F10]";
  return (
    <div className={cn("flex items-center gap-2", vertical && "flex-col")}>
      <span className={cn(eyebrowCls, vertical ? "mb-1" : "mr-1")}>Share</span>
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
          <div onMouseMove={spot} className={cn("group relative h-full overflow-hidden rounded-3xl p-5 text-white", darkCard, lift)}>
            <span aria-hidden="true" className="absolute -right-6 -top-6 h-20 w-20 rounded-full border-[10px] border-[#F4D27A]/10 transition-transform duration-500 group-hover:scale-125" />
            <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/60 to-transparent" />
            <CountUp value={f.value} className="block break-words bg-gradient-to-r from-[#F4D27A] to-[#FFE9A8] bg-clip-text font-display text-[1.6rem] font-black leading-none tracking-tight text-transparent sm:text-[1.75rem]" />
            <span className="mt-3 block text-sm leading-snug text-white/80">{f.label}</span>
          </div>
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
        <h2 id={b.id} className="group mt-12 scroll-mt-48 text-2xl font-black tracking-tight text-[#0B1F10] sm:text-[1.85rem]">
          <span aria-hidden="true" className="mb-3 block h-1 w-12 rounded-full bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615] transition-all duration-500 group-hover:w-20" />
          {b.text}
        </h2>
      );
    case "quote":
      return (
        <motion.figure {...reveal} className="relative my-12 overflow-hidden rounded-[1.75rem] bg-[#F2F6F0] px-7 py-9 ring-1 ring-black/10 sm:px-10">
          <Quote aria-hidden="true" className="absolute -right-3 -top-4 h-28 w-28 rotate-180 text-[#0A4A13]/[0.07]" />
          <span aria-hidden="true" className="absolute inset-y-6 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#CB9615] via-[#2E913D] to-[#117F21]" />
          <span aria-hidden="true" className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]"><Quote className="h-4 w-4 rotate-180 fill-current" /></span>
          <blockquote className="relative font-serif text-[1.45em] italic leading-snug text-[#0B1F10]">{b.text}</blockquote>
          {b.by && <figcaption className="relative mt-4 text-sm font-bold uppercase tracking-[0.12em] text-[#7F5A04]">{b.by}</figcaption>}
        </motion.figure>
      );
    case "list":
      return (
        <ul className="my-6 space-y-3">
          {b.items.map((it, i) => (
            <motion.li key={it} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease }} className="flex gap-3 font-serif text-[1.12em] leading-relaxed text-gray-800">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]">
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
        <motion.aside {...reveal} aria-label={b.title} onMouseMove={spot} className="relative my-12 rounded-[1.75rem] bg-gradient-to-br from-[#CB9615] via-[#2E913D] to-[#117F21] p-px shadow-[0_30px_60px_-36px_rgba(4,20,10,0.45)]">
          <div className={cn("relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-white p-7 sm:p-8", glowLight)}>
          <p className="relative inline-flex items-center gap-2 rounded-full bg-[#0A4A13] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F4D27A]" />{b.title}</p>
          <p className="relative mt-3 text-lg leading-relaxed text-[#0B1F10]">{b.text}</p>
          <ul className="relative mt-5 flex flex-wrap gap-3">
            {b.links.map((l, i) => (
              <li key={l.to}>
                <Link to={l.to} className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold transition", i === 0 ? "bg-[#0B1F10] text-white hover:bg-[#117F21]" : "bg-white text-[#0B1F10] ring-1 ring-black/15 hover:ring-[#0B1F10]", focusRing)}>
                  {l.label}
                  <ArrowRight className={cn("h-4 w-4 transition-transform group-hover:translate-x-1", i === 0 && "text-[#F4D27A]")} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          </div>
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
    <nav aria-label="In this story" className="rounded-3xl bg-white p-5 ring-1 ring-black/10">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90" aria-hidden="true">
          <circle cx="28" cy="28" r={r} fill="none" stroke="#F2F6F0" strokeWidth="5" />
          <circle cx="28" cy="28" r={r} fill="none" stroke="url(#ring)" strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} className="transition-[stroke-dashoffset] duration-200" />
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#117F21" /><stop offset="1" stopColor="#CB9615" /></linearGradient>
          </defs>
        </svg>
        <div>
          <p className={eyebrowCls}>In this story</p>
          <p className="text-sm font-bold text-[#0B1F10]">{Math.round(progress * 100)}% read</p>
        </div>
      </div>
      {items.length > 0 && (
        <ol className="mt-4 space-y-1 border-l-2 border-[#F2F6F0]">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                aria-current={active === i.id ? "location" : undefined}
                className={cn("relative -ml-0.5 block border-l-2 py-1.5 pl-4 text-sm transition", active === i.id ? "border-[#CB9615] font-bold text-[#0B1F10]" : "border-transparent text-gray-600 hover:text-[#0B1F10]", "rounded-r-lg", focusRing)}
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
        <Link to={newsPath(a)} onMouseMove={spot} className={cn("group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/10", glowLight, lift, focusRing)}>
          <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
          <span className="relative block aspect-[16/10] overflow-hidden bg-[#0B1F10]">
            <img src={a.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04140A]/60 via-transparent to-[#04140A]/20" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0B1F10]/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#F4D27A] shadow-sm backdrop-blur">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {a.category}
            </span>
          </span>
          <span className="flex flex-1 flex-col p-5">
            <span className="text-xs text-gray-600">{short(a.date)} · {a.readMins} min read</span>
            <span className="mt-2 block text-lg font-bold leading-snug text-[#0B1F10] transition-colors group-hover:text-[#117F21]">{a.title}</span>
            <span className="mt-2 line-clamp-2 text-sm text-gray-600">{a.excerpt}</span>
            <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-bold text-[#0B1F10]">
              Read story <ArrowChip />
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
  const tool = cn("inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#0B1F10] ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-[#F4D27A] hover:ring-[#0B1F10] disabled:pointer-events-none disabled:opacity-40", focusRing);

  return (
    <article aria-labelledby="story-title">
      {/* Sticky reading bar */}
      <AnimatePresence>
        {!heroVisible && (
          <motion.div initial={{ y: -64, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -64, opacity: 0 }} transition={{ duration: 0.35, ease }} className="fixed inset-x-0 top-[92px] z-30 border-b border-black/10 bg-white/90 shadow-[0_12px_30px_-24px_rgba(4,20,10,0.5)] backdrop-blur-xl print:hidden">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] sm:flex"><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-[#0B1F10]">{a.title}</p>
              <button type="button" onClick={listen} disabled={!canSpeak} className={cn("hidden min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-[#0B1F10] ring-1 ring-black/10 transition hover:bg-[#0B1F10] hover:text-[#F4D27A] sm:inline-flex", speaking && "bg-[#0B1F10] text-[#F4D27A]", focusRing)} aria-pressed={speaking}>
                {speaking ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}{speaking ? "Stop" : "Listen"}
              </button>
              <Link to="/news" className={cn("inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#0B1F10] px-4 text-sm font-semibold text-white transition hover:bg-[#117F21]", focusRing)}>
                <ArrowLeft className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" /> <span className="hidden sm:inline">Newsroom</span>
              </Link>
            </div>
            <motion.span aria-hidden="true" style={{ scaleX: bar }} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <header ref={heroRef} className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-[#0A4A13] text-white lg:min-h-[640px]">
        <motion.img src={a.image} alt={a.imageAlt} style={{ y: imgY, scale: imgScale }} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#04140A] via-[#04140A]/80 to-[#04140A]/30" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#04140A]/80 via-transparent to-transparent" />
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
          <h1 id="story-title" data-no-translate className="mt-6 max-w-4xl text-[2.1rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
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
      <div className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[56px_minmax(0,1fr)_280px] lg:gap-12">
          <aside className="hidden lg:block print:hidden" aria-label="Share this story">
            <div className="sticky top-[180px]"><ShareRail a={a} vertical /></div>
          </aside>

          <div ref={bodyRef} className="min-w-0">
            {/* Byline + tools */}
            <div className="relative flex flex-col gap-5 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#117F21]/40 via-[#CB9615]/40 to-transparent" />
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-[#CB9615]/40 ring-offset-2">
                  <img src="/pencom-logo.png" alt="" className="h-9 w-9 object-contain" />
                </span>
                <div>
                  <p className="font-bold text-[#0B1F10]">{a.author}</p>
                  <p className="text-sm text-gray-600">National Pension Commission</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button type="button" onClick={listen} disabled={!canSpeak} aria-pressed={speaking} className={cn(tool, speaking && "bg-[#0B1F10] text-[#F4D27A] ring-[#0B1F10]")}>
                  {speaking ? (
                    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
                      {[0, 1, 2].map((i) => <motion.span key={i} className="w-1 rounded-full bg-current" animate={{ height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}
                    </span>
                  ) : <Volume2 className="h-4 w-4" aria-hidden="true" />}
                  {speaking ? "Stop" : "Listen"}
                </button>
                <div className="inline-flex items-center rounded-full bg-white ring-1 ring-black/10" role="group" aria-label="Text size">
                  <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} className={cn("flex h-11 w-11 items-center justify-center rounded-full text-[#0B1F10] transition hover:bg-[#0B1F10] hover:text-[#F4D27A] disabled:pointer-events-none disabled:opacity-30", focusRing)} aria-label="Smaller text"><Minus className="h-4 w-4" aria-hidden="true" /></button>
                  <span className="px-1 text-sm font-black text-[#0B1F10]" aria-live="polite">A<span className="sr-only"> text size {size + 1} of 3</span></span>
                  <button type="button" onClick={() => setSize((s) => Math.min(2, s + 1))} disabled={size === 2} className={cn("flex h-11 w-11 items-center justify-center rounded-full text-[#0B1F10] transition hover:bg-[#0B1F10] hover:text-[#F4D27A] disabled:pointer-events-none disabled:opacity-30", focusRing)} aria-label="Larger text"><Plus className="h-4 w-4" aria-hidden="true" /></button>
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
                <motion.a {...reveal} href={a.attachment.url} target="_blank" rel="noopener noreferrer" onMouseMove={spot} className={cn("group relative flex items-center gap-5 overflow-hidden rounded-3xl p-6 text-white transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.6)]", darkCard, focusRing)}>
                  <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />
                  <span className="relative flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-[#B52026] shadow-lg transition group-hover:-rotate-6">
                    <FileText className="h-6 w-6" aria-hidden="true" /><span className="text-[10px] font-black">PDF</span>
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Read the full document</span>
                    <span className="mt-1 block font-semibold leading-snug">{a.attachment.title}</span>
                    {a.attachment.size && <span className="mt-0.5 block text-sm text-white/70">{a.attachment.size}</span>}
                  </span>
                  <span className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition group-hover:scale-110 sm:flex"><Download className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="sr-only">(opens in a new tab)</span>
                </motion.a>
              )}

              {/* Related + sources */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Rise className="h-full">
                <div onMouseMove={spot} className={cn("group/card relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10", glowLight, lift)}>
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615] transition-transform duration-500 group-hover/card:scale-x-100" />
                  <h2 className={eyebrowCls}>Related on this site</h2>
                  <ul className="mt-3 divide-y divide-black/5">
                    {a.related.map((r) => (
                      <li key={r.to}><Link to={r.to} className={cn("group flex min-h-12 items-center justify-between gap-3 rounded-lg py-2 font-semibold text-[#0B1F10] transition-colors hover:text-[#117F21]", focusRing)}>{r.label}<span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span></Link></li>
                    ))}
                  </ul>
                </div>
                </Rise>
                <Rise delay={0.08} className="h-full">
                <div onMouseMove={spot} className={cn("group/card relative h-full overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10", glowLight, lift)}>
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615] transition-transform duration-500 group-hover/card:scale-x-100" />
                  <h2 className={eyebrowCls}>Sources</h2>
                  <ul className="mt-3 divide-y divide-black/5">
                    {a.sources.map((s) => (
                      <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className={cn("group flex min-h-11 items-start justify-between gap-3 rounded-lg py-2.5 text-sm text-gray-700 transition-colors hover:text-[#117F21]", focusRing)}>{s.label}<ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#7F5A04] transition-transform group-hover:-translate-y-0.5" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a></li>
                    ))}
                  </ul>
                </div>
                </Rise>
              </div>

              {/* Feedback */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-[#F2F6F0] p-6 ring-1 ring-black/10 sm:flex-row sm:items-center print:hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {useful === null ? (
                    <motion.div key="ask" exit={{ opacity: 0, y: -8 }} className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <p className="font-bold text-[#0B1F10]">Was this story useful?</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setUseful(true)} className={tool}><ThumbsUp className="h-4 w-4" aria-hidden="true" /> Yes</button>
                        <button type="button" onClick={() => setUseful(false)} className={tool}><ThumbsDown className="h-4 w-4" aria-hidden="true" /> No</button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p key="thanks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} role="status" className="flex items-center gap-3 font-semibold text-[#0B1F10]">
                      <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]"><Check className="h-4 w-4" strokeWidth={3} /></span>
                      {useful ? "Thank you for your feedback." : <>Thank you. <Link to="/connect#contact" className={cn("text-[#117F21] underline underline-offset-2", focusRing)}>Tell us what was missing</Link>.</>}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block print:hidden">
            <div className="sticky top-[180px] space-y-5">
              <Contents items={toc} progress={pct} />
              <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-3xl p-6 text-white", darkCard)}>
                <span aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/60 to-transparent" />
                <p className="font-black tracking-tight">Media enquiries</p>
                <p className="mt-1 text-sm text-white/80">Corporate Communications Department</p>
                <a href="mailto:info@pencom.gov.ng" className="mt-3 block text-sm font-semibold text-[#F4D27A] underline-offset-2 hover:underline">info@pencom.gov.ng</a>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Follow PenCom</p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {social.map((s) => (
                    <li key={s.name}><a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-8 items-center rounded-full bg-white/10 px-3 text-xs font-semibold ring-1 ring-white/15 transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focusRing)}>{s.name}<span className="sr-only"> (opens in a new tab)</span></a></li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Newer / older */}
      <nav aria-label="More stories" className="bg-white px-4 pb-16 print:hidden sm:pb-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2">
          {[{ s: older, label: "Previous story", dir: -1 }, { s: newer, label: "Next story", dir: 1 }].map(({ s, label, dir }) =>
            s ? (
              <Link key={label} to={newsPath(s)} onMouseMove={spot} className={cn("group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-white p-5 ring-1 ring-black/10 sm:p-6", glowLight, lift, dir === 1 && "sm:flex-row-reverse sm:text-right", focusRing)}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition duration-300 group-hover:bg-[#117F21] group-hover:text-white">
                  {dir === -1 ? <ArrowLeft className="h-5 w-5" aria-hidden="true" /> : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
                </span>
                <span className="min-w-0">
                  <span className={cn("block", eyebrowCls)}>{label}</span>
                  <span className="mt-1 block font-bold leading-snug text-[#0B1F10] transition-colors group-hover:text-[#117F21]">{s.title}</span>
                </span>
              </Link>
            ) : <span key={label} className="hidden sm:block" />,
          )}
        </div>
      </nav>

      {/* More stories */}
      <section aria-labelledby="more-title" className={cn("bg-[#F2F6F0] print:hidden", sectionCls)}>
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            id="more-title"
            eyebrow="Newsroom"
            title="More from the newsroom"
            highlight="newsroom"
            action={
              <Link to="/news" className={cn("group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#117F21]", focusRing)}>
                All news
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
              </Link>
            }
          />
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
      <DarkBackdrop />
      <div className="mx-auto max-w-xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">Newsroom</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">We can’t find that story</h1>
        <p className="mt-4 text-white/70">It may have been moved or archived. Browse the latest news instead.</p>
        <Link to="/news" className={cn("group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-6 pr-1.5 font-semibold text-[#1A1206] transition hover:bg-[#FFE39A]", focusRing)}>
          Go to the newsroom <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
        </Link>
      </div>
    </section>
  );
}
