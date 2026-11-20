import { library, type RegDoc } from "./library";

/** Everyday abbreviations users type (DES-24, DES-27) and what they stand for. */
export const abbreviations: Record<string, string> = {
  rsa: "retirement savings account",
  pfa: "pension fund administrator",
  pfc: "pension fund custodian",
  pcc: "pension clearance certificate",
  ppp: "personal pension plan",
  pra: "pension reform act",
  cps: "contributory pension scheme",
  apa: "pension agent",
  rla: "retiree life annuity",
  avc: "voluntary contribution",
  ict: "information technology",
  kyc: "know your customer",
};

export const typeStyle: Record<RegDoc["type"], { dot: string; chip: string }> = {
  Regulation: { dot: "bg-[#117F21]", chip: "bg-[#E8F5E9] text-[#0A4A13]" },
  Guideline: { dot: "bg-[#1E88E5]", chip: "bg-[#E3F2FD] text-[#0B4F8A]" },
  Circular: { dot: "bg-[#CB9615]", chip: "bg-[#FFF8E1] text-[#7A5604]" },
  Framework: { dot: "bg-[#7B4BB7]", chip: "bg-[#F1EAFB] text-[#4B2A7A]" },
  Code: { dot: "bg-[#B52026]", chip: "bg-[#FDE8E8] text-[#8E1A1E]" },
  Form: { dot: "bg-gray-500", chip: "bg-gray-100 text-gray-700" },
};

export const statusStyle: Record<RegDoc["status"], string> = {
  "Latest version": "bg-[#E8F5E9] text-[#0A4A13] ring-[#117F21]/20",
  Amended: "bg-[#FFF8E1] text-[#7A5604] ring-[#CB9615]/30",
  "Revised version available": "bg-[#FDE8E8] text-[#8E1A1E] ring-[#B52026]/20",
  Draft: "bg-gray-100 text-gray-700 ring-gray-300",
};

export const byId = (id: string | null | undefined) => library.find((d) => d.id === id);

const haystack = new Map(
  library.map((d) => [d.id, `${d.title} ${d.summary} ${d.type} ${d.subjects.join(" ")} ${d.appliesTo.join(" ")} ${d.year}`.toLowerCase()]),
);

/** Every word must match, either itself or its expansion. Returns the expansions used, for the hint. */
export function matchQuery(q: string) {
  const words = q.toLowerCase().replace(/[^\w\s/.-]/g, " ").split(/\s+/).filter(Boolean);
  const used: string[] = [];
  words.forEach((w) => abbreviations[w] && used.push(`${w.toUpperCase()} = ${abbreviations[w]}`));
  const test = (d: RegDoc) => {
    const h = haystack.get(d.id)!;
    return words.every((w) => h.includes(w) || (abbreviations[w] && h.includes(abbreviations[w])));
  };
  return { test, used };
}

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const latest = library.slice(0, 8);
export const years = Array.from(new Set(library.map((d) => d.year))).sort((a, b) => a - b);
