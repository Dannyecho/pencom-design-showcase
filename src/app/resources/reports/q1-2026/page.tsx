import type { Metadata } from "next";
import ReportPage from "@/views/report/ReportPage";

export const metadata: Metadata = {
  title: "Q1 2026 Quarterly Industry Report",
  description: "The Commission’s consolidated view of the pension industry for January to March 2026, as a readable web page with the PDF attached.",
};

export default function Page() {
  return <ReportPage />;
}
