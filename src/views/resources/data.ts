/**
 * Knowledge-base content for /resources.
 * - RSA transfer guide: from the website project's content/transfer.ts (based on the Revised Regulation
 *   for the Transfer of RSAs).
 * - Other guides, FAQs and glossary: plain-language (Grade 8) summaries of the Pension Reform Act 2014 and
 *   PenCom guidance already used on this site. Departments must confirm them before launch (DES-25, DES-26).
 */

export type Guide = {
  id: string;
  icon: string;
  audience: string;
  title: string;
  intro: string;
  time: string;
  where: string;
  needs: string[];
  steps: { title: string; body: string }[];
  link: { label: string; href: string };
};

export const guides: Guide[] = [
  {
    id: "open-rsa",
    icon: "user-plus",
    audience: "Contributors",
    title: "Open a Retirement Savings Account",
    intro: "Your RSA is your personal pension account. It stays yours for life, whichever job you have.",
    time: "One visit",
    where: "Any licensed PFA",
    needs: ["A valid means of identification", "Your National Identification Number (NIN)", "Your Bank Verification Number (BVN)", "Passport photographs"],
    steps: [
      { title: "Choose a PFA", body: "Compare the licensed Pension Fund Administrators and pick the one you want to manage your savings." },
      { title: "Register with the PFA", body: "Visit the PFA or its agent with your documents and fill in the RSA registration form." },
      { title: "Get your RSA PIN", body: "The PFA registers you and gives you your RSA PIN. Keep it safe: it is your pension number for life." },
      { title: "Tell your employer", body: "Give your employer your RSA PIN and PFA name so your contributions go into your account." },
    ],
    link: { label: "Find a PFA", href: "/operators#pfas" },
  },
  {
    id: "transfer-rsa",
    icon: "transfer",
    audience: "Contributors",
    title: "Transfer your RSA to another PFA",
    intro: "You can move your RSA to a different PFA. Your savings and contribution history move with you, and it’s free.",
    time: "Takes effect quarterly",
    where: "Your new PFA",
    needs: ["Your RSA PIN and surname", "Your NIN or Virtual NIN", "Your phone number and email", "Completed data recapture"],
    steps: [
      { title: "Compare PFAs and choose one", body: "Look at each PFA’s returns and service." },
      { title: "Visit your new PFA", body: "Sign the Pre-RSA Transfer Consent Form. The new PFA checks you haven’t transferred in the last 365 days and submits your request." },
      { title: "Confirm it’s you", body: "The PFA takes a live photo and fingerprint, checked against your NIN record. If your fingerprint can’t be read, your Virtual NIN is used." },
      { title: "Your savings move", body: "The transfer takes effect on the quarter’s transfer date. Your new PFA sends you a transfer letter within 5 working days of completion. Your RSA PIN stays the same." },
    ],
    link: { label: "Compare PFAs", href: "/operators#pfas" },
  },
  {
    id: "retirement",
    icon: "retiree",
    audience: "Retirees",
    title: "Get your retirement benefits",
    intro: "When you retire, your PFA pays your benefits from your RSA. You choose how you want to be paid.",
    time: "Start before you retire",
    where: "Your PFA",
    needs: ["Your RSA PIN", "Proof of retirement from your employer", "A valid means of identification", "Your bank account details"],
    steps: [
      { title: "Check you can access your RSA", body: "Benefits are paid when you retire, generally from age 50. If you lose your job before then, you may access part of your RSA after four months without work." },
      { title: "Contact your PFA early", body: "Ask your PFA for its checklist of documents and start the process before your retirement date." },
      { title: "Choose how to be paid", body: "Programmed withdrawal pays you a regular amount from your RSA through your PFA. An annuity is bought from a life insurer and pays you for life. You may also take a lump sum, within the limits set by PenCom." },
      { title: "Receive your payments", body: "Your PFA processes your request and pays into your bank account. If there are delays, contact your PFA first, then PenCom." },
    ],
    link: { label: "Find your nearest zonal office", href: "/connect#zonal-offices" },
  },
  {
    id: "pcc",
    icon: "certificate",
    audience: "Employers",
    title: "Get a Pension Clearance Certificate (PCC)",
    intro: "The PCC shows your organisation complies with the Pension Reform Act. You need it to bid for government contracts.",
    time: "Apply online",
    where: "eHub portal",
    needs: ["Your employer code", "Evidence that contributions have been remitted", "Your group life insurance policy", "Your organisation’s registration details"],
    steps: [
      { title: "Make sure you are compliant", body: "Register all employees, deduct and remit their contributions on time, and keep a group life insurance policy." },
      { title: "Apply on eHub", body: "New PCC applications are made on eHub. Upload the documents it asks for." },
      { title: "Respond to any queries", body: "PenCom reviews your application and may ask for more information." },
      { title: "Download your certificate", body: "Certificates already approved can be viewed, downloaded and printed from the PCC portal." },
    ],
    link: { label: "PCC requirements", href: "/services#pcc" },
  },
  {
    id: "ppp",
    icon: "store",
    audience: "Self-employed",
    title: "Join the Personal Pension Plan",
    intro: "Traders, artisans and other self-employed people can save for retirement in their own RSA.",
    time: "Register in minutes",
    where: "A PFA or an approved pension agent",
    needs: ["Your NIN", "Your BVN", "A phone number", "Your bank account details"],
    steps: [
      { title: "Pick a PFA", body: "Choose a licensed PFA, or speak to one of its approved pension agents." },
      { title: "Register", body: "Open your RSA under the Personal Pension Plan and receive your RSA PIN." },
      { title: "Save as it suits you", body: "Contribute daily, weekly or monthly, by bank transfer or other approved channels." },
      { title: "Use your savings", body: "Part of what you save can be withdrawn before retirement; the rest is kept for your pension." },
    ],
    link: { label: "Personal Pension Plan", href: "/services#ppp" },
  },
  {
    id: "complaint",
    icon: "complaint",
    audience: "Everyone",
    title: "Make a complaint",
    intro: "If something goes wrong with your pension, start with your PFA. If it isn’t resolved, PenCom will step in.",
    time: "We aim to resolve within 14 working days",
    where: "Your PFA, then PenCom",
    needs: ["Your RSA PIN", "Your PFA’s complaint reference, if you have one", "Copies of letters or receipts", "A short description of the problem"],
    steps: [
      { title: "Contact your PFA", body: "Every PFA must have a complaints channel. Explain the problem and keep the reference number." },
      { title: "Escalate to PenCom", body: "If your PFA doesn’t resolve it, lodge a complaint with PenCom online, by email or at a zonal office." },
      { title: "Track your case", body: "You get a case reference so you can follow progress." },
      { title: "Report an employer", body: "If your employer deducts pension but doesn’t remit it, report the employer to PenCom." },
    ],
    link: { label: "Lodge a complaint", href: "/connect#report" },
  },
];

