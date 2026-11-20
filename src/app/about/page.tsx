import type { Metadata } from "next";
import AboutPage from "@/views/about/AboutPage";

export const metadata: Metadata = {
  title: "About PenCom",
  description: "Who we are, what we do, our history, structure, leadership and Service Charter.",
};

export default function Page() {
  return <AboutPage />;
}
