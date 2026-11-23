"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, BadgeCheck, BarChart3, CalendarDays, Check, ChevronDown, FileText, Images, LayoutGrid, Link2, List, Mail,
  Megaphone, Mic, Newspaper, Paperclip, Phone, Play, Scale, Search, Share2, SlidersHorizontal, Tv, X, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { CountUp } from "@/views/about/primitives";
import { social } from "@/views/connect/data";
import { ArrowChip, glowLight } from "@/views/docs/kit";
import Headline from "@/views/theme/Headline";
import { DarkBackdrop, PageHero, Rise, sectionCls, spot } from "@/views/theme/ui";
import { cardImage, galleries, kinds, totals, years, type Kind, type NewsItem } from "./data";

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

export const look: Record<Kind, { icon: LucideIcon; chip: string; dot: string }> = {
  "Press release": { icon: Megaphone, chip: "bg-[#E8F5E9] text-[#105D1D]", dot: "bg-[#14892A]" },
  Statement: { icon: FileText, chip: "bg-[#E6F1FB] text-[#0B4F8A]", dot: "bg-[#1E88E5]" },
  Speech: { icon: Mic, chip: "bg-[#F1EAFB] text-[#5B2E91]", dot: "bg-[#7E57C2]" },
  Event: { icon: CalendarDays, chip: "bg-[#FAEEDA] text-[#854F0B]", dot: "bg-[#D97706]" },
  Reports: { icon: BarChart3, chip: "bg-[#FFF2CC] text-[#7A5200]", dot: "bg-[#CB9615]" },
  Regulation: { icon: Scale, chip: "bg-[#EEF6EE] text-[#105D1D]", dot: "bg-[#105D1D]" },
  "Media coverage": { icon: Tv, chip: "bg-[#FCEBEB] text-[#A32D2D]", dot: "bg-[#D32F2F]" },
};

export function KindChip({ kind, className }: { kind: Kind; className?: string }) {
  const { t } = useI18n();
  const s = look[kind];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em]", s.chip, className)}>
      <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
      {t(kind)}
    </span>
  );
}

/* ─────────────────────────── Hero + featured story ─────────────────────────── */

