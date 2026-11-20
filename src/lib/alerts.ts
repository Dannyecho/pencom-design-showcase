/**
 * Site notices shown in the header bell (all pages).
 * Content owner: Corporate Communications. Give a notice a new id when its wording changes,
 * so readers who dismissed the old one see the new one.
 */
export type NoticeType = "critical" | "warning" | "info" | "success";

export interface SiteNotice {
  id: string;
  type: NoticeType;
  title: string;
  message: string;
  link?: { label: string; to: string };
}

export const siteNotices: SiteNotice[] = [
  {
    id: "remit-by-7th-2026",
    type: "critical",
    title: "Important Update",
    message: "All employers must remit pension contributions by the 7th of every month. Non-compliance will attract penalties under the Pension Reform Act 2014.",
    link: { label: "Read the Act", to: "/regulations/pension-reform-act" },
  },
  {
    id: "kyc-update-dec-2026",
    type: "warning",
    title: "Verification Exercise",
    message: "All RSA holders are advised to update their KYC information with their respective PFAs before December 31, 2026.",
    link: { label: "See what you need", to: "/resources/forms-and-checklists" },
  },
  {
    id: "retiree-verification-portal",
    type: "info",
    title: "New Digital Portal",
    message: "PenCom has launched a new online verification portal for retirees. Visit the Services page to learn more.",
    link: { label: "Go to Services", to: "/services" },
  },
];
