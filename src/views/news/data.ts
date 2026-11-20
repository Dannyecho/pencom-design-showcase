/**
 * Newsroom content. Each article is a CMS "news" item (brief §7 "News and events": listing, article, event detail,
 * gallery with alt text). Figures come from PenCom's published reports and press coverage of them (sources listed
 * per article). The wording is draft copy for Corporate Communications to replace with the official release text.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "list"; items: string[] }
  | { type: "facts"; items: { value: string; label: string }[] }
  | { type: "callout"; title: string; text: string; links: { label: string; to: string }[] };

export type Category = "Press release" | "Statement" | "Reports" | "Regulation" | "Speech" | "Event";

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: Category;
  image: string;
  imageAlt: string;
  readMins: number;
  author: string;
  blocks: Block[];
  attachment?: { title: string; url: string; size?: string };
  related: { label: string; to: string }[];
  sources: { label: string; url: string }[];
};

const articles: Article[] = [
  {
    id: "q1-2026-industry-report",
    slug: "q1-2026-industry-report",
    title: "PenCom publishes the Q1 2026 Pension Industry Report",
    excerpt: "Pension assets crossed ₦29 trillion for the first time, and 143,248 new Retirement Savings Accounts were opened in the first quarter.",
    date: "2026-08-14",
    category: "Reports",
    image: "/images/site/board-meeting-1920.webp",
    imageAlt: "Colleagues reviewing figures around a boardroom table",
    readMins: 4,
    author: "Corporate Communications Department",
    attachment: { title: "Nigerian Pension Industry Quarterly Report, Q1 2026", url: "https://www.pencom.gov.ng/wp-content/uploads/2026/08/PenCom-Q1-2026-Quarterly-Industry-Report-finale-2.pdf", size: "PDF" },
    blocks: [
      { type: "p", text: "The National Pension Commission has published its quarterly industry report for January to March 2026. The report shows a pension industry that started the year in a stronger position, with assets under regulation passing ₦29 trillion for the first time." },
      { type: "facts", items: [
        { value: "₦29tn+", label: "Pension assets at 31 March 2026" },
        { value: "143,248", label: "New RSAs opened in Q1 2026" },
        { value: "11.18m", label: "Total RSA registrations" },
        { value: "₦559.42bn", label: "Contributions received in Q1" },
      ] },
      { type: "h2", id: "coverage", text: "More Nigerians are saving for retirement" },
      { type: "p", text: "During the quarter, 143,248 new Retirement Savings Accounts (RSAs) were opened, up from 114,864 in the last quarter of 2025. Total registrations rose from 11.04 million at the end of December 2025 to 11.18 million by the end of March 2026." },
      { type: "p", text: "New registrations were also spread more evenly across Pension Fund Administrators (PFAs). The five largest PFAs by new registrations accounted for 54.41% of new accounts, down from 62.11% in the previous quarter." },
      { type: "h2", id: "contributions", text: "Contributions" },
      { type: "p", text: "Employers and workers remitted ₦559.42 billion in contributions during the quarter. The figure is lower than the fourth quarter of 2025, which included one-off public-sector payments. The Commission has published a separate note explaining the comparison." },
      { type: "h2", id: "informal-sector", text: "Personal Pension Plan" },
      { type: "p", text: "By March 2026, 219,316 accounts had been registered under the Personal Pension Plan (PPP) for self-employed and informal-sector workers. Only 18,811 of them had received a contribution. Growing regular saving in this group remains a priority under Pension Revolution 2.0." },
      { type: "callout", title: "What this means for you", text: "If you have opened a PPP account but not yet saved into it, you can start with any amount and contribute daily, weekly or monthly through your PFA.", links: [
        { label: "How the Personal Pension Plan works", to: "/services#ppp" },
        { label: "Find your PFA", to: "/operators#pfas" },
      ] },
    ],
    related: [
      { label: "All quarterly reports", to: "/resources#quarterly-reports" },
      { label: "PFA performance data", to: "/performance" },
    ],
    sources: [
      { label: "PenCom Q1 2026 Quarterly Industry Report (PDF)", url: "https://www.pencom.gov.ng/wp-content/uploads/2026/08/PenCom-Q1-2026-Quarterly-Industry-Report-finale-2.pdf" },
      { label: "Nairametrics, 24 Aug 2026", url: "https://nairametrics.com/2026/08/24/pencom-registers-143248-new-pension-accounts-as-coverage-gap-persists/" },
    ],
  },
  {
    id: "q1-contributions-explained",
    slug: "q1-contributions-explained",
    title: "PenCom explains the Q1 2026 contribution figures",
    excerpt: "The lower quarter-on-quarter figure reflects one-off public-sector payments received at the end of 2025, not a fall in regular remittances.",
    date: "2026-08-21",
    category: "Statement",
    image: "/images/site/signing-document-1920.webp",
    imageAlt: "A hand signing a printed statement",
    readMins: 2,
    author: "Corporate Communications Department",
    blocks: [
      { type: "p", text: "The Commission has noted reports describing a 38% fall in pension contributions in the first quarter of 2026. Total contributions were ₦559.42 billion in Q1 2026, compared with ₦903.70 billion in Q4 2025." },
      { type: "p", text: "The fourth-quarter figure included one-off payments by government that do not recur every quarter. Comparing the two quarters directly therefore overstates the change in regular monthly remittances by employers." },
      { type: "facts", items: [
        { value: "₦559.42bn", label: "Contributions, Q1 2026" },
        { value: "₦903.70bn", label: "Contributions, Q4 2025" },
      ] },
      { type: "h2", id: "employers", text: "A reminder to employers" },
      { type: "p", text: "Employers must remit their own and their employees’ contributions to each employee’s RSA no later than seven working days after paying salaries. Late remittance attracts penalties under the Pension Reform Act 2014." },
      { type: "callout", title: "Is your employer not remitting?", text: "You can report an employer to the Commission. You do not need to give your RSA PIN, and you will get a case reference to follow progress.", links: [
        { label: "Report an employer", to: "/connect#report" },
        { label: "Check how to get a Pension Clearance Certificate", to: "/services#pcc" },
      ] },
    ],
    related: [
      { label: "Pension Reform Act 2014", to: "/regulations#act" },
      { label: "Compliance for employers", to: "/regulations#compliance" },
    ],
    sources: [
      { label: "Nairametrics, 21 Aug 2026", url: "https://nairametrics.com/2026/08/21/pencom-clarifies-38-decline-in-pension-remittances-cites-one-off-government-payments/" },
    ],
  },
  {
    id: "48-hour-approvals",
    slug: "48-hour-approvals",
    title: "Benefit approvals now within 48 hours",
    excerpt: "A 48-hour approval timeline is now a mandatory service standard for every Pension Fund Administrator.",
    date: "2026-07-14",
    category: "Press release",
    image: "/images/site/elder-woman-call-1920.webp",
    imageAlt: "A retired woman smiling during a phone call",
    readMins: 3,
    author: "Corporate Communications Department",
    blocks: [
      { type: "p", text: "The Commission has made a 48-hour timeline for approving retirement benefit requests a mandatory service standard for all licensed Pension Fund Administrators. It is binding on every PFA." },
      { type: "facts", items: [
        { value: "48 hrs", label: "Approval standard for PFAs" },
        { value: "₦36bn", label: "Pension arrears recovered" },
      ] },
      { type: "h2", id: "what-changes", text: "What changes for retirees" },
      { type: "list", items: [
        "You still apply for your benefits through your PFA.",
        "Once your PFA sends the Commission a complete application, approval should follow within 48 hours.",
        "If your PFA does not act on your application, you can complain to the Commission.",
      ] },
      { type: "h2", id: "arrears", text: "Recovering unpaid contributions" },
      { type: "p", text: "The Commission also reported that about ₦36 billion in pension arrears has been recovered." },
      { type: "callout", title: "Retiring soon?", text: "Our step-by-step guide shows what to prepare so your application is complete the first time.", links: [
        { label: "Guide: retiring and accessing your benefits", to: "/resources?guide=retirement" },
        { label: "Service Charter", to: "/about#charter" },
      ] },
    ],
    related: [
      { label: "Complain about a PFA", to: "/connect#complaint" },
      { label: "Licensed PFAs", to: "/operators#pfas" },
    ],
    sources: [
      { label: "Gazette Nigeria, 16 Jul 2026", url: "https://gazettengr.com/?p=485699" },
    ],
  },
  {
    id: "pension-assets-may-2026",
    slug: "pension-assets-may-2026",
    title: "Pension assets reach ₦31.32 trillion",
    excerpt: "Total pension assets grew 29.5% year on year to a record ₦31.32 trillion at the end of May 2026.",
    date: "2026-06-29",
    category: "Reports",
    image: "/images/site/laptop-phone-1920.webp",
    imageAlt: "Someone checking figures on a laptop and a phone",
    readMins: 2,
    author: "Corporate Communications Department",
    blocks: [
      { type: "p", text: "Unaudited figures for the month ended 31 May 2026 show total pension assets of ₦31.32 trillion, a record for the industry." },
      { type: "facts", items: [
        { value: "₦31.32tn", label: "Total pension assets, May 2026" },
        { value: "29.5%", label: "Growth in a year" },
        { value: "₦384.98bn", label: "Growth since April" },
      ] },
      { type: "p", text: "Assets rose by ₦384.98 billion from ₦30.94 trillion at the end of April, and by 29.5% from ₦24.18 trillion in May 2025. Growth came from new contributions and investment income." },
      { type: "p", text: "Federal Government securities remain the largest share of investments, at about 56% of assets in April. The Commission continues to encourage diversification within its investment rules." },
    ],
    related: [
      { label: "Monthly reports", to: "/resources#monthly-reports" },
      { label: "Industry figures", to: "/performance" },
    ],
    sources: [
      { label: "Leadership, Jun 2026", url: "https://leadership.ng/pension-assets-hit-n31-32trn/" },
      { label: "Gazette Nigeria, 20 Jul 2026", url: "https://gazettengr.com/pension-assets-hit-n30-9-trillion-as-government-securities-dominate-portfolios/" },
    ],
  },
  {
    id: "ppp-guidelines",
    slug: "ppp-guidelines",
    title: "Guidelines for the Personal Pension Plan issued",
    excerpt: "The Micro Pension Plan becomes the Personal Pension Plan, with simpler rules for self-employed and informal-sector workers.",
    date: "2025-10-01",
    category: "Regulation",
    image: "/images/opt/pencom-trader-1200.webp",
    imageAlt: "A trader at her pepper stall in a busy market",
    readMins: 3,
    author: "Corporate Communications Department",
    attachment: { title: "Guidelines for Personal Pension Plan (September 2025)", url: "https://www.pencom.gov.ng/wp-content/uploads/2025/10/Guidelines-for-Personal-Pension-Plan.pdf", size: "PDF, 27 pages" },
    blocks: [
      { type: "p", text: "The Commission has issued the Guidelines for Personal Pension Plan. They replace the Micro Pension Plan framework and set out how self-employed people, informal-sector workers and others not covered by the mandatory scheme can save for retirement." },
      { type: "h2", id: "who", text: "Who it is for" },
      { type: "list", items: [
        "Self-employed people and owners of small businesses.",
        "Workers in the informal sector, such as traders, artisans and farmers.",
        "People exempted from the mandatory Contributory Pension Scheme.",
      ] },
      { type: "h2", id: "how", text: "How it works" },
      { type: "p", text: "You open a Retirement Savings Account with a licensed PFA of your choice and contribute as often as suits your income. Part of each contribution can be set aside so you can withdraw it before retirement if you need it." },
      { type: "quote", text: "Save as often as your income allows, in any amount, with a licensed PFA of your choice." },
      { type: "callout", title: "Ready to start?", text: "Open a Personal Pension Plan account in a few steps.", links: [
        { label: "Personal Pension Plan", to: "/services#ppp" },
        { label: "Read the guidelines in the library", to: "/regulations?q=personal%20pension#library" },
      ] },
    ],
    related: [
      { label: "Pension calculator", to: "/services#calculator" },
      { label: "FAQ", to: "/resources/faq" },
    ],
    sources: [
      { label: "Guidelines for Personal Pension Plan (PDF)", url: "https://www.pencom.gov.ng/wp-content/uploads/2025/10/Guidelines-for-Personal-Pension-Plan.pdf" },
    ],
  },
];

export const news = [...articles].sort((a, b) => b.date.localeCompare(a.date));
export const findArticle = (slug: string) => news.find((a) => a.slug === slug);
export const newsPath = (a: { slug: string }) => `/news/${a.slug}`;
