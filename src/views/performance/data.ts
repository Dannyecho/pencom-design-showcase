/**
 * Industry performance data (brief §7 "Data page": accessible tables and charts, period selector, CSV/JSON download,
 * methodology note; questionnaire DES-29). Industry figures are from PenCom's unaudited monthly portfolio reports,
 * quarterly reports and dashboards, as published or reported (sources below). Per-PFA returns are SAMPLE figures
 * for design review: PenCom's Research and Statistics team must supply validated unit-price data before launch.
 */
import { operators } from "@/views/operators/data";

export const asAt = "31 August 2026";
export const asAtShort = "Aug 2026";

/** Total pension assets, ₦ trillion, end of month (unaudited). */
export const assets: { m: string; v: number }[] = [
  { m: "2025-01", v: 22.86 }, { m: "2025-02", v: 23.26 }, { m: "2025-03", v: 23.38 }, { m: "2025-04", v: 23.65 },
  { m: "2025-05", v: 24.11 }, { m: "2025-06", v: 24.62 }, { m: "2025-07", v: 25.8 }, { m: "2025-08", v: 25.9 },
  { m: "2025-09", v: 26.09 }, { m: "2025-10", v: 26.66 }, { m: "2025-11", v: 27.05 }, { m: "2025-12", v: 27.45 },
  { m: "2026-01", v: 28.04 }, { m: "2026-02", v: 29.43 }, { m: "2026-03", v: 29.52 }, { m: "2026-04", v: 30.94 },
  { m: "2026-05", v: 31.32 }, { m: "2026-06", v: 31.48 }, { m: "2026-07", v: 31.51 }, { m: "2026-08", v: 31.8 },
];

export const headline = {
  assets: 31.8,
  ytd: 13.41,
  usd: 23.9,
  members: 11_391_008,
  retirees: 819_411,
  benefitsPaid: 3.44,
  joined2y: 938_229,
};

/** Where the money is invested, ₦ trillion. "Other" = money market, mutual funds, real estate, infrastructure, private equity, cash. */
export type Alloc = { period: string; label: string; total: number; items: { k: string; v: number }[]; note?: string };
export const allocation: Alloc[] = [
  { period: "2025-10", label: "Oct 2025", total: 26.66, items: [{ k: "FGN securities", v: 15.96 }, { k: "Equities", v: 3.84 }, { k: "Corporate debt", v: 2.16 }, { k: "Money market", v: 2.88 }, { k: "Other", v: 1.82 }] },
  { period: "2026-04", label: "Apr 2026", total: 30.94, items: [{ k: "FGN securities", v: 17.36 }, { k: "Equities", v: 6.78 }, { k: "Corporate debt", v: 2.25 }, { k: "Money market", v: 2.66 }, { k: "Other", v: 1.89 }], note: "Equities include ₦0.27tn in foreign equities." },
  { period: "2026-08", label: "Aug 2026", total: 31.8, items: [{ k: "FGN securities", v: 17.8 }, { k: "Equities", v: 6.32 }, { k: "Corporate debt", v: 2.21 }, { k: "Money market", v: 0 }, { k: "Other", v: 5.47 }], note: "Equities are domestic only. Money market is included in Other until the full August breakdown is confirmed." },
];
export const allocColors: Record<string, string> = {
  "FGN securities": "#117F21",
  Equities: "#CB9615",
  "Corporate debt": "#2E7DAF",
  "Money market": "#7BC67E",
  Other: "#9AA59B",
};

/** Net assets by fund type, ₦ trillion. */
export type FundRow = { k: string; v: number; who: string };
export const fundTypes: { period: string; label: string; total: number; rows: FundRow[] }[] = [
  {
    period: "2026-03", label: "Mar 2026", total: 29.52, rows: [
      { k: "RSA Fund II", v: 12.59, who: "Default for contributors under 50" },
      { k: "RSA Fund III", v: 7.53, who: "Default for contributors 50 and over" },
      { k: "Closed PFAs", v: 2.74, who: "Company pension funds" },
      { k: "RSA Fund IV", v: 2.34, who: "Retirees" },
      { k: "RSA Fund I", v: 0.56, who: "Higher-risk, by choice (under 50)" },
      { k: "Other funds", v: 3.76, who: "Existing schemes, Fund V (PPP), Fund VI (non-interest)" },
    ],
  },
  {
    period: "2026-01", label: "Jan 2026", total: 28.04, rows: [
      { k: "RSA Fund II", v: 11.86, who: "Default for contributors under 50" },
      { k: "RSA Fund III", v: 7.19, who: "Default for contributors 50 and over" },
      { k: "RSA Fund IV", v: 2.27, who: "Retirees" },
      { k: "RSA Fund I", v: 0.48, who: "Higher-risk, by choice (under 50)" },
      { k: "RSA Fund VI", v: 0.23, who: "Non-interest (Islamic) fund" },
      { k: "Other funds", v: 6.01, who: "Closed PFAs, existing schemes, Fund V (PPP)" },
    ],
  },
];

/** RSA membership (contributors), end of period. */
export const members: { label: string; v: number }[] = [
  { label: "Jun 2025", v: 10_790_000 },
  { label: "Sep 2025", v: 10_928_039 },
  { label: "Dec 2025", v: 11_040_000 },
  { label: "Mar 2026", v: 11_180_000 },
  { label: "Apr 2026", v: 11_230_000 },
  { label: "Aug 2026", v: 11_391_008 },
];

/** Contributions received per quarter, ₦ billion. Q2 2025 is derived from the Q3 change (+18%). */
export const contributions: { label: string; v: number; derived?: boolean }[] = [
  { label: "Q2 2025", v: 426.4, derived: true },
  { label: "Q3 2025", v: 503.19 },
  { label: "Q4 2025", v: 903.7 },
  { label: "Q1 2026", v: 559.42 },
];

