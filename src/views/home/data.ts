import { externalPortals, faqs, regulations, services } from "@/lib/data";

/** Home page content. Figures match the About page and are dated where they appear. */

export type Slide = {
  id: string;
  /** "campaign" = a Commission advert or campaign (gold tag); "story" = a standing message */
  kind: "campaign" | "story";
  eyebrow: string;
  title: string;
  summary: string;
  cta: { label: string; href?: string; chat?: boolean };
  image: string;
  srcSet: string;
  thumb: string;
  alt: string;
  position?: string;
  /** Show from / until (YYYY-MM-DD). Set by Corporate Communications: an expired slide never shows (brief §12). */
  starts?: string;
  ends?: string;
};

/** Licensed stock photos (Unsplash licence), see public/images/site/CREDITS.md */
const stock = (n: string) => ({
  image: `/images/site/${n}-1920.webp`,
  srcSet: `/images/site/${n}-960.webp 960w, /images/site/${n}-1920.webp 1920w`,
  thumb: `/images/site/${n}-480.webp`,
});
/** PenCom's own photos (public/images) */
const own = (n: string) => ({
  image: `/images/opt/${n}-1200.webp`,
  srcSet: `/images/opt/${n}-640.webp 640w, /images/opt/${n}-1080.webp 1080w, /images/opt/${n}-1200.webp 1200w`,
  thumb: `/images/opt/${n}-384.webp`,
});

/** Slider rules from the design brief §7.1: every slide leads to a task, and each one is also reachable elsewhere. */
const allSlides: Slide[] = [
  {
    id: "ppp-campaign",
    kind: "campaign",
    eyebrow: "Personal Pension Plan campaign",
    title: "Save small today, retire with dignity",
    summary:
      "Traders, artisans and small business owners can join the Personal Pension Plan and save as much, and as often, as suits them.",
    cta: { label: "Join the Personal Pension Plan", href: "/services#ppp" },
    ...own("pencom-trader"),
    alt: "A trader at her pepper stall in a busy market",
    position: "50% 35%",
    starts: "2026-10-01",
    ends: "2027-03-31",
  },
  {
    id: "secure-retirement",
    kind: "story",
    eyebrow: "For every Nigerian worker",
    title: "Plan for a secure, dignified retirement",
    summary:
      "Under the Contributory Pension Scheme, at least 18% of your monthly pay is saved for your retirement in an account that is yours, regulated by PenCom.",
    cta: { label: "Explore pension services", href: "/services" },
    ...own("pencom-contributor"),
    alt: "A smiling young woman outside her workplace",
    position: "62% 30%",
  },
  {
    id: "pencare-campaign",
    kind: "campaign",
    eyebrow: "Pencare for retirees",
    title: "Health cover that continues after you retire",
    summary: "Retirees under the Contributory Pension Scheme can join Pencare, the Commission's health insurance programme.",
    cta: { label: "Join Pencare health insurance", href: "/services#pencare" },
    ...stock("retiree-health-check"),
    alt: "A health worker checks an older man's blood pressure",
    position: "62% 40%",
  },
  {
    id: "q1-2026-report",
    kind: "story",
    eyebrow: "Q1 2026 Pension Industry Report",
    title: "See how pension savings are performing",
    summary: "Our latest quarterly report on assets, investment returns and membership across the industry.",
    cta: { label: "Read the report", href: "/resources/reports/q1-2026" },
    ...stock("abuja-dusk"),
    alt: "Abuja at dusk, seen from above",
    position: "50% 55%",
  },
  {
    id: "assistant",
    kind: "story",
    eyebrow: "PenCom Assistant",
    title: "Get quick answers to your pension questions",
    summary: "Ask about RSA transfers, retirement benefits, the PCC and more. Never share your RSA PIN in a chat.",
    cta: { label: "Ask PenCom Assistant", chat: true },
    ...stock("woman-phone"),
    alt: "A young woman smiling at her phone",
    position: "62% 35%",
  },
];

const today = new Date().toISOString().slice(0, 10);
export const slides = allSlides.filter((s) => (!s.starts || s.starts <= today) && (!s.ends || s.ends >= today));

export const popularTasks = [
  { label: "Transfer my RSA", href: "/services#rsa-transfer" },
  { label: "Find a PFA", href: "/operators#pfas" },
  { label: "Get a PCC", href: "/services#pcc" },
  { label: "Pension calculator", href: "/services#calculator" },
];

/* ─────────────────────────── "I am a…" ─────────────────────────── */

export type Task = { label: string; href?: string; external?: boolean; chat?: boolean };
export type Audience = { id: string; label: string; icon: string; blurb: string; tasks: Task[] };

