import {
  Accessibility, ArrowRightLeft, Bell, BookOpen, Bot, ClipboardList, FileCheck, Home, MessageSquare, UserPlus, Users, type LucideIcon,
} from "lucide-react";

/**
 * Content of the app preview, kept from the original prototype (app/src/pages/MobileApp.tsx).
 * The app is public: nobody signs in, so there is no account data (no name, PIN, balance or personal activity).
 * Updates and dates are sample content and are labelled as such on the page.
 */

export type ScreenName = "dashboard" | "chat" | "services" | "publications" | "pfa" | "guidance" | "notifications" | "feedback" | "accessibility";

export const features: { label: string; desc: string; icon: LucideIcon; screen: ScreenName }[] = [
  { label: "Home screen", desc: "Quick links and the latest from PenCom", icon: Home, screen: "dashboard" },
  { label: "AI Assistant", desc: "Ask a question and see where the answer comes from", icon: Bot, screen: "chat" },
  { label: "Services", desc: "Open an RSA, transfer, retirement, PCC and more", icon: ClipboardList, screen: "services" },
  { label: "Publications", desc: "Circulars and reports, saved for offline reading", icon: BookOpen, screen: "publications" },
  { label: "PFA Directory", desc: "Contact and location details", icon: Users, screen: "pfa" },
  { label: "Service Guide", desc: "Step-by-step instructions", icon: FileCheck, screen: "guidance" },
  { label: "Notifications", desc: "Alerts when new content is published", icon: Bell, screen: "notifications" },
  { label: "Feedback", desc: "Complaints and suggestions", icon: MessageSquare, screen: "feedback" },
  { label: "Accessibility", desc: "Screen reader and text size", icon: Accessibility, screen: "accessibility" },
];

export const publications = [
  { title: "Annual Report 2025", type: "Annual Report", size: "4.2 MB", downloaded: true },
  { title: "Q1 2026 Pension Industry Report", type: "Quarterly Report", size: "2.8 MB", downloaded: false },
  { title: "Micro Pension Guidelines", type: "Guideline", size: "1.5 MB", downloaded: true },
  { title: "Pension Reform Act 2014", type: "Legislation", size: "3.1 MB", downloaded: false },
  { title: "Code of Corporate Governance", type: "Code", size: "2.2 MB", downloaded: true },
];

export const guides: { service: string; icon: LucideIcon; steps: string[] }[] = [
  {
    service: "How to open an RSA",
    icon: UserPlus,
    steps: [
      "Choose a licensed PFA from the directory",
      "Visit the PFA with valid ID and BVN",
      "Complete the RSA enrollment form",
      "Receive your unique PIN and account number",
      "Start contributing to your retirement savings",
    ],
  },
  {
    service: "How to transfer your RSA",
    icon: ArrowRightLeft,
    steps: [
      "Choose a new licensed PFA",
      "Obtain the RSA Transfer Form (RTF)",
      "Complete and submit the form to your new PFA",
      "PenCom processes the transfer within 3-5 days",
      "Receive confirmation of successful transfer",
    ],
  },
  {
    service: "How to access benefits",
    icon: FileCheck,
    steps: [
      "Confirm you have reached retirement age (50+)",
      "Submit retirement notification to your PFA",
      "Choose payment option (lump sum/programmed/annuity)",
      "Complete the benefit application form",
      "Receive your retirement benefits",
    ],
  },
  {
    service: "How to apply for PCC",
    icon: FileCheck,
    steps: [
      "Log in to your employer portal",
      "Complete the PCC application form",
      "Upload supporting documents",
      "Pay the processing fee",
      "Receive certificate within 5-10 working days",
    ],
  },
];

export type Tone = "info" | "warning" | "success" | "critical";

export const notifications: { title: string; body: string; time: string; type: Tone; read: boolean }[] = [
  { title: "New circular published", body: "Updated Micro Pension Guidelines now available", time: "5h ago", type: "warning", read: false },
  { title: "Pension Reform update", body: "New amendments to the Pension Reform Act 2014", time: "2d ago", type: "critical", read: true },
  { title: "Verification deadline", body: "Update your KYC with your PFA before Dec 31", time: "3d ago", type: "warning", read: false },
];
