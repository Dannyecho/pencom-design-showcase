import type { Metadata } from "next";
import CharterPage from "@/views/charter/CharterPage";

export const metadata: Metadata = {
  title: "Service Charter",
  description: "How quickly PenCom delivers each service, the documents you need, how to complain, and the full signed charter.",
};

export default function Page() {
  return <CharterPage />;
}
