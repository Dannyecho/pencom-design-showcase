"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, Banknote, Bell, Briefcase, Building2, CheckCircle2, ChevronDown, ExternalLink,
  Globe, Heart, HelpCircle, Info, LineChart, Mail, MessageCircle, MessageSquareWarning, Newspaper, Phone, RefreshCw, Scale, Search,
  ShieldAlert, Store, User, UserRoundCheck, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { siteNotices, type NoticeType } from "@/lib/alerts";
import { cn } from "@/lib/utils";
import { CountUp } from "@/views/about/primitives";
import { headOffice } from "@/views/connect/data";
import { audiences, externalPortals, faqs, figures, popularTasks } from "@/views/home/data";
import SiteSearch, { go, openChat } from "@/views/home/SiteSearch";
import { news, newsPath } from "@/views/news/data";
import { library } from "@/views/regulations/library";
import Title from "./Title";

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const fmt = (d: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) => new Date(d).toLocaleDateString("en-GB", o);

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

/** Track the pointer in CSS variables so a soft spotlight follows it across a card. */
const spot = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

/* ─────────────────────────── Reading progress ─────────────────────────── */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden="true" style={{ scaleX }} className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]" />;
}

/* ─────────────────────────── 1 "I am a…" expanding cards ─────────────────────────── */

const audienceLook: Record<string, { icon: LucideIcon; img: string }> = {
  contributor: { icon: User, img: "/images/opt/pencom-contributor-1080.webp" },
  retiree: { icon: UserRoundCheck, img: "/images/opt/pencom-retiree-1080.webp" },
  employer: { icon: Building2, img: "/images/opt/pencom-employer-1080.webp" },
  operator: { icon: Briefcase, img: "/images/site/board-meeting-960.webp" },
  informal: { icon: Store, img: "/images/opt/pencom-trader-1080.webp" },
};
const lookFor = (id: string, icon: string) =>
  audienceLook[id] ?? audienceLook[{ user: "contributor", retiree: "retiree", building: "employer", briefcase: "operator", store: "informal" }[icon] ?? "contributor"];

