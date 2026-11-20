/**
 * Website languages (DES-39): English is the official version; Hausa, Yoruba and Igbo
 * are added for FAQs, guides and key pension information. Every translation is a draft
 * until PenCom's reviewers (people who understand pension matters) sign it off.
 */
export type Lang = "en" | "ha" | "yo" | "ig";

export type LangInfo = {
  code: Lang;
  /** Name in English */
  name: string;
  /** Name in the language itself */
  native: string;
  short: string;
  /** Greeting shown in the language picker */
  hello: string;
  /** Offer shown, in that language, to visitors whose browser prefers it */
  offer: string;
  switchTo: string;
};

export const LANGS: LangInfo[] = [
  { code: "en", name: "English", native: "English", short: "EN", hello: "Welcome", offer: "This website is also available in English.", switchTo: "Switch to English" },
  { code: "ha", name: "Hausa", native: "Hausa", short: "HA", hello: "Barka da zuwa", offer: "Akwai wannan shafin yanar gizo da harshen Hausa.", switchTo: "Canja zuwa Hausa" },
  { code: "yo", name: "Yoruba", native: "Yorùbá", short: "YO", hello: "Ẹ káàbọ̀", offer: "Ojú òpó wẹ́ẹ̀bù yìí wà ní èdè Yorùbá.", switchTo: "Yí padà sí Yorùbá" },
  { code: "ig", name: "Igbo", native: "Igbo", short: "IG", hello: "Nnọọ", offer: "Weebụsaịtị a dịkwa n'asụsụ Igbo.", switchTo: "Gbanwee gaa n'Igbo" },
];

export const langInfo = (code: Lang) => LANGS.find((l) => l.code === code) ?? LANGS[0];
export const isLang = (s: unknown): s is Lang => typeof s === "string" && LANGS.some((l) => l.code === s);

/** Pages whose text is law or regulation: always kept in the official English version. */
export const isLegalPath = (path: string) => path.startsWith("/regulations");

/** Lookup key: whitespace collapsed, curly quotes straightened. */
export const norm = (s: string) =>
  s.replace(/\s+/g, " ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();
