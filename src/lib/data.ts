// PenCom Mock Data - Comprehensive content for all sections

export const navItems = [
  {
    label: "Home",
    href: "/",
    icon: "Home",
    description: "Official homepage",
  },
  {
    label: "About",
    href: "/about",
    icon: "Building2",
    description: "About PenCom, leadership, governance",
    megaMenu: {
      columns: [
        {
          title: "About PenCom",
          links: [
            { label: "About the Commission", href: "/about" },
            { label: "Promise to Stakeholders", href: "/about#stakeholders" },
            { label: "Mission & Vision", href: "/about#mission" },
            { label: "Why Choose Us", href: "/about#why-us" },
            { label: "Service Charter", href: "/about/service-charter" },
          ],
        },
        {
          title: "Leadership",
          links: [
            { label: "DG's Corner", href: "/about#dg-corner" },
            { label: "Executive Management", href: "/about#executive" },
            { label: "Members of the Board", href: "/about#board" },
            { label: "Structure of the Commission", href: "/about#structure" },
            { label: "Zonal Offices", href: "/connect#zonal-offices" },
          ],
        },
        {
          title: "History",
          links: [
            { label: "Signing into Law", href: "/about#signing" },
            { label: "Pension Reform Act", href: "/regulations/pension-reform-act" },
            { label: "Annual Reports", href: "/resources#publications" },
            { label: "FAQs", href: "/resources/faq" },
          ],
        },
      ],
    },
  },
  {
    label: "Services",
    href: "/services",
    icon: "ClipboardList",
    description: "All pension services",
    megaMenu: {
      columns: [
        {
          title: "For Individuals",
          links: [
            { label: "RSA Transfer", href: "/services#rsa-transfer" },
            { label: "Personal Pension Plan", href: "/services#ppp" },
            { label: "Micro Pension", href: "/services#micro" },
            { label: "Pencare Health", href: "/services#pencare" },
          ],
        },
        {
          title: "For Employers",
          links: [
            { label: "Pension Clearance Certificate", href: "/services#pcc" },
            { label: "Uncredited Contributions", href: "/services#complaint" },
            { label: "Online Enrolment", href: "/services#enrolment" },
            { label: "Contribution Remittance", href: "/services#portals" },
          ],
        },
        {
          title: "Quick Links",
          links: [
            { label: "PENCAP (Recapture)", href: "/services#portals" },
            { label: "Pension Calculator", href: "/services#calculator" },
            { label: "Step-By-Step Guides", href: "/resources#guides" },
            { label: "Performance Dashboard", href: "/performance" },
          ],
        },
      ],
    },
  },
  {
    label: "Operators",
    href: "/operators",
    icon: "Users",
    description: "Pension operators directory",
    megaMenu: {
      columns: [
        {
          title: "Administrators",
          links: [
            { label: "Pension Fund Administrators", href: "/operators#pfas" },
            { label: "PFA Downloads", href: "/resources#downloads" },
            { label: "Closed Pension Fund Admins", href: "/operators#cpfas" },
            { label: "PFA Office Addresses", href: "/operators#pfa-addresses" },
          ],
        },
        {
          title: "Custodians",
          links: [
            { label: "Pension Fund Custodians", href: "/operators#pfcs" },
            { label: "PFC Downloads", href: "/resources#downloads" },
          ],
        },
        {
          title: "Related Bodies",
          links: [
            { label: "PENOP", href: "/operators#penop" },
            { label: "PTAD", href: "/operators#ptad" },
            { label: "PFA Monthly Performance", href: "/operators#performance" },
            { label: "RSA Transfer Summary", href: "/performance" },
          ],
        },
      ],
    },
  },
  {
    label: "Resources",
    href: "/resources",
    icon: "BookOpen",
    description: "Publications, forms, FAQ",
    megaMenu: {
      columns: [
        {
          title: "Publications",
          links: [
            { label: "Annual Reports", href: "/resources#annual-reports" },
            { label: "Monthly Reports", href: "/resources#monthly-reports" },
            { label: "Quarterly Reports", href: "/resources#quarterly-reports" },
            { label: "General Publications", href: "/resources#general" },
            { label: "PenCom Chronicles", href: "/chronicles" },
          ],
        },
        {
          title: "Documents",
          links: [
            { label: "Circulars", href: "/regulations?type=Circular#library" },
            { label: "Forms & Checklists", href: "/resources/forms-and-checklists" },
            { label: "Downloads Center", href: "/resources#downloads" },
            { label: "Presentations", href: "/resources#learning" },
            { label: "Seminars & Conferences", href: "/resources#learning" },
          ],
        },
        {
          title: "Learning",
          links: [
            { label: "FAQ Knowledge Base", href: "/resources/faq" },
            { label: "Step-By-Step Guides", href: "/resources#guides" },
            { label: "Pension Calculator", href: "/services#calculator" },
            { label: "AI Assistant", href: "/#chat" },
          ],
        },
      ],
    },
  },
  {
    label: "Regulations",
    href: "/regulations",
    icon: "Scale",
    description: "Laws, guidelines, compliance",
  },
  {
    label: "Connect",
    href: "/connect",
    icon: "Mail",
    description: "News, events, contact",
  },
];