export function Hero({ lead, q, onSearch }: { lead: NewsItem; q: string; onSearch: (q: string) => void }) {
  const { t } = useI18n();
  const [text, setText] = useState(q);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(text.trim());
  };

  return (
    <PageHero
      id="news-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Connect", to: "/connect" }, { label: "News" }]}
      pill={{ icon: Newspaper, label: "Newsroom" }}
      title="News and updates from PenCom"
      mark="PenCom"
      intro={<p>Press releases, statements, reports and media coverage from the National Pension Commission, newest first.</p>}
      actions={
        <div className="max-w-xl">
          {/* Search pill: gold-to-green edge, pointer glow, focus ring on the pill (not inside it) */}
          <div className="relative rounded-full p-px [background-image:linear-gradient(120deg,rgba(244,210,122,0.9),rgba(255,255,255,0.15),rgba(20,137,42,0.8))] has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[#FFD84D]">
            <form role="search" onSubmit={submit} onMouseMove={spot} className={cn("flex items-center gap-1.5 rounded-full bg-white p-1.5 pl-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] sm:gap-2 sm:pl-5", glowLight)}>
              <label htmlFor="news-search" className="sr-only">
                Search the news
              </label>
              <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
              <input
                id="news-search"
                type="search"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("Search the news, e.g. “Pencare” or “report”")}
                className="min-h-12 w-full min-w-0 bg-transparent text-base text-[#1A3A22] placeholder:text-gray-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0 [&::-webkit-search-cancel-button]:hidden"
              />
              {text && (
                <button type="button" onClick={() => { setText(""); onSearch(""); }} aria-label={t("Clear search")} className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:bg-[#F2F6F0] hover:text-[#1A3A22]", focus)}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
              <button type="submit" className={cn("group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#1A3A22] py-1.5 pl-4 pr-1.5 font-semibold text-white transition hover:bg-[#14892A] sm:pl-5", focus)}>
                Search
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </form>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              [totals.stories, "Stories"],
              [totals.coverage, "Media reports"],
              [totals.photos, "Photos"],
            ].map(([v, l]) => (
              <div
                key={l}
                onMouseMove={spot}
                className="rounded-2xl bg-white/[0.06] px-4 py-3 text-white ring-1 ring-white/15 backdrop-blur transition hover:ring-[#F4D27A]/50 [background-image:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.18),transparent_60%)]"
              >
                <dt className="text-xs font-semibold text-white/75">{l}</dt>
                <dd className="mt-0.5 bg-gradient-to-r from-[#F4D27A] to-[#E9B949] bg-clip-text font-mono text-2xl font-black tabular-nums text-transparent sm:text-3xl">
                  <CountUp value={String(v)} duration={1.2} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      }
      aside={<Featured item={lead} />}
    />
  );
}

function Featured({ item }: { item: NewsItem }) {
  const { t } = useI18n();
  return (
    <article className="group relative" aria-labelledby="lead-title">
      {/* Thin gold-to-green edge, as on the theme's floating panels */}
      <div aria-hidden="true" className="absolute -inset-px rounded-[calc(2rem+1px)] bg-gradient-to-br from-[#F4D27A]/80 via-white/10 to-[#14892A]/70" />
      <div
        onMouseMove={spot}
        className="relative h-[30rem] overflow-hidden rounded-[2rem] bg-[#1A3A22] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] sm:h-[34rem]"
      >
        <img src={item.image} alt={t(item.imageAlt)} className="absolute inset-0 h-full w-full object-cover transition [transition-duration:1600ms] ease-out group-hover:scale-105" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#12331C]/80 via-[#12331C]/10 to-[#12331C]/40" />
        {/* Gold spotlight that follows the pointer over the photo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 [background-image:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.22),transparent_55%)]" />
        <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.9)]">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#105D1D]/60 [animation-iteration-count:3]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#105D1D]" />
          </span>
          Top story
        </p>
        <div className="absolute inset-x-3 bottom-3 rounded-[1.5rem] bg-white/95 p-5 shadow-xl backdrop-blur transition duration-500 group-hover:-translate-y-1 sm:inset-x-4 sm:bottom-4 sm:p-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <KindChip kind={item.kind} />
            <time dateTime={item.date}>{item.dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{t(item.meta)}</span>
          </p>
          <h2 id="lead-title" className="mt-3 text-2xl font-black leading-tight tracking-tight text-[#1A3A22] sm:text-[1.7rem]">
            <Link to={item.to} className={cn("rounded after:absolute after:inset-0 after:rounded-[1.5rem] after:content-['']", focus)}>
              {t(item.title)}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-gray-600">{t(item.excerpt)}</p>
          <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] py-1 pl-4 pr-1 text-sm font-semibold text-white transition group-hover:bg-[#14892A]">
            {t(item.action)}
            <ArrowChip dark />
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────── Filter bar ─────────────────────────── */

export type View = "grid" | "list";
export type Sort = "new" | "old";

export function FilterBar({
  kind, setKind, year, setYear, sort, setSort, view, setView, counts, shown, total, q, clear,
}: {
  kind: Kind | null; setKind: (k: Kind | null) => void;
  year: string | null; setYear: (y: string | null) => void;
  sort: Sort; setSort: (s: Sort) => void;
  view: View; setView: (v: View) => void;
  counts: Record<string, number>; shown: number; total: number; q: string; clear: () => void;
}) {
  const { t } = useI18n();
  const chips: { id: Kind | null; label: string; n: number }[] = [
    { id: null, label: "All", n: counts.all },
    ...kinds.filter((k) => counts[k.id] > 0).map((k) => ({ id: k.id, label: k.label, n: counts[k.id] })),
  ];
  const active = !!(kind || year || q);
  const select = cn(
    "min-h-11 appearance-none rounded-full bg-white pl-4 pr-9 text-sm font-semibold text-[#1A3A22] ring-1 ring-black/10 transition hover:ring-[#1A3A22]/40",
    focus,
  );

  return (
    <div className="sticky top-[92px] z-30 -mx-4 mt-8 px-4 py-3">
      <div className="rounded-[1.75rem] bg-white/90 p-1.5 shadow-[0_24px_50px_-30px_rgba(18,51,28,0.7)] ring-1 ring-black/10 backdrop-blur-xl lg:rounded-full">
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center">
          <div role="group" aria-label={t("Type of news")} className="flex snap-x gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-1 [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => {
              const on = kind === c.id;
              return (
                <button
                  key={c.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setKind(c.id)}
                  className={cn("relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm font-semibold transition", on ? "text-[#F4D27A]" : "text-gray-700 hover:bg-[#F2F6F0]", focus)}
                >
                  {on && <motion.span layoutId="news-kind-pill" className="absolute inset-0 rounded-full bg-[#1A3A22]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{t(c.label)}</span>
                  <span className={cn("relative min-w-[1.5rem] rounded-full px-1.5 text-center font-mono text-xs tabular-nums", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#F2F6F0] text-gray-700")}>{c.n}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 px-1 pb-1 lg:p-0">
            <label className="relative">
              <span className="sr-only">{t("Year")}</span>
              <select value={year ?? ""} onChange={(e) => setYear(e.target.value || null)} className={select}>
                <option value="">{t("All years")}</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" aria-hidden="true" />
            </label>
            <label className="relative">
              <span className="sr-only">{t("Sort")}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={select}>
                <option value="new">{t("Newest first")}</option>
                <option value="old">{t("Oldest first")}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" aria-hidden="true" />
            </label>
            <div role="group" aria-label={t("Layout")} className="ml-auto flex rounded-full bg-[#F2F6F0] p-1 lg:ml-0">
              {([["grid", LayoutGrid, "Cards"], ["list", List, "List"]] as const).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  title={t(label)}
                  className={cn("relative flex h-10 w-11 items-center justify-center rounded-full transition", view === v ? "text-[#F4D27A]" : "text-gray-600 hover:text-[#1A3A22]", focus)}
                >
                  {view === v && <motion.span layoutId="news-view-pill" className="absolute inset-0 rounded-full bg-[#1A3A22]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <Icon className="relative h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t(label)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 px-2 text-sm text-gray-700">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A]" aria-hidden="true">
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </span>
        <p aria-live="polite" data-i18n-done>
          {t("Showing {n} of {total} items", { n: shown, total })}
          {q && <> {t("for “{q}”", { q })}</>}
        </p>
        {active && (
          <button type="button" onClick={clear} className={cn("inline-flex min-h-9 items-center gap-1 rounded-full bg-white px-3 font-semibold text-[#1A3A22] ring-1 ring-black/10 transition hover:bg-[#1A3A22] hover:text-[#F4D27A]", focus)}>
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Cards ─────────────────────────── */

const lift = "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]";

export function NewsCard({ item, view, onShare }: { item: NewsItem; view: View; onShare: (i: NewsItem) => void }) {
  const { t } = useI18n();
  const video = item.kind === "Media coverage";
  const img = cardImage(item.image);

  if (view === "list") {
    return (
      <article onMouseMove={spot} className={cn("group relative flex items-center gap-4 rounded-3xl bg-white p-3 ring-1 ring-black/10 sm:gap-5 sm:p-4", glowLight, lift)}>
        <div className="relative aspect-[4/3] w-28 shrink-0 self-start overflow-hidden rounded-2xl bg-[#1A3A22] sm:aspect-video sm:w-52">
          <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          {video && (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#12331C]/25">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] shadow sm:h-11 sm:w-11"><Play className="ml-0.5 h-4 w-4 fill-current" /></span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-600 sm:text-sm">
            <KindChip kind={item.kind} />
            <time dateTime={item.date}>{item.dateLabel}</time>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{t(item.meta)}</span>
          </p>
          <h3 className="mt-2 font-bold leading-snug text-[#1A3A22] sm:text-lg">
            <Link to={item.to} className={cn("rounded transition-colors after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-[#117F21]", focus)}>
              {t(item.title)}
            </Link>
          </h3>
          <p className="mt-1 hidden line-clamp-2 text-sm leading-relaxed text-gray-600 sm:block">{t(item.excerpt)}</p>
        </div>
        <div className="hidden shrink-0 flex-col items-center gap-2 sm:flex">
          <ArrowChip />
          <ShareButton item={item} onShare={onShare} />
        </div>
      </article>
    );
  }

  return (
    <article onMouseMove={spot} className={cn("group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/10", glowLight, lift)}>
      {/* Green-to-gold line that grows along the top on hover */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1A3A22]">
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#12331C]/60 via-transparent to-[#12331C]/20" />
        <KindChip kind={item.kind} className="absolute left-3 top-3 shadow-sm" />
        {item.attachment && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#1A3A22]/85 px-2.5 py-1 text-[11px] font-bold text-[#F4D27A] shadow-sm backdrop-blur">
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            PDF
          </span>
        )}
        {video && (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] shadow-[0_14px_30px_-10px_rgba(244,210,122,0.9)] transition duration-300 group-hover:scale-110">
              <span className="absolute inset-0 rounded-full ring-2 ring-[#F4D27A]/70 transition duration-500 group-hover:scale-125 group-hover:opacity-0" />
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
          <time dateTime={item.date}>{item.dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{t(item.meta)}</span>
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[#1A3A22]">
          <Link to={item.to} className={cn("rounded transition-colors after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-[#117F21]", focus)}>
            {t(item.title)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[0.95rem] leading-relaxed text-gray-600">{t(item.excerpt)}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.07] pt-4">
          <span className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#1A3A22]">
            <ArrowChip />
            {t(item.action)}
          </span>
          <ShareButton item={item} onShare={onShare} />
        </div>
      </div>
    </article>
  );
}

function ShareButton({ item, onShare, className }: { item: NewsItem; onShare: (i: NewsItem) => void; className?: string }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={() => onShare(item)}
      aria-label={`${t("Share")}: ${t(item.title)}`}
      title={t("Share")}
      data-i18n-done
      className={cn("relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 ring-1 ring-black/10 transition hover:bg-[#1A3A22] hover:text-[#F4D27A]", focus, className)}
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

/** "Link copied" toast. */
export function Toast({ text }: { text: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {text && (
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#1A3A22] px-4 py-2.5 text-sm font-semibold text-white shadow-xl ring-1 ring-[#F4D27A]/40"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206]">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Empty({ clear }: { clear: () => void }) {
  return (
    <div onMouseMove={spot} className={cn("rounded-[1.75rem] bg-white px-6 py-14 text-center ring-1 ring-black/10", glowLight)}>
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A]">
        <Search className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-black tracking-tight text-[#1A3A22]">No news matches your search</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-600">Try a different word, choose another year, or look in the regulatory library for circulars and guidelines.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={clear} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] px-5 font-semibold text-white transition hover:bg-[#14892A]", focus)}>
          Clear filters
        </button>
        <Link to="/regulations#library" className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-white py-1 pl-5 pr-1 font-semibold text-[#1A3A22] ring-1 ring-black/10 transition hover:ring-[#1A3A22]/40", focus)}>
          Open the library
          <ArrowChip />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── Photo galleries ─────────────────────────── */

export function Galleries() {
  const { t } = useI18n();
  const list = galleries.slice(0, 4);
  return (
    <section aria-labelledby="galleries-title" className={cn("bg-[#F2F6F0]", sectionCls)}>
      <div className="mx-auto max-w-7xl">
        <Headline
          id="galleries-title"
          kicker="Photos"
          title="Pictures from our events"
          mark="our events"
          intro="Briefings, visits, campaigns and training, captioned so everyone can follow."
          action={
            <Link to="/media#photos" className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] py-1 pl-5 pr-1 text-sm font-semibold text-white transition hover:bg-[#14892A]", focus)}>
              <Images className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
              {t("All photos and videos")}
              <ArrowChip dark />
            </Link>
          }
        />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((g, i) => (
            <li key={g.id}>
              <Rise delay={i * 0.06} className="h-full">
                <Link to={g.to} onMouseMove={spot} className={cn("group flex h-full flex-col rounded-3xl bg-white p-3 pb-5 ring-1 ring-black/10", glowLight, lift, focus)}>
                  {/* Fanned photo stack: the back photos swing out on hover */}
                  <div className="relative h-56 [perspective:900px]">
                    {g.cover.map((c, k) => (
                      <img
                        key={c.src}
                        src={c.src}
                        alt={k === 0 ? c.alt : ""}
                        loading="lazy"
                        className={cn(
                          "absolute inset-x-4 top-3 h-48 w-[calc(100%-2rem)] rounded-2xl object-cover shadow-[0_18px_40px_-20px_rgba(18,51,28,0.6)] ring-4 ring-white transition duration-500 ease-out",
                          k === 0 && "z-30 group-hover:-translate-y-1",
                          k === 1 && "z-20 -rotate-3 scale-[0.96] group-hover:-translate-x-5 group-hover:-rotate-[9deg]",
                          k === 2 && "z-10 rotate-3 scale-[0.92] group-hover:translate-x-5 group-hover:rotate-[9deg]",
                        )}
                      />
                    ))}
                    <span className="absolute bottom-4 right-6 z-40 inline-flex items-center gap-1.5 rounded-full bg-[#1A3A22]/90 px-2.5 py-1 text-xs font-bold text-[#F4D27A] backdrop-blur">
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      <span data-i18n-done>{t("{n} photos", { n: g.count })}</span>
                    </span>
                  </div>
                  <div className="mt-2 flex flex-1 items-start justify-between gap-3 px-2">
                    <div>
                      <h3 className="font-bold leading-snug text-[#1A3A22] transition-colors group-hover:text-[#117F21]">{t(g.title)}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{t(g.blurb)}</p>
                    </div>
                    <ArrowChip />
                  </div>
                </Link>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── Media desk ─────────────────────────── */

const glass = "rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur transition duration-300 hover:-translate-y-1 hover:ring-[#F4D27A]/40 [background-image:radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.14),transparent_55%)] sm:p-6";
const label = "text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]";

/** The page's one near-black band. */
export function MediaDesk() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="media-desk-title" className={cn("relative isolate bg-[#12331C] text-white", sectionCls)}>
      <DarkBackdrop />
      <div className="relative mx-auto max-w-7xl">
        <Headline
          id="media-desk-title"
          kicker="Media desk"
          title="For journalists and researchers"
          mark="researchers"
          intro="Ask Corporate Communications for interviews, comments or official figures. Only trust news shared on our verified accounts."
          dark
        />
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Rise className="h-full">
            <div onMouseMove={spot} className={cn(glass, "h-full")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206]" aria-hidden="true">
                <Megaphone className="h-5 w-5" />
              </span>
              <p className={cn(label, "mt-4")}>Press enquiries</p>
              <p className="mt-2 text-lg font-bold">Corporate Communications Department</p>
              <ul className="mt-4 space-y-1 text-sm">
                <li>
                  <a href="mailto:info@pencom.gov.ng" className={cn("group inline-flex min-h-11 items-center gap-3 rounded-full pr-3 transition hover:text-[#F4D27A]", focus)}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]"><Mail className="h-4 w-4" aria-hidden="true" /></span>
                    info@pencom.gov.ng
                  </a>
                </li>
                <li>
                  <a href="tel:094611300" className={cn("group inline-flex min-h-11 items-center gap-3 rounded-full pr-3 transition hover:text-[#F4D27A]", focus)}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]"><Phone className="h-4 w-4" aria-hidden="true" /></span>
                    09-4611300
                  </a>
                </li>
              </ul>
            </div>
          </Rise>
          <Rise delay={0.06} className="h-full">
            <div onMouseMove={spot} className={cn(glass, "h-full")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15" aria-hidden="true">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <p className={cn(label, "mt-4")}>Verified accounts</p>
              <ul className="mt-3 space-y-1">
                {social.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("group flex min-h-11 items-center justify-between gap-3 rounded-full px-3 text-sm transition hover:bg-white/10", focus)}>
                      <span><span className="font-semibold">{s.name}</span> <span className="text-white/70">{s.handle}</span></span>
                      <Link2 className="h-4 w-4 shrink-0 text-white/60 transition group-hover:text-[#F4D27A]" aria-hidden="true" />
                      <span className="sr-only">{t("(opens in a new tab)")}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
          <Rise delay={0.12} className="h-full">
            <div onMouseMove={spot} className={cn(glass, "flex h-full flex-col gap-3")}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15" aria-hidden="true">
                <BarChart3 className="h-5 w-5" />
              </span>
              <p className={cn(label, "mt-1")}>Data and documents</p>
              {[
                { label: "Industry figures and charts", to: "/performance" },
                { label: "Reports and publications", to: "/resources#publications" },
                { label: "Circulars and regulations", to: "/regulations#library" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className={cn("group flex min-h-12 items-center justify-between gap-3 rounded-full bg-white py-1 pl-5 pr-1 text-sm font-semibold text-[#1A3A22] transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)}>
                  {t(l.label)}
                  <ArrowChip />
                </Link>
              ))}
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