export const ppp = { registered: 219_316, funded: 18_811, asAt: "March 2026" };

/* ─────────────────────────── PFA returns (SAMPLE) ─────────────────────────── */

export const funds = ["Fund I", "Fund II", "Fund III", "Fund IV"] as const;
export type FundKey = (typeof funds)[number];
export const fundInfo: Record<FundKey, { who: string; risk: string; range: [number, number] }> = {
  "Fund I": { who: "Contributors under 50 who choose more risk", risk: "Higher risk", range: [24, 36] },
  "Fund II": { who: "Default for contributors under 50", risk: "Medium risk", range: [15, 23] },
  "Fund III": { who: "Default for contributors 50 and over", risk: "Lower risk", range: [11, 17] },
  "Fund IV": { who: "Retirees", risk: "Lowest risk", range: [9, 13] },
};
export const periods = ["Year to date", "12 months", "3 years (a year)"] as const;
export type PeriodKey = (typeof periods)[number];

/** Deterministic pseudo-random so the sample stays stable between visits. */
function seeded(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

export type PfaReturn = { id: string; name: string; short: string; ret: number; price: number; size: number };
export function pfaReturns(fund: FundKey, period: PeriodKey): PfaReturn[] {
  const [lo, hi] = fundInfo[fund].range;
  const scale = period === "Year to date" ? 1 : period === "12 months" ? 1.18 : 0.82;
  return operators
    .filter((o) => o.type === "PFA")
    .map((o) => {
      const r = seeded(o.id + fund);
      const ret = +((lo + (hi - lo) * r) * scale).toFixed(2);
      const price = +(1.8 + seeded(o.id + fund + "p") * 5.2).toFixed(4);
      const size = +(fund === "Fund II" ? 0.08 + seeded(o.id + "s") * 2.4 : fund === "Fund III" ? 0.05 + seeded(o.id + "s3") * 1.4 : fund === "Fund IV" ? 0.01 + seeded(o.id + "s4") * 0.45 : 0.002 + seeded(o.id + "s1") * 0.11).toFixed(3);
      return { id: o.id, name: o.name, short: o.name.replace(/ (Limited|Ltd|Plc|PLC|Pension Managers|Pensions|Pension|PFA)\b.*$/i, ""), ret, price, size };
    });
}

/* ─────────────────────────── Fees (published rules) ─────────────────────────── */

export const fees = [
  { title: "RSA Funds I, II and III", body: "Asset-based fees: a yearly percentage of the fund’s net asset value, shared between the PFA, the custodian (PFC) and PenCom, within maximum rates set by the Commission.", tag: "% of assets a year" },
  { title: "RSA Fund IV (retirees)", body: "Income-based fees: charged on investment income, not on the retiree’s savings, so balances are protected in a weak year.", tag: "% of income" },
  { title: "Closed PFAs", body: "A maximum of 1.1% a year: 0.80% to the closed PFA, 0.20% to the custodian and 0.10% to PenCom.", tag: "max 1.1% a year" },
  { title: "Approved existing schemes", body: "A maximum of 7.5% of income: 5% to the PFA, 1.5% to the custodian and 1% to PenCom.", tag: "max 7.5% of income" },
  { title: "Personal Pension Plan", body: "Separate asset-based fees approved for Fund V. The PFA, not the contributor, pays a one-off ₦500 onboarding fee for each new account.", tag: "Fund V" },
];

/* ─────────────────────────── Sources ─────────────────────────── */

export const sources = [
  { label: "PenCom monthly industry summaries (unaudited)", url: "https://www.pencom.gov.ng/wp-content/uploads/2026/04/Monthly-Industry-Summary-March-2026.pdf" },
  { label: "PenCom Q1 2026 Pension Industry Information Dashboard", url: "https://www.pencom.gov.ng/wp-content/uploads/2025/06/PenCom-Q1-2026-Dashboard-Concluded.pdf" },
  { label: "PenCom Q3 2025 Pension Industry Information Dashboard", url: "https://www.pencom.gov.ng/wp-content/uploads/2025/06/Q3-2025-PENSION-INDUSTRY-INFORMATION-DASHBOARD-FINAL.pdf" },
  { label: "PenCom Q1 2026 Quarterly Industry Report", url: "https://www.pencom.gov.ng/wp-content/uploads/2026/08/PenCom-Q1-2026-Quarterly-Industry-Report-finale-2.pdf" },
  { label: "Circular on Fund V, Fund VII and APA fees (2026)", url: "https://www.pencom.gov.ng/wp-content/uploads/2026/03/Circular-for-Fund-V-VII-and-APA-fees.pdf" },
  { label: "Nairametrics: assets reach ₦31.8tn (Aug 2026)", url: "https://nairametrics.com/2026/10/02/nigerias-pension-assets-grow-by-n3-8-trillion-in-eight-months-pencom/" },
  { label: "Leadership: 2025 monthly assets", url: "https://leadership.ng/?p=543475" },
];

/* ─────────────────────────── Helpers ─────────────────────────── */

export const monthLabel = (m: string, long = false) =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString("en-GB", { month: long ? "long" : "short", year: long ? "numeric" : "2-digit" });

export function download(name: string, rows: Record<string, string | number | boolean | undefined>[], kind: "csv" | "json") {
  const body =
    kind === "json"
      ? JSON.stringify(rows, null, 2)
      : [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map((v) => (typeof v === "string" && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v ?? "")).join(","))].join("\n");
  const blob = new Blob([body], { type: kind === "json" ? "application/json" : "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pencom-${name}.${kind}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
