import { guides, type Guide } from "@/views/resources/data";

/**
 * Services: guided journeys (brief §7 "Guided service journey"; DES-25) and the online services hub (DES-26).
 * Journeys reuse the Resources guides so the two pages never disagree.
 * Portal "Use this if…" lines come from the website project (content/services.ts); portal owners must confirm them.
 */

export type Journey = Guide & {
  anchor: string;
  short: string;
  standard?: string;
  portal?: string;
  eligibility?: { intro: string; questions: string[]; yes: string; no: string };
  forWho: string;
};

const g = (id: string) => guides.find((x) => x.id === id)!;

export const journeys: Journey[] = [
  {
    ...g("open-rsa"),
    anchor: "open-rsa",
    short: "Open an RSA",
    forWho: "Anyone starting work, or self-employed people saving for retirement.",
  },
  {
    ...g("transfer-rsa"),
    anchor: "rsa-transfer",
    short: "Transfer your RSA",
    standard: "Takes effect on the quarter’s transfer date",
    forWho: "RSA holders who want a different PFA.",
    eligibility: {
      intro: "Answer three questions to check.",
      questions: ["Have you completed data recapture with your PFA?", "Is your NIN linked to your RSA?", "Has it been at least 365 days since your last transfer?"],
      yes: "You can transfer. Follow the steps below.",
      no: "Not yet. Ask your current PFA to complete your data recapture and link your NIN, or wait until 365 days have passed since your last transfer.",
    },
  },
  {
    ...g("retirement"),
    anchor: "retirement",
    short: "Retirement benefits",
    forWho: "People retiring, or who lost their job and have been out of work for four months.",
  },
  {
    ...g("ppp"),
    anchor: "ppp",
    short: "Personal Pension Plan",
    portal: "ppp",
    forWho: "Self-employed people, informal-sector workers and staff of organisations with fewer than three employees.",
  },
  {
    ...g("pcc"),
    anchor: "pcc",
    short: "Pension Clearance Certificate",
    standard: "Issued within 10 working days",
    portal: "ehub",
    forWho: "Employers who need to bid for government contracts.",
    eligibility: {
      intro: "Check you’re ready to apply.",
      questions: ["Are all your employees registered with a PFA?", "Have you remitted contributions for every month?", "Do you have a current group life insurance policy?"],
      yes: "You’re ready. Apply on eHub.",
      no: "Not yet. Put these in place first, or your application will be delayed.",
    },
  },
  {
    id: "enrolment",
    anchor: "enrolment",
    short: "Enrol your employees",
    icon: "user-plus",
    audience: "Employers",
    title: "Enrol your employees in the scheme",
    intro: "If you have three or more employees, each one must have a Retirement Savings Account and you must pay into it every month.",
    time: "Before the first payroll",
    where: "Your employees’ chosen PFAs",
    needs: ["Each employee’s RSA PIN and PFA", "Your employer code", "Your payroll records"],
    steps: [
      { title: "Ask each employee for their RSA PIN", body: "New employees who don’t have an RSA open one with a PFA of their choice. The choice of PFA is theirs, not yours." },
      { title: "Set up payroll deductions", body: "Deduct at least 8% of each employee’s monthly pay and add at least 10% as the employer’s contribution." },
      { title: "Remit every month", body: "Pay contributions to each employee’s Pension Fund Custodian through PCRS soon after you pay salaries." },
      { title: "Keep records", body: "Keep remittance schedules and receipts. You will need them for your PCC and for inspections." },
    ],
    link: { label: "Remittance with PCRS", href: "#portals" },
    portal: "pcrs",
    forWho: "Employers with three or more employees.",
  },
  {
    id: "pencare",
    anchor: "pencare",
    short: "Pencare",
    icon: "retiree",
    audience: "Retirees",
    title: "Pencare health insurance",
    intro: "Pencare is a health insurance programme for retirees under the Contributory Pension Scheme.",
    time: "When you retire",
    where: "Your PFA and the Pencare portal",
    needs: ["Your RSA PIN", "Your retirement details", "Your consent to enrol"],
    steps: [
      { title: "Ask your PFA", body: "When your PFA processes your programmed withdrawal, it can explain Pencare and ask for your consent to enrol." },
      { title: "Give your consent", body: "Enrolment needs your consent. Read what is covered before you agree." },
      { title: "Use the Pencare portal", body: "Check your enrolment and find out how to access care." },
    ],
    link: { label: "Pencare portal", href: "#portals" },
    portal: "pencare",
    forWho: "Retirees on programmed withdrawal.",
  },
  {
    ...g("complaint"),
    anchor: "complaint",
    short: "Complaints",
    standard: "We aim to resolve complaints within 14 working days",
    forWho: "Anyone with a problem with their PFA, employer or a PenCom service.",
  },
];

/** Old links that should land on a journey. */
export const anchorAlias: Record<string, string> = { micro: "ppp", "rsa-transfer": "rsa-transfer", uncredited: "complaint", remittance: "portals", pencap: "portals", ehub: "portals" };

export type Portal = {
  key: string;
  name: string;
  full: string;
  use: string;
  url?: string;
  prepare?: string[];
  next?: string;
};

export const portals: Portal[] = [
  {
    key: "ehub",
    name: "eHub",
    full: "PenCom eHub",
    use: "Use this if you need a new Pension Clearance Certificate or an employer code.",
    prepare: ["Your employer code (or company registration details if you don’t have one)", "Evidence of remittance", "Your group life insurance policy"],
    next: "PenCom reviews your application. Certificates already approved can be viewed, downloaded and printed from the PCC portal.",
  },
  { key: "pcrs", name: "PCRS", full: "Pension Contribution Remittance System", use: "Use this to remit employee contributions.", url: "https://pcrs.pencom.gov.ng" },
  { key: "cobra", name: "COBRA", full: "Contribution and Bond Redemption Application", use: "Use this for federal pre-retirement verification and enrolment.", url: "https://cobra.pencom.gov.ng" },
  { key: "pencap", name: "PENCAP", full: "Pension Recapture Automated Platform", use: "Use this to update or recapture your RSA records.", url: "https://pensionrecap.pencom.gov.ng" },
  { key: "pencare", name: "Pencare", full: "Pencare health insurance", use: "Use this for retiree health services.", url: "https://pencare.pencom.gov.ng" },
  { key: "ppp", name: "PPP portal", full: "Personal Pension Plan registration", use: "Use this to register if you are self-employed." },
];
