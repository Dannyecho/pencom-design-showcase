/**
 * PenCom Chronicles (brief §7 "Publications listing and detail: reports, magazine, downloads"; questionnaire:
 * news and media centre, easy sharing). Issue facts come from the PenCom website and NAN's launch report.
 */

export const issue = {
  number: 1,
  title: "PenCom Chronicles",
  edition: "Inaugural edition",
  date: "October 2026",
  launched: "6 October 2026, Lagos",
  pdfUrl: "https://www.pencom.gov.ng/wp-content/uploads/2026/10/PenCom-Chronicles-1.pdf",
  pageUrl: "https://www.pencom.gov.ng/pencom-chronicles-magazine/",
  /** Put the issue PDF here (same origin) and the flip book shows the real pages. */
  localPdf: "/magazine/pencom-chronicles-1.pdf",
  cover: "/images/opt/pencom-retiree-family-1200.webp",
};

export const sections = [
  { k: "News", body: "What the Commission is doing, as it happens." },
  { k: "Interviews", body: "Conversations with the people shaping the industry." },
  { k: "Industry updates", body: "Figures, rules and changes that affect your pension." },
  { k: "Human interest", body: "Contributors, retirees and the stories behind the numbers." },
  { k: "Features", body: "Deeper looks at reforms such as Pension Revolution 2.0." },
  { k: "Commentaries", body: "Views from stakeholders across the industry." },
];

export const awards = [
  { cat: "Online", name: "Chuks Udo-Okonta", outlet: "" },
  { cat: "Print", name: "Modestus Anaesoronye", outlet: "BusinessDay" },
  { cat: "Television", name: "Ini John-Mekwa", outlet: "Channels Television" },
];

export const shelf = [
  { n: 1, label: "Issue 01", date: "October 2026", live: true },
  { n: 2, label: "Issue 02", date: "Coming soon", live: false },
];

export const launchSource = { label: "NAN: PenCom unveils magazine to deepen public understanding of pension system", url: "https://nannews.ng/pencom-unveils-magazine-to-deepen-public-understanding-of-pension-system/" };
