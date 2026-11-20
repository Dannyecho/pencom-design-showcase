"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { I18nContext, fill, type I18n, type Vars } from "./context";
import { DomTranslator } from "./dom";
import { LANGS, isLang, langInfo, norm, type Lang } from "./languages";

const KEY = "pencom:lang";
const OFFER_KEY = "pencom:lang-offer-dismissed";

type Loaded = { lang: Lang; map: Map<string, string> };

// Each language is its own chunk, so English visitors download none of them.
const loaders: Record<Exclude<Lang, "en">, () => Promise<{ default: Record<string, string> }>> = {
  ha: () => import("./dict/ha"),
  yo: () => import("./dict/yo"),
  ig: () => import("./dict/ig"),
};

const store = {
  get: (k: string) => {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string) => {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* storage unavailable: choice lasts for this visit */
    }
  },
};

/** ?lang=ha in the address (shareable links) wins, then the visitor's saved choice. */
function initial(): { lang: Lang; chosen: boolean } {
  const m = /[?&]lang=([a-z]{2})\b/.exec(window.location.hash + window.location.search);
  if (m && isLang(m[1])) {
    store.set(KEY, m[1]);
    return { lang: m[1], chosen: true };
  }
  const saved = store.get(KEY);
  return isLang(saved) ? { lang: saved, chosen: true } : { lang: "en", chosen: false };
}

function browserSuggestion() {
  const prefs = (navigator.languages ?? [navigator.language]).map((l) => l.slice(0, 2).toLowerCase());
  return LANGS.find((l) => l.code !== "en" && prefs.includes(l.code)) ?? null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // The server renders English; the visitor's language is applied as soon as the page loads.
  const [lang, setLangState] = useState<Lang>("en");
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [coverage, setCoverage] = useState<number | null>(null);
  const [offerOff, setOfferOff] = useState(true);
  const booted = useRef(true);

  useEffect(() => {
    const first = initial();
    if (first.lang !== "en") setLangState(first.lang);
    setOfferOff(first.chosen || store.get(OFFER_KEY) === "1");
  }, []);
  const translator = useRef<DomTranslator | null>(null);

  // Load the dictionary for the chosen language.
  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "en") return;
    let alive = true;
    loaders[lang]().then((m) => {
      if (!alive) return;
      const map = new Map<string, string>();
      // NFC so tone marks compare equal however they were typed (headings look up highlights by substring).
      for (const [k, v] of Object.entries(m.default)) map.set(norm(k), v.normalize("NFC"));
      setLoaded({ lang, map });
    }).catch(() => {
      // Dictionary could not load (offline?): carry on in English rather than show nothing.
      if (!alive) return;
      booted.current = true;
      setLangState("en");
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  const dict = lang !== "en" && loaded?.lang === lang ? loaded.map : null;
  if (dict) booted.current = true;

  // Translate the rendered page before the browser paints it.
  useLayoutEffect(() => {
    translator.current ??= new DomTranslator(setCoverage);
    translator.current.apply(dict);
  }, [dict]);

  useEffect(() => () => translator.current?.destroy(), []);

  // Re-measure coverage when the page changes.
  useEffect(() => {
    const onNav = () => translator.current?.measureSoon(700);
    window.addEventListener("pencom:locationchange", onNav);
    return () => window.removeEventListener("pencom:locationchange", onNav);
  }, []);

  const setLang = useCallback((l: Lang) => {
    store.set(KEY, l);
    setOfferOff(true);
    const root = document.documentElement;
    root.classList.remove("i18n-swap");
    void root.offsetWidth; // restart the cross-fade
    root.classList.add("i18n-swap");
    window.setTimeout(() => root.classList.remove("i18n-swap"), 600);
    setLangState(l);
  }, []);

  const t = useCallback((english: string, vars?: Vars) => fill(dict?.get(norm(english)) ?? english, vars), [dict]);

  const suggestion = useMemo(() => (offerOff || lang !== "en" ? null : browserSuggestion()), [offerOff, lang]);

  const value = useMemo<I18n>(
    () => ({
      lang,
      info: langInfo(lang),
      setLang,
      t,
      coverage: lang === "en" ? null : coverage,
      suggestion,
      dismissSuggestion: () => {
        store.set(OFFER_KEY, "1");
        setOfferOff(true);
      },
    }),
    [lang, setLang, t, coverage, suggestion],
  );

  // A returning Hausa/Yoruba/Igbo reader waits for the (small) dictionary rather than seeing English flash first.
  if (!booted.current) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
