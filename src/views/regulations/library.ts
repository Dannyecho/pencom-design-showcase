/**
 * Regulatory library, generated from the pencom.gov.ng WordPress manifest
 * (rag/data/manifests/pencom_wp_manifest.csv): real titles, issue dates, summaries and PDF links.
 *
 * Derived fields (to be replaced by CMS metadata before launch):
 * - appliesTo / subjects: keyword tagging of titles.
 * - status: "Amended" / "Revised version available" come from addendum and "Revised …" documents
 *   found in the library; everything else is "Latest version". Legal Services must confirm the
 *   in-force status, reference numbers and effective dates (DES-23).
 */
export type RegDoc = {
  id: string;
  title: string;
  type: "Circular" | "Guideline" | "Regulation" | "Framework" | "Code" | "Form";
  date: string;
  year: number;
  summary: string;
  pdf: string;
  appliesTo: string[];
  subjects: string[];
  status: "Latest version" | "Amended" | "Revised version available" | "Draft";
  amends: string | null;
  amendedBy: string[];
  revises: string | null;
  revisedBy: string | null;
};

export const library: RegDoc[] = [
{
"id": "circular-on-obtaining-retirees-consent-for-enrolment-into-the-pencare-initiative",
"title": "Circular on Obtaining Retirees' Consent for Enrolment into The Pencare Initiative During Programmed Withdrawal Retirement Benefit Processing",
"type": "Circular",
"date": "2026-10-27",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/10/CIRCULAR-ON-OBTAINING-RETIREES-CONSENT-FOR-ENROLMENT-INTO-THE-PENCARE-INITIATIVE-DURING-PROGRAMMED-WITHDRAWAL-RETIREMENT-BENEFIT-PROCESSING.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs",
"Health"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-asset-crossing-between-pension-funds",
"title": "Circular on Asset Crossing between Pension Funds",
"type": "Circular",
"date": "2026-09-18",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/09/CIRCULAR-ON-ASSET-CROSSING-BETWEEN-PENSION-FUNDS.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-rla-custodial-fees-structure-and-processes",
"title": "Circular on RLA Custodial Fees Structure and Processes",
"type": "Circular",
"date": "2026-07-29",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/07/Circular-RLA-Custodian-Fee-PenCom-20260723_260724_114612.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-stewardship-responsibilities-by-pfa",
"title": "Guidelines on Stewardship Responsibilities by PFA",
"type": "Guideline",
"date": "2026-07-04",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/07/GUIDELINESS-ON-STEWARDSHIP-RESPONSIBILITIES-BY-PFA-ISSUED-COPY.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-digitization",
"title": "Circular on Digitization",
"type": "Circular",
"date": "2026-07-04",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/07/Circular-on-Digitazation.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-i-am-alive-verification-exercise",
"title": "Circular on I am Alive Verification Exercise",
"type": "Circular",
"date": "2026-07-04",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/07/Circular-on-I-am-Alive-Verification-Exercise.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-granting-forbearance-to-pfas-to-invest-in-shares-and-other-securities-o",
"title": "Circular Granting Forbearance to PFAs to Invest in Shares and other Securities of PFCs",
"type": "Circular",
"date": "2026-07-04",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/07/CIRCULAR-GRANTING-FORBEARANCE-TO-PFAs-TO-INVEST-IN-SHARES-AND-OTHER-SECURITIES-OF-PFCs.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-dangote-refinery",
"title": "Circular on Dangote Refinery",
"type": "Circular",
"date": "2026-05-14",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/05/CIRCULAR-ON-DANGOTE-REFINERY.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-the-revised-regulations-on-investment-of-pension-fund-assets",
"title": "Addendum to the Revised Regulations on Investment of Pension Fund Assets",
"type": "Regulation",
"date": "2026-03-25",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/03/ADDENDUM-TO-THE-REVISED-REGULATIONS-ON-INVESTMENT-OF-PENSION-FUND-ASSETS.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": "the-revised-regulation-on-investment-of-pension-fund-assets",
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-for-fund-v-vii-and-apa-fees",
"title": "Circular for Fund V, VII and APA fees",
"type": "Circular",
"date": "2026-03-14",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/03/Circular-for-Fund-V-VII-and-APA-fees.pdf",
"appliesTo": [
"Pension agents"
],
"subjects": [
"Investment",
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-verification-enrolment-exercise-of-prospective-retirees",
"title": "Guidelines for Verification and Enrolment Exercise of Prospective Retirees",
"type": "Guideline",
"date": "2026-02-26",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/02/Guidelines-for-Verification-Enrolment-Exercise-of-Prospective-Retirees_Issued-Copy.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-revised-documentation-for-data-recapture",
"title": "Circular on Revised Documentation for Data Recapture",
"type": "Circular",
"date": "2026-02-24",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/02/Circular-on-Revised-Documentation-for-Data-Recapture-1.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs",
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-categorisation-of-contributions-under-the-ppp",
"title": "CIRCULAR - Categorisation of Contributions under the PPP",
"type": "Circular",
"date": "2026-02-24",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/02/CIRCULAR-Categorisaation-of-Contributions-under-the-PPP.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Contributions & RSAs",
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-ppp",
"title": "Guidelines on PPP",
"type": "Guideline",
"date": "2026-01-30",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/01/Guidelines-on-PPP_Final.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-the-engagement-of-accredited-pension-agents-in-the-implementation-",
"title": "Framework for the Engagement of Accredited Pension Agents in the Implementation of PPP",
"type": "Framework",
"date": "2026-01-30",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/01/The-Framework-for-the-Engagement-of-APA-25-09-2025.pdf",
"appliesTo": [
"Informal sector",
"Pension agents"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-appointment-of-external-auditors-and-actuaries-for-approved-existing",
"title": "Circular on Appointment of External Auditors and Actuaries for Approved Existing Schemes and Additional Benefits Schemes",
"type": "Circular",
"date": "2026-01-09",
"year": 2026,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/01/Circular-on-appointmt-of-Ext-Auditor-and-Actuarial-Valuers-for-AES-FINAL-FEB-UPDATED.pdf",
"appliesTo": [
"Retirees",
"Closed schemes"
],
"subjects": [
"Benefits & retirement",
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-pension-increases-for-federal-government-self-funded-agencies",
"title": "Circular on Pension Increases for Federal Government Self-funded Agencies",
"type": "Circular",
"date": "2025-12-27",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/12/Circular-on-Pension-Increases-for-Federal-Government-Self-funded-Agencies.pdf",
"appliesTo": [
"Employers",
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-circular-on-minimum-information-to-be-displayed-on-pfas-website",
"title": "Addendum: Circular on Minimum Information to be Displayed on PFA's Website",
"type": "Circular",
"date": "2025-11-13",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/11/ADDENDUM-Circular-on-Minimum-Information-to-be-Displayed-on-PFAs-Website.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing",
"Technology & data"
],
"amends": "circular-on-minimum-information-to-be-displayed-on-pfas-website",
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-rla-pcc",
"title": "Circular on Retiree Life Annuity (RLA) Pension Clearance Certificate (PCC)",
"type": "Circular",
"date": "2025-11-04",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/11/Circular-on-RLA-PCC.pdf",
"appliesTo": [
"Employers",
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "pencom-naicom-joint-circular-on-additional-inflow",
"title": "PenCom & NAICOM Joint Circular on Additional Inflow",
"type": "Circular",
"date": "2025-11-04",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/11/PenCom-and-NAICOM-Joint-Circular-on-Additional-Inflow.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-counterparties-to-pension-funds-transactions-in-government-securitie",
"title": "Circular on Counterparties to Pension Funds Transactions in Government Securities",
"type": "Circular",
"date": "2025-09-28",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Circular-on-Counterparties-To-Pension-Funds-Transactions-In.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-personal-pension-plan-ppp",
"title": "Guidelines on Personal Pension Plan (PPP)",
"type": "Guideline",
"date": "2025-09-26",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Guidelines-on-PPP_Final.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-the-engagement-of-accredited-pension-agents-apa-in-the-implementat",
"title": "Framework for the Engagement of Accredited Pension Agents (APA) in the Implementation of Personal Pension Plan (PPP)",
"type": "Framework",
"date": "2025-09-26",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/The-Framework-for-the-Engagement-of-APA-25-09-2025.pdf",
"appliesTo": [
"Informal sector",
"Pension agents"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-compensation-framework-for-approved-pension-agents-apas",
"title": "Circular on Compensation Framework for Approved Pension Agents (APAs)",
"type": "Circular",
"date": "2025-09-26",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Draft-Circular-on-Compensation-Framework-for-APAs.pdf",
"appliesTo": [
"Pension agents"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-regulatory-capital-requirement-for-pfos",
"title": "Revised Regulatory Capital Requirement for Pension Fund Operators",
"type": "Circular",
"date": "2025-09-26",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Revised-Regulatory-Capital-Requirement-for-PFOs-September-24.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-securities-lending-and-repurchase-transactions-repos-by-pension-fund-ad",
"title": "Circular Securities Lending and Repurchase Transactions (Repos) By Pension Fund Administrators",
"type": "Circular",
"date": "2025-09-24",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/CIRCULAR-SECURITIES-LENDING-AND-REPURCHASE-TRANSACTIONS-Repos-by-PENSION-FUND-ADMINISTRATORS-1.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "the-revised-regulation-on-investment-of-pension-fund-assets",
"title": "The Revised Regulation on Investment of Pension Fund Assets",
"type": "Regulation",
"date": "2025-09-24",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/The-Revised-Regulation-on-Investment-of-Pension-Fund-Assets.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [
"addendum-to-the-revised-regulations-on-investment-of-pension-fund-assets"
],
"revises": "regulation-on-investment-of-pension-fund-assets-2012",
"revisedBy": null,
"status": "Amended"
},
{
"id": "revised-guidelines-on-appointments-to-board-and-senior-management",
"title": "Revised Guidelines on Appointments to Board and Senior Management",
"type": "Guideline",
"date": "2025-09-22",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Revised-Guidelines-on-Appointments-to-Board-and-Senior-Management-22-September-2025.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guideline-on-corporate-governance-for-licensed-pension-fund-operators",
"title": "Revised Guideline on Corporate Governance for Licensed Pension Fund Operators",
"type": "Guideline",
"date": "2025-09-22",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Revised-Guideline-on-Corporate-Governance-for-LPFOs-22-September-2025.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": "guidelines-on-corporate-governance-for-pension-fund-operators",
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-significant-cross-shareholding-in-licensed-pension-fund-operators",
"title": "Guidelines On Significant Cross-Shareholding In Licensed Pension Fund Operators",
"type": "Guideline",
"date": "2025-09-19",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/09/Guidelines-for-Cross-Shareholding-in-LPFOs-19-SEPT-2025.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-foreign-currency-pension-contributions-2",
"title": "Guidelines on Foreign Currency Pension Contributions",
"type": "Guideline",
"date": "2025-09-11",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2026/08/Guidelines-on-Foreign-Currency-Pension-Contributions-2025.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-circular-on-inducement-of-rsa-holders",
"title": "Addendum to Circular on Inducement of RSA Holders",
"type": "Circular",
"date": "2025-08-22",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/08/Addendum-to-Circular-on-Inducement-of-RSA-Holders.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-circular-on-shareholding",
"title": "Addendum to Circular on Shareholding",
"type": "Circular",
"date": "2025-08-06",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/08/ADDENDUM-TO-CIRCULAR-ON-SHAREHOLDING.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "investment-in-additional-tier-1-at1-capital-of-deposit-money-banks",
"title": "Investment in Additional Tier 1 (AT1) Capital Of Deposit Money Banks",
"type": "Circular",
"date": "2025-08-06",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/08/INVESTMENT-IN-ADDITIONAL-TIER-ONE-CAPITAL-BY-PFAs-FINAL.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment",
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-ict-guidelines",
"title": "Revised ICT Guidelines for Pension Fund Operators",
"type": "Guideline",
"date": "2025-08-04",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/08/REVISED-ICT-GUIDELINES-S-1-August-2025.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-the-circular-on-approval-of-benefits-payments",
"title": "Addendum to the Circular on Approval of Benefits Payments",
"type": "Circular",
"date": "2025-07-09",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/07/ADDENDUM-TO-CIRCULAR-ON-APPROVAL-OF-BENEFITS-PAYMENTS.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-unethical-practice",
"title": "Circular on Unethical Practice",
"type": "Circular",
"date": "2025-06-17",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/06/CIRCULAR-ON-UNETHICAL-PRACTICE-FINAL.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-compliance-with-provisions-of-pra",
"title": "Circular on Compliance with Provisions of PRA",
"type": "Circular",
"date": "2025-05-23",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/05/CIRCULAR-ON-COMPLIANCE-WITH-PROVISIONS-OF-PRA-APPROVED.docx.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [
"addendum-to-circular-on-compliance-with-provisions-of-pra"
],
"revises": null,
"revisedBy": null,
"status": "Amended"
},
{
"id": "addendum-to-circular-on-compliance-with-provisions-of-pra",
"title": "Addendum to Circular on Compliance with Provisions of PRA",
"type": "Circular",
"date": "2025-05-23",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/05/ADDENDUM-TO-CIRCULAR-ON-COMPLIANCE-WITH-PROVISIONS-OF-PRA-FINAL.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": "circular-on-compliance-with-provisions-of-pra",
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-calculating-and-reporting-of-rate-of-returns",
"title": "Circular on Calculating and Reporting of Rate of Returns",
"type": "Circular",
"date": "2025-05-09",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/05/Circular-on-Calculating-and-Reporting-of-RoR-Revised-Copy.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-approval-and-payments-of-benefits-by-pfas",
"title": "Circular on Approval and Payments of Benefits by PFAs",
"type": "Circular",
"date": "2025-03-13",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/03/CIRCULAR-ON-APROVAL-AND-PAYMENTS-OF-BENEFITS-BY-PFAS.pdf",
"appliesTo": [
"PFAs",
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-circular-on-the-operations-of-branch-offices-and-service-centres-by-lice",
"title": "Revised Circular on The Operations of Branch Offices and Service Centres by Licenced Pension Fund Administrators",
"type": "Circular",
"date": "2025-02-03",
"year": 2025,
"summary": "PenCom reshapes how Pension Fund Administrators (PFAs) run branch offices and service centres towards stronger presence and better service delivery to retirees and contributors",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/02/Final-Copy-of-Revised-Circular-on-Branches-and-Service-Centres-FINAL.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": "circular-on-the-operations-of-branch-offices-and-service-centres-by-licenced-pen",
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-mandatory-provision-of-the-bank-verification-number-bvn-for-rsa-regi",
"title": "Circular on Mandatory Provision of The Bank Verification Number (BVN) For RSA Registration and Data Recapture",
"type": "Circular",
"date": "2025-01-16",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/01/Circular-to-PFAs-on-the-Mandatory-Adoption-of-the-BVN.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs",
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-the-revised-documentation-for-retirement-savings-account-rsa-registr",
"title": "Circular on The Revised Documentation for Retirement Savings Account (RSA) Registration",
"type": "Circular",
"date": "2025-01-13",
"year": 2025,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/01/CIRCULAR-ON-THE-REVISED-DOCUMENTATION-FOR-RETIREMENT-SAVINGS-ACCOUNT-RSA-REGISTRATION_0001.pdf",
"appliesTo": [
"Retirees",
"Contributors"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-implementation-of-minimum-wage",
"title": "Circular on Implementation of Minimum Wage",
"type": "Circular",
"date": "2024-12-03",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/12/Circular-on-Implementation-of-Minimum-Wage.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-commercial-paper",
"title": "Circular on Commercial Paper",
"type": "Circular",
"date": "2024-12-03",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/12/Circular-on-Commercial-Paper.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-documentation-from-rsa-holders-for-the-data-recapture-exercise",
"title": "Revised Documentation from RSA Holders for The Data Recapture Exercise",
"type": "Circular",
"date": "2024-09-26",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/09/Revised-Documentation-for-Data-Recapture-Exercise.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs",
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-emerging-matters-in-the-payment-of-voluntary-contribution-under-the-",
"title": "Circular on Emerging Matters in The Payment of Voluntary Contribution Under the Contributory Pension Scheme",
"type": "Circular",
"date": "2024-06-28",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/06/Circular-on-Emerging-Matters-in-The-Payment-of-Voluntary-Contribution-Under-the-Contributory-Pension-Scheme_0001.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "review-of-some-matters-relating-to-the-administration-of-retirement-and-terminal",
"title": "Review of Some Matters Relating to The Administration of Retirement and Terminal Benefits Under the Contributory Pension Scheme",
"type": "Circular",
"date": "2024-06-28",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/06/Review-of-Some-Matters-Relating-to-The-Administration-of-Retirement-and-Terminal-Benefits-Under-the-Contributory-Pension-Scheme_0001.pdf",
"appliesTo": [
"Retirees",
"Contributors"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "consumer-protection-framework-for-the-nigerian-pension-industry",
"title": "Consumer Protection Framework for The Nigerian Pension Industry",
"type": "Framework",
"date": "2024-04-15",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/04/CONSUMER-PROTECTION-FRAMEWORK-FOR-THE-NIGERIAN-PENSION-INDUSTRY.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-regulation-for-the-transfer-of-rsas",
"title": "Revised Regulation for the Transfer of RSAs",
"type": "Regulation",
"date": "2024-02-20",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/02/REVISED-REGULATION-FOR-THE-TRANSFER-OF-RSA.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guidelines-for-the-registration-of-rsas",
"title": "Revised Guidelines for RSA Registration",
"type": "Guideline",
"date": "2024-02-20",
"year": 2024,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2024/02/REVISED-RSA-REGISTRATION-GUIDELINES.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": "circular-on-guidelines-for-registration",
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-requirements-on-performance-management-and-provisioning-for-expected",
"title": "Circular on Requirements on Performance Management and Provisioning for Expected Credit Losses (ECL)",
"type": "Circular",
"date": "2023-12-07",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/12/CIRCULAR-ON-REQUIREMENTS-FOR-PERFORMANCE-MANAGEMENT-OF-PENSION-FUNDS.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-request-for-details-of-authorised-officers-to-endorse-letter-of-intr",
"title": "Revised Circular on Request for Details of Authorised Officers to Endorse Letter of Introduction for Retiring Employees",
"type": "Circular",
"date": "2023-12-07",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/12/Circular-on-Request-for-Details-of-Aunthorized-Officers-to-Endorse-Letter-of-Introduction-for-Retirees.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guidelines-for-the-administration-of-retirement-benefits-of-professors-a",
"title": "Revised Guidelines for the Administration of Retirement Benefits of Professors and a Category of Political Appointees",
"type": "Guideline",
"date": "2023-12-07",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/12/Gudeline-for-the-Administration-of-Retirement-Benefits-for-Professors.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": "guidelines-for-the-administration-of-retirement-benefits-of-professors-and-a-cat",
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-enrollment-of-federal-government-employees-2",
"title": "Revised Circular on Enrolment of Federal Government Employees",
"type": "Circular",
"date": "2023-12-07",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/12/CIrcular-on-Online-Enrolment-of-FGN-Employees-of-Treasury-Funded-MDAs.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-the-establishment-of-additional-benefits-schemes-under-the-contrib",
"title": "Framework for the Establishment of Additional Benefits Schemes under the Contributory Pension Scheme",
"type": "Framework",
"date": "2023-09-13",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/09/FRAMEWORK-FOR-THE-ESTABLISHMENT-OF-ADDITIONAL-BENEFITS-SCHEMES-UNDER-THE-CONTRIBORY-PENSION-SCHEME.pdf",
"appliesTo": [
"Retirees",
"Contributors",
"Closed schemes"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-the-operations-of-branch-offices-and-service-centres-by-licenced-pen",
"title": "Circular on the Operations of Branch Offices and Service Centres by Licenced Pension Fund Administrators",
"type": "Circular",
"date": "2023-08-29",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/08/Revised-Circular-on-Branch-Offices-on-Service-Centres.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": "revised-circular-on-the-operations-of-branch-offices-and-service-centres-by-lice",
"status": "Revised version available"
},
{
"id": "revised-framework-for-the-establishment-of-pinac",
"title": "Revised Framework for the Establishment of the Pension Industry Non-Interest Advisory Committee (pinac)",
"type": "Framework",
"date": "2023-07-14",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/07/REVISED-FRAMEWORK-FOR-THE-ESTBALISHMENT-OF-PINAC-JULY-2023.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guidance-note-for-pfas-on-online-enrolment-of-retirees-prospective-retir",
"title": "Revised Guidance Note for PFAs on Online Enrolment of Retirees/prospective Retirees of FGN Treasury Funded Mdas",
"type": "Guideline",
"date": "2023-06-21",
"year": 2023,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2023/06/REVISED-PFA-ENROLMENT-GUIDANCE-NOTE.pdf",
"appliesTo": [
"PFAs",
"Retirees"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-equity-contribution-from-rsa-for-residential-mortgage",
"title": "Guidelines on Accessing RSA Balance Towards Payment of Equity Contribution for Residential Mortgage by RSA Holders",
"type": "Guideline",
"date": "2022-09-26",
"year": 2022,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2022/09/GUIDELINES-ON-ACCESSING-RSA-BALANCE-TOWARDS-PAYMENT-OF-EQUITY-CONTRIBUTION-FOR-RESIDENTIAL-MORTGAGE-BY-RSA-HOLDERS.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-co-investment-of-pension-funds-by-pension-fund-administrators",
"title": "Framework for Co-Investment of Pension Funds by Pension Fund Administrators",
"type": "Framework",
"date": "2022-05-19",
"year": 2022,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2022/05/FRAMEWORK-ON-CO-INVESTMENT-OF-PENSION-FUNDS.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "financial-services-regulation-coordinating-committee-fsrcc-public-statement-advi",
"title": "Financial Services Regulation Coordinating Committee (fsrcc) - Public Statement Advisory on Illegal Financial Operators in Nigeria",
"type": "Regulation",
"date": "2022-04-13",
"year": 2022,
"summary": "The FSRCC wishes to draw the attention of the general public to the worrisome increase in the activities of the Illegal Financial Operators (IFOs) which portends grave risk to public confidence and the stability of the Nigerian Financial System... (download for details)",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2022/04/FSRCC-STATEMENT-ON-IFO.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-regulation-on-the-administration-of-retirement-and-terminal-benefits",
"title": "Revised Regulation on the Administration of Retirement and Terminal Benefits",
"type": "Regulation",
"date": "2022-03-18",
"year": 2022,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2022/03/REVISED-REGULATION-ON-THE-ADMINISTRATION-OF-RETIREMENT-AND-TERMINAL-BENEFITS-APPROVED-MAR-2022.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "introduction-of-a-non-interst-fund-fund-vi-and-issuance-of-the-operational-frame",
"title": "Introduction of a Non-Interest Fund (fund VI) and Issuance of the Operational Framework",
"type": "Framework",
"date": "2021-10-28",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/10/PRESS-RELEASE-INTRODUCTION-OF-A-NON-INTEREST-FUND-FUND-VI-AND-ISSUANCE-OF-THE-OPERATIONAL-FRAMEWORK-.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-fee-structure-for-non-interest-fund-fund-vi",
"title": "Circular on Fee Structure for Non-Interest Fund (fund VI)",
"type": "Circular",
"date": "2021-10-25",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/10/CIRCULAR-ON-FEE-STRUCTURE-FOR-NON-INTEREST-FUND.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment",
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-enlightenment-and-public-awareness-for-the-micro-pension-plan",
"title": "Framework for Enlightenment and Public Awareness for the Micro Pension Plan",
"type": "Framework",
"date": "2021-08-09",
"year": 2021,
"summary": "Sequel to the release of the Guidelines for the Micro Pension Plan (MPP), the National Pension Commission (the Commission) identified the need to intensify public enlightenment in a sustained manner, in order to raise the level of awareness and acceptability of the MPP as a critical success factor.…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/08/Framework-for-Enlightenment-and-Public-Awareness-on-MPP.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "operational-framework-for-non-interest-funds",
"title": "Operational Framework for Non-Interest Funds",
"type": "Framework",
"date": "2021-06-22",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/06/OPERATIONAL-FRAMEWORK-FOR-NON-INTEREST-FUND.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-fee-structure-for-the-micro-pension-fund",
"title": "Circular on Fee Structure for the Micro Pension Fund",
"type": "Circular",
"date": "2021-06-02",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/06/CIRCULAR0004.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP",
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-revised-minimum-share-capital-requirement-for-licensed-pfas",
"title": "Circular on Revised Minimum Share Capital Requirement for Licensed PFAs",
"type": "Circular",
"date": "2021-04-30",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/04/REVISED-MINIMUM-SHARE-CAPITAL0001.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-corporate-governance-for-pension-fund-operators",
"title": "Guidelines on Corporate Governance for Pension Fund Operators",
"type": "Guideline",
"date": "2021-03-12",
"year": 2021,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/03/Guidelines-on-Corporate-Governance-for-Pension-Fund-Operators-February-2021.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": "revised-guideline-on-corporate-governance-for-licensed-pension-fund-operators",
"status": "Revised version available"
},
{
"id": "circular-on-reclassification-and-valuation-of-pension-fund-assets-under-internat",
"title": "Circular on Reclassification and Valuation of Pension Fund Assets under International Financial Reporting Standards (ifrs 9)",
"type": "Circular",
"date": "2021-02-10",
"year": 2021,
"summary": "As a follow up to the Commission's letter of 5 November, 2020 on the above subject matter, we write to clarify and direct as follows:",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2021/02/CIRCULAR-ON-RECLASSIFICATION-AND-VALUATION-OF-PENSION-FUND-ASSETS-UNDER-IFRS-9.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-fund-accounting",
"title": "Circular on Fund Accounting",
"type": "Circular",
"date": "2020-11-12",
"year": 2020,
"summary": "This Fund Accounting Circular is for reporting the Accounting Entries for the transfer of RSA from one PFA to another and the purchase of RLA by Retirees with their RSA balances. The provisions of this Circular are consistent with the PRA, 2014.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/11/FUND-ACCOUNTING-CIRCULAR-NOVEMBER-2020-002.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-regulation-on-retiree-life-annuity",
"title": "Revised Regulation on Retiree Life Annuity",
"type": "Regulation",
"date": "2020-09-02",
"year": 2020,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/09/Revised-Regulation-on-RLA-2020.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guidelines-on-group-life-insurance-policy-for-employees",
"title": "Revised Guidelines on Group Life Insurance Policy for Employees",
"type": "Guideline",
"date": "2020-09-02",
"year": 2020,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/09/Revised-Guideline-on-GLIP-2020.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "retiree-pack-guide-for-retirees-under-the-contributory-pension-scheme",
"title": "CPS RETIREE PACK - Guide for Retirees under the Contributory Pension Scheme",
"type": "Guideline",
"date": "2020-09-02",
"year": 2020,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/09/CPS-Pack-2020.pdf",
"appliesTo": [
"Retirees",
"Contributors"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-reprogramming-rsa-balance",
"title": "Circular on Reprogramming RSA Balance",
"type": "Circular",
"date": "2020-08-14",
"year": 2020,
"summary": "Procedure for reprogramming RSA balances of Retirees already on programmed withdrawal exercising their rights to transfer to Retiree Life Annuity...",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/08/Circular-on-Reprogramming-RSA-Balance.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "data-privacy-policy",
"title": "Data Privacy & Protection Policy",
"type": "Regulation",
"date": "2020-06-24",
"year": 2020,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/06/Data-Privacy-Protection-Policy.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-circular-on-management-of-the-statutory-reserve-fund",
"title": "Revised Circular on Management of the Statutory Reserve Fund",
"type": "Circular",
"date": "2020-03-23",
"year": 2020,
"summary": "Further to the Commission's Circular Referenced PENCOM.INSP/CIR/SURV/15/15 of 22 October, 2015 on management of the Statutory Reserved Fund, the Commission has observed the need to revise the Investment Limits in Section VI of the Circular.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2020/03/66.-Revised-Circular-on-Management-of-Statutory-Reserve-Fund.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "directive-to-licensed-pension-fund-operators-on-sharing-and-treatment-of-brokera",
"title": "Directive to Licensed Pension Fund Operators on Sharing and Treatment of Brokerage Commission on All Bond Transactions",
"type": "Circular",
"date": "2019-10-30",
"year": 2019,
"summary": "The Securities and Exchange Commission (SEC) has through a Circular dated 27 July 2019 directed that only Capital Market Operators duly registered by SEC are eligible to be paid brokerage fee/receiving agents' commission and such Operators shall not pay or offer a percentage of the commission…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/10/Directive-on-sharing-of-brokerage.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment",
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-the-circular-on-the-revised-procedures-on-the-processing-of-death-be",
"title": "Addendum to the Circular on the Revised Procedures on the Processing of Death Benefits",
"type": "Circular",
"date": "2019-10-09",
"year": 2019,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/10/Addendum-to-Circular-on-Death-Benefits0001.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "issues-on-the-transition-from-the-contributor-registration-system-crs-to-the-enh",
"title": "Issues on the Transition from the Contributor Registration System (CRS) to the Enhanced Contributor Registration System (ECRS)",
"type": "Circular",
"date": "2019-06-26",
"year": 2019,
"summary": "PFAs would recall the various engagements of the Commission during the process of the development of the Enhanced Contributor Registration System (ECRS), and their subsequent participation in the pilot test of the application, preparatory to the deployment of same.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/06/Issues-on-the-Transition-from-the-CRS-to-the-ECRS-1.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-guidelines-for-retirement-savings-account-rsa-registration",
"title": "Revised Guidelines for Retirement Savings Account (RSA) Registration",
"type": "Guideline",
"date": "2019-06-26",
"year": 2019,
"summary": "The ECRS is an upgrade of the Contributor Registration System (CRS) earlier deployed by the Commission for the registration of participants of the Contributory Pension Scheme (CPS). The ECRS has the following functionalities: i) Provides an electronic platform for the submission of requests by…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/06/REVISED-RSA-REGISTRATION-GUIDELINES.pdf",
"appliesTo": [
"Retirees",
"Contributors"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-the-implementation-of-the-requirement-for-the-provision-of-the-fidel",
"title": "Circular on the Implementation of the Requirement for the Provision of the Fidelity Insurance Cover for Employees of PFAs/PFCs",
"type": "Circular",
"date": "2019-06-26",
"year": 2019,
"summary": "Section 69 (f) of the Pension Reform Act (PRA 2014) mandates Pension Fund Administrators (PFAs) and Pension Fund Custodians (PFCs) to provide annual Fidelity Insurance Cover for all staff to the full value of the pension funds and assets managed or held by them or as may be determined by the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/06/CIRCULAR-ON-THE-IMPLEMENTATION-OF-THE-REQUIREMENT-FOR-THE-PROVISION-OF-FIDELITY-INSURANCE-COVER-FOR-EMPLOYEES-OF-PFAsPFCs.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "amended-regulation-on-investment-of-pension-fund-asset-february-2019",
"title": "Amended Regulation on Investment of Pension Fund Asset - February 2019",
"type": "Regulation",
"date": "2019-01-31",
"year": 2019,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2014. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2019/01/AMENDED-INVESTMENT-REGULATION-FEBRUARY-2019-.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "voluntary-contribution-guidelines-under-the-contributory-pension-scheme",
"title": "Voluntary Contribution Guidelines Under the Contributory Pension Scheme",
"type": "Guideline",
"date": "2018-10-25",
"year": 2018,
"summary": "The main purpose of the Pension Reform is to introduce a pension system that is sustainable and has the capacity to achieve the ultimate goal of providing a stable, predictable and adequate source of retirement income for each employee in Nigeria.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/10/GUIDELINES-FOR-VOLUNTARY-CONTRIBUTIONS-UNDER-CONTRIBUTORY-PENSION-SCHEME.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "approval-of-issuance-of-guidelines-for-voluntary-contribution",
"title": "Approval of Issuance of Guidelines for Voluntary Contribution",
"type": "Guideline",
"date": "2018-10-20",
"year": 2018,
"summary": "With reference to your letter No. PENCOM/TECH/B&I/2018/8045 dated 2nd October 2018, I write to convey the approval of the Secretary to the Government of the Federation for the PenCom to issue the Guideline for Voluntary Contribution under the Contributory Pension Scheme as presented by the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/10/Approval-for-Issuance-of-Guidelines-for-Voluntary-Contribution.jpg",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "re-review-of-programmed-withdrawal-template",
"title": "Re: Review of Programmed Withdrawal Template",
"type": "Circular",
"date": "2018-10-04",
"year": 2018,
"summary": "Further to the Circular Ref. PENCOM/INSP/CIR/Surv/18/21 dated 8 August 2018, suspending the use of the Revised Programmed Withdrawal Templates (PWT), you are by this circular requested to revert to the old PWT for the computation of retirement benefits under the CPS.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/10/Circular-Addedum-C-Amended.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-forwarding-of-requests-for-refund-of-pension-contributions-to-employ",
"title": "Re: Circular on Forwarding of Requests for Refund of Pension Contributions to Employees of States and Local Governments By Pension Fund Administrators",
"type": "Circular",
"date": "2018-10-04",
"year": 2018,
"summary": "It has come to the Commission's attention that following the Circular referenced INSP/CIR/SOD/18/01 of 31 August 2018, some Pension Fund Administrators have been refusing to execute the approvals granted by the Benefits and Insurance Department of the Commission for refund of pension contributions…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/10/CIRCULAR0002.pdf",
"appliesTo": [
"PFAs",
"States & LGs"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-micro-pension-plan",
"title": "Guidelines for Micro Pension Plan 2018",
"type": "Guideline",
"date": "2018-09-14",
"year": 2018,
"summary": "Section 2(3) of the Pension Reform Act, 2014 (PRA 2014) provides that employees of organizations with less than three employees as well as the self-employed persons shall be entitled to participate in the Contributory Pension Scheme in accordance with Guidelines issued by the Commission.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/09/GUIDELINES-FOR-MICRO-PENSION-PLAN.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-micro-pension-plan",
"title": "Framework for Micro Pension Plan 2018",
"type": "Framework",
"date": "2018-09-14",
"year": 2018,
"summary": "The provisions of the Pension Reform Act 2014 (PRA 2014) applies to all employees in the Public Service of the Federation, Federal Capital Territory, States and Local Governments and the Private Sector Organizations in which there are three or more employees. However, Section 2(3) of the Act…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/09/FRAMEWORK-FOR-MICRO-PENSION-PLAN.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-forwarding-of-requests-for-refunds-in-respect-of-employees-of-states",
"title": "Circular on Forwarding of Requests for Refunds in Respect of Employees of States and Local Governments by PFA",
"type": "Circular",
"date": "2018-09-03",
"year": 2018,
"summary": "This is to inform all Pension Fund Administrators that henceforth all requests for approvals",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/09/Circular-on-Forwarding-of-Requests-for-Refund-of-Pension-Contributions-to-Employees-of-States-and-Local-Governments-by-PFAs.pdf",
"appliesTo": [
"PFAs",
"States & LGs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "implementation-guidelines-on-rsa-multi-fund-structure-addendum",
"title": "Implementation Guidelines On RSA Multi-Fund Structure (Addendum)",
"type": "Circular",
"date": "2018-07-16",
"year": 2018,
"summary": "Re:Implementation Guidelines on Retirement Savings Account (RSA) Multi-Fund Structure (Addendum).",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/07/IMPLEMENTATION-GUIDELINES-ON-RSA-MULTI-FUND-STRUCTURE-ADDENDUM-1.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revision-of-the-fees-structure-in-the-pension-industry",
"title": "Revision of the Fees Structure in the Pension Industry",
"type": "Regulation",
"date": "2018-07-13",
"year": 2018,
"summary": "Accordingly, the Commission wishes to notify Licensed Pension Fund Operators and other Stakeholders, of a revised fees structure for the Pension Industry, as follows:",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/07/REVISION-OF-THE-FEES-STRUCTURE-IN-THE-PENSION-INDUSTRY.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "rsa-multi-fund-implementation-guidelines",
"title": "RSA Multi Fund Implementation Guidelines",
"type": "Guideline",
"date": "2018-07-13",
"year": 2018,
"summary": "Please, recall that the Multi Fund Structure for Retirement Savings Account (RSA) is expected to be effective from Monday, 2nd July, 2018.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/07/RSA-MULTIFUND-IMPLEMENTATION-GUIDELINES-21-JUNE-2018-1.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-appointment-to-board-and-top-management-positions-of-pfas-and-pfc",
"title": "Guidelines for Appointment to Board and Top Management Positions of PFAs and PFCs",
"type": "Guideline",
"date": "2018-07-12",
"year": 2018,
"summary": "Pursuant to its role as specified in Section 97 of the Pension Reform Act 2004, the National Pension Commission(PenCom) hereby sets out the minimum qualification requirements for appointments to the Board and Top Management positions of licensed Pension Fund Administrators (PFAs) and Pension Fund…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/07/GUIDELINE-FOR-APPOINTMENT-TO-BOARD-AND-TOP-MANAGEMENT-POSITION-OF-PFAs-and-PFCs.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "ict-guidelines-2",
"title": "ICT Guidelines",
"type": "Guideline",
"date": "2018-07-05",
"year": 2018,
"summary": "The following are the ICT guidelines serving as a minimum IT requirements for licensed Pension Fund Administrators in Nigeria. The key objective is to midwife a system that is robust, efficient and transparent in its entirety, based on principles required to assure the success of the Defined…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/07/PFA-ICT-Guidelines.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Technology & data"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "draft-framework-for-the-extension-of-pension-coverage-in-accordance-with-section",
"title": "Draft Framework for the Extension of Pension Coverage in Accordance with Section 2(3) of the PRA 2014 (Micro Pension Plan) 2018",
"type": "Framework",
"date": "2018-04-27",
"year": 2018,
"summary": "The provisions of the Pension Reform Act 2014 (PRA 2014) applies to all employees in the Public Service of the Federation, Federal Capital Territory, States and Local Governments and the Private Sector Organizations in which there are three or more employees. However, Section 2(3) of the Act…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/04/DRAFT-FRAMEWORK-FOR-MICRO-PENSION-27042018.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Draft"
},
{
"id": "draft-guidelines-for-the-extension-of-pension-coverage-in-accordance-with-sectio",
"title": "Draft Guidelines for the Extension of Pension Coverage in Accordance with Section 2(3) of the PRA 2014 (Micro Pension Plan) 2018",
"type": "Guideline",
"date": "2018-04-27",
"year": 2018,
"summary": "Section 2(3) of the Pension Reform Act, 2014 (PRA 2014) provides that employees of organizations with less than three employees as well as the self-employed persons shall be entitled to participate in the Contributory Pension Scheme in accordance with Guidelines issued by the Commission.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/04/DRAFT-GUIDELINES-FOR-MICRO-PENSION-27042018.pdf",
"appliesTo": [
"Informal sector"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Draft"
},
{
"id": "revised-fund-accounting-guidelines",
"title": "Revised Fund Accounting Guidelines",
"type": "Guideline",
"date": "2018-02-23",
"year": 2018,
"summary": "This Fund Accounting Guideline is for the regulatory reporting of the financial statements of Pension Funds",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/02/REVISED-FUND-ACCOUNTING-GUIDELINES-FEBRUARY-2018-ISSUED-COPY-1.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "second-addendum-to-circular-on-pfas-with-funds-under-management-of-n100-billion-",
"title": "Second Addendum to Circular on PFAs with Funds under Management of N100 Billion and Above",
"type": "Circular",
"date": "2018-01-24",
"year": 2018,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2018/01/2nd-Addendum-to-Circular-on-PFAs-with-Funds-of-under-Mgt-of-N100-billion-and-above.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": "circular-on-requirements-for-pfas-with-funds-under-management-of-n100-billion-ab",
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-fee-sharing-between-pension-operators-and-state-pension-bureau",
"title": "Regulation on Fee Sharing Between Pension Operators and State Pension Bureau",
"type": "Regulation",
"date": "2017-10-26",
"year": 2017,
"summary": "Consequent upon the persistent requests by some State and Local Government (LG) Pension Bureaux/Boards that they be allowed to share in the administration fee being charged on the administration of State and Local Government employees’ Retirement Savings Accounts (RSAs), the National Pension…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1452592931_Fees-Sharing-Finalised-and-Issued.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-administration-of-retirement-benefits-of-professors-and-a-cat",
"title": "Guidelines for the Administration of Retirement Benefits of Professors and a Category of Political Appointees",
"type": "Guideline",
"date": "2017-10-26",
"year": 2017,
"summary": "Prior to the enactment of the Pension Reform Act (PRA) 2004, retiring Heads of Service of the Federation and Permanent Secretaries were entitled to receive 100% of their Annual Total Emoluments as pension for life...",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1504713826_Final-Guidelines-for-Prof-Political-Appointees.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": "revised-guidelines-for-the-administration-of-retirement-benefits-of-professors-a",
"status": "Revised version available"
},
{
"id": "amended-regulation-on-investment-of-pension-funds-asset-april-2017",
"title": "Regulation on Investment of Pension Funds Asset April 2017",
"type": "Regulation",
"date": "2017-04-26",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1492535703_Amended_Investment_Regulation_April-2017.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-the-use-of-outsourced-staff-by-operators",
"title": "Circular on the Use of Outsourced Staff by Operators",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Using outsourced staff to perform pension administration, management, and custodial functions by Pension Fund Operators.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Outsourced_Staff.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-execution-of-technical-agreement-with-third-parties",
"title": "Circular on Execution of Technical Agreement with Third Parties",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has observed that some Licensed Pension Fund Operators execute Technical Agreements with third parties without obtaining the prior approval of the Commission. This is of concern to the Commission especially as it has been observed that some clauses in these agreements are not in line…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Technical_Agreement.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-importance-of-training-for-operators",
"title": "Circular on Importance of Training for Operators",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has observed that Operators generally do not treat the issue of staff training with paramount importance.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_the_Importance_of_Training_for_Staff_of_Pension_Fund_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-minimum-information-to-be-displayed-on-pfas-website",
"title": "Circular on Minimum Information to Be Displayed on PFA's Website",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "In keeping with the spirit of transparency and to ensure that all stakeholders, particularly RSA holders, have access to vital, basic information, this circular is issued to notify all PFAs of minimum information to be posted on their websites.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Minimum_Information_to_be_Displayed_by_PFAs_Revised.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing",
"Technology & data"
],
"amends": null,
"amendedBy": [
"addendum-circular-on-minimum-information-to-be-displayed-on-pfas-website"
],
"revises": null,
"revisedBy": null,
"status": "Amended"
},
{
"id": "circular-on-late-response-to-correspondence-from-the-commission-by-operators",
"title": "Circular on Late Response to Correspondence from the Commission by Operators",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "It has been observed that Operators have formed the habit of not responding to correspondence from the Commission within the stipulated time frame. Consequently, Management is by this circular informing all Operators that effective from today, any Operator that fails to respond to any…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Late_Response_to_Letters_from_the_Commission.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-service-delivery-by-pension-fund-administrators",
"title": "Circular on Service Delivery by Pension Fund Administrators",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has realized through its oversight functions as well as information obtained from stakeholders in the pension industry that Pension Fund Administrators (PFAs) were failing in one of their core mandate which is to render good services to their clients.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Service_Delivery_by_PFAs.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-minimum-requirement-for-investment-in-state-bonds",
"title": "Circular on Minimum Requirement for Investment in State Bonds",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Minimum requirement for the inclusion of state bonds as investible instruments in the pension industry.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Revised_Minimum_Requirements_for_Investment_in_State_Bonds.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "change-of-operating-software-by-licensed-pension-fund-operators-without-the-prio",
"title": "Change of Operating Software by Licensed Pension Fund Operators Without the Prior Approval of the Commission",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has observed that some Operators change their operating Software without notifying the Commission. Consequently, all licensed Operators are henceforth required to inform the Commission when changing their operating software. Any Operator infringing this requirement will from now on…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Change_of_Operating_Software_by_Licensed_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-inclusion-of-osun-state-bond-as-an-investible-instrument-in-the-pens",
"title": "Circular on Inclusion of Osun State Bond as an Investible Instrument in the Pension Industry",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "We write to inform you that the Commission has issued a letter of no objection for the inclusion of Osun Development Bond 2012 as an investible instrument in the Pension Industry.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_to_PFAs_on_Inclusion_of_Osun_Bond.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-payment-of-dividend-by-licensed-operators",
"title": "Circular on Payment of Dividend by Licensed Operators",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has observed from the review of Company audited accounts that Operators do not seek the prior approval of the Commission before payment of dividends to shareholders. In view of this, all licensed Operators are required to seek the prior approval of the Commission before payment of…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Payment_of_Dividend_by_Licensed_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-fcta-retirees",
"title": "Circular on Fcta Retirees",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Payment of entitlements to retirees of the Federal Capital Territory Authority.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_FCTA_Retirees.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-review-of-pension-rates",
"title": "Circular on Review of Pension Rates",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Review of Pension rates in accordance with Section 173(3) of the constitution of the Federal Republic of Nigeria, 1999 as amended.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Review_of_Pension_Rates.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-procedure-for-registration-of-state-and-local-government-employeesre",
"title": "Circular on Procedure for Registration of State and Local Government Employees(revised)",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Please recall the commission's earlier circular referenced PENCOM/INSP/CIR/PSP/11/01, which grants concessions to state to adopt a structured arrangement in the registration of States' and Local Governments' employees by assigning Pension Fund Administrators(PFAs) to specific Ministries,…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Revised_Procedure_for_Registration_of_State_and_Local_Government_Employees.pdf",
"appliesTo": [
"Contributors",
"States & LGs"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-minimum-share-capital-requirement-for-licensed-pension-fund-administ",
"title": "Circular on Minimum Share Capital Requirement for Licensed Pension Fund Administrators (PFA)",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Commission has through its oversight function observed that the minimum paid up share capital of N150 million was no longer adequate to meet the operational expenses of a PFA business given its intensive IT nature and an average gestation period of 5 years. The Commission had consulted with the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_minimum_capital_requirements_for_licensed_PFA.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-requirements-for-pfas-with-funds-under-management-of-n100-billion-ab",
"title": "Circular on Requirements for PFAs with Funds under Management of N100 Billion & Above",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The significant growth in the size of pension assets and the changing dynamics of pension business has necessitated the need for the Commission to issue another circular in respect of appointment to Board and Top Management Positions as well as new requirements for PFAs with funds under management…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular-on-Requirements-for-PFAs-with-Funds-under-Management-of-N100-Billion-and-Above.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [
"second-addendum-to-circular-on-pfas-with-funds-under-management-of-n100-billion-"
],
"revises": null,
"revisedBy": null,
"status": "Amended"
},
{
"id": "circular-on-opening-rsa-with-pfas-no-1",
"title": "Circular on Opening RSA with PFAs No.1",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Opening of Retirement Savings Account with Licensed Pension Fund Administrators(PFAs) for the implementation of the contributory pension scheme.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular-on-Opeing-RSA-with-PFAs-No.1.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-opening-rsa-with-pfas-no-2",
"title": "Circular on Opening RSA with PFAs No.2",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Opening of Retirement Savings Accounts with Licensed Pension Fund Administrators (PFAs) for the implementation of the contributory pension scheme.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular-on-opeing-RSA-with-PFAs-No.2.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-appointment-of-pfc-by-pfa",
"title": "Circular on Appointment of PFC by PFA",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "This Circular is for guidance in terms of the selection and appointment of PFCs. The appointment of PFCs shall be in line with the following guidelines:",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular.on_.appointment.of_.PFC_.by_.PFA_.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-online-registration-by-employees",
"title": "Circular on Online Registration by Employees",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "All employees in the Federal Ministries, Departments, Agencies, Military, Para-Military, Security Establishments and the Federal Capital Territory(FCT) who have opened their Retirement Savings Accounts (RSAs) with their chosen Pension Fund Administrators (PFAs) are required to visit the website: <a…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/On-Line-Registration-by-Employees.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-risk-management",
"title": "Circular on Risk Management",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The following regulations are hereby issued: Guidelines for Risk Management Framework for Licensed Pension Operators.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Riskmgt_Auditing_Compliance.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-audited-accounts",
"title": "Circular on Audited Accounts",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Posting of audited accounts on Operators' website",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Audited_Accounts.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-disclosure-of-funds-under-custody",
"title": "Circular on Disclosure of Funds under Custody",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "It has been observed from the review of â��companyâ�� audited accounts so far submitted by PFCs, that funds under custody are usually not disclosed on the financials.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Disclosure_of_Funds_Under_Custody.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-inclusion-of-niger-state-bond-as-an-investible-instrument-in-the-pen",
"title": "Circular on Inclusion of Niger State Bond as an Investible Instrument in the Pension Industry",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "We write to inform you that the Commission has issued a letter of no objection for inclusion of the N21 Billion Fixed Rate Niger State Bond Series 1 as an investible instrument in the Pension Industry.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Inclusion_of_Niger_State_Bond_as_Investment_Instrument.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-lagos-state-bond-as-an-investible-instrument",
"title": "Circular on Lagos State Bond as an Investible Instrument",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "The Lagos State Bond has been granted a no objection for inclusion as an investment instrument.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/CIRCULAR.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-stregthening-the-administration-of-retirement-benefits",
"title": "Circular on Stregthening the Administration of Retirement Benefits",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1478277141_Circular-on-Holding-of-Annuity-by-Custodians0001.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "code-of-conduct-form-for-directors-of-licensed-pension-operators",
"title": "Code of Conduct Form for Directors of Licensed Pension Operators",
"type": "Code",
"date": "2017-04-07",
"year": 2017,
"summary": "In furtherance of the need to promote and ensure a high level of ethical standard amongst PFAs, CPFAs, and PFCs, the Commission has issued a Code of Corporate Governance for Licensed Pension Operators.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Code_of_Conduct_Form_for_Directors_of_Pension_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "code-of-corporate-governance-for-licensed-pension-operators",
"title": "Code of Corporate Governance for Licensed Pension Operators",
"type": "Code",
"date": "2017-04-07",
"year": 2017,
"summary": "The Code of Corporate Governance essentially aims to set out rules based on best practices to guide PFAs (including CPFAs) and PFCs on the structures and processes to be used towards achieving optimal governance set up.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Code_of_Corporate_Governance_for_Licensed_Pension_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "code-of-ethics-and-business-practices-for-licensed-pension-operators",
"title": "Code of Ethics and Business Practices for Licensed Pension Operators",
"type": "Code",
"date": "2017-04-07",
"year": 2017,
"summary": "The requirements of this Code are consistent with the provisions of the Pension Reform Act, 2004 and are also considered enforceable within the industry.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Code_of_Ethics_and_Business_Practices_for_Licinsed_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-and-implementation-guidelines-for-rsa-retiree-fund",
"title": "Framework and Implementation Guidelines for RSA Retiree Fund",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines-on-Retiree-Fund.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-regime-of-sanctions-and-penalties",
"title": "Framework for Regime of Sanctions and Penalties",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "This Framework covers operators (i.e. Pension Fund Administrators and Custodians) as well as Employers. It is expected that employee related compliance issues would be handled through their employers and awareness campaigns.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Framework_for_Regime_of_Sanctions_and_Penalties.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-on-sanctions-and-penalties-for-non-compliance-with-pra-2004",
"title": "Framework on Sanctions and Penalties for Non Compliance with PRA 2004",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Framework_on_Sanctions_and_Penalties_for_non_compliance_with_PRA2004.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-resolution-of-failing-operators-in-the-nigerian-pension-industry",
"title": "Framework for Resolution of Failing Operators in the Nigerian Pension Industry",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "The framework for resolution of failing Operators in the Nigerian Pension Industry is issued by the National Pension Commission (Commission) in the exercise of its powers under Sections 20 and 54 of the Pension Reform Act 2004 (PRA 2004). The framework is intended to standardize its actions in…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Framework_for_failing_Operators_in_the_Nigerian_Pension_Industry.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-the-supervision-of-states-and-local-government-schemes",
"title": "Framework for the Supervision of States and Local Government Schemes",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "The Framework for the Supervision of States and Local Governments Schemes sets out the implementation processes and supervisory machinery to be adopted in ensuring effective and smooth operations of the Schemes at the State and Local Government levels, and also for supervising the activities of the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/SLG.body_.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regime-of-sanctions-and-penalties-for-nonlate-submission-of-regulatory-returns",
"title": "Regime of Sanctions and Penalties for Non/late Submission of Regulatory Returns",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Revised_Regime_of_Sanctions_for_RMAS.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "framework-for-recovery-of-outstanding-pension-contributions-and-interest-penalty",
"title": "Framework for Recovery of Outstanding Pension Contributions and Interest Penalty from Defaulting Employers",
"type": "Framework",
"date": "2017-04-07",
"year": 2017,
"summary": "Section 11 (5) (b) of the Pension Reform Act (PRA 2004) provides that the employer shall not later than 7 days from the day the employee is paid his/her salary, remit an amount comprising the employee's and employer's pension contributions to the custodian specified by the Pension Fund…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Framework_for_Recovery_of_Unremitted_Pension_Contributions_and_Interest_Penalty.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "shareholding-ownership-in-more-than-one-licensed-pension-fund-administrator-pfa-",
"title": "Shareholding/Ownership in More Than One Licensed Pension Fund Administrator (PFA) Or Pension Fund Custodian (PFC)",
"type": "Circular",
"date": "2017-04-07",
"year": 2017,
"summary": "Further to our Circular Ref: PENCOM/INSP/P&R/CIR/05.2006/01 of May 23, 2006 the Commission has observed that as a result of Mergers and Acquisitions that took place outside the Pension Industry, some shareholders own equity holding of 5% and above in more than one (1) Licensed Pension Fund…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2025/05/SHAREHOLDING-OWNERSHIP-IN-MORE-THAN-ONE-LICENSED-PENSION-FUND-ADMINISTRATOR-PFA-OR-PENSION-FUND-CUSTODIAN-PFC-Copy.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-valuation-of-pension-fund-assets",
"title": "Regulation on Valuation of Pension Fund Assets",
"type": "Regulation",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations-on-Valuation-of-Pension-Funds-Updated-December-2006.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulations-for-the-administration-of-legacy-pension-assets",
"title": "Regulations for the Administration of Legacy Pension Assets",
"type": "Regulation",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations_on_the_Administration_of_Legacy_Pension_Assets.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-1-rsa-opening-form",
"title": "Appendix 1 - RSA Opening Form",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "RETIREMENT SAVINGS ACCOUNT OPENING FORM",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-1.RSA-Opening-Form.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulations-on-fee-sharing-between-pension-operators-and-state-pension-bureaux",
"title": "Regulations on Fee Sharing between Pension Operators and State Pension Bureaux",
"type": "Regulation",
"date": "2017-04-06",
"year": 2017,
"summary": "Consequent upon the persistent requests by some State and Local Government (LG) Pension Bureaux/Boards that they be allowed to share in the administration fee being charged on the administration of State and Local Government employees’ Retirement Savings Accounts (RSAs), the National Pension…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1452592931_Fees-Sharing-Finalised-and-Issued.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "standard-format-for-stakeholders-comments-on-regulations",
"title": "Standard Format for Stakeholders Comments on Regulations",
"type": "Regulation",
"date": "2017-04-06",
"year": 2017,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448884191_Standard_Format_for_Stakeholders_Comments_on_Draft_Amended_Investment_Regulation.doc",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-administration-of-gratuity-benefits",
"title": "Guidelines for the Administration of Gratuity Benefits",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "Retirement benefits are any entitlements/rights/privileges that accrue to a worker/employee upon leaving the services of an employer for reason of having worked or provided service to the employer. Such benefits could be paid in either lump-sum, periodically or a combination of both. Further still,…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/EXPOSURE-DRAFT-GUIDELINES-FOR-THE-ADMINISTRATION-OF-GRATUITY-BENEFITS.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-transfer-of-nsitf-contributions-into-employees-rsa",
"title": "Guidelines for the Transfer of NSITF Contributions into Employees RSA",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The Pension Reform Act, 2004 (the Act) provided that contributions into the NSITF scheme (the Scheme) together with accrued income shall be transferred into members Retirement Savings Accounts (RSAs) after the expiration of the 5 years moratorium i.e. from July, 2009. The Act also provided that the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Amended_Guidelines_for_Transfer_of_NSITF_Contributions.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-1-irrevocable-standing-payment-order-illustration",
"title": "Appendix 1 - Irrevocable Standing Payment Order -Illustration",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-1_ISPO_Illustration.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-1-irrevocable-standing-payment-order",
"title": "Appendix 1 - Irrevocable Standing Payment Order",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-1_ISPO.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-2-collection-process",
"title": "Appendix 2 - Collection Process",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-2.Collection-Process.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-2-schedule-of-remittance-to-lead-pfas-by-the-oagf",
"title": "Appendix 2 - Schedule of Remittance to Lead PFAs by the Oagf",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-2_Schedule-of-Remittance-to-Lead-PFAs.pdf",
"appliesTo": [
"PFAs",
"Employers"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-3-schedule-of-contributions",
"title": "Appendix 3 - Schedule of Contributions",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-3.Schedule-of-Contributions.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-3-schedule-of-expected-monthly-contributions",
"title": "Appendix 3 - Schedule of Expected Monthly Contributions",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-3_Schedule-of-Expected-Monthly-Contributions.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "appendix-4-returns-on-remittances-received-from-the-oagf",
"title": "Appendix 4 - Returns on Remittances Received from the Oagf",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Appendix-4_Returns-on-Remittances-Received-from-OAGF.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-operation-and-supervision-of-ptad",
"title": "Guidelines for Operation and Supervision of Ptad",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "Sections 30 and 31 of the Pension Reform Act 2004 (PRA 2004) provides for the establishment of the Pension Transitional Arrangement Department (PTAD) and the FCT Pension Transitional Arrangement Department. These departments were given the responsibility of overseeing the management of pension…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines-for-the-Operation-and-Supervision-of-the-PTAD.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-administration-of-state-funds-deducted-at-source-under-the-co",
"title": "Guidelines for the Administration of State Funds Deducted at Source under the Contributory Pension Scheme",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The Commission's Regulation on the Investment of Pension Fund Assets allows only States that have fully implemented the Contributory Pension Scheme (CPS) to access pension funds for the purpose of infrastructural development.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines-for-Administration-of-State-Funds.pdf",
"appliesTo": [
"Contributors",
"States & LGs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-operations-of-pension-fund-administrators",
"title": "Guidelines for the Operations of Pension Fund Administrators",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The purpose of these guidelines is to provide the basic procedures for the operations of Pension Fund Administrators (PFAs) pursuant to the Pension Reform Act 2004 (the Act).",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines-for-the-Operations-of-PFAs.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-operations-of-pension-fund-custodians",
"title": "Guidelines for the Operations of Pension Fund Custodians",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The purpose of this document is to provide the basic procedures that shall to be adhered to for services provided by Pension Fund Custodians (PFCs) in terms of the Pension Reform Act 2004 (Act).",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines-for-the-Operations-of-PFCs.pdf",
"appliesTo": [
"PFCs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-publication-of-rates-of-return-on-rsa-funds-by-pension-fund-a",
"title": "Guidelines for the Publication of Rates of Return on RSA Funds by Pension Fund Administrators",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "These Guidelines are issued to regulate the publication of rates of return on RSA Funds by PFAs. The Guidelines summarize the standards and requirements, and succinctly present good corporate governance practices, relative to publishing annual rates of return by the PFAs.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/GUIDELINES-FOR-THE-PUBLICATION-OF-RATES-OF-RETURN-ON-RSA-FUNDS-BY-PFAs.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-appointment-of-pension-fund-administrators-and-custodians-for",
"title": "Guidelines for the Appointment of Pension Fund Administrators and Custodians for Existing Pension Schemes",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "These Guidelines are issued to form a basis for the appointment of PFAs by companies with approved existing schemes and to limit the assets of approved existing schemes that can be held in custody by PFCs.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_-Appointment_PFA_PFC_Existing_Schemes.pdf",
"appliesTo": [
"PFAs",
"PFCs"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-employer-code-requests-by-pension-fund-administrators",
"title": "Guidelines for Employer Code Request",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "One of the functions of the Pension Fund Administrators (PFAs) according to the PRA 2004, section 45(a) is to open Retirement Savings Accounts for all employees and obtain Personal Identification Numbers (PINs) for the employees from the National Pension Commission (PenCom). In order to do this,…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/REVISED-GUIDELINES-FOR-EMPLOYER-CODE-REQUESTS.pdf",
"appliesTo": [
"Employers"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-risk-management-framework-for-licensed-pension-operators",
"title": "Guidelines for Risk Management Framework for Licensed Pension Operators",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "A continuous process of effective risk management is critical to the safety and soundness of the operations of Pension Fund Administrators and Custodians. Furthermore, Section 66 of the PRA 2004 requires every Pension Fund Administrator to establish Risk Management Committee for the purpose of…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_for_Risk_Management_Framework_for_Licensed_Pension_Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-appointment-of-pension-fund-custodians-for-state-government-a",
"title": "Guidelines for the Appointment of Pension Fund Custodians for State Government and Retiree Funds",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The need for the issuance of a Guideline in respect of appointment of Pension Fund Custodians (PFCs) by Pension Fund Administrators (PFAs) has arisen as a result of the growing number of States that have enacted the Contributory Pension Scheme into law.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_for_the_Appointment_of_PFCs_for_State_Govt_and_Retiree_Funds.pdf",
"appliesTo": [
"PFCs",
"Retirees",
"States & LGs"
],
"subjects": [
"Benefits & retirement",
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-operations-of-pension-transitional-arrangement-departments",
"title": "Guidelines for the Operations of Pension Transitional Arrangement Departments",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "Section 30 of the Pension Reform Act, 2004 established for the Public Service of the Federation and the Federal Capital Territory, Pension Departments to be known as the Pension Transitional Arrangement Departments (PTAD). The PTAD is to be made up of the existing pension boards or offices in the…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_for_the_Operations_of_Pension_Transtional_Arrangement_Departments.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-the-transfer-of-nsitf-contributions-into-employees-retirement-sav",
"title": "Guidelines for the Transfer of NSITF Contributions into Employees Retirement Savings Account",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The Pension Reform Act, 2004 (the Act) provided that contributions into the NSITF scheme (the Scheme) together with accrued income shall be transferred into members. Retirement Savings Accounts (RSAs) after the expiration of the 5 years moratorium i.e. from July, 2009. The Act also provided that…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_for_Transfer_of_NSITF_Contributions_into_Employees_RSAs.pdf",
"appliesTo": [
"Retirees",
"Contributors"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-transitional-contributions-fund",
"title": "Guidelines for Transitional Contributions Fund",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "Many employers in their effort to comply with the Pension Reform Act 2004 (Act) have demonstrated strong commitment by remitting regularly the pension contributions of employees who have opened RSAs to the PFAs. However, some of the employers who are complying with the provisions of the Act still…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_for_Transitional_Contributions_Fund.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-on-direct-real-estate-investments-by-closed-pension-fund-administrato",
"title": "Guidelines on Direct Real Estate Investments by Closed Pension Fund Administrators and Approved Existing Schemes",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "These Guidelines seek to standardize procedures to be adopted by Closed Pension Fund Administrators (CPFAs) and Pension Fund Administrators (for Approved Existing Schemes) that operate Defined Benefit Schemes and have or intend to have direct investments in real estate.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_on_Direct_Real_Estate_Investment_by_CPFAs_and_AES1.pdf",
"appliesTo": [
"PFAs",
"Closed schemes"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-rsa-retiree-fund",
"title": "Guidelines for RSA Retiree Fund",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guidelines_on_Retiree_Fund.pdf",
"appliesTo": [
"Retirees"
],
"subjects": [
"Benefits & retirement",
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "revised-regime-of-sanctions",
"title": "Revised Regime of Sanctions",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Revised_Regime_of_Sanctions.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-transitional-arrangements",
"title": "Guidelines for Transitional Arrangements",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "The purpose of the guidelines is to provide general guidance on transitional matters for both the public and private sectors relating to the implementation of the Pension Reform Act 2004.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/transitional-arrangement.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "whistle-blowing-guidelines-for-pensions",
"title": "Whistle Blowing Guidelines for Pensions",
"type": "Guideline",
"date": "2017-04-06",
"year": 2017,
"summary": "Transparency is one of the core values of the Commission which has been encouraged amongst the operators. As a regulatory philosophy, the Commission has adopted a stakeholder approach in its regulatory activities. This philosophy has often encouraged operators to make meaningful contributions that…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Whistle_Blowing_Guidelines_for_Pensions.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-framework-for-resolution-of-failing-operators",
"title": "Addendum to Framework for Resolution of Failing Operators",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "ADDENDUM TO FRAMEWORK FOR RESOLUTION OF FAILING OPERATORS IN THE NIGERIAN PENSION INDUSTRY",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Addendum-to-Circular-on-Framework-for-Resolution-of-Failing-Operators.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "addendum-to-circular-on-for-pfas-with-n100billion",
"title": "Addendum to Circular on for PFAs with N100billion",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "ADDENDUM TO CIRCULAR ON REQUIREMENTS FOR PFAs WITH FUNDS UNDER MANAGEMENT OF N100 BILLION & ABOVE AND NEW REQUIREMENTS FOR APPOINTMENTS TO BOARD AND TOP MANAGEMENT POSITIONS OF ALL PFAs",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Addendum_to_Circular_for_PFAs_with_N100_billion.pdf",
"appliesTo": [
"PFAs"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-for-change-of-date-of-birth",
"title": "Circular for Change of Date of Birth",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Change_of_Date_of_Birth_Circular.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "exemption-under-the-contributory-pension-scheme",
"title": "Exemption under the Contributory Pension Scheme",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "We write to inform you that the Commission has received several enquiries concerning exemption of employees under the Contributory Pension Scheme in the Public Service of the Federation. Some of these include officers that had three years(3) or less to retire as at the commencement of Pension…",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/CIRCULAR-on-Exemptions-Under-Contributory-Pension-Scheme.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "circular-on-guidelines-for-registration",
"title": "Circular on Guidelines for Registration",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "Management has approved the Guildelines for the registration of Contributor/Member. The final guidelines is hereby exposed for operators to adopt.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Guideline_for_Registration.pdf",
"appliesTo": [
"Contributors"
],
"subjects": [
"Contributions & RSAs"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": "revised-guidelines-for-the-registration-of-rsas",
"status": "Revised version available"
},
{
"id": "circular-on-pension-fund-investment-in-state-bonds",
"title": "Circular on Pension Fund Investment in State Bonds",
"type": "Circular",
"date": "2017-04-06",
"year": 2017,
"summary": "Investment of Pension funds in State and Local Government bond instruments.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Circular_on_Investment_in_State_Bonds.pdf",
"appliesTo": [
"States & LGs"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-appointment-of-top-management",
"title": "Guidelines for Appointment of Top Management",
"type": "Guideline",
"date": "2017-04-05",
"year": 2017,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guideline-for-Appointment-to-Board-and-Top-Management-Positions-in-PFAs-and-PFCs.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-fund-assets-2012",
"title": "Regulation on investment of Pension Fund Assets 2012",
"type": "Regulation",
"date": "2012-04-06",
"year": 2012,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448884100_Regulation_on_Investment_of_Pension_Assets_2012.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": "the-revised-regulation-on-investment-of-pension-fund-assets",
"status": "Revised version available"
},
{
"id": "draft-amended-regulation-on-investment-of-pension-fund-assets-march-2012",
"title": "Draft Amended Regulation on Investment of Pension Fund Assets March 2012",
"type": "Regulation",
"date": "2012-03-06",
"year": 2012,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448884042_Draft_Amended_Investment_Regulation_March2012.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Draft"
},
{
"id": "draft-amended-regulation-on-investment-of-pension-funds-feb-2012",
"title": "Regulation on Investment of Pension Funds Feb 2012",
"type": "Regulation",
"date": "2012-02-06",
"year": 2012,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448883994_FINAL-DRAFT-AMENDED-INVESTMENT-REGULATION_2FEB2012.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-funds-asset-2010",
"title": "Regulation on Investment of Pension Funds Asset 2010",
"type": "Regulation",
"date": "2010-10-26",
"year": 2010,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1448883956_Regulaion_on_Investment_of_Pension_Funds_2010.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-fund-assets-2010",
"title": "Regulation on Investment of Pension Fund Assets 2010",
"type": "Regulation",
"date": "2010-04-06",
"year": 2010,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448883956_Regulaion_on_Investment_of_Pension_Funds_2010.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulations-for-auditing-pension-funds",
"title": "Regulations for Auditing Pension Funds - April 2009",
"type": "Regulation",
"date": "2009-04-06",
"year": 2009,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations_for_Auditing_Pension_Funds.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"General"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulations-for-compliance-officers",
"title": "Regulations for Compliance Officers - April 2009",
"type": "Regulation",
"date": "2009-04-06",
"year": 2009,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations_on_Compliance_Officers.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Governance & licensing"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-fees-structure-march-2009",
"title": "Regulation on Fees Structure - March 2009",
"type": "Regulation",
"date": "2009-03-06",
"year": 2009,
"summary": "The fees stipulated herein, are maximum amounts chargeable by Pension Fund Administrators (PFAs), Pension Fund Custodians (PFCs) and the National Pension Commission (Commission), for all services to be provided by them.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448889161_REVISED-REGULATION-ON-FEES-STRUCTURE-MARCH-2009.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-fees-structure-review-of-supervisory-fees",
"title": "Review of Supervisory Fees - December 2008",
"type": "Regulation",
"date": "2008-12-06",
"year": 2008,
"summary": "The fees stipulated herein, are maximum amounts chargeable by Pension Fund Administrators (PFAs), Pension Fund Custodians (PFCs) and the National Pension Commission (Commission), for all services to be provided by them.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448889748_ReviewofSupervisoryFees.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "guidelines-for-cross-border-arrangements-under-the-pension-reform-act",
"title": "Guidelines for Cross Border Arrangements under the Pension Reform Act - December 2008",
"type": "Guideline",
"date": "2008-12-06",
"year": 2008,
"summary": "The requirements of these Guidelines are consistent with the provisions of the Pension Reform Act, 2004 and are also considered enforceable within the industry.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Guideline_for_Crossborder_Arrangement_unde_-the_PRA_2004.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Coverage & PPP"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-funds-asset-2008",
"title": "Regulation on Investment of Pension Funds Asset 2008",
"type": "Regulation",
"date": "2008-10-26",
"year": 2008,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1448883925_Regulation-on-Investment-of-Pension-Fund-Assets-October-2008.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-fund-assets-2008",
"title": "Regulation on Investment of Pension Fund Assets 2008",
"type": "Regulation",
"date": "2008-04-06",
"year": 2008,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448883925_Regulation-on-Investment-of-Pension-Fund-Assets-October-2008.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-valuation-of-pension-fund-assets-december-2006",
"title": "Regulation on Valuation of Pension Fund Assets - December, 2006",
"type": "Regulation",
"date": "2006-12-06",
"year": 2006,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations_on_Valuation_of_Pension_Funds3.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-funds-asset-2006",
"title": "Regulation on Investment of Pension Funds Asset 2006",
"type": "Regulation",
"date": "2006-10-26",
"year": 2006,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/10/1448884140_Regulation_on_Investment_of_Pension_Funds31.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-investment-of-pension-fund-assets-2006",
"title": "Regulation on Investment of Pension Fund Assets 2006",
"type": "Regulation",
"date": "2006-04-06",
"year": 2006,
"summary": "The requirements of this Regulation are consistent with the provisions of the Pension Reform Act, 2004. The purpose of the Regulation is to provide uniform rules and standards for the investment of pension fund assets.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448884140_Regulation_on_Investment_of_Pension_Funds31.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-valuation-of-pension-fund-assets-march-2006",
"title": "Regulation on Valuation of Pension Fund Assets - March, 2006",
"type": "Regulation",
"date": "2006-03-06",
"year": 2006,
"summary": "",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/Regulations_on_Valuation_of_Pension_Fund_Assets_March2006.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Investment"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
},
{
"id": "regulation-on-fees-structure-march-2006",
"title": "Regulation on Fees Structure - March 2006",
"type": "Regulation",
"date": "2006-03-06",
"year": 2006,
"summary": "The fees stipulated herein, are maximum amounts chargeable by Pension Fund Administrators (PFAs), Pension Fund Custodians (PFCs) and the National Pension Commission (Commission), for all services to be provided by them.",
"pdf": "https://www.pencom.gov.ng/wp-content/uploads/2017/04/1448889722_Regulations_on_Fees_March2006.pdf",
"appliesTo": [
"All operators"
],
"subjects": [
"Fees"
],
"amends": null,
"amendedBy": [],
"revises": null,
"revisedBy": null,
"status": "Latest version"
}
];
