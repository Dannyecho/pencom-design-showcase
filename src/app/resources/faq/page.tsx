import type { Metadata } from "next";
import ResourcesPage from "@/views/resources/ResourcesPage";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description: "Answers to common questions about pensions, RSAs, retirement benefits and PenCom services.",
};

/** /resources/faq opens the Resources page at the questions. */
export default function Page() {
  return <ResourcesPage />;
}