/* ─────────────────────────── FAQs ─────────────────────────── */

export type Faq = { q: string; a: string; cat: string };

export const faqCats = ["Contributors", "Retirees", "Employers", "Self-employed"];

export const faqs: Faq[] = [
  { cat: "Contributors", q: "What is the Contributory Pension Scheme (CPS)?", a: "It is the pension scheme set up by law. Your employer pays at least 10% of your monthly pay and you pay at least 8% into your own Retirement Savings Account (RSA), which a PFA invests for your retirement." },
  { cat: "Contributors", q: "How do I open a Retirement Savings Account (RSA)?", a: "Visit any licensed PFA with a valid means of identification, your NIN, your BVN and passport photographs. The PFA registers you and gives you your RSA PIN." },
  { cat: "Contributors", q: "Can I transfer my RSA to another PFA?", a: "Yes. Transfers are free and can be made once every 365 days. Start the request at your new PFA. Your RSA PIN stays the same." },
  { cat: "Contributors", q: "Does my RSA PIN change if I change jobs?", a: "No. Your RSA PIN stays the same for life. Give it to each new employer so your contributions keep going into the same account." },
  { cat: "Contributors", q: "Can I save more than the minimum?", a: "Yes. You can make voluntary contributions on top of your regular contributions." },
  { cat: "Retirees", q: "When can I access my pension benefits?", a: "When you retire, generally from age 50. If you lose your job before 50, you may access part of your RSA after four months without work, subject to conditions." },
  { cat: "Retirees", q: "What is the difference between programmed withdrawal and an annuity?", a: "Programmed withdrawal pays you regular amounts from your RSA through your PFA. An annuity is bought from a life insurer with your RSA balance and pays you for the rest of your life." },
  { cat: "Retirees", q: "Can retirees transfer to another PFA?", a: "Yes, if you are on programmed withdrawal, or on annuity while making voluntary contributions." },
  { cat: "Retirees", q: "What is Pencare?", a: "Pencare is a health insurance programme for retirees under the Contributory Pension Scheme." },
  { cat: "Employers", q: "Which employers must join the scheme?", a: "Federal, FCT, State and Local Government employers, and private organisations with three or more employees." },
  { cat: "Employers", q: "How much must I contribute for each employee?", a: "At least 10% of the employee’s monthly pay, plus the 8% you deduct from the employee: 18% in total, paid to the employee’s Pension Fund Custodian." },
  { cat: "Employers", q: "What is a Pension Clearance Certificate (PCC)?", a: "A certificate from PenCom confirming that your organisation complies with the Pension Reform Act. You need it to bid for government contracts." },
  { cat: "Employers", q: "Where do I apply for a PCC?", a: "New applications are made on eHub. Certificates already approved can be viewed, downloaded and printed from the PCC portal." },
  { cat: "Self-employed", q: "What is the Personal Pension Plan (PPP)?", a: "A way for self-employed people and staff of small organisations to save for retirement in their own RSA, with flexible contributions." },
  { cat: "Self-employed", q: "Can I join if I don’t have an employer?", a: "Yes. Register with a PFA or one of its approved pension agents and contribute as often as suits you." },
  { cat: "Self-employed", q: "Can I take money out before I retire?", a: "Part of your savings under the Personal Pension Plan can be withdrawn before retirement. The rest is kept for your pension." },
];

