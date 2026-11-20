"use client";

import { createContext, useContext } from "react";
import { LANGS, type Lang, type LangInfo } from "./languages";

export type Vars = Record<string, string | number>;

export type I18n = {
  lang: Lang;
  info: LangInfo;
  setLang: (l: Lang) => void;
  /** Translate an English string (falls back to English). `{name}` placeholders are filled from vars. */
  t: (english: string, vars?: Vars) => string;
  /** Share of this page's main text shown in the chosen language (0–1), or null in English. */
  coverage: number | null;
  /** A language the visitor's browser prefers, offered once if they have never chosen. */
  suggestion: LangInfo | null;
  dismissSuggestion: () => void;
};

export const fill = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;

export const I18nContext = createContext<I18n>({
  lang: "en",
  info: LANGS[0],
  setLang: () => {},
  t: fill,
  coverage: null,
  suggestion: null,
  dismissSuggestion: () => {},
});

export const useI18n = () => useContext(I18nContext);
