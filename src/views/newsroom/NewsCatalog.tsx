"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CookieConsent from "@/components/CookieConsent";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { sectionCls } from "@/views/theme/ui";
import Headline from "@/views/theme/Headline";
import { items, kinds, type Kind, type NewsItem } from "./data";
import { Empty, FilterBar, Galleries, Hero, MediaDesk, NewsCard, Toast, ease, focus, type Sort, type View } from "./parts";

const PAGE = 9;

/**
 * News catalogue (/news): the newsroom the stakeholders asked for (questionnaire "Anything else"; brief §6–7).
 * Top story → search, type chips, year archive, sort and card/list view, all kept in the URL so a filtered view
 * can be shared → photo galleries → media desk (press contacts, verified accounts, data). Showcase look: dark
 * cinematic hero with the top story floating in it, a sticky pill filter bar, spotlight cards with a growing
 * green→gold line, photo stacks on a pale green band, and the media desk as the page's one near-black band.
 * Not a carousel (brief §13: the home slider is the only one); images lazy-load below the fold.
 */
export default function NewsCatalog() {
  const { t } = useI18n();
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(PAGE);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const q = params.get("q") ?? "";
  const kindParam = params.get("type");
  const kind = (kinds.find((k) => k.id === kindParam)?.id ?? null) as Kind | null;
  const year = params.get("year");
  const sort: Sort = params.get("sort") === "old" ? "old" : "new";
  const view: View = params.get("view") === "list" ? "list" : "grid";

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true, preventScrollReset: true });
    setLimit(PAGE);
  };
  const clear = () => {
    const next = new URLSearchParams(params);
    ["q", "type", "year"].forEach((k) => next.delete(k));
    setParams(next, { replace: true, preventScrollReset: true });
    setLimit(PAGE);
  };

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const tm = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(tm);
  }, [hash, reduce]);

  const lead = items.find((i) => i.kind !== "Media coverage") ?? items[0];
  const filtering = !!(q || kind || year);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => (c[i.kind] = (c[i.kind] ?? 0) + 1));
    return c;
  }, []);

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = items.filter((i) => {
      if (kind && i.kind !== kind) return false;
      if (year && !i.date.startsWith(year)) return false;
      if (!words.length) return true;
      const hay = `${i.title} ${i.excerpt} ${i.meta} ${i.kind} ${t(i.title)} ${t(i.excerpt)}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    // The top story already sits in the hero; leave it out of the unfiltered list.
    const trimmed = filtering ? list : list.filter((i) => i.id !== lead.id);
    return sort === "old" ? [...trimmed].reverse() : trimmed;
  }, [q, kind, year, sort, filtering, lead.id, t]);

  const shown = results.slice(0, limit);

  const share = async (item: NewsItem) => {
    const url = `${window.location.origin}${item.to}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t(item.title), url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t("Link copied"));
    } catch {
      return;
    }
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const search = (v: string) => {
    set("q", v || null);
    window.setTimeout(() => scrollToId("catalogue", !reduce), 60);
  };

  return (
    <MotionConfig reducedMotion="user">
      <CookieConsent />
      <div className="bg-white text-[#0B1F10]">
        <Hero lead={lead} q={q} onSearch={search} />

        <section id="catalogue" aria-labelledby="catalogue-title" className={sectionCls}>
          <div className="mx-auto max-w-7xl">
            <Headline
              id="catalogue-title"
              kicker="All news"
              title="Browse every story"
              mark="every story"
              intro="Filter by type or year, or search. Your choices stay in the page address, so you can share the view."
            />

            {/* "contents": the sticky bar must sit directly in the section, or it stops sticking at its wrapper. */}
            <div className="contents">
              <FilterBar
                kind={kind}
                setKind={(k) => set("type", k)}
                year={year}
                setYear={(y) => set("year", y)}
                sort={sort}
                setSort={(s) => set("sort", s === "new" ? null : s)}
                view={view}
                setView={(v) => set("view", v === "grid" ? null : v)}
                counts={counts}
                shown={Math.min(limit, results.length)}
                total={results.length}
                q={q}
                clear={clear}
              />
            </div>

            <div className="mt-4">
              {results.length === 0 ? (
                <Empty clear={clear} />
              ) : (
                <motion.ul
                  layout
                  className={cn(view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-3")}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    {shown.map((item, i) => (
                      <motion.li
                        key={`${view}-${item.id}`}
                        layout
                        initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.18 } }}
                        transition={{ duration: 0.45, delay: Math.min(i % PAGE, 6) * 0.04, ease }}
                      >
                        <NewsCard item={item} view={view} onShare={share} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}

              {results.length > limit && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#F2F6F0] ring-1 ring-black/10" aria-hidden="true">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" animate={{ width: `${(limit / results.length) * 100}%` }} transition={{ duration: 0.5, ease }} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLimit((l) => l + PAGE)}
                    className={cn("group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0B1F10] py-1.5 pl-6 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", focus)}
                  >
                    {t("Show more news")}
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:translate-y-0.5">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </div>
              )}
              <p className="mt-10 text-center text-xs text-gray-600">
                News items are drafts until the newsroom is connected to the CMS. Items scheduled for a later date appear automatically on that date.
              </p>
            </div>
          </div>
        </section>

        <Galleries />
        <MediaDesk />
      </div>
      <Toast text={toast} />
    </MotionConfig>
  );
}
