"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight, ArrowRight, BadgeCheck, BarChart3, Building2, Globe, Landmark, LayoutGrid, List, Mail, MapPin, MessageSquareWarning, Phone, Search,
  ShieldAlert, ShieldCheck, UserRound, Vault, Wallet, X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "@/lib/router";
import { cn } from "@/lib/utils";
import { CountUp, scrollToId } from "@/views/about/primitives";
import Headline from "@/views/theme/Headline";
import { DarkBackdrop, Drawer, FramedPanel, PageHero, Rise, SectionNav, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { funds, operators, relatedBodies, typeInfo, type Operator, type OperatorType } from "./data";

/**
 * Pension operators, showcase theme (brief §6.2 Operators and the "Operator directory and details" template;
 * DES-28, DES-29, DES-30). Hero with a "Is this company licensed?" check → directory (type tabs, search, city,
 * card or list view; each operator opens a details panel with a shareable ?op= link) → how the three safeguards
 * work → which RSA fund you are in → performance and complaints. Old links (#pfas, #pfcs, #cpfas, #penop …) open
 * the matching tab.
 */

type Tab = OperatorType | "Related";
const tabFor: Record<string, Tab> = { pfas: "PFA", "pfa-addresses": "PFA", pfcs: "PFC", cpfas: "CPFA", penop: "Related", ptad: "Related", related: "Related" };

const onThisPage = [
  { id: "directory", label: "Directory" },
  { id: "how", label: "How it works" },
  { id: "funds", label: "RSA funds" },
  { id: "performance", label: "Performance" },
];

/** Pointer spotlights (green on white cards, gold on dark ones) and the theme's hover lift. */
const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(46,145,61,0.10),transparent_45%)]";
const glowDark = "[background-image:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_50%)]";
/** Dark gradient card with the gold spotlight in the same background-image (a separate gradient class would be overridden). */
const darkCard = "bg-[#0B1F10] [background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_50%),linear-gradient(135deg,#0B1F10,#0A4A13)]";
const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]";
const darkBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#117F21]";