export const audiences: Audience[] = [
  {
    id: "contributor",
    label: "Contributor",
    icon: "user",
    blurb: "You have a Retirement Savings Account (RSA) through your job.",
    tasks: [
      { label: "Transfer your RSA to another PFA", href: "/services#rsa-transfer" },
      { label: "Find or compare Pension Fund Administrators", href: "/operators#pfas" },
      { label: "Estimate your pension", href: "/services#calculator" },
      { label: "Report an employer who isn’t remitting", href: "/connect#report" },
      { label: "Lodge a complaint", href: "/connect" },
    ],
  },
  {
    id: "retiree",
    label: "Retiree",
    icon: "retiree",
    blurb: "You have retired, or will soon, and want to access your benefits.",
    tasks: [
      { label: "Find out how to access your retirement benefits", href: "/services" },
      { label: "Join Pencare health insurance", href: "/services#pencare" },
      { label: "Find your nearest zonal office", href: "/connect#zonal-offices" },
      { label: "See our service standards", href: "/about#charter" },
    ],
  },
  {
    id: "employer",
    label: "Employer",
    icon: "building",
    blurb: "You employ staff and must enrol them and remit their contributions.",
    tasks: [
      { label: "Get a Pension Clearance Certificate (PCC)", href: "/services#pcc" },
      { label: "Enrol your employees", href: "/services#enrolment" },
      { label: "Remit contributions through PCRS", href: "https://pcrs.pencom.gov.ng", external: true },
      { label: "Download forms", href: "/resources#downloads" },
    ],
  },
  {
    id: "operator",
    label: "Pension operator",
    icon: "briefcase",
    blurb: "You work for a licensed PFA, PFC or closed pension fund.",
    tasks: [
      { label: "Latest regulations and circulars", href: "/regulations" },
      { label: "Pension Reform Act 2014", href: "/regulations" },
      { label: "Industry performance data", href: "/performance" },
      { label: "Reports and publications", href: "/resources#publications" },
    ],
  },
  {
    id: "informal",
    label: "Self-employed",
    icon: "store",
    blurb: "You run your own business or work in the informal sector.",
    tasks: [
      { label: "Join the Personal Pension Plan", href: "/services#ppp" },
      { label: "Learn about Micro Pension", href: "/services#micro" },
      { label: "Work out how much to save", href: "/services#calculator" },
      { label: "Ask PenCom Assistant", chat: true },
    ],
  },
];

/* ─────────────────────────── Figures ─────────────────────────── */

export const figures = [
  { value: "₦31.8tn", label: "Pension assets", note: "As at 31 August 2026" },
  { value: "11.39m", label: "RSA holders", note: "As at August 2026" },
  { value: "219,316", label: "Personal Pension Plan accounts", note: "Q1 2026" },
  { value: "19", label: "Licensed PFAs", note: "plus 3 PFCs" },
];

export const assetGrowth = [
  { label: "June 2024", sub: "20 years of the scheme", value: 20.5 },
  { label: "Aug 2026", sub: "Latest", value: 31.8 },
];

/* ─────────────────────────── Notices ─────────────────────────── */

export const notices = [
  {
    level: "Critical",
    title: "Employers: remit contributions on time",
    body: "All employers must remit pension contributions by the 7th of every month. Non-compliance attracts penalties under the Pension Reform Act 2014.",
    href: "/services#pcc",
  },
  {
    level: "Warning",
    title: "Update your KYC before 31 December 2026",
    body: "All RSA holders are advised to update their KYC information with their PFA.",
    href: "/operators#pfas",
  },
  {
    level: "Information",
    title: "New verification portal for retirees",
    body: "PenCom has launched an online verification portal for retirees.",
    href: "/services",
  },
] as const;

export const latestRegulations = regulations.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

export { externalPortals, faqs, services };

/* ─────────────────────────── Search index ─────────────────────────── */

export type SearchItem = { label: string; group: "Tasks" | "Services" | "Regulations" | "Questions"; href?: string; chat?: boolean; external?: boolean };

export const searchIndex: SearchItem[] = [
  ...audiences.flatMap((a) => a.tasks.map((t) => ({ ...t, group: "Tasks" as const }))),
  ...services.map((s) => ({ label: s.title, href: s.href, group: "Services" as const })),
  ...regulations.map((r) => ({ label: r.title, href: "/regulations", group: "Regulations" as const })),
  ...faqs.map((f) => ({ label: f.question, href: "/resources/faq", group: "Questions" as const })),
].filter((item, i, all) => all.findIndex((x) => x.label === item.label) === i);