export function AudienceDock() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [active, setActive] = useState(audiences[0].id);
  return (
    <section id="iam" aria-labelledby="dock-title" className="relative z-10 -mt-16 scroll-mt-32 px-4">
      <div className="mx-auto max-w-7xl">
        <h2 id="dock-title" className="sr-only">{t("I am a…")}</h2>
        <ul className="flex flex-col gap-3 lg:h-[26rem] lg:flex-row">
          {audiences.map((a) => {
            const on = a.id === active;
            const L = lookFor(a.id, a.icon);
            return (
              <li
                key={a.id}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] bg-[#0B1F10] text-white shadow-[0_30px_60px_-30px_rgba(4,20,10,0.8)] transition-[flex-grow,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  on ? "lg:flex-[3.2]" : "lg:flex-1",
                )}
              >
                <img src={L.img} alt="" loading="lazy" className={cn("absolute inset-0 h-full w-full object-cover transition duration-700", on ? "scale-100 opacity-60" : "scale-110 opacity-35 group-hover:opacity-50")} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04140A] via-[#04140A]/60 to-[#04140A]/10" />
                <h3 className="relative">
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`dock-${a.id}`}
                    onClick={() => setActive(a.id)}
                    className={cn("flex w-full items-center gap-3 p-5 text-left lg:h-full lg:flex-col lg:items-start lg:justify-end", on && "lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:h-auto lg:justify-start", focus)}
                  >
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-white/15 text-white backdrop-blur")}>
                      <L.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">{t("I am a")}</span>
                    <span className="text-xl font-black">{a.label}</span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`dock-${a.id}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, delay: 0.2, ease }}
                      className="relative px-5 pb-5 lg:absolute lg:inset-x-0 lg:bottom-0"
                    >
                      <p className="max-w-md text-white/80">{a.blurb}</p>
                      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {a.tasks.slice(0, 4).map((tk) => (
                          <li key={tk.label}>
                            <button
                              type="button"
                              onClick={() => go(tk, navigate)}
                              className={cn("group/t flex min-h-12 w-full items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-left text-sm font-semibold backdrop-blur-md transition hover:bg-white hover:text-[#0B1F10]", focus)}
                            >
                              <span className="flex-1">{tk.label}</span>
                              {tk.external ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover/t:translate-x-1" aria-hidden="true" />}
                              {tk.external && <span className="sr-only">{t("(opens in a new tab)")}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── 2 Command search ─────────────────────────── */

export function CommandSearch() {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);

  // Press "/" anywhere (outside a text field) to jump to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== "/" || el.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
      const input = box.current?.querySelector("input");
      input?.focus();
      input?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section aria-labelledby="cmd-title" className="px-4 pt-16 sm:pt-20">
      <Rise className="mx-auto max-w-4xl text-center">
        <h2 id="cmd-title" className="text-3xl font-black tracking-tight text-[#0B1F10] sm:text-4xl">{t("What do you need to do today?")}</h2>
        <p className="mt-2 text-gray-600">
          {t("Search tasks, services, regulations and answers.")}{" "}
          <span className="hidden sm:inline">
            {t("Press")} <kbd className="mx-0.5 rounded-md border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-xs text-gray-700 shadow-sm">/</kbd> {t("to search from anywhere on this page.")}
          </span>
        </p>
        <div ref={box} className="relative mt-7 rounded-[1.4rem] bg-gradient-to-r from-[#117F21] via-[#CB9615] to-[#117F21] p-[2px] text-left shadow-[0_30px_60px_-30px_rgba(10,74,19,0.6)]">
          <div className="rounded-[1.3rem] bg-white p-1.5 [&_form>div]:border-0 [&_input]:min-h-14 [&_input]:text-lg">
            <SiteSearch />
          </div>
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {popularTasks.map((tk) => (
            <li key={tk.label}>
              <Link to={tk.href} className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#EEF4EC] px-4 text-sm font-semibold text-[#0A4A13] transition hover:bg-[#0A4A13] hover:text-white", focus)}>
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                {tk.label}
              </Link>
            </li>
          ))}
        </ul>
      </Rise>
    </section>
  );
}

/* ─────────────────────────── 3 Alerts with spotlight ─────────────────────────── */

const alertLook: Record<NoticeType, { icon: LucideIcon; label: string; text: string; ring: string; glow: string }> = {
  critical: { icon: ShieldAlert, label: "Critical", text: "text-[#B52026]", ring: "bg-[#FCEBEB]", glow: "rgba(229,57,53,0.16)" },
  warning: { icon: AlertTriangle, label: "Warning", text: "text-[#8A4B00]", ring: "bg-[#FAEEDA]", glow: "rgba(245,158,11,0.18)" },
  info: { icon: Info, label: "Information", text: "text-[#0C447C]", ring: "bg-[#E6F1FB]", glow: "rgba(30,136,229,0.16)" },
  success: { icon: CheckCircle2, label: "Update", text: "text-[#0A4A13]", ring: "bg-[#E8F5E9]", glow: "rgba(46,145,61,0.16)" },
};

export function Alerts() {
  const { t } = useI18n();
  return (
    <section id="alerts" aria-labelledby="s-alerts" className="scroll-mt-32 overflow-x-clip px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Title id="s-alerts" ghost="Alerts" tag="Alerts" icon={Bell} title="Important alerts" mark="alerts" intro="Deadlines and changes that may affect you. The bell at the top of every page keeps these too." />
        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {siteNotices.map((n, i) => {
            const s = alertLook[n.type];
            return (
              <li key={n.id}>
                <Rise delay={i * 0.08} className="h-full">
                  <div
                    onMouseMove={spot}
                    style={{ "--glow": s.glow } as CSSProperties}
                    className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),var(--glow),transparent_45%)]"
                  >
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", s.ring, s.text)}>
                      <s.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <p className={cn("mt-5 text-xs font-black uppercase tracking-[0.16em]", s.text)}>{t(s.label)}</p>
                    <h3 className="mt-1 text-xl font-bold text-[#0B1F10]">{t(n.title)}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-gray-700">{t(n.message)}</p>
                    {n.link && (
                      <Link to={n.link.to} className={cn("group mt-5 inline-flex w-fit items-center gap-2 font-bold text-[#117F21]", focus)}>
                        {t(n.link.label)}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── 4 Circulars carousel ─────────────────────────── */

export function Circulars() {
  const { t } = useI18n();
  const track = useRef<HTMLUListElement>(null);
  const latest = [...library].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * Math.min(track.current.clientWidth * 0.8, 420), behavior: "smooth" });
  const nav = cn("flex h-12 w-12 items-center justify-center rounded-full border border-[#0B1F10]/15 bg-white text-[#0B1F10] transition hover:bg-[#0B1F10] hover:text-white", focus);
  return (
    <section id="circulars" aria-labelledby="s-circ" className="scroll-mt-32 overflow-x-clip bg-[#F2F6F0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <Title
          id="s-circ"
          ghost="Circulars"
          tag="Regulatory updates"
          icon={Scale}
          title="Latest circulars and guidelines"
          mark="circulars"
          action={
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scroll(-1)} aria-label={t("Previous")} className={nav}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label={t("Next")} className={nav}>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <Link to="/regulations#library" className={cn("ml-2 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B1F10] px-5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                {t("Open the library")}
              </Link>
            </div>
          }
        />
      </div>
      <ul ref={track} tabIndex={0} aria-label={t("Latest circulars and guidelines")} className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-6 [scrollbar-width:thin] sm:scroll-px-[max(1rem,calc((100vw-80rem)/2+1rem))] sm:px-[max(1rem,calc((100vw-80rem)/2+1rem))]">
        {latest.map((d, i) => (
          <li key={d.id} className="w-[19rem] shrink-0 snap-start sm:w-[22rem]">
            <Rise delay={Math.min(i, 4) * 0.06} className="h-full">
              <Link to={`/regulations/doc/${d.id}`} className={cn("group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(10,74,19,0.6)] hover:ring-[#117F21]", focus)}>
                <span className="flex items-start justify-between">
                  <span>
                    <span className="block text-5xl font-black leading-none tracking-tight text-[#0B1F10]">{new Date(d.date).getDate()}</span>
                    <span className="mt-1 block text-sm font-semibold uppercase tracking-wider text-[#B07E0C]">{fmt(d.date, { month: "long", year: "numeric" })}</span>
                  </span>
                  <span className="rounded-full bg-[#EEF4EC] px-3 py-1 text-xs font-bold text-[#0A4A13]">{d.type}</span>
                </span>
                <span className="mt-6 line-clamp-4 flex-1 font-semibold leading-snug text-[#0B1F10] group-hover:text-[#117F21]">{d.title}</span>
                <span className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <span className="truncate">{d.appliesTo.slice(0, 2).join(" · ")}</span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-[#117F21] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Rise>
          </li>
        ))}
        <li className="w-[19rem] shrink-0 snap-start sm:w-[22rem]">
          <Link to="/regulations/pension-reform-act" className={cn("group relative flex h-full min-h-[18rem] flex-col justify-end overflow-hidden rounded-3xl bg-[#0B1F10] p-6 text-white", focus)}>
            <span aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#CB9615]/40 blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <Scale className="relative h-8 w-8 text-[#F4D27A]" aria-hidden="true" />
            <span className="relative mt-4 text-2xl font-black">Pension Reform Act 2014</span>
            <span className="relative mt-2 inline-flex items-center gap-2 font-semibold text-[#F4D27A]">
              {t("Read the full Act online")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

/* ─────────────────────────── 5 Online services: tilt cards ─────────────────────────── */

const portalIcons: Record<string, LucideIcon> = { ExternalLink, Heart, RefreshCw, Banknote };

function Tilt({ children, className, href }: { children: ReactNode; className?: string; href: string }) {
  const reduce = useReducedMotion();
  const [r, setR] = useState({ x: 0, y: 0 });
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={(e) => {
        spot(e);
        if (reduce) return;
        const b = e.currentTarget.getBoundingClientRect();
        setR({ x: ((e.clientY - b.top) / b.height - 0.5) * -10, y: ((e.clientX - b.left) / b.width - 0.5) * 12 });
      }}
      onMouseLeave={() => setR({ x: 0, y: 0 })}
      style={{ transform: `perspective(900px) rotateX(${r.x}deg) rotateY(${r.y}deg)` }}
      className={cn("block transition-transform duration-200 ease-out [transform-style:preserve-3d]", className, focus)}
    >
      {children}
    </a>
  );
}

export function Portals() {
  const { t } = useI18n();
  return (
    <section id="online" aria-labelledby="s-online" className="scroll-mt-32 overflow-x-clip px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Title
          id="s-online"
          ghost="Portals"
          tag="Online services"
          icon={Globe}
          title="Go straight to the right portal"
          mark="right portal"
          intro="These PenCom services run on their own websites. Each opens in a new tab."
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {externalPortals.map((p, i) => {
            const I = portalIcons[p.icon] ?? ExternalLink;
            return (
              <li key={p.name}>
                <Rise delay={i * 0.07} className="h-full">
                  <Tilt href={p.url} className="group relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] p-7 text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)] [background-image:radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.22),transparent_45%),linear-gradient(135deg,#0B1F10,#0A4A13)]">
                    <span className="flex items-start justify-between [transform:translateZ(30px)]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15">
                        <I className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <ArrowUpRight className="h-6 w-6 text-white/60 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#F4D27A]" aria-hidden="true" />
                    </span>
                    <span className="mt-10 block text-3xl font-black tracking-tight [transform:translateZ(40px)]">{p.name}</span>
                    <span className="mt-2 block text-white/75">{t(p.description)}</span>
                    <span className="mt-6 block text-sm text-[#F4D27A]/80">{p.url.replace("https://", "")}</span>
                    <span className="sr-only">{t("(opens in a new tab)")}</span>
                  </Tilt>
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── 6 News bento ─────────────────────────── */

export function NewsBento() {
  const { t } = useI18n();
  const [lead, ...rest] = news.slice(0, 3);
  return (
    <section id="news" aria-labelledby="s-news" className="scroll-mt-32 overflow-x-clip bg-[#F2F6F0] px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Title
          id="s-news"
          ghost="News"
          tag="News and events"
          icon={Newspaper}
          title="What’s happening at PenCom"
          mark="PenCom"
          action={
            <Link to="/news" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B1F10] px-5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              {t("All news")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-2">
          <Rise className="lg:col-span-7 lg:row-span-2">
            <Link to={newsPath(lead)} className={cn("group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] text-white", focus)}>
              <img src={lead.image} alt={t(lead.imageAlt)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#04140A] via-[#04140A]/50 to-transparent" />
              <span className="relative p-7 sm:p-9">
                <span className="inline-flex rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold text-[#1A1206]">{lead.category}</span>
                <span className="mt-3 block text-sm text-white/80">{fmt(lead.date)}</span>
                <span className="mt-1 block text-2xl font-black leading-tight sm:text-3xl">{lead.title}</span>
                <span className="mt-3 line-clamp-2 block max-w-xl text-white/80">{lead.excerpt}</span>
              </span>
            </Link>
          </Rise>
          {rest.map((a, i) => (
            <Rise key={a.id} delay={0.1 * (i + 1)} className="lg:col-span-5">
              <Link to={newsPath(a)} className={cn("group flex h-full gap-5 overflow-hidden rounded-[1.75rem] bg-white p-3 ring-1 ring-black/5 transition hover:shadow-[0_24px_50px_-30px_rgba(10,74,19,0.5)]", focus)}>
                <span className="relative block w-36 shrink-0 overflow-hidden rounded-[1.3rem] sm:w-44">
                  <img src={a.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </span>
                <span className="flex min-w-0 flex-col justify-center py-3 pr-3">
                  <span className="text-sm font-semibold text-[#B07E0C]">{fmt(a.date)}</span>
                  <span className="mt-1 text-lg font-bold leading-snug text-[#0B1F10] group-hover:text-[#117F21]">{a.title}</span>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#117F21]">
                    {t("Read more")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 7 Figures ─────────────────────────── */

export function FiguresBand() {
  const { t } = useI18n();
  return (
    <section id="figures" aria-labelledby="s-fig" className="relative isolate scroll-mt-32 overflow-hidden bg-[#04140A] px-4 py-20 text-white sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_10%,rgba(203,150,21,0.28),transparent),radial-gradient(50%_60%_at_10%_90%,rgba(46,145,61,0.35),transparent)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="mx-auto max-w-7xl">
        <Title id="s-fig" ghost="Figures" tag="Industry figures" icon={LineChart} title="The pension industry at a glance" mark="at a glance" dark intro="Approved figures from PenCom’s published industry reports. Each one shows the date it refers to." />
        <dl className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((f, i) => (
            <Rise key={f.label} delay={i * 0.08}>
              <div onMouseMove={spot} className="group relative h-full overflow-hidden rounded-3xl p-[1px] [background-image:radial-gradient(260px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.7),rgba(255,255,255,0.12)_45%)]">
                <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-[#0A1C10]/95 p-7">
                  <dt className="text-white/75">{t(f.label)}</dt>
                  <dd className="mt-3 text-5xl font-black tracking-tight text-[#F4D27A]">
                    <CountUp value={f.value} />
                  </dd>
                  <dd className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{t(f.note)}</dd>
                </div>
              </div>
            </Rise>
          ))}
        </dl>
        <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
          <span>{t("Source: PenCom industry reports")}</span>
          <Link to="/resources/reports/q1-2026" className={cn("inline-flex items-center gap-1.5 font-semibold text-[#F4D27A] hover:underline", focus)}>
            {t("Read the Q1 2026 report")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/performance" className={cn("inline-flex items-center gap-1.5 font-semibold text-[#F4D27A] hover:underline", focus)}>
            {t("See industry performance")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────── 8 Questions and contact ─────────────────────────── */

export function HelpBlock() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const tel = headOffice.phone.replace(/\s/g, "");
  const ways = [
    { icon: Phone, label: "Call us", value: headOffice.phone, href: `tel:${tel}` },
    { icon: Mail, label: "Email us", value: headOffice.email, href: `mailto:${headOffice.email}` },
    { icon: Building2, label: "Visit an office", value: "Head office in Abuja and offices in every zone", to: "/connect#zonal-offices" },
    { icon: MessageSquareWarning, label: "Make a complaint", value: "We aim to resolve within 14 working days", to: "/connect" },
  ];
  return (
    <section id="help" aria-labelledby="s-help" className="scroll-mt-32 overflow-x-clip px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Title id="s-help" ghost="Help" tag="Help" icon={HelpCircle} title="Questions and how to reach us" mark="reach us" />
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <ul className="space-y-3 lg:col-span-7">
            {faqs.slice(0, 5).map((f, i) => {
              const on = open === i;
              return (
                <li key={f.question} className={cn("overflow-hidden rounded-2xl ring-1 transition-colors duration-300", on ? "bg-[#0B1F10] text-white ring-[#0B1F10]" : "bg-white ring-black/10")}>
                  <h3>
                    <button type="button" id={`sq-${i}`} aria-expanded={on} aria-controls={`sa-${i}`} onClick={() => setOpen(on ? null : i)} className={cn("flex min-h-16 w-full items-center gap-4 px-6 py-4 text-left font-bold", focus)}>
                      <span className={cn("font-mono text-sm", on ? "text-[#F4D27A]" : "text-[#B07E0C]")}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1">{t(f.question)}</span>
                      <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-300", on && "rotate-180 text-[#F4D27A]")} aria-hidden="true" />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`sa-${i}`} role="region" aria-labelledby={`sq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease }}>
                        <p className="px-6 pb-6 pl-[3.6rem] leading-relaxed text-white/80">{t(f.answer)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
            <li className="pt-2">
              <Link to="/resources/faq" className={cn("inline-flex items-center gap-1.5 font-bold text-[#117F21] hover:underline", focus)}>
                {t("See all questions")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <button type="button" onClick={openChat} className={cn("group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#117F21] to-[#0A4A13] p-6 text-left text-white shadow-[0_30px_60px_-30px_rgba(10,74,19,0.8)]", focus)}>
                <span aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#F4D27A]/30 blur-2xl transition-transform duration-700 group-hover:scale-150" />
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[#F4D27A]">
                  <MessageCircle className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="relative flex-1">
                  <span className="block text-lg font-black">{t("Ask PenCom Assistant")}</span>
                  <span className="block text-white/80">{t("Quick answers in plain language")}</span>
                </span>
                <ArrowRight className="relative h-6 w-6 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {ways.map((w) => {
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4EC] text-[#0A4A13] transition group-hover:bg-[#0A4A13] group-hover:text-[#F4D27A]">
                        <w.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold text-[#0B1F10]">{t(w.label)}</span>
                        <span className="block break-words text-sm text-gray-600">{t(w.value)}</span>
                      </span>
                    </>
                  );
                  const cls = cn("group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/10 transition hover:ring-[#117F21]", focus);
                  return <li key={w.label}>{w.to ? <Link to={w.to} className={cls}>{inner}</Link> : <a href={w.href} className={cls}>{inner}</a>}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
