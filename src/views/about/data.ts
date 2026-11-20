/**
 * Content for the About page ("for everyone" theme).
 *
 * - History: drawn from the Pension Reform Acts 2004 and 2014 and PenCom's published
 *   announcements. 2024/2026 figures match the copy used elsewhere on this site.
 * - Structure: based on the organisational chart in a PenCom Annual Report
 *   (Board → DG → four Commissioners → departments → units). It must be confirmed
 *   with Human Resources / CCD before launch, as departments may have changed.
 */

export type Exec = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
};

export const dg: Exec = {
  id: "dg",
  name: "Omolola Oloworaran",
  title: "Director General",
  image: "/exec-dg.jpg",
  bio: "Chief Executive Officer of the National Pension Commission, responsible for the overall direction and administration of the Commission.",
};

export const commissioners: Exec[] = [
  {
    id: "admin",
    name: "Hon. Bello Abubakar Malabu",
    title: "Commissioner, Administration",
    image: "/exec-admin.jpg",
    bio: "Oversees administrative functions including human resources, corporate services, and general administration of the Commission.",
  },
  {
    id: "finance",
    name: "Dr. Charles Efe Sylvester Emukowhate",
    title: "Commissioner, Finance",
    image: "/exec-finance.jpg",
    bio: "Manages the Commission's financial operations, budgeting, accounting, and fiscal policy implementation.",
  },
  {
    id: "technical",
    name: "Hon. Hafiz Muhammad Kawu Ibrahim OON, mni",
    title: "Commissioner, Technical",
    image: "/exec-tech.jpg",
    bio: "Responsible for technical operations including pension regulation, supervision, and industry standards development.",
  },
  {
    id: "inspectorate",
    name: "Hon. Samuel Chigozie Uwandu, CPA",
    title: "Commissioner, Inspectorate",
    image: "/exec-insp.jpg",
    bio: "Leads the inspectorate division ensuring compliance and enforcement of pension regulations across operators.",
  },
];

export const secretary: Exec = {
  id: "secretary",
  name: "Mr. Muhammad Sani Muhammad",
  title: "Commission Secretary / Legal Adviser",
  image: "/exec-sec.jpg",
  bio: "Provides legal counsel and secretariat services to the Commission, ensuring regulatory compliance and governance.",
};

export const allExecs: Exec[] = [dg, ...commissioners, secretary];

/* ─────────────────────────── Key figures ─────────────────────────── */

export const heroStats = [
  { value: "₦31.8tn", label: "Pension assets", note: "31 Aug 2026" },
  { value: "11.39m", label: "RSA holders", note: "Aug 2026" },
  { value: "19", label: "Licensed PFAs", note: "plus 3 PFCs" },
];

/* ─────────────────────────── Mandate ─────────────────────────── */

export const mandate = [
  {
    icon: "shield",
    title: "License and supervise operators",
    body: "Pension Fund Administrators, Pension Fund Custodians and closed pension schemes.",
  },
  {
    icon: "scale",
    title: "Set the rules and enforce them",
    body: "Regulations, guidelines and circulars on investment, benefits and compliance.",
  },
  {
    icon: "users",
    title: "Protect contributors and retirees",
    body: "Resolve complaints and recover contributions that employers fail to remit.",
  },
  {
    icon: "trend",
    title: "Widen coverage",
    body: "Bring self-employed and informal-sector workers in through the Personal Pension Plan.",
  },
] as const;

export const values = [
  { icon: "shield", title: "Integrity", desc: "We uphold the highest ethical standards in all our operations." },
  { icon: "award", title: "Professionalism", desc: "We deliver excellence through competence and diligence." },
  { icon: "eye", title: "Transparency", desc: "We maintain open communication with all stakeholders." },
  { icon: "heart", title: "Service", desc: "We put the needs of pension contributors first." },
] as const;

/* ─────────────────────────── History ─────────────────────────── */

export type Chapter = {
  id: string;
  /** Large display year in the sticky panel. */
  year: string;
  /** Short label for the year rail. */
  rail: string;
  period: string;
  title: string;
  body: string;
  points?: string[];
  figure?: { value: string; label: string };
};