export const heroSlides = [
  {
    title: "Secure Your Retirement",
    subtitle: "National Pension Commission",
    description:
      "The Pension Reform Act 2014 ensures every Nigerian worker has a secure and dignified retirement through the Contributory Pension Scheme.",
    cta: { label: "Explore Services", href: "/services" },
    secondaryCta: { label: "About PenCom", href: "/about" },
    image: "/images/opt/pencom-retiree-1200.webp",
  },
  {
    title: "Personal Pension Plan",
    subtitle: "For the Informal Sector",
    description:
      "Self-employed? Small business owner? Register for the Personal Pension Plan and enjoy government-regulated retirement savings.",
    cta: { label: "Register for PPP", href: "/services#ppp" },
    secondaryCta: { label: "Learn More", href: "/services#ppp" },
    image: "/images/opt/pencom-trader-1200.webp",
  },
  {
    title: "AI-Powered Assistance",
    subtitle: "PenCom Digital Assistant",
    description:
      "Get instant answers to your pension questions from our AI-powered assistant, available 24/7 with accurate, up-to-date information.",
    cta: { label: "Try AI Assistant", href: "#chat" },
    secondaryCta: { label: "View FAQ", href: "/resources/faq" },
    image: "/images/site/woman-phone-1920.webp",
  },
];

export const quickActions = [
  { label: "Check Pension Status", icon: "Search", href: "/services", color: "#117F21" },
  { label: "Find Your PFA", icon: "Users", href: "/operators#pfas", color: "#2E913D" },
  { label: "Download Forms", icon: "Download", href: "/resources#downloads", color: "#CB9615" },
  { label: "Pension Calculator", icon: "Calculator", href: "/services#calculator", color: "#1E88E5" },
];

export const stats = [
  { label: "Registered Contributors", value: "10.2M+", suffix: "", icon: "Users" },
  { label: "Assets Under Management", value: "20.5", suffix: "Trillion NGN", icon: "Wallet" },
  { label: "Licensed PFAs", value: "22", suffix: "", icon: "Building" },
  { label: "Years of Service", value: "20", suffix: "+", icon: "Calendar" },
];

export { news as latestNews } from "@/views/news/data";

export const services = [
  {
    title: "RSA Transfer",
    description:
      "Transfer your Retirement Savings Account between licensed Pension Fund Administrators.",
    icon: "ArrowRightLeft",
    href: "/services#rsa-transfer",
    category: "individual",
  },
  {
    title: "Personal Pension Plan",
    description:
      "A voluntary pension scheme for self-employed individuals and workers in the informal sector.",
    icon: "UserCircle",
    href: "/services#ppp",
    category: "individual",
  },
  {
    title: "Micro Pension Scheme",
    description:
      "Simplified pension savings designed specifically for small businesses and informal sector workers.",
    icon: "TrendingUp",
    href: "/services#micro",
    category: "individual",
  },
  {
    title: "Pension Clearance",
    description:
      "Employers can apply for Pension Clearance Certificates for bidding and contract purposes.",
    icon: "FileCheck",
    href: "/services#pcc",
    category: "employer",
  },
  {
    title: "Online Enrolment",
    description:
      "Register your employees into the Contributory Pension Scheme through our online portal.",
    icon: "UserPlus",
    href: "/services#enrolment",
    category: "employer",
  },
  {
    title: "Pencare Health",
    description:
      "Health insurance program for retirees under the Contributory Pension Scheme.",
    icon: "Heart",
    href: "/services#pencare",
    category: "individual",
  },
];