/* ─────────────────────────── Glossary (DES-24) ─────────────────────────── */

export const glossary: { term: string; full?: string; def: string }[] = [
  { term: "Annuity", def: "A regular income for life that you buy from a life insurance company with your RSA balance when you retire." },
  { term: "APA", full: "Approved Pension Agent", def: "A person or business approved to help people register for and contribute to the Personal Pension Plan." },
  { term: "AVC", full: "Additional Voluntary Contribution", def: "Extra money you choose to pay into your RSA on top of your regular contributions." },
  { term: "BVN", full: "Bank Verification Number", def: "Your unique bank identity number. PFAs ask for it when you open an RSA." },
  { term: "CPFA", full: "Closed Pension Fund Administrator", def: "A company that manages a pension scheme only for the employees of the organisation that set it up." },
  { term: "CPS", full: "Contributory Pension Scheme", def: "Nigeria’s pension scheme in which you and your employer both pay into your own RSA." },
  { term: "Data recapture", def: "Updating your RSA records and identity details with your PFA, including your NIN and biometrics." },
  { term: "Group life insurance", def: "Life cover that employers must buy for their employees under the Pension Reform Act." },
  { term: "Lump sum", def: "A one-off payment from your RSA when you retire, within limits set by PenCom." },
  { term: "Micro Pension", def: "A pension plan for informal-sector and self-employed workers, with flexible contributions." },
  { term: "NIN", full: "National Identification Number", def: "Your national identity number. It must be linked to your RSA." },
  { term: "PCC", full: "Pension Clearance Certificate", def: "A certificate showing an employer complies with the Pension Reform Act. Needed for government contracts." },
  { term: "PFA", full: "Pension Fund Administrator", def: "A licensed company that manages and invests your RSA savings. You choose your PFA." },
  { term: "PFC", full: "Pension Fund Custodian", def: "A licensed company that holds pension assets safely, separate from the PFA that invests them." },
  { term: "PPP", full: "Personal Pension Plan", def: "A way for self-employed people to save for retirement in their own RSA." },
  { term: "PRA", full: "Pension Reform Act 2014", def: "The law that sets up the Contributory Pension Scheme and the National Pension Commission." },
  { term: "Programmed withdrawal", def: "Regular payments from your RSA, made by your PFA, after you retire." },
  { term: "Remittance", def: "When an employer pays the pension contributions it has deducted into employees’ accounts." },
  { term: "RSA", full: "Retirement Savings Account", def: "Your personal pension account. It belongs to you for life, whichever job you have." },
  { term: "RSA PIN", def: "Your unique pension number. It never changes, even when you change jobs or PFA." },
];
