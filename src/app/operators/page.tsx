import type { Metadata } from "next";
import OperatorsPage from "@/views/operators/OperatorsPage";

export const metadata: Metadata = {
  title: "Pension operators",
  description: "Check whether a company is licensed, and find and contact every PFA, PFC and Closed PFA licensed by PenCom.",
};

export default function Page() {
  return <OperatorsPage />;
}
