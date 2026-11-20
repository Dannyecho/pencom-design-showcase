"use client";

import { useState } from "react";
import { useLocation } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Languages, Scale, X } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { isLegalPath } from "@/i18n/languages";

type Level = "full" | "part" | "none" | "wait";

const level = (c: number | null): Level => (c == null ? "wait" : c >= 0.85 ? "full" : c >= 0.3 ? "part" : "none");

/**
 * Sits under the header. In English it offers the visitor's browser language once; in
 * Hausa, Yoruba or Igbo it says how much of the page is translated, that translations are
 * drafts, and that laws stay in official English. Stays until the reader closes it.
 */
export default function LanguageNotice() {
  const { lang, info, setLang, t, coverage, suggestion, dismissSuggestion } = useI18n();
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [closed, setClosed] = useState<string[]>(() => {
    try {
      return JSON.parse(window.sessionStorage.getItem("pencom:lang-notice") ?? "[]");
    } catch {
      return [];
    }
  });

  const lv = level(coverage);
  const legal = isLegalPath(pathname);
  // Closing hides the notice for this language and situation; a worse situation shows it again.
  const key = `${lang}:${legal ? "legal" : lv === "full" ? "full" : lv === "wait" ? "full" : "gap"}`;
  const show = lang !== "en" && !closed.includes(key);

  const close = () => {
    const next = [...closed, key];
    setClosed(next);
    try {
      window.sessionStorage.setItem("pencom:lang-notice", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const pct = coverage == null ? null : Math.round(coverage * 100);
  const headline = legal
    ? t("Laws and regulations are kept in their official English version.")
    : lv === "full" ? t("You are reading this page in {lang}.", { lang: info.native })
    : lv === "part" ? t("Parts of this page are still in English.")
    : lv === "none" ? t("This page is not yet available in {lang}, so it is shown in English.", { lang: info.native })
    : t("Translating…");

  const anim = { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: reduce ? 0 : 0.35 } };

  return (
    <div data-i18n-notice data-no-translate>
      <AnimatePresence initial={false}>
        {suggestion && lang === "en" && (
          <motion.div key="offer" {...anim} className="overflow-hidden" role="region" aria-label="Language">
            <div lang={suggestion.code} className="border-b border-[#117F21]/15 bg-gradient-to-r from-[#E8F5E9] via-white to-[#FFF8E6]">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 text-sm">
                <Languages className="h-4 w-4 text-[#117F21]" aria-hidden="true" />
                <span className="font-semibold text-[#0A2E10]">{suggestion.hello}!</span>
                <span className="text-gray-700">{suggestion.offer}</span>
                <button type="button" onClick={() => setLang(suggestion.code)} className="inline-flex min-h-9 items-center rounded-full bg-[#117F21] px-4 text-xs font-bold text-white hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  {suggestion.switchTo}
                </button>
                <button type="button" onClick={dismissSuggestion} lang="en" aria-label="No thanks, stay in English" className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {show && (
          <motion.div key={`notice-${lang}`} {...anim} className="overflow-hidden" role="region" aria-label={t("Language notice")}>
            <div className="relative overflow-hidden border-b border-[#117F21]/15 bg-gradient-to-r from-[#04240A] via-[#0A4A13] to-[#117F21] text-white">
              <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-0 h-full w-1/3 bg-[radial-gradient(closest-side,rgba(244,210,122,0.25),transparent)]" />
              <div className="relative mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center">
                <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 sm:flex">
                  <Languages className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">{headline}</p>
                  <p className="mt-0.5 text-xs text-white/75">
                    {t("Translations are drafts being checked by PenCom.")}
                    {legal && (
                      <span className="ml-1 inline-flex items-center gap-1 text-[#F4D27A]">
                        <Scale className="h-3 w-3" aria-hidden="true" />
                        {t("Menus and help are shown in {lang}.", { lang: info.native })}
                      </span>
                    )}
                  </p>
                </div>
                {pct != null && !legal && (
                  <div className="hidden shrink-0 items-center gap-2 md:flex" aria-hidden="true">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/15">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-[#F4D27A] to-[#CB9615]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.8 }} />
                    </div>
                    <span className="w-10 text-xs font-bold tabular-nums text-[#F4D27A]">{pct}%</span>
                  </div>
                )}
                <button type="button" onClick={() => setLang("en")} className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-white/30 px-3 text-xs font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  {t("Read in English")}
                </button>
                <button type="button" onClick={close} aria-label={t("Close language notice")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
