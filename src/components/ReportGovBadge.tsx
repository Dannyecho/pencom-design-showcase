"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ReportGov.ng badge (the government's public reporting service). Opens in a new tab.
 * `compact` is the 20 px version for the header's 28 px top bar (desktop only).
 */
export default function ReportGovBadge({ compact = false }: { compact?: boolean }) {
  return (
    <motion.a
      href="https://reportgov.ng"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center bg-gradient-to-r from-[#B52026] to-[#C62828] text-white transition-shadow focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]",
        compact ? "h-5 rounded px-2" : "min-h-11 rounded-lg px-3 shadow-lg hover:shadow-xl",
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      title="ReportGov.ng - Report Government Activities"
    >
      <span className="text-xs font-bold tracking-wide">reportgov</span>
      <span aria-hidden="true" className={cn("ml-0.5 rounded-sm bg-[#14892A] font-bold text-white", compact ? "px-1 text-xs leading-[14px]" : "px-1 py-0.5 text-xs")}>
        .ng
      </span>
      <span className="sr-only">.ng (opens in a new tab)</span>
    </motion.a>
  );
}
