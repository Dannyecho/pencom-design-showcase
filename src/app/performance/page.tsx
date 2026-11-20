import type { Metadata } from "next";
import PerformancePage from "@/views/performance/PerformancePage";

export const metadata: Metadata = {
  title: "Industry performance",
  description: "Pension assets, investments, fund types, coverage, PFA returns and fees, as charts and downloadable tables.",
};

export default function Page() {
  return <PerformancePage />;
}