export const operators = [
  { name: "AIICO Pension Managers Limited", type: "PFA", address: "Lagos", phone: "01-2792930" },
  { name: "APT Pension Fund Managers Limited", type: "PFA", address: "Abuja", phone: "09-46077900" },
  { name: "ARM Pension Managers (PFA) Limited", type: "PFA", address: "Lagos", phone: "01-2802200" },
  { name: "CrusaderSterling Pensions Limited", type: "PFA", address: "Lagos", phone: "01-2715000" },
  { name: "First Guarantee Pension Limited", type: "PFA", address: "Lagos", phone: "01-2774567" },
  { name: "FCMB Pensions Limited", type: "PFA", address: "Lagos", phone: "01-2793030" },
  { name: "Fidelity Pension Managers", type: "PFA", address: "Lagos", phone: "01-2778000" },
  { name: "Guaranty Trust Pension Managers Limited", type: "PFA", address: "Lagos", phone: "01-4480000" },
  { name: "IEI-Anchor Pension Managers Limited", type: "PFA", address: "Lagos", phone: "01-7916182" },
  { name: "Investment One Pension Managers Limited", type: "PFA", address: "Lagos", phone: "01-2770150" },
  { name: "Leadway Pensure PFA Limited", type: "PFA", address: "Lagos", phone: "01-2802500" },
  { name: "Legacy Pension Managers Limited", type: "PFA", address: "Lagos", phone: "01-2701285" },
];

export const publications = [
  { title: "Annual Report 2025", type: "Annual Report", date: "2026-03-15", size: "4.2 MB" },
  { title: "Q1 2026 Pension Industry Report", type: "Quarterly Report", date: "2026-04-30", size: "2.8 MB" },
  { title: "Guidelines on Micro Pension Scheme", type: "Guideline", date: "2026-04-15", size: "1.5 MB" },
  { title: "Pension Reform Act 2014 (Amended)", type: "Legislation", date: "2026-01-10", size: "3.1 MB" },
  { title: "Monthly Report - January 2026", type: "Monthly Report", date: "2026-02-28", size: "1.8 MB" },
  { title: "Code of Corporate Governance for PFAs", type: "Code", date: "2025-11-20", size: "2.2 MB" },
];

export const faqs = [
  {
    question: "What is the Contributory Pension Scheme (CPS)?",
    answer:
      "The Contributory Pension Scheme (CPS) is a mandatory pension scheme established under the Pension Reform Act 2014. Under this scheme, employers and employees contribute a minimum of 10% and 8% respectively of the employee's monthly emoluments into the employee's Retirement Savings Account (RSA).",
  },
  {
    question: "How do I open a Retirement Savings Account (RSA)?",
    answer:
      "To open an RSA, visit any licensed Pension Fund Administrator (PFA) of your choice with a valid means of identification (National ID, Driver's License, or International Passport), passport photographs, and your Bank Verification Number (BVN). The PFA will issue you a PIN and account number.",
  },
  {
    question: "Can I transfer my RSA to another PFA?",
    answer:
      "Yes. The Pension Reform Act allows RSA holders to transfer their accounts from one PFA to another once every year. To initiate a transfer, visit your chosen PFA and complete the RSA Transfer Application Form.",
  },
  {
    question: "What is the Personal Pension Plan (PPP)?",
    answer:
      "The Personal Pension Plan (PPP) is a voluntary pension arrangement for self-employed individuals and workers in the informal sector. Contributions are flexible and determined by the contributor, with a minimum contribution of N500 per month.",
  },
  {
    question: "When can I access my pension benefits?",
    answer:
      "You can access your retirement benefits upon reaching the age of 50 years and retiring from active employment. Benefits may also be accessed in cases of mental incapacity, terminal illness, or loss of employment before age 50 (with conditions).",
  },
  {
    question: "What is a Pension Clearance Certificate (PCC)?",
    answer:
      "A Pension Clearance Certificate is a document issued by PenCom to employers confirming compliance with the Pension Reform Act. It is required for employers bidding for government contracts, accessing tax incentives, and participating in public procurement processes.",
  },
];

export const regulations = [
  { title: "Pension Reform Act 2014", type: "Act of Parliament", date: "2014-07-01", description: "Primary legislation establishing the CPS" },
  { title: "Investment Regulations", type: "Regulation", date: "2019-06-15", description: "Guidelines on investment of pension fund assets" },
  { title: "Regulation on Administration", type: "Regulation", date: "2020-03-20", description: "Administrative procedures for pension operations" },
  { title: "Disclosure Framework", type: "Framework", date: "2021-08-10", description: "Disclosure requirements for pension operators" },
  { title: "Micro Pension Guidelines", type: "Guideline", date: "2025-12-01", description: "Operational guidelines for micro pension scheme" },
  { title: "Code of Corporate Governance", type: "Code", date: "2022-05-18", description: "Corporate governance standards for PFAs and PFCs" },
];

