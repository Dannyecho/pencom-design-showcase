/**
 * Operator register, transcribed from PenCom's official pages (pencom.gov.ng, November 2026):
 * Pension Fund Administrators, Pension Fund Custodians and Closed Pension Fund Administrators.
 * Before launch this should come from the CMS / licensing department (DES-28), not a static file.
 */

export type OperatorType = "PFA" | "PFC" | "CPFA";
export type Operator = {
  id: string;
  name: string;
  type: OperatorType;
  md: string;
  address: string;
  city: "Lagos" | "Abuja";
  phones: string[];
  emails: string[];
  website: string;
};

const op = (type: OperatorType, name: string, md: string, address: string, phones: string[], emails: string[], website: string): Operator => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""),
  name,
  type,
  md,
  address,
  city: /abuja/i.test(address) ? "Abuja" : "Lagos",
  phones,
  emails,
  website: website.replace(/^https?:\/\//, "").replace(/^www\./, ""),
});

export const operators: Operator[] = [
  op("PFA", "Access Pensions Limited", "Sa’adu A. Jijji", "Plot 339, Tarkwa Crescent, off Adetokunbo Ademola Crescent, Wuse II, Abuja", ["+234 9 4613333"], ["info@accesspensions.ng"], "accesspensions.ng"),
  op("PFA", "CardinalStone Pensions Limited", "Mahmud Sulaiman", "12A Adeola Hopewell Street, Victoria Island, Lagos", ["02013300180", "+234 1 291 9687"], ["info@cardinalstonepensions.com"], "cardinalstonepensions.com"),
  op("PFA", "Citizens Pensions Limited", "Helen Da-Souza", "3rd Floor, The Beacon, Plot 15 Admiralty Way, Lekki Phase 1, Lagos", ["02016306030"], ["info@citizenspensions.com"], "citizenspensions.com"),
  op("PFA", "CrusaderSterling Pensions Limited", "Rotimi Adebiyi", "14B Keffi Street, off Awolowo Road, Ikoyi, Lagos", ["+234 1 271 3800-4", "+234 1 271 3813"], ["info@crusaderpensions.com"], "crusaderpensions.com"),
  op("PFA", "FCMB Pensions Limited", "Christopher Bajowa", "207 Zakaria Maimalari Street, Cadastral AO, Central Business District, Abuja", ["+234 9 4613501-3", "+234 805 958 0002"], ["info@fcmbpensions.com"], "fcmbpensions.com"),
  op("PFA", "Fidelity Pension Managers Limited", "Donald Onuoha", "Plot 688, Ahmodu Tijjani Close, off Sanusi Fafunwa Street, Victoria Island, Lagos", ["+234 1 4626963", "+234 9 6720547"], ["info@fidelitypensionmanagers.com"], "fidelitypensionmanagers.com"),
  op("PFA", "Guaranty Trust Pension Managers Limited", "Adeola Oyegbade", "172B Moshood Olugbani Street, Victoria Island, Lagos", ["+234 813 985 5002", "+234 813 985 5003"], ["adeola.oyegbade@gtpensionmanagers.com"], "gtpensionmanagers.com"),
  op("PFA", "Leadway Pensure PFA Limited", "Olusakin Labeodan", "121/123 Funsho Williams Street, Surulere, Lagos", ["+234 1 2800850", "+234 1 2800900"], ["info@leadway-pensure.com"], "leadway-pensure.com"),
  op("PFA", "Nigerian University Pension Management Company (NUPEMCO)", "Aliyu Atiku", "NUPEMCO House, 722 Dahiru Musdapher Boulevard, off Babafemi Ogundipe Road, Wuye, Abuja", ["+234 808 283 3355"], ["info@nupemco.com"], "nupemco.com"),
  op("PFA", "NLPC Pension Fund Administrators Limited", "Samuel Banji Abolarin", "312A Ikorodu Road, Anthony, Lagos", ["+234 1 4482780", "+234 1 4623230"], ["info@nlpcpfa.com"], "nlpcpfa.com"),
  op("PFA", "Norrenberger Pensions Limited", "Afolabi Folayan", "22 Otukpo Street, off Gimbiya Street, Area 11, Garki, Abuja", ["+234 9 7831663-4", "+234 807 845 0652"], ["clientservice.pensions@norrenberger.com"], "norrenpensions.com"),
  op("PFA", "NPF Pensions Limited", "Muhammad M. Dutse", "NPF Pensions House, Plot 3820, R.B. Dikko Road, Central Business District, Abuja", ["+234 9 4603401", "+234 701 777 2676"], ["info@npfpensions.com"], "npfpensions.com.ng"),
  op("PFA", "OAK Pensions Limited", "Abdullahi Aliyu", "266 Murtala Mohammed Way, Alagomeji, Yaba, Lagos", ["+234 1 2953095", "+234 700 2255 625"], ["info@oakpensions.com"], "oakpensions.com"),
  op("PFA", "Parthian Pensions Limited", "Olufemi Odukoya", "1st Floor, NIJ House, Plot 20 Adeyemo Alakija Street, Victoria Island, Lagos", [], ["info@parthianpensions.com"], "parthianpensions.com"),
  op("PFA", "Premium Pension Limited", "Hamisu Bala Idris", "4 Agwu Close, off Faskari Crescent, Area 3, Garki, Abuja", ["+234 9 4615707-9", "+234 9 4615700"], ["info@premiumpension.com"], "premiumpension.com"),
  op("PFA", "Stanbic IBTC Pension Managers Limited", "Olumide Oyetan", "Stanbic IBTC Tower, 6F Walter Carrington Crescent, Victoria Island, Lagos", ["+234 1 2716021"], ["PensionSolution@stanbicibtc.com"], "stanbicibtcpension.com"),
  op("PFA", "Tangerine APT Pensions Limited", "Aliyu Dahiru Mohammed", "Federal Mortgage Bank House, Plot 266, Cadastral AO, Central Business District, Garki, Abuja", ["+234 1 448 5490"], ["info@TangerineApt.Africa"], "tangerineapt.ng"),
  op("PFA", "Trustfund Pensions Limited", "Uche Ihechere", "The Renaissance Place, Plot 1363 Samuel Ademulegun Avenue, Central Business District, Abuja", ["+234 9 6725777", "+234 9 6725946"], ["enquiries@trustfundpensions.com"], "trustfundpensions.com"),
  op("PFA", "Veritas Glanvills Pensions Limited", "Godson Ukpevo", "1698 Oyin Jolayemi Street, Victoria Island, Lagos", ["+234 1 4627060", "+234 1 4627067"], ["info@vgpensions.com"], "vgpensions.com"),

  op("PFC", "First Pension Custodian Nigeria Limited", "Oloruntimilehin George", "Plot 1297 Akin Adesola Street, Victoria Island, Lagos", ["+234 1 277 2800", "+234 802 340 7776"], ["info@firstpensioncustodian.com"], "firstpensioncustodian.com"),
  op("PFC", "UBA Pensions Custodian Limited", "Blessing Ogwu", "3rd & 4th Floors, 22B Idowu Taylor Street, Victoria Island, Lagos", ["+234 1 2718000-4", "+234 811 395 4275"], ["ubapensions@ubagroup.com"], "ubapensions.com"),
  op("PFC", "Zenith Pensions Custodian Limited", "Peters Ifeanyi Eledu", "4th & 5th Floors, Civic Towers, Ozumba Mbadiwe Road, Victoria Island, Lagos", ["+234 1 2712793", "+234 1 2712794"], ["enquiry@zenithcustodian.com"], "zenithcustodian.com"),

  op("CPFA", "Progress Trust CPFA Limited", "Joy O. Ojakovo", "1 Abebe Village Road, Iganmu, Lagos", ["+234 1 52717400-20"], ["info@progresstrustcpfaltd.com"], "progresstrustcpfaltd.com"),
  op("CPFA", "Shell Nig. Closed Pension Fund Administrator Ltd.", "Ehis Uzenabor", "The Heritage Place, 21 Lugard Avenue, Ikoyi, Lagos", ["+234 807 036 5632", "+234 1 2769999"], ["ehis.uzenabor@shell.com"], "shellnigpensions.com"),
  op("CPFA", "TotalEnergies EP Nigeria CPFA Limited", "Ifeanyi Ani", "30 Kofo Abayomi Street, Victoria Island, Lagos", ["+234 1 27776238"], ["pensioncare@tepngcpfa.com"], "tepngcpfa.com"),
];

