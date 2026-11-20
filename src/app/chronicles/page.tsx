import type { Metadata } from "next";
import ChroniclesPage from "@/views/chronicles/ChroniclesPage";

export const metadata: Metadata = {
  title: "PenCom Chronicles",
  description: "The Commission’s magazine: news, interviews, industry updates, human-interest stories, features and commentaries. Read Issue 01 online or download it.",
};

export default function Page() {
  return <ChroniclesPage />;
}