export const externalPortals = [
  { name: "COBRA", url: "https://cobra.pencom.gov.ng", description: "Contribution and Bond Redemption Application", icon: "ExternalLink" },
  { name: "Pencare", url: "https://pencare.pencom.gov.ng", description: "Health insurance for retirees", icon: "Heart" },
  { name: "PENCAP", url: "https://pensionrecap.pencom.gov.ng", description: "Pension Recapture Automated Platform", icon: "RefreshCw" },
  { name: "PCRS", url: "https://pcrs.pencom.gov.ng", description: "Pension Contribution Remittance System", icon: "Banknote" },
];

export const chatbotFAQs = [
  {
    keywords: ["cps", "contributory pension scheme", "what is pension"],
    answer: "The Contributory Pension Scheme (CPS) is a mandatory pension scheme established under the Pension Reform Act 2014. Under CPS, employers contribute 10% and employees contribute 8% of monthly emoluments into the employee's Retirement Savings Account (RSA). The scheme ensures you have savings for retirement.",
    source: "PenCom FAQ Database",
  },
  {
    keywords: ["rsa", "retirement savings account", "open rsa", "pfa"],
    answer: "A Retirement Savings Account (RSA) is your personal pension account. To open one, visit any licensed Pension Fund Administrator (PFA) with your National ID, passport photos, and BVN. You can choose any of the 22 licensed PFAs in Nigeria. Once opened, you'll receive a unique PIN.",
    source: "PenCom Enrollment Guide",
  },
  {
    keywords: ["transfer", "change pfa", "rsa transfer"],
    answer: "Yes, you can transfer your RSA to another PFA once every year. Visit your chosen PFA, complete the RSA Transfer Form, and they will handle the process. PenCom will process the transfer within 3-5 working days. Your account balance and contribution history transfer completely.",
    source: "RSA Transfer Guidelines",
  },
  {
    keywords: ["pcc", "pension clearance", "certificate"],
    answer: "A Pension Clearance Certificate (PCC) proves your employer is compliant with the Pension Reform Act. Employers need it for government contracts and tax incentives. You can apply online through the PenCom portal. Processing takes 5-10 working days.",
    source: "PCC Application Guide",
  },
  {
    keywords: ["ppp", "personal pension plan", "self employed", "informal"],
    answer: "The Personal Pension Plan (PPP) is a voluntary pension scheme for self-employed individuals and informal sector workers. You can contribute as little as N500 monthly. Register through the PPP portal or visit any licensed PFA to open a PPP account.",
    source: "PPP Guidelines 2026",
  },
  {
    keywords: ["withdraw", "access pension", "retirement", "benefits"],
    answer: "You can access pension benefits at age 50 upon retirement. If you lose your job before 50, you can access 25% of your RSA balance after 4 months of unemployment. Benefits are paid as lump sum, programmed withdrawals, or annuity based on your choice.",
    source: "Benefits Payment Guidelines",
  },
  {
    keywords: ["micro pension", "small business", "artisan"],
    answer: "The Micro Pension Scheme targets small business owners, artisans, and self-employed workers. It offers flexible contributions starting from N100 per day or N500 monthly. Enroll through any licensed PFA or the online Micro Pension portal.",
    source: "Micro Pension Framework",
  },
  {
    keywords: ["employer", "company", "remittance", "contribution"],
    answer: "Employers must contribute 10% of employee monthly emoluments (with employees contributing 8%). Contributions must be remitted within 7 days of salary payment. Use the Pension Contribution Remittance System (PCRS) for online remittance.",
    source: "Employer Compliance Guide",
  },
  {
    keywords: ["pencare", "health", "insurance", "retiree health"],
    answer: "Pencare is PenCom's health insurance program for retirees under the CPS. It provides access to quality healthcare through accredited health maintenance organizations (HMOs). Enroll through the Pencare portal at pencare.pencom.gov.ng.",
    source: "Pencare Program Documentation",
  },
  {
    keywords: ["complaint", "grievance", "report", "issue"],
    answer: "To file a complaint, use the Report Employer feature on our website, visit any PenCom zonal office, or email complaints@pencom.gov.ng. Include your RSA PIN, employer name, and detailed description of the issue. PenCom investigates all complaints within 14 working days.",
    source: "Complaints Handling Procedure",
  },
];
