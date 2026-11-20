/**
 * Contact data for /connect.
 * - Head office, email and social links: pencom.gov.ng header/footer (November 2026).
 * - Zonal offices: addresses published by PenCom; Calabar confirmed on pencom.gov.ng. Lagos and Ilorin phone
 *   numbers differ between sources, so Corporate Communications must confirm them before launch.
 * - States per office follow the six geo-political zones (PenCom states this for the South-West and South-East).
 */

export const headOffice = {
  name: "Head office",
  address: "174 Adetokunbo Ademola Crescent, Wuse II, Abuja",
  phone: "+234 209 460 3955",
  email: "info@pencom.gov.ng",
};

export const social = [
  { name: "X", handle: "@PenComNig", href: "https://x.com/PenComNig" },
  { name: "Facebook", handle: "PenCom.gov", href: "https://www.facebook.com/PenCom.gov" },
  { name: "Instagram", handle: "@pencomnigeria", href: "https://www.instagram.com/pencomnigeria/" },
  { name: "LinkedIn", handle: "National Pension Commission", href: "https://www.linkedin.com/company/national-pension-commission/" },
  { name: "YouTube", handle: "PenCom", href: "https://www.youtube.com/channel/UCK7FCj7J1GMk6hrnDDInq9w" },
];

export type Office = {
  id: string;
  zone: string;
  city: string;
  address: string;
  phone?: string;
  confirm?: boolean;
  states: string[];
  /** Position on the map, from longitude/latitude scaled to Nigeria’s bounding box (percent). */
  x: number;
  y: number;
};

export const offices: Office[] = [
  { id: "nw", zone: "North-West", city: "Kano", address: "22 Kazaure Road, Bompai, Kano, Kano State", phone: "+234 805 599 9335", states: ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"], x: 48.5, y: 19.8 },
  { id: "ne", zone: "North-East", city: "Gombe", address: "Plot 10, Gombe–Biu Road, Gombe, Gombe State", phone: "+234 805 599 9339", states: ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"], x: 70.6, y: 37.6 },
  { id: "nc", zone: "North-Central", city: "Ilorin", address: "Plot 1, Aderemi Adeleye Street, off Fate Road, GRA, Ilorin, Kwara State", phone: "+234 807 885 9104", confirm: true, states: ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau"], x: 15.4, y: 56.3 },
  { id: "sw", zone: "South-West", city: "Lagos", address: "88A Oduduwa Crescent, GRA, Ikeja, Lagos State", phone: "+234 807 885 9160", confirm: true, states: ["Ekiti", "Lagos", "Ogun", "Ondo", "Osun", "Oyo"], x: 5.8, y: 76 },
  { id: "se", zone: "South-East", city: "Awka", address: "Road 1/47, Udoka Housing Estate, Awka, Anambra State", phone: "+234 805 599 9337", states: ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"], x: 36.4, y: 80 },
  { id: "ss", zone: "South-South", city: "Calabar", address: "Plot 9, PCN Layout, Diamond Hill, Calabar, Cross River State", phone: "+234 805 599 9332", states: ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"], x: 47, y: 93 },
];

export const abuja = { x: 40, y: 50.4 };

export const allStates = [...offices.flatMap((o) => o.states), "FCT (Abuja)"].sort();

export const topics = [
  { id: "enquiry", label: "Ask a question", body: "General questions about pensions or PenCom services." },
  { id: "pfa", label: "Complain about a PFA", body: "Problems with your PFA that it hasn’t resolved." },
  { id: "employer", label: "Report an employer", body: "Your employer deducts pension but doesn’t remit it, or hasn’t registered you." },
  { id: "pencom", label: "Complain about PenCom", body: "A PenCom service that didn’t meet our Service Charter." },
] as const;

export type TopicId = (typeof topics)[number]["id"];
