import type { Metadata } from "next";
import RegulationsPage from "@/views/regulations/RegulationsPage";

export const metadata: Metadata = {
  title: "Regulations and compliance",
  description: "Every regulation, guideline, framework and circular issued under the Pension Reform Act 2014, with plain-language summaries and the signed PDFs.",
};

export default function Page() {
  return <RegulationsPage />;
}
