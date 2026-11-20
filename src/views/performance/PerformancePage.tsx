"use client";

import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { useLocation } from "@/lib/router";
import { scrollToId } from "@/views/about/primitives";
import { SectionNav } from "@/views/theme/ui";
import { AllocationSection, AssetsSection, CompareSection, CoverageSection, FeesSection, FundsSection, MethodSection, PerfHero } from "./Sections";

const sections = [
  { id: "assets", label: "Assets" },
  { id: "allocation", label: "Investments" },
  { id: "funds", label: "Fund types" },
  { id: "coverage", label: "Coverage" },
  { id: "compare", label: "Compare PFAs" },
  { id: "fees", label: "Fees" },
  { id: "method", label: "Methodology" },
];

/**
 * Industry performance, "for everyone" theme (brief §7 "Data page (PFA performance and fees)": accessible tables
 * and charts, period selector, CSV/JSON download, methodology note; DES-29).
 * #rsa-summary (old link) lands on Coverage.
 */
export default function PerformancePage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const target = id === "rsa-summary" ? "coverage" : id;
    const t1 = window.setTimeout(() => scrollToId(target, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(target, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <PerfHero />
        <SectionNav sections={sections} pillId="perf-nav-pill" />
        <AssetsSection />
        <AllocationSection />
        <FundsSection />
        <CoverageSection />
        <CompareSection />
        <FeesSection />
        <MethodSection />
      </div>
    </MotionConfig>
  );
}
