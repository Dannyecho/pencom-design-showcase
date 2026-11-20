"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Globe, Scale } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { LANGS, type Lang } from "@/i18n/languages";
import { cn } from "@/lib/utils";

/**
 * Language picker for the utility bar (DES-39). Menu-button pattern: arrow keys, Home/End,
 * Esc closes and returns focus. Each language is named in itself, with a greeting.
 */
export default function LanguageSwitcher() {
  const { lang, info, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [said, setSaid] = useState("");
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    menu.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onMenuKey = (e: KeyboardEvent) => {
    const items = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    const to: Record<string, number> = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 };
    if (e.key === "Tab") return setOpen(false);
    if (!(e.key in to)) return;
    e.preventDefault();
    items[to[e.key]]?.focus();
  };

  const choose = (code: Lang) => {
    setOpen(false);
    btn.current?.focus();
    if (code === lang) return;
    setLang(code);
    const next = LANGS.find((l) => l.code === code)!;
    setSaid(`${next.hello}. ${next.native}.`);
  };

  return (
    <div ref={wrap} className="relative" data-no-translate>
      <button
        ref={btn}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-label={`${t("Language")}: ${info.native}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]",
          open ? "border-[#F4D27A] bg-white text-[#0A4A13]" : "border-white/25 text-white hover:border-[#F4D27A] hover:bg-white/10",
        )}
      >
        <Globe className={cn("h-3.5 w-3.5 transition-transform duration-500", open && !reduce && "rotate-[360deg]")} aria-hidden="true" />
        <span className="hidden sm:inline">{info.native}</span>
        <span className="sm:hidden">{info.short}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menu}
            id="lang-menu"
            role="menu"
            aria-label={t("Choose a language")}
            onKeyDown={onMenuKey}
            initial={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-[70] mt-2 w-[min(19rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl bg-white text-gray-800 shadow-[0_24px_60px_-20px_rgba(4,36,10,0.55)] ring-1 ring-black/5"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#04240A] to-[#117F21] px-4 py-3 text-white">
              <div aria-hidden="true" className="absolute -right-6 -top-10 h-28 w-28 rounded-full bg-[#CB9615]/30 blur-2xl" />
              <p className="relative text-sm font-bold">{t("Choose a language")}</p>
              <p className="relative mt-0.5 text-xs text-white/75">{t("Translations are drafts being checked by PenCom.")}</p>
            </div>
            <div className="p-1.5">
              {LANGS.map((l, i) => {
                const on = l.code === lang;
                return (
                  <motion.button
                    key={l.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={on}
                    lang={l.code}
                    onClick={() => choose(l.code)}
                    initial={{ opacity: 0, x: reduce ? 0 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.03 * i }}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-[#FFD84D]",
                      on ? "bg-[#E8F5E9]" : "hover:bg-[#F4F7F2]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-black tracking-wider",
                        on ? "bg-gradient-to-br from-[#117F21] to-[#0A4A13] text-[#F4D27A]" : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {l.short}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-[#0A2E10]">{l.native}</span>
                      <span className="block truncate text-xs italic text-gray-500">“{l.hello}”</span>
                    </span>
                    {l.code !== "en" && <span lang={lang} className="rounded-full bg-[#FFF4D6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7A5200]">{t("Draft")}</span>}
                    {on && <Check className="h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />}
                  </motion.button>
                );
              })}
            </div>
            <p className="flex items-start gap-2 border-t border-gray-100 px-4 py-3 text-xs leading-snug text-gray-500">
              <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#CB9615]" aria-hidden="true" />
              {t("Laws and regulations are kept in their official English version.")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{said}</span>
    </div>
  );
}