export const chapters: Chapter[] = [
  {
    id: "history-1951",
    year: "1951",
    rail: "Pre-2004",
    period: "1951 – 2004",
    title: "Why Nigeria reformed its pensions",
    body: "Before 2004, most public servants were on an unfunded defined benefit scheme. Pensions were paid from the annual budget, and when budgets fell short, retirees waited.",
    points: [
      "Nigeria’s first pension law, the Pension Ordinance, dates from 1951.",
      "The National Provident Fund was set up in 1961 for private-sector workers.",
      "Pensions Decrees 102 and 103 of 1979 covered the public service and the military.",
      "By 2004 the old schemes carried a deficit estimated at more than ₦2 trillion.",
    ],
  },
  {
    id: "history-2004",
    year: "2004",
    rail: "2004",
    period: "25 June 2004",
    title: "The Pension Reform Act is signed into law",
    body: "The Pension Reform Act 2004 created the Contributory Pension Scheme and established the National Pension Commission as the single regulator of pension matters in Nigeria.",
    points: [
      "Employers and employees each pay 7.5% of monthly pay into a Retirement Savings Account (RSA).",
      "Licensed Pension Fund Administrators (PFAs) invest the money; separate Pension Fund Custodians (PFCs) keep it safe.",
      "Workers choose their own PFA, and the RSA stays with them from job to job.",
    ],
    figure: { value: "15%", label: "of monthly pay saved for retirement" },
  },
  {
    id: "history-2005",
    year: "2005",
    rail: "2005",
    period: "2005 – 2006",
    title: "The industry opens for business",
    body: "The Commission licensed the first PFAs and PFCs, and workers began opening Retirement Savings Accounts. Employers whose own schemes met the rules continued as Closed Pension Fund Administrators.",
  },
  {
    id: "history-2014",
    year: "2014",
    rail: "2014",
    period: "1 July 2014",
    title: "Pension Reform Act 2014",
    body: "After ten years of the scheme, the 2004 Act was repealed and re-enacted as the Pension Reform Act 2014, strengthening the framework and widening who it covers.",
    points: [
      "Minimum contribution rose from 15% to 18% of monthly pay: 10% from the employer and 8% from the employee.",
      "The scheme now covers employers with three or more staff.",
      "Self-employed people and staff of smaller firms can join.",
      "Tougher penalties for employers who fail to remit contributions.",
    ],
    figure: { value: "18%", label: "minimum contribution under the 2014 Act" },
  },
  {
    id: "history-2019",
    year: "2019",
    rail: "2019",
    period: "March 2019",
    title: "Micro Pension Plan launched",
    body: "The Micro Pension Plan brought artisans, traders and other self-employed workers into the scheme, with flexible contributions and part of their savings available before retirement.",
  },
  {
    id: "history-2021",
    year: "2021",
    rail: "2021",
    period: "2021",
    title: "Contributors can switch PFA",
    body: "The RSA transfer window opened, so contributors who are unhappy with their PFA can move their account to one of their choice.",
  },
  {
    id: "history-2024",
    year: "2024",
    rail: "2024",
    period: "June 2024",
    title: "Twenty years of the Contributory Pension Scheme",
    body: "Twenty years on, the Commission regulates 22 PFAs and 4 PFCs, overseeing pension assets above ₦20.5 trillion for more than 10 million registered contributors.",
    figure: { value: "₦20.5tn", label: "pension assets at 20 years" },
  },
  {
    id: "history-2026",
    year: "2026",
    rail: "2026",
    period: "Today",
    title: "Wider reach, stronger enforcement",
    body: "Pension assets reached ₦31.8 trillion by August 2026 and RSA membership 11.39 million. The Commission recovered ₦36.6 billion from defaulting employers and held the first National Pension Week to bring young and informal-sector workers into the Personal Pension Plan.",
    figure: { value: "₦31.8tn", label: "pension assets, August 2026" },
  },
];

/* ─────────────────────────── Structure ─────────────────────────── */

export type Department = { name: string; units?: string[] };
export type Arm = { execId: string; short: string; departments: Department[] };

export const arms: Arm[] = [
  {
    execId: "admin",
    short: "Administration",
    departments: [
      {
        name: "Management Services",
        units: ["Administrative Services", "Human Resources", "Training & Manpower Development"],
      },
      {
        name: "Information Technology",
        units: ["Business Systems Development & Support", "Infrastructural Services", "Database Administration"],
      },
    ],
  },
  {
    execId: "finance",
    short: "Finance",
    departments: [
      {
        name: "Finance",
        units: ["Treasury & Investments", "Budget & Payroll", "General Accounts & Reconciliation"],
      },
      { name: "National Databank", units: ["Database Management", "Systems Development & Support"] },
      { name: "Retirement Benefits Bond Redemption Fund" },
    ],
  },
  {
    execId: "technical",
    short: "Technical",
    departments: [
      { name: "Risk Management", units: ["Investments Policy & Regulation", "Risk Evaluation & Analysis"] },
      { name: "Benefits & Insurance" },
      {
        name: "Research & Corporate Strategy",
        units: ["Research & Policy", "Corporate Strategy", "Web Development & Management"],
      },
    ],
  },
  {
    execId: "inspectorate",
    short: "Inspectorate",
    departments: [
      {
        name: "Surveillance",
        units: ["Authorisation & Regulation", "Inspection & Investigation", "Market Surveillance"],
      },
      { name: "Resolution & Enforcement", units: ["Resolution", "Enforcement"] },
      { name: "Pension Assistance & Ombudsman" },
      { name: "States & Local Governments" },
    ],
  },
];

/** Offices that report straight to the Director General. */
export const dgOffices = [
  { name: "Commission Secretary / Legal Adviser", execId: "secretary" },
  { name: "Internal Audit" },
  { name: "Corporate Communications" },
];

/* ─────────────────────────── Service Charter ─────────────────────────── */

export const charter = [
  { value: "48", unit: "hours", label: "to respond to all enquiries" },
  { value: "5", unit: "working days", label: "to process RSA transfers" },
  { value: "10", unit: "working days", label: "to issue Pension Clearance Certificates" },
  { value: "14", unit: "working days", label: "to resolve complaints" },
  { value: "4", unit: "times a year", label: "industry reports, published promptly" },
  { value: "99.9", unit: "% uptime", label: "on all digital platforms" },
];

export const zonalOffices = ["Lagos", "Ilorin", "Kano", "Gombe", "Awka", "Calabar"];

/* ─────────────────────────── Overview text ─────────────────────────── */

export const overview = [
  "Before 2004, pensions in Nigeria were paid from yearly budgets, and many retirees waited years for what they were owed. The Pension Reform Act 2004 replaced that system with the Contributory Pension Scheme and created the Commission to regulate it.",
  "Today we license and supervise the operators who invest and keep your savings, set the rules they follow, and step in when employers or operators fall short.",
];

export const mission =
  "To regulate, supervise and ensure the effective administration of pension matters in Nigeria, while promoting a sustainable pension system that guarantees retirement benefits for all Nigerian workers.";

export const vision =
  "To be a model pension regulatory authority in Africa, ensuring that every Nigerian worker receives their retirement benefits as and when due, through a well-regulated and supervised pension industry.";
