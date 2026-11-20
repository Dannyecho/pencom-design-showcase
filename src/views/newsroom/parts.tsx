"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BarChart3, CalendarDays, Check, ChevronDown, FileText, Images, LayoutGrid, Link2, List, Mail,
  Megaphone, Mic, Paperclip, Phone, Play, Scale, Search, Share2, SlidersHorizontal, Tv, X, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { social } from "@/views/connect/data";
import Headline from "@/views/theme/Headline";
import { cardImage, galleries, kinds, totals, years, type Kind, type NewsItem } from "./data";

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

export const look: Record<Kind, { icon: LucideIcon; chip: string; dot: string }> = {
  "Press release": { icon: Megaphone, chip: "bg-[#E8F5E9] text-[#0A4A13]", dot: "bg-[#117F21]" },
  Statement: { icon: FileText, chip: "bg-[#E6F1FB] text-[#0B4F8A]", dot: "bg-[#1E88E5]" },
  Speech: { icon: Mic, chip: "bg-[#F1EAFB] text-[#5B2E91]", dot: "bg-[#7E57C2]" },
  Event: { icon: CalendarDays, chip: "bg-[#FAEEDA] text-[#854F0B]", dot: "bg-[#D97706]" },
  Reports: { icon: BarChart3, chip: "bg-[#FFF2CC] text-[#7A5200]", dot: "bg-[#CB9615]" },
  Regulation: { icon: Scale, chip: "bg-[#EEF6EE] text-[#0A4A13]", dot: "bg-[#0A4A13]" },
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
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const [text, setText] = useState(q);
  const H = t("News and updates from PenCom");
  const M = t("PenCom");
  const has = H.includes(M);
  const [b, a] = has ? [H.slice(0, H.lastIndexOf(M)), H.slice(H.lastIndexOf(M) + M.length)] : [H, ""];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(text.trim());
  };

  return (
    <section aria-labelledby="news-title" className="relative isolate overflow-hidden bg-[#F2F6F0]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
        <div className="absolute -right-32 top-32 h-[26rem] w-[26rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-12 lg:pb-20">
        <div className="lg:col-span-6 lg:pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li><Link to="/" className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to="/connect" className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>Connect</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#0E2414]">News</li>
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#117F21]/60 [animation-iteration-count:3]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#117F21]" />
            </span>
            Newsroom
          </motion.p>
          <motion.h1
            id="news-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            data-i18n-done={lang !== "en" ? "" : undefined}
            className="mt-5 text-[2.4rem] font-bold leading-[1.05] tracking-tight text-[#0E2414] sm:text-6xl"
          >
            {b}
            {has && (
              <span className="relative whitespace-nowrap text-[#117F21]">
                {M}
                <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                  <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease }} />
                </svg>
              </span>
            )}
            {a}
          </motion.h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700">
            Press releases, statements, reports and media coverage from the National Pension Commission, newest first.
          </p>

          <form role="search" onSubmit={submit} className="mt-7 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-28px_rgba(10,74,19,0.6)] ring-1 ring-black/10 focus-within:ring-2 focus-within:ring-[#117F21]">
            <label htmlFor="news-search" className="sr-only">
              Search the news
            </label>
            <Search className="ml-2 h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
            <input
              id="news-search"
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("Search the news, e.g. “Pencare” or “report”")}
              className="min-h-12 w-full bg-transparent text-base text-[#0E2414] placeholder:text-gray-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {text && (
              <button type="button" onClick={() => { setText(""); onSearch(""); }} aria-label={t("Clear search")} className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100", focus)}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button type="submit" className={cn("inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              Search
            </button>
          </form>

          <dl className="mt-7 grid max-w-md grid-cols-3 gap-3">
            {[
              [totals.stories, "Stories"],
              [totals.coverage, "Media reports"],
              [totals.photos, "Photos"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-black/5 backdrop-blur">
                <dt className="text-xs font-semibold text-gray-600">{l}</dt>
                <dd className="font-mono text-2xl font-bold text-[#0E2414]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6">
          <Featured item={lead} />
        </div>
      </div>
    </section>
  );
}

function Featured({ item }: { item: NewsItem }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 24, rotate: reduce ? 0 : 1.2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease }}
      className="group relative"
      aria-labelledby="lead-title"
    >
      <div aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-[2.2rem] bg-[#0A4A13]" />
      <div className="relative h-[30rem] overflow-hidden rounded-[2rem] bg-[#0E2414] shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)] sm:h-[34rem]">
        <img src={item.image} alt={t(item.imageAlt)} className="absolute inset-0 h-full w-full object-cover transition [transition-duration:1600ms] ease-out group-hover:scale-105" fetchPriority="high" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
        <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#FFD84D] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#04140A] shadow">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0A4A13]" aria-hidden="true" />
          Top story
        </p>
        <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-white/95 p-5 shadow-xl backdrop-blur sm:p-6">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
            <KindChip kind={item.kind} />
            <time dateTime={item.date}>{item.dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{t(item.meta)}</span>
          </p>
          <h2 id="lead-title" className="mt-3 text-2xl font-bold leading-tight text-[#0E2414] sm:text-[1.7rem]">
            <Link to={item.to} className={cn("rounded after:absolute after:inset-0 after:rounded-[2rem] after:content-['']", focus)}>
              {t(item.title)}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-gray-600">{t(item.excerpt)}</p>
          <span className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A4A13] px-4 text-sm font-semibold text-white transition group-hover:bg-[#117F21]">
            {t(item.action)}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
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
    "min-h-11 appearance-none rounded-xl bg-white pl-3 pr-9 text-sm font-semibold text-[#0E2414] ring-1 ring-black/10 transition hover:ring-[#117F21]",
    focus,
  );

  return (
    <div className="sticky top-[92px] z-30 -mx-4 mt-5 px-4 py-3">
      <div className="rounded-3xl bg-white/85 p-2 shadow-[0_18px_40px_-30px_rgba(10,46,16,0.6)] ring-1 ring-black/5 backdrop-blur-xl sm:p-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div role="group" aria-label={t("Type of news")} className="-mx-1 flex snap-x gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] lg:flex-1 [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => {
              const on = kind === c.id;
              return (
                <button
                  key={c.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setKind(c.id)}
                  className={cn("relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-2xl px-4 text-sm font-semibold transition", on ? "text-white" : "text-gray-700 hover:bg-[#F1F5EF]", focus)}
                >
                  {on && <motion.span layoutId="news-kind-pill" className="absolute inset-0 rounded-2xl bg-[#0A4A13]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{t(c.label)}</span>
                  <span className={cn("relative rounded-full px-1.5 text-xs tabular-nums", on ? "bg-white/20" : "bg-gray-100 text-gray-600")}>{c.n}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">{t("Year")}</span>
              <select value={year ?? ""} onChange={(e) => setYear(e.target.value || null)} className={select}>
                <option value="">{t("All years")}</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            </label>
            <label className="relative">
              <span className="sr-only">{t("Sort")}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={select}>
                <option value="new">{t("Newest first")}</option>
                <option value="old">{t("Oldest first")}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            </label>
            <div role="group" aria-label={t("Layout")} className="ml-auto flex rounded-xl bg-gray-100 p-1 lg:ml-0">
              {([["grid", LayoutGrid, "Cards"], ["list", List, "List"]] as const).map(([v, Icon, label]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  title={t(label)}
                  className={cn("flex h-9 w-10 items-center justify-center rounded-lg transition", view === v ? "bg-white text-[#0A4A13] shadow" : "text-gray-500 hover:text-gray-900", focus)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{t(label)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 px-1 text-sm text-gray-600">
        <SlidersHorizontal className="h-4 w-4 text-[#117F21]" aria-hidden="true" />
        <p aria-live="polite" data-i18n-done>
          {t("Showing {n} of {total} items", { n: shown, total })}
          {q && <> {t("for “{q}”", { q })}</>}
        </p>
        {active && (
          <button type="button" onClick={clear} className={cn("inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-[#0A4A13] ring-1 ring-black/10 hover:bg-[#E8F5E9]", focus)}>
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Cards ─────────────────────────── */

export function NewsCard({ item, view, onShare }: { item: NewsItem; view: View; onShare: (i: NewsItem) => void }) {
  const { t } = useI18n();
  const video = item.kind === "Media coverage";
  const img = cardImage(item.image);

  if (view === "list") {
    return (
      <article className="group relative flex gap-4 rounded-3xl bg-white p-3 ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-34px_rgba(0,0,0,0.5)] sm:gap-5 sm:p-4">
        <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-2xl bg-[#0E2414] sm:aspect-video sm:w-52">
          <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          {video && (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#A32D2D] shadow sm:h-11 sm:w-11"><Play className="h-4 w-4 fill-current" /></span>
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
          <h3 className="mt-2 font-bold leading-snug text-[#0E2414] sm:text-lg">
            <Link to={item.to} className={cn("rounded after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:text-[#0A4A13]", focus)}>
              {t(item.title)}
            </Link>
          </h3>
          <p className="mt-1 hidden line-clamp-2 text-sm leading-relaxed text-gray-600 sm:block">{t(item.excerpt)}</p>
        </div>
        <ShareButton item={item} onShare={onShare} className="hidden self-start sm:flex" />
      </article>
    );
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(10,46,16,0.55)] hover:ring-[#117F21]/30">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0E2414]">
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
        <KindChip kind={item.kind} className="absolute left-3 top-3 shadow-sm" />
        {item.attachment && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-[#0E2414] shadow-sm">
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            PDF
          </span>
        )}
        {video && (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#A32D2D] shadow-xl backdrop-blur transition duration-300 group-hover:scale-110">
              <span className="absolute inset-0 rounded-full ring-2 ring-white/60 transition duration-500 group-hover:scale-125 group-hover:opacity-0" />
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
          <time dateTime={item.date}>{item.dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{t(item.meta)}</span>
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-[#0E2414]">
          <Link to={item.to} className={cn("rounded bg-[linear-gradient(#CB9615,#CB9615)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:bg-[length:100%_2px]", focus)}>
            {t(item.title)}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[0.95rem] leading-relaxed text-gray-600">{t(item.excerpt)}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#117F21]">
            {t(item.action)}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
      className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 ring-1 ring-black/10 transition hover:bg-[#0A4A13] hover:text-white", focus, className)}
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
            className="inline-flex items-center gap-2 rounded-full bg-[#0E2414] px-4 py-2.5 text-sm font-semibold text-white shadow-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F4D27A] text-[#0E2414]">
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
    <div className="rounded-3xl bg-white px-6 py-14 text-center ring-1 ring-black/10">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] text-[#117F21]">
        <Search className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-xl font-bold text-[#0E2414]">No news matches your search</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-600">Try a different word, choose another year, or look in the regulatory library for circulars and guidelines.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={clear} className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white hover:bg-[#117F21]", focus)}>
          Clear filters
        </button>
        <Link to="/regulations#library" className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 hover:bg-[#E8F5E9]", focus)}>
          Open the library
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────── Photo galleries ─────────────────────────── */

export function Galleries() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const list = galleries.slice(0, 4);
  return (
    <section aria-labelledby="galleries-title" className="overflow-x-clip px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline
          id="galleries-title"
          n="02"
          kicker="Photos"
          title="Pictures from our events"
          mark="our events"
          intro="Briefings, visits, campaigns and training, captioned so everyone can follow."
          action={
            <Link to="/media#photos" className={cn("inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 text-sm font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              <Images className="h-4 w-4" aria-hidden="true" />
              {t("All photos and videos")}
            </Link>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((g, i) => (
            <motion.li
              key={g.id}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease }}
            >
              <Link to={g.to} className={cn("group block rounded-3xl", focus)}>
                <div className="relative h-56 [perspective:900px]">
                  {g.cover.map((c, k) => (
                    <img
                      key={c.src}
                      src={c.src}
                      alt={k === 0 ? c.alt : ""}
                      loading="lazy"
                      className={cn(
                        "absolute inset-x-4 top-3 h-48 w-[calc(100%-2rem)] rounded-2xl object-cover shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] ring-4 ring-white transition duration-500 ease-out",
                        k === 0 && "z-30 group-hover:-translate-y-1",
                        k === 1 && "z-20 -rotate-3 scale-[0.96] group-hover:-translate-x-6 group-hover:-rotate-[9deg]",
                        k === 2 && "z-10 rotate-3 scale-[0.92] group-hover:translate-x-6 group-hover:rotate-[9deg]",
                      )}
                    />
                  ))}
                  <span className="absolute bottom-4 right-6 z-40 inline-flex items-center gap-1.5 rounded-full bg-[#0E2414]/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                    <Images className="h-3.5 w-3.5" aria-hidden="true" />
                    <span data-i18n-done>{t("{n} photos", { n: g.count })}</span>
                  </span>
                </div>
                <h3 className="mt-2 px-1 font-bold text-[#0E2414] group-hover:text-[#0A4A13] group-hover:underline">{t(g.title)}</h3>
                <p className="mt-1 px-1 text-sm leading-relaxed text-gray-600">{t(g.blurb)}</p>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── Media desk ─────────────────────────── */

export function MediaDesk() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="media-desk-title" className="px-4 pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0A4A13] p-6 text-white shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)] sm:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#117F21] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-[#CB9615]/30 blur-3xl" />
        <div className="relative">
          <Headline
            id="media-desk-title"
            n="03"
            kicker="Media desk"
            title="For journalists and researchers"
            mark="researchers"
            intro="Ask Corporate Communications for interviews, comments or official figures. Only trust news shared on our verified accounts."
            dark
          />
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Press enquiries</p>
              <p className="mt-2 font-semibold">Corporate Communications Department</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="mailto:info@pencom.gov.ng" className={cn("group inline-flex items-center gap-2 rounded hover:underline", focus)}>
                    <Mail className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
                    info@pencom.gov.ng
                  </a>
                </li>
                <li>
                  <a href="tel:094611300" className={cn("inline-flex items-center gap-2 rounded hover:underline", focus)}>
                    <Phone className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
                    09-4611300
                  </a>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Verified accounts</p>
              <ul className="mt-3 space-y-1.5">
                {social.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("group flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm transition hover:bg-white/10", focus)}>
                      <span><span className="font-semibold">{s.name}</span> <span className="text-white/70">{s.handle}</span></span>
                      <Link2 className="h-4 w-4 text-white/60 group-hover:text-[#F4D27A]" aria-hidden="true" />
                      <span className="sr-only">{t("(opens in a new tab)")}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Data and documents</p>
              {[
                { label: "Industry figures and charts", to: "/performance" },
                { label: "Reports and publications", to: "/resources#publications" },
                { label: "Circulars and regulations", to: "/regulations#library" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className={cn("group flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0A4A13] transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)}>
                  {t(l.label)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
