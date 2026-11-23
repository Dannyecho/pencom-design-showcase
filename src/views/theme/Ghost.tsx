"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

/** One short word behind each title. Long kickers map to a single word; short kickers are used as they are. */
const ghostFor: Record<string, string> = {
  "Who we are": "About",
  "What drives us": "Mission",
  "Our history": "History",
  "Service Charter": "Charter",
  "Read the charter": "Charter",
  "How it works": "Operators",
  "RSA funds": "Funds",
  "Fund types": "Funds",
  "Performance and reporting": "Performance",
  "Media desk": "Media",
  "News and media": "Media",
  "Pension calculator": "Calculator",
  "All news": "News",
  "News and events": "News",
  "Service standards": "Standards",
  "If something goes wrong": "Complaints",
  "Our promise": "Promise",
  "Step-by-step services": "Services",
  "Online services": "Portals",
  "Get help": "Help",
  "Regulatory updates": "Regulations",
  "Industry figures": "Figures",
  "Step-by-step guides": "Guides",
  "Frequently asked": "FAQ",
  "Forms and downloads": "Downloads",
  "Regulatory library": "Library",
  "Primary legislation": "Law",
  "Just issued": "Latest",
  "Our own policies": "Policies",
  "Follow us": "Follow",
  "Photo gallery": "Photos",
  "Total assets": "Assets",
  "Visit us": "Offices",
  "Contact us": "Contact",
  "Application checklists": "Checklists",
  "Compare PFAs": "Compare",
  "Coverage and contributions": "Coverage",
  "Director-General’s read": "Foreword",
  "PenCom Insight Framework": "Insight",
  "Executive dashboard": "Dashboard",
  "Every edition": "Inside",
  "The launch": "Launch",
  "About this data": "Method",
  "Case tracker": "Tracker",
};

export const ghostWord = (kicker: string) => ghostFor[kicker] ?? kicker;

/**
 * The showcase "ghost" word: giant outlined uppercase letters drifting sideways as the section scrolls by.
 * Decorative (aria-hidden); still under reduced motion. With `clip` (the default) it is clipped to its own
 * box so it can never widen the page; the home page sections clip it themselves and pass `clip={false}`.
 */
export default function Ghost({ word, dark = false, clip = true, className }: { word: string; dark?: boolean; clip?: boolean; className?: string }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-14%"]);
  const text = (
    <motion.span
      ref={clip ? undefined : ref}
      style={{ x: reduce ? 0 : x }}
      className={cn(
        "block select-none whitespace-nowrap text-[4.5rem] font-black uppercase leading-none tracking-tighter text-transparent sm:text-[8rem] lg:text-[11rem]",
        dark ? "[-webkit-text-stroke:1.5px_rgba(244,210,122,0.18)]" : "[-webkit-text-stroke:1.5px_rgba(16,93,29,0.13)]",
        !clip && cn("pointer-events-none absolute -top-8 left-0 sm:-top-12 lg:-top-16", className),
      )}
    >
      {t(word)}
    </motion.span>
  );
  if (!clip) return <span aria-hidden="true">{text}</span>;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 -top-8 block h-[4.5rem] overflow-hidden sm:-top-12 sm:h-[8rem] lg:-top-16 lg:h-[11rem]", className)}
    >
      {text}
    </span>
  );
}
