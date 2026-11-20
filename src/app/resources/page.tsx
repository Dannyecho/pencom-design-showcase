import type { Metadata } from "next";
import ResourcesPage from "@/views/resources/ResourcesPage";

export const metadata: Metadata = {
  title: "Resources",
  description: "Guides you can read, listen to or print, answers to common questions, a pension glossary, and every report and form PenCom publishes.",
};

export default function Page() {
  return <ResourcesPage />;
}