export const typeInfo: Record<OperatorType, { label: string; plural: string; short: string; role: string }> = {
  PFA: {
    label: "Pension Fund Administrator",
    plural: "Pension Fund Administrators",
    short: "PFAs",
    role: "Open and manage Retirement Savings Accounts, invest contributions and pay retirement benefits. You choose your PFA.",
  },
  PFC: {
    label: "Pension Fund Custodian",
    plural: "Pension Fund Custodians",
    short: "PFCs",
    role: "Receive contributions from employers and hold pension assets safely, separate from the PFAs that invest them.",
  },
  CPFA: {
    label: "Closed Pension Fund Administrator",
    plural: "Closed Pension Fund Administrators",
    short: "CPFAs",
    role: "Run a pension scheme only for the staff of the company that set it up. They do not take new members from the public.",
  },
};

export const relatedBodies = [
  {
    short: "PenOp",
    name: "Pension Fund Operators Association of Nigeria",
    body: "The industry association of licensed pension operators. It works with PenCom on standards and industry-wide initiatives.",
  },
  {
    short: "PTAD",
    name: "Pension Transitional Arrangement Directorate",
    body: "Manages pensions for Federal Government retirees under the old Defined Benefit Scheme, from before 2004.",
  },
];

/** RSA multi-fund structure (from the website project's content/pfas.ts). Confirm with Investment Supervision. */
export const funds = [
  { key: "I", who: "Contributors up to age 49 who choose it", note: "Higher share of variable-income investments, for those willing to take more risk." },
  { key: "II", who: "Contributors up to age 49", note: "The default fund for active contributors aged 49 and below." },
  { key: "III", who: "Contributors aged 50 and over", note: "A more conservative mix as you approach retirement." },
  { key: "IV", who: "Retirees", note: "For retirees on programmed withdrawal. Focused on steady income." },
  { key: "V", who: "Micro pension contributors", note: "For informal-sector contributors under the Personal Pension Plan." },
  { key: "VI", who: "Contributors who choose non-interest investments", note: "Invests only in non-interest (ethical) instruments." },
];
