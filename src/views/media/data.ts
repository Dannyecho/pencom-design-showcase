/**
 * Photos and videos (questionnaire "Anything else": a news and media centre with photographs and videos;
 * brief §7 "News and events": gallery with alt text).
 * Photos: PenCom's own, from the photo gallery in PenCom Chronicles, Issue 1 (pages 45–52). Captions follow the magazine.
 * Videos: news coverage of PenCom on YouTube, embedded from the broadcasters' channels. Dates are approximate (month).
 */

export type Album = { id: string; title: string; blurb: string };
export const albums: Album[] = [
  { id: "statehouse", title: "State House press briefing", blurb: "Marking two years of pension reforms in Abuja." },
  { id: "partners", title: "Strengthening partnerships", blurb: "Working with security agencies and state governments." },
  { id: "industry", title: "Advancing the pension industry", blurb: "New agents, labour unions and international peers." },
  { id: "people", title: "Taking pensions to the people", blurb: "Campaigns, retirees and public institutions." },
  { id: "media", title: "PenCom in the media", blurb: "Summits, seminars and press briefings." },
  { id: "learning", title: "Learning and capacity building", blurb: "Training, study visits and pension education." },
  { id: "staff", title: "Staff life", blurb: "TGIF staff bonding at the head office." },
];

export type Photo = { id: string; album: string; caption: string; alt: string; tall?: boolean };
const p = (id: string, album: string, caption: string, alt: string, tall?: boolean): Photo => ({ id, album, caption, alt, tall });

export const photos: Photo[] = [
  p("statehouse-dg-onanuga", "statehouse", "PenCom DG with the Special Adviser to the President on Information and Strategy, Bayo Onanuga, at the State House media briefing", "The Director-General shakes hands with Bayo Onanuga in an office with wood panelling"),
  p("statehouse-executives-media", "statehouse", "PenCom executives with the Special Adviser on Information and the Senior Special Assistant on Media", "PenCom executives stand in a row with presidential media aides at the State House"),
  p("partners-dg-igp", "partners", "PenCom DG visits the Inspector-General of Police", "The Director-General and the Inspector-General of Police hold a plaque in his office"),
  p("partners-kogi-governor", "partners", "Kogi State Governor visits the PenCom DG and pledges support for pension reforms", "The Kogi State Governor hands a gift bag to the Director-General"),
  p("partners-uba-sani", "partners", "Governor Uba Sani of Kaduna State visits PenCom", "A large group of officials poses with Governor Uba Sani in the PenCom lobby"),
  p("partners-edo-governor", "partners", "PenCom visits the Governor of Edo State, Senator Monday Okpebholo", "PenCom officials stand with the Edo State Governor in front of a stone wall"),
  p("partners-bayelsa", "partners", "PenCom engages the Bayelsa State Government on implementing the Contributory Pension Scheme", "PenCom officials and Bayelsa State officials pose in a government hall"),
  p("industry-apa-licence-awabah", "industry", "PenCom DG presents a licence to the first Accredited Pension Agent, Awabah", "On stage, the Director-General hands a licence to Awabah’s representatives"),
  p("industry-dg-harvard", "industry", "PenCom DG speaks at Harvard", "Panellists, including the Director-General, seated on a stage under a projected banner"),
  p("industry-nlc-courtesy", "industry", "PenCom DG pays a courtesy visit to the President of the Nigeria Labour Congress", "The Director-General and union leaders stand together in an office"),
  p("industry-kenya-rba", "industry", "Kenya’s Retirement Benefits Authority on a study visit to PenCom", "Visitors from Kenya and PenCom staff pose in a conference room"),
  p("industry-fct-irs", "industry", "The FCT Internal Revenue Service visits PenCom", "FCT-IRS and PenCom officials stand in a line in an office"),
  p("people-iwd-ppp-launch", "people", "PenCom DG kicks off the International Women’s Day Personal Pension Plan campaign, “Save small today, gain big tomorrow”, in Abuja", "The Director-General, in a red cap, speaks into reporters’ microphones at a market event"),
  p("people-iwd-crowd", "people", "Market women join the International Women’s Day Personal Pension Plan campaign in Abuja", "Women in purple shirts and red caps gather under canopies at an outdoor event", true),
  p("people-nup-legacy-house", "people", "PenCom DG commissions the Nigerian Union of Pensioners’ legacy house", "The Director-General stands with pensioners wearing red NUP sashes outdoors"),
  p("people-military-pension-board", "people", "The Military Pension Board visits PenCom", "Military officers in uniform and PenCom officials pose in a hallway"),
  p("people-nji", "people", "PenCom visits the National Judicial Institute", "PenCom officials and judicial officers seated and standing in a red-carpeted hall"),
  p("people-icpc-roundtable", "people", "PenCom and ICPC roundtable", "A group of officials in suits poses in a conference room"),
  p("people-customer-clinic", "people", "PenCom DG at the Pension Customer Clinic", "The Director-General talks with staff helping members of the public at laptops"),
  p("media-fsd-africa", "media", "PenCom DG at the FSD Africa workshop for operators", "The Director-General speaks into a microphone at a glass lectern", true),
  p("media-issa-seminar", "media", "PenCom DG at the International Social Security Association West Africa Technical Seminar 2026", "The Director-General speaks into microphones in front of a conference backdrop"),
  p("media-iwd-briefing", "media", "PenCom DG briefs the media at International Women’s Day about the Personal Pension Plan", "Reporters hold microphones toward the Director-General, who wears a red cap"),
  p("media-pilc-briefing", "media", "Pension Industry Leadership Council press briefing", "Industry leaders stand in a row before a PILC press briefing banner"),
  p("learning-cso-conference", "learning", "PenCom holds capacity building for civil society organisations", "Participants seated and standing before a 2025 PenCom conference banner"),
  p("learning-unilag-visit", "learning", "University of Lagos educational visit to PenCom", "Students and staff from UNILAG with PenCom officials in a meeting room"),
  p("learning-lecturers-gombe-bauchi", "learning", "PenCom trains university lecturers from Gombe and Bauchi states", "Lecturers and PenCom trainers pose in a training room"),
  p("learning-heads-of-service", "learning", "PenCom holds a consultative session for states’ Heads of Service", "Heads of Service and PenCom officials seated in rows in a hall"),
  p("learning-redeemers-students", "learning", "Students from Redeemer’s Private Secondary School visit PenCom on pension education", "Uniformed students and teachers pose with PenCom staff"),
  p("learning-redeemers-tour", "learning", "Redeemer’s Private Secondary School students tour the PenCom head office", "Students in blazers walk in a line through the PenCom compound"),
  p("staff-tgif-table-tennis", "staff", "PenCom staff bonding event", "A staff member plays table tennis outdoors"),
  p("staff-tgif-dance", "staff", "PenCom staff bonding event", "Staff dance together under a white canopy"),
  p("staff-tgif-canopies", "staff", "PenCom staff bonding event", "White canopies set up in the PenCom compound"),
  p("staff-tgif-board-games", "staff", "PenCom staff bonding event", "Staff play board games at a long table"),
  p("staff-tgif-walk", "staff", "PenCom staff bonding event", "Staff hold hands and walk together outdoors"),
  p("staff-tgif-ludo", "staff", "PenCom staff bonding event", "Staff laugh over a game of ludo"),
];
export const photoSrc = (ph: Photo) => `/media/gallery/${ph.id}.jpg`;