/** Gold circular arrow chip at the end of buttons and cards. */
function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-[-45deg]", className)}>{children}</span>;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tel = (p: string) => `tel:${p.split(/[,(]/)[0].replace(/-\d+$/, "").replace(/[^\d+]/g, "")}`;
const mapUrl = (o: Operator) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.name}, ${o.address}`)}`;
const initials = (n: string) =>
  n
    .replace(/\(.*?\)|limited|ltd\.?|nig\.?|pfa|pension(s)?|fund|managers|administrators?|custodian|closed/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const tones = ["bg-[#0A4A13] text-[#F4D27A]", "bg-[#117F21] text-white", "bg-[#CB9615] text-[#1A1206]", "bg-[#E8F5E9] text-[#0A4A13]"];
const tone = (id: string) => tones[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length];

function Monogram({ o, size = "md" }: { o: Operator; size?: "md" | "lg" }) {
  return (
    <span aria-hidden="true" className={cn("flex shrink-0 items-center justify-center rounded-2xl font-bold", tone(o.id), size === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12 text-base")}>
      {initials(o.name) || o.name[0]}
    </span>
  );
}

function ContactActions({ o, compact = false }: { o: Operator; compact?: boolean }) {
  const items = [
    o.phones[0] && { href: tel(o.phones[0]), icon: Phone, label: `Call ${o.name}`, text: "Call" },
    o.emails[0] && { href: `mailto:${o.emails[0]}`, icon: Mail, label: `Email ${o.name}`, text: "Email" },
    { href: `https://${o.website}`, icon: Globe, label: `${o.name} website (opens in a new tab)`, text: "Website", ext: true },
    { href: mapUrl(o), icon: MapPin, label: `${o.name} on a map (opens in a new tab)`, text: "Map", ext: true },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string; text: string; ext?: boolean }[];
  return (
    <div className={cn("relative z-10 flex flex-wrap", compact ? "gap-1.5" : "gap-2")}>
      {items.map((it) => (
        <a
          key={it.text}
          href={it.href}
          aria-label={it.label}
          title={it.text}
          {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={cn("inline-flex items-center gap-1.5 rounded-full bg-white font-semibold text-gray-700 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#0B1F10] hover:text-[#F4D27A] hover:ring-[#0B1F10]", compact ? "h-11 w-11 justify-center" : "min-h-11 px-4 text-sm", focus)}
        >
          <it.icon className="h-4 w-4" aria-hidden="true" />
          {!compact && it.text}
        </a>
      ))}
    </div>
  );
}

export default function OperatorsPage() {
  const [params, setParams] = useSearchParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [tabHint, setTabHint] = useState<Tab | null>(null);

  const open = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set("op", id);
    else next.delete("op");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  // Old links: #pfas, #pfcs … land on the directory tab; downloads and summaries moved to other pages.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    if (id === "pfa-downloads" || id === "pfc-downloads") return void navigate("/resources#downloads", { replace: true });
    if (id === "rsa-summary") return void navigate("/performance", { replace: true });
    if (id in tabFor) setTabHint(tabFor[id]);
    const target = id in tabFor ? "directory" : id;
    const t1 = window.setTimeout(() => scrollToId(target, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(target, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce, navigate]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <Hero onOpen={open} />
        <SectionNav sections={onThisPage} pillId="ops-nav-pill" />
        <Directory onOpen={open} tabHint={tabHint} />
        <HowItWorks />
        <Funds />
        <Performance />
        <Details id={params.get("op")} onClose={() => open(null)} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero + licence check ─────────────────────────── */

function Hero({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const term = norm(q);
  const matches = useMemo(() => (term.length < 3 ? [] : operators.filter((o) => norm(o.name).includes(term))), [term]);
  const state = term.length < 3 ? "idle" : matches.length ? "found" : "none";
  const count = (t: OperatorType) => operators.filter((o) => o.type === t).length;

  return (
    <PageHero
      id="ops-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Operators" }]}
      pill={{ icon: ShieldCheck, label: "Licensed by PenCom" }}
      title="The companies that look after your pension"
      mark="your pension"
      intro="Find, compare and contact every Pension Fund Administrator, Pension Fund Custodian and Closed Pension Fund Administrator licensed by the Commission."
      actions={
        <dl className="grid max-w-md grid-cols-3 gap-3">
          {(["PFA", "PFC", "CPFA"] as const).map((t) => (
            <div key={t} onMouseMove={spot} className={cn("relative overflow-hidden rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-[#F4D27A]/50", glowDark)}>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{typeInfo[t].short}</dt>
              <dd className="mt-1 font-mono text-3xl font-black tabular-nums text-[#F4D27A]">
                <CountUp value={String(count(t))} duration={1.2} />
              </dd>
            </div>
          ))}
        </dl>
      }
      aside={
        <FramedPanel className="p-6 sm:p-7">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0A4A13]">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            Licence check
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">Is this company licensed?</h2>
          <p className="mt-1 text-gray-600">Check a name before you hand over your details.</p>
          <label htmlFor="verify-q" className="sr-only">
            Company name
          </label>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F2F6F0] px-3 ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#117F21]">
            <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
            <input id="verify-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type at least 3 letters, e.g. “Leadway”" autoComplete="off" className="min-h-12 w-full bg-transparent text-base focus:outline-none" />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear" className={cn("flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-white", focus)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div aria-live="polite" className="mt-4 min-h-[9rem]">
            <AnimatePresence mode="wait" initial={false}>
              {state === "idle" && (
                <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl bg-[#F2F6F0] p-4 text-sm text-gray-600">
                  Only companies on PenCom’s register may open RSAs, hold pension assets or collect contributions.
                </motion.p>
              )}
              {state === "found" && (
                <motion.ul key="found" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                  {matches.slice(0, 3).map((o) => (
                    <li key={o.id}>
                      <button type="button" onClick={() => onOpen(o.id)} className={cn("group flex w-full items-center gap-3 rounded-2xl bg-[#E8F5E9] p-3 text-left transition hover:bg-[#0B1F10] hover:text-white", focus)}>
                        <ShieldCheck className="h-6 w-6 shrink-0 text-[#117F21] group-hover:text-[#F4D27A]" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-bold">{o.name}</span>
                          <span className="block text-xs opacity-75">Licensed {typeInfo[o.type].label}</span>
                        </span>
                        <Chip className="h-7 w-7">
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Chip>
                      </button>
                    </li>
                  ))}
                  {matches.length > 3 && <li className="px-1 text-xs text-gray-500">and {matches.length - 3} more in the directory below</li>}
                </motion.ul>
              )}
              {state === "none" && (
                <motion.div key="none" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 rounded-2xl bg-[#FDE8E8] p-4 text-[#5C1013]">
                  <ShieldAlert className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <p className="text-sm">
                    <strong className="block">Not on PenCom’s register.</strong>
                    Don’t give them your RSA PIN or money. If they claim to be licensed,{" "}
                    <Link to="/connect#report" className={cn("rounded font-semibold underline", focus)}>
                      report it to PenCom
                    </Link>
                    .
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FramedPanel>
      }
    />
  );
}

/* ─────────────────────────── Directory ─────────────────────────── */

function Directory({ onOpen, tabHint }: { onOpen: (id: string) => void; tabHint: Tab | null }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("PFA");
  const [q, setQ] = useState("");
  const [city, setCity] = useState<"All" | "Lagos" | "Abuja">("All");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (tabHint) setTab(tabHint);
  }, [tabHint]);

  const tabs: { id: Tab; label: string; n: number }[] = [
    ...(["PFA", "PFC", "CPFA"] as const).map((t) => ({ id: t, label: typeInfo[t].short, n: operators.filter((o) => o.type === t).length })),
    { id: "Related", label: "Related bodies", n: relatedBodies.length },
  ];
  const list = useMemo(() => {
    const term = norm(q);
    return operators.filter((o) => o.type === tab && (city === "All" || o.city === city) && (!term || norm(`${o.name} ${o.md} ${o.address}`).includes(term)));
  }, [tab, q, city]);

  return (
    <section id="directory" aria-labelledby="directory-title" className={sectionCls}>
      {Object.keys(tabFor).map((a) => (
        <span key={a} id={a} className="block scroll-mt-[170px]" aria-hidden="true" />
      ))}
      <div className="mx-auto max-w-7xl">
        <Headline
          id="directory-title"
          kicker="Directory"
          title="Every licensed operator, in one place"
          mark="in one place"
          intro={tab === "Related" ? "Bodies that work alongside the Commission and licensed operators." : typeInfo[tab].role}
        />

        <div className="mt-10 rounded-[1.75rem] bg-white/90 p-2 shadow-[0_24px_50px_-34px_rgba(4,20,10,0.6)] ring-1 ring-black/10 backdrop-blur sm:p-2.5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <LayoutGroup id="ops-tabs">
              <div role="tablist" aria-label="Type of operator" className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] lg:flex-1 [&::-webkit-scrollbar]:hidden">
                {tabs.map((t) => {
                  const on = tab === t.id;
                  return (
                    <button key={t.id} type="button" role="tab" aria-selected={on} aria-controls="ops-panel" onClick={() => setTab(t.id)} className={cn("relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition", on ? "text-[#F4D27A]" : "text-gray-700 hover:bg-[#F2F6F0]", focus)}>
                      {on && <motion.span layoutId="ops-tab-pill" className="absolute inset-0 rounded-full bg-[#0B1F10]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                      <span className="relative">{t.label}</span>
                      <span className={cn("relative rounded-full px-1.5 text-xs tabular-nums", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#F2F6F0] text-gray-600")}>{t.n}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            {tab !== "Related" && (
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex min-h-11 flex-1 items-center gap-2 rounded-full bg-[#F2F6F0] px-4 ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#117F21] sm:w-60 sm:flex-none">
                  <Search className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                  <span className="sr-only">Search operators</span>
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or address" className="w-full bg-transparent text-sm focus:outline-none" />
                </label>
                <div role="group" aria-label="City" className="flex rounded-full bg-[#F2F6F0] p-1">
                  {(["All", "Lagos", "Abuja"] as const).map((c) => (
                    <button key={c} type="button" aria-pressed={city === c} onClick={() => setCity(c)} className={cn("min-h-9 rounded-full px-3.5 text-sm font-semibold transition", city === c ? "bg-[#0B1F10] text-[#F4D27A] shadow" : "text-gray-600 hover:text-gray-900", focus)}>
                      {c}
                    </button>
                  ))}
                </div>
                <div role="group" aria-label="Layout" className="flex rounded-full bg-[#F2F6F0] p-1">
                  {([["grid", LayoutGrid, "Cards"], ["list", List, "List"]] as const).map(([v, Icon, label]) => (
                    <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} title={label} className={cn("flex h-9 w-10 items-center justify-center rounded-full transition", view === v ? "bg-[#0B1F10] text-[#F4D27A] shadow" : "text-gray-500 hover:text-gray-900", focus)}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div id="ops-panel" role="tabpanel" className="mt-5">
          {tab === "Related" ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedBodies.map((b, i) => (
                <li key={b.short}>
                  <Rise delay={i * 0.06} className="h-full">
                  <div onMouseMove={spot} className={cn("flex h-full gap-4 rounded-[1.75rem] bg-white p-6 ring-1 ring-black/10 sm:p-7", glowLight, lift)}>
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A] shadow-[0_14px_30px_-14px_rgba(4,20,10,0.8)]">
                      <Landmark className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#117F21]">{b.short}</span>
                      <span className="mt-1 block text-lg font-black tracking-tight">{b.name}</span>
                      <span className="mt-2 block leading-relaxed text-gray-600">{b.body}</span>
                    </span>
                  </div>
                  </Rise>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mb-3 px-1 text-sm text-gray-600" aria-live="polite">
                {list.length} {list.length === 1 ? typeInfo[tab].label : typeInfo[tab].plural}
                {city !== "All" && ` in ${city}`}
                {q && ` matching “${q}”`}
              </p>
              {list.length === 0 ? (
                <div className="rounded-[1.75rem] bg-[#F2F6F0] px-6 py-14 text-center ring-1 ring-black/10">
                  <Search className="mx-auto h-8 w-8 text-[#117F21]" aria-hidden="true" />
                  <p className="mt-3 font-bold">No operator matches</p>
                  <button type="button" onClick={() => { setQ(""); setCity("All"); }} className={cn("mt-5", darkBtn, focus)}>
                    Clear filters
                    <Chip>
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Chip>
                  </button>
                </div>
              ) : (
                <motion.ul layout className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-2.5"}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    {list.map((o) => (
                      <motion.li key={`${view}-${o.id}`} layout initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.3, ease }}>
                        {view === "grid" ? (
                          <article onMouseMove={spot} className={cn("group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-5 ring-1 ring-black/10 hover:ring-[#117F21]/30 sm:p-6", glowLight, lift)}>
                            <span aria-hidden="true" className="absolute inset-x-6 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                            <div className="flex items-start gap-3">
                              <Monogram o={o} />
                              <div className="min-w-0">
                                <h3 className="font-black leading-snug tracking-tight">
                                  <button type="button" onClick={() => onOpen(o.id)} className={cn("text-left after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] group-hover:text-[#0A4A13]", focus)}>
                                    {o.name}
                                  </button>
                                </h3>
                                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-bold text-[#0A4A13]">
                                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                                  Licensed
                                </p>
                              </div>
                            </div>
                            <dl className="mt-4 space-y-1.5 text-sm text-gray-600">
                              <div className="flex gap-2">
                                <dt className="sr-only">Managing director</dt>
                                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                                <dd>{o.md}</dd>
                              </div>
                              <div className="flex gap-2">
                                <dt className="sr-only">Head office</dt>
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                                <dd className="line-clamp-2">{o.address}</dd>
                              </div>
                            </dl>
                            <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/[0.06] pt-4">
                              <ContactActions o={o} compact />
                              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </article>
                        ) : (
                          <article onMouseMove={spot} className={cn("group relative flex items-center gap-4 rounded-3xl bg-white p-3 ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-34px_rgba(4,20,10,0.4)] hover:ring-[#117F21]/30 sm:p-4", glowLight)}>
                            <Monogram o={o} />
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold">
                                <button type="button" onClick={() => onOpen(o.id)} className={cn("text-left after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-[#0A4A13]", focus)}>
                                  {o.name}
                                </button>
                              </h3>
                              <p className="truncate text-sm text-gray-600">
                                {o.city} · {o.md}
                              </p>
                            </div>
                            <div className="hidden sm:block">
                              <ContactActions o={o} compact />
                            </div>
                          </article>
                        )}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </>
          )}
        </div>
        <p className="mt-5 text-sm text-gray-500">Operator details as published on PenCom’s register of licensed operators. Branch offices and licence dates will be added from the licensing department.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────── Details panel ─────────────────────────── */

function Details({ id, onClose }: { id: string | null; onClose: () => void }) {
  const o = operators.find((x) => x.id === id);
  return (
    <Drawer open={!!o} onClose={onClose} labelledBy="op-name">
      {o && (
        <>
          <div className="relative isolate overflow-hidden bg-[#04140A] px-6 pb-8 pt-8 text-white sm:px-8">
            <DarkBackdrop animate={false} />
            <div className="relative flex items-center gap-4 pr-12">
              <Monogram o={o} size="lg" />
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F4D27A] px-2.5 py-0.5 text-xs font-bold text-[#1A1206]">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Licensed
                </span>
                <p className="mt-1 text-xs text-white/70">{typeInfo[o.type].label}</p>
              </div>
            </div>
            <h2 id="op-name" className="relative mt-5 text-2xl font-black leading-snug tracking-tight">
              {o.name}
            </h2>
            <p className="relative mt-2 text-sm text-white/75">{typeInfo[o.type].role}</p>
          </div>
          <div className="space-y-6 px-6 py-7 sm:px-8">
            <dl className="space-y-4 text-sm">
              {[
                { icon: UserRound, k: "Managing director", v: o.md },
                { icon: MapPin, k: "Head office", v: o.address },
                { icon: Phone, k: "Phone", v: o.phones.length ? o.phones.join(" · ") : "Not published" },
                { icon: Mail, k: "Email", v: o.emails.join(" · ") },
                { icon: Globe, k: "Website", v: o.website },
              ].map((r) => (
                <div key={r.k} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F2F6F0] text-[#117F21] ring-1 ring-black/[0.06]">
                    <r.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">{r.k}</dt>
                    <dd className="mt-0.5 break-words font-medium">{r.v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <ContactActions o={o} />
            {o.type === "PFA" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/performance" onClick={onClose} className={cn("group flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/10", lift, focus)}>
                  <BarChart3 className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                  <span className="flex-1 text-sm font-semibold">Compare performance</span>
                  <Chip>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Chip>
                </Link>
                <Link to="/services#rsa-transfer" onClick={onClose} className={cn("group flex items-center gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/10", lift, focus)}>
                  <ArrowLeftRight className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                  <span className="flex-1 text-sm font-semibold">How to transfer to this PFA</span>
                  <Chip>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Chip>
                </Link>
              </div>
            )}
            <p className="rounded-2xl bg-[#F2F6F0] p-4 text-xs text-gray-600">Details as published on PenCom’s register. Share this page’s address to send someone straight to this operator.</p>
          </div>
        </>
      )}
    </Drawer>
  );
}

/* ─────────────────────────── How it works ─────────────────────────── */

const nodes = [
  { icon: UserRound, title: "You and your employer", body: "At least 18% of your pay is set aside each month." },
  { icon: Vault, title: "Pension Fund Custodian", body: "Receives the contributions and holds the assets in trust." },
  { icon: Wallet, title: "Pension Fund Administrator", body: "Invests your savings and pays your benefits when you retire." },
];

function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section id="how" aria-labelledby="how-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <Headline id="how-title" kicker="How it works" title="Three safeguards around your savings" mark="Three safeguards" intro="The company that invests your money never holds it. A separate custodian keeps the assets, and PenCom supervises both." />
        <Rise className="mt-10">
          <div
            onMouseMove={spot}
            className={cn(
              "relative overflow-hidden rounded-[2rem] p-5 text-white shadow-[0_40px_80px_-40px_rgba(4,20,10,0.8)] sm:p-8",
              darkCard,
            )}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#CB9615]/20 blur-3xl" />
            <p className="relative mx-auto flex w-fit items-center justify-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-center text-sm font-semibold ring-1 ring-white/15 sm:text-base">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#F4D27A]" aria-hidden="true" />
              PenCom licenses, supervises and inspects every operator
            </p>
            <ol className="relative mt-7 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-0">
              {nodes.map((n, i) => (
                <li key={n.title} className="relative md:px-6">
                  {i > 0 && (
                    <span aria-hidden="true" className="absolute -left-0 top-1/2 hidden h-[2px] w-12 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-white/25 md:block">
                      {!reduce && (
                        <motion.span className="absolute inset-y-0 w-4 rounded-full bg-[#F4D27A]" initial={{ left: "-30%" }} whileInView={{ left: "110%" }} viewport={{ once: false }} transition={{ duration: 1.4, repeat: 3, ease: "easeInOut", delay: i * 0.3 }} />
                      )}
                    </span>
                  )}
                  <div className="group h-full rounded-3xl bg-white p-5 text-[#0B1F10] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-6">
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A] transition-transform duration-300 group-hover:scale-105">
                        <n.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-sm font-bold tabular-nums text-[#7F5A04]">0{i + 1}</span>
                    </span>
                    <h3 className="mt-4 text-lg font-black tracking-tight">{n.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{n.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="relative mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-center text-sm text-white/80">
              <span>Contributions flow to the custodian →</span>
              <span>← Investment instructions come from the PFA</span>
            </p>
          </div>
        </Rise>
      </div>
    </section>
  );
}

/* ─────────────────────────── RSA funds ─────────────────────────── */

function Funds() {
  const [age, setAge] = useState(35);
  const [status, setStatus] = useState<"working" | "retired" | "ppp">("working");
  const [nonInterest, setNonInterest] = useState(false);
  const yours = nonInterest ? "VI" : status === "retired" ? "IV" : status === "ppp" ? "V" : age >= 50 ? "III" : "II";
  const options = !nonInterest && status === "working" && age < 50 ? ["I"] : [];

  // The page's one near-black band: the fund finder is its interactive moment.
  return (
    <section id="funds" aria-labelledby="funds-title" className={cn(sectionCls, "relative isolate bg-[#04140A] text-white")}>
      <DarkBackdrop />
      <div className="mx-auto max-w-7xl">
        <Headline id="funds-title" kicker="RSA funds" title="Which fund is your money in?" mark="your money" intro="Every PFA runs the same set of RSA funds. Which one you’re in depends on your age and situation. Try it." dark />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="h-fit text-[#0B1F10] lg:sticky lg:top-[170px] lg:col-span-5">
            <FramedPanel className="p-6 sm:p-7">
              <fieldset>
                <legend className="font-black tracking-tight">I am…</legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {([["working", "Working"], ["retired", "Retired"], ["ppp", "Self-employed (PPP)"]] as const).map(([v, l]) => (
                    <label key={v} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-2xl px-2 text-center text-sm font-semibold ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", status === v ? "bg-[#0B1F10] text-[#F4D27A] ring-[#0B1F10]" : "text-gray-700 ring-black/10 hover:ring-[#117F21]")}>
                      <input type="radio" name="fund-status" value={v} checked={status === v} onChange={() => setStatus(v)} className="sr-only" />
                      {l}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className={cn("mt-7 transition-opacity", status !== "working" && "pointer-events-none opacity-40")}>
                <label htmlFor="fund-age" className="flex items-baseline justify-between font-black tracking-tight">
                  My age
                  <span className="rounded-full bg-[#0B1F10] px-3 py-0.5 font-mono text-sm text-[#F4D27A]">{age}</span>
                </label>
                <input
                  id="fund-age"
                  type="range"
                  min={18}
                  max={70}
                  value={age}
                  disabled={status !== "working"}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={cn("mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-[#117F21]", focus)}
                  style={{ background: `linear-gradient(to right, #117F21, #CB9615 ${((age - 18) / 52) * 100}%, #E5E7EB ${((age - 18) / 52) * 100}%)` }}
                />
              </div>
              <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F2F6F0] p-4 ring-1 ring-black/10">
                <input type="checkbox" checked={nonInterest} onChange={(e) => setNonInterest(e.target.checked)} className="mt-0.5 h-5 w-5 accent-[#117F21]" />
                <span className="text-sm font-semibold">I want non-interest (ethical) investments</span>
              </label>
              <p className="mt-5 text-xs text-gray-600">A simplified guide. Your PFA can confirm which fund you are in and help you move between funds where the rules allow.</p>
            </FramedPanel>
          </div>

          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7" aria-live="polite">
            {funds.map((f) => {
              const mine = f.key === yours;
              const open = options.includes(f.key);
              return (
                <motion.li
                  key={f.key}
                  layout
                  onMouseMove={spot}
                  className={cn(
                    "relative overflow-hidden rounded-[1.75rem] p-5 ring-1 transition-[background-color,box-shadow,color] duration-300 sm:p-6",
                    mine
                      ? "bg-white text-[#0B1F10] shadow-[0_0_0_2px_#F4D27A,0_30px_70px_-25px_rgba(244,210,122,0.55)] ring-transparent"
                      : open
                        ? "bg-white/[0.07] ring-[#F4D27A]/50"
                        : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.07]",
                    !mine && glowDark,
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={cn("font-mono text-3xl font-black tabular-nums", mine ? "text-[#0A4A13]" : "text-[#F4D27A]")}>Fund {f.key}</span>
                    {mine && <span className="rounded-full bg-[#0B1F10] px-2.5 py-1 text-xs font-bold text-[#F4D27A]">Your fund</span>}
                    {open && <span className="rounded-full px-2.5 py-1 text-xs font-bold text-[#F4D27A] ring-1 ring-[#F4D27A]/60">You can choose this</span>}
                  </div>
                  <p className={cn("mt-3 font-semibold", mine ? "text-[#0B1F10]" : "text-white")}>{f.who}</p>
                  <p className={cn("mt-1 text-sm leading-relaxed", mine ? "text-gray-600" : "text-white/75")}>{f.note}</p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Performance + complaints ─────────────────────────── */

function Performance() {
  return (
    <section id="performance" aria-labelledby="perf-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-12">
        <Rise className="lg:col-span-8">
          <div
            onMouseMove={spot}
            className={cn(
              "relative h-full overflow-hidden rounded-[2rem] p-7 text-white shadow-[0_40px_80px_-40px_rgba(4,20,10,0.8)] sm:p-10",
              darkCard,
            )}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#117F21]/60 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#CB9615]/25 blur-3xl" />
            <div className="relative">
              <Headline id="perf-title" kicker="Performance and reporting" title="Compare PFA performance and fees" mark="performance and fees" dark stacked />
              <p className="mt-4 max-w-xl text-white/80">Returns by fund, assets under management and published fees, with the data to download. Past returns don’t guarantee future returns.</p>
              <Link to="/performance" className={cn("group mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 font-semibold text-[#1A1206] transition hover:bg-white", focus)}>
                <BarChart3 className="h-5 w-5" aria-hidden="true" />
                See industry performance
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </Rise>
        <Rise delay={0.08} className="lg:col-span-4">
          <div onMouseMove={spot} className={cn("relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-7 ring-1 ring-black/10 sm:p-8", glowLight, lift)}>
            <span aria-hidden="true" className="absolute inset-x-8 top-0 h-[3px] rounded-b-full bg-[#B52026]/70" />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FCEBEB] text-[#B52026]">
              <MessageSquareWarning className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-black tracking-tight">Problem with an operator?</h2>
            <p className="mt-2 text-gray-600">Complain to the operator first. If it isn’t resolved, or someone unlicensed approaches you, tell PenCom.</p>
            <div className="mt-auto pt-6">
              <Link to="/connect#report" className={cn(darkBtn, focus)}>
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Report to PenCom
                <Chip>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Chip>
              </Link>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
