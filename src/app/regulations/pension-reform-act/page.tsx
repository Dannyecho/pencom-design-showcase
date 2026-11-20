import type { Metadata } from "next";
import PensionAct from "@/views/regulations/PensionAct";

export const metadata: Metadata = {
  title: "Pension Reform Act 2014",
  description: "The Pension Reform Act 2014 in full, section by section, with search and links to every part.",
};

export default function Page() {
  return <PensionAct />;
}