/* ─────────────────────────── Videos ─────────────────────────── */

export const topics = ["All", "Informal sector", "Retirees", "Reforms and governance"] as const;
export type Topic = (typeof topics)[number];

export type Video = { id: string; title: string; blurb: string; channel: string; month: string; topic: Exclude<Topic, "All"> };
export const videos: Video[] = [
  { id: "H2sS1r5ixdY", title: "Exit benefit awards for retirees at the PenCom summit", blurb: "Retirees receive exit benefit awards as PenCom reviews how well retirees are protected.", channel: "NTA", month: "Oct 2026", topic: "Retirees" },
  { id: "i8Fd4-Ia0jU", title: "National Pension Week 2026: traders, artisans and small businesses", blurb: "PenCom urges people in the informal sector to start saving for retirement.", channel: "NTA", month: "Oct 2026", topic: "Informal sector" },
  { id: "Z4PcBNnzDSY", title: "Minimum pension guarantee and Pencare for retirees", blurb: "Planned reforms to strengthen retirement security and retiree healthcare.", channel: "NTA", month: "Oct 2026", topic: "Retirees" },
  { id: "qY9RwqquvVA", title: "Clearing pension arrears: two years of reform", blurb: "PenCom on how benefit payments moved from arrears to on-time payment.", channel: "NTA", month: "Jul 2026", topic: "Reforms and governance" },
  { id: "a1JiZFS38io", title: "A Nigerian Pension Industry Investment Consortium", blurb: "PenCom considers a consortium to strengthen long-term investment.", channel: "NTA", month: "Apr 2026", topic: "Reforms and governance" },
  { id: "ILIJny9zqKQ", title: "The new PenCom Board is inaugurated", blurb: "The Secretary to the Government of the Federation inaugurates the Board.", channel: "Global TV", month: "Mar 2026", topic: "Reforms and governance" },
  { id: "vvOW5I8Z9r4", title: "The Personal Pension Plan for informal workers", blurb: "How the Personal Pension Plan extends retirement savings to the informal sector.", channel: "TVC News", month: "Mar 2026", topic: "Informal sector" },
  { id: "eOyR8pkZ6i0", title: "Pension coverage drive at Utako Market, Abuja", blurb: "PenCom takes the pension message to traders in the market.", channel: "NTA", month: "Mar 2026", topic: "Informal sector" },
  { id: "fMymxMyG1ok", title: "Awabah becomes the first Accredited Pension Agent", blurb: "A new route for informal workers to join the Contributory Pension Scheme.", channel: "News Central", month: "Feb 2026", topic: "Informal sector" },
  { id: "0u9oP2EqUiw", title: "PenCom engages police retirees on pension reforms", blurb: "Addressing concerns about pension adequacy as ₦758 billion is released.", channel: "RootsTV", month: "Dec 2025", topic: "Retirees" },
  { id: "rWzMD2FT7mU", title: "The Pencare initiative board is inaugurated", blurb: "A new board to deliver quality, affordable healthcare to retirees.", channel: "News Agency of Nigeria", month: "Nov 2025", topic: "Retirees" },
  { id: "ydOJ3rPTafs", title: "The Director-General on Pension Revolution 2.0", blurb: "The Commission’s commitment to a new approach to pension administration.", channel: "News Agency of Nigeria", month: "Oct 2025", topic: "Reforms and governance" },
  { id: "Q9sVEIV_cUY", title: "How the ₦758 billion pension bond will be paid out", blurb: "PenCom explains the disbursement process for the Federal Government bond.", channel: "TVC News", month: "Mar 2025", topic: "Retirees" },
];

export const channelUrl = "https://www.youtube.com/channel/UCK7FCj7J1GMk6hrnDDInq9w";
export const thumb = (id: string, hi = false) => `https://i.ytimg.com/vi/${id}/${hi ? "maxresdefault" : "hqdefault"}.jpg`;
