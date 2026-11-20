"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import Ghost, { ghostWord } from "./Ghost";

/**
 * Section title for the showcase theme (same props as the everyone theme's numbered Headline, so pages don't
 * change): a giant outlined ghost word drifting behind, a pill tag, and a heavy title whose key phrase is
 * filled with the green-to-gold gradient. Sections are not numbered in this design; `n` is accepted and ignored.
 */
export default function Headline({
  kicker,
  title,
  mark,
  intro,
  action,
  dark = false,
  stacked = false,
  id,
}: {
  n?: string;
  kicker: string;
  title: string;
  mark?: string;
  intro?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  /** Title and intro one above the other, for narrow columns. */
  stacked?: boolean;
  id: string;
}) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const T = t(title);
  const M = mark ? t(mark) : undefined;
  // Find the highlight in the (translated) title, ignoring case, and keep the title's own letters.
  const at = M ? T.toLowerCase().indexOf(M.toLowerCase()) : -1;
  const hl = at >= 0 ? T.slice(at, at + M!.length) : undefined;
  const [before, after] = hl ? [T.slice(0, at), T.slice(at + hl.length)] : [T, ""];

  return (
    <header className="relative pt-2">
      <Ghost word={ghostWord(kicker)} dark={dark} />
      <div className={cn("relative grid grid-cols-1 gap-6", !stacked && "items-end lg:grid-cols-12")}>
        <div className={stacked ? undefined : "lg:col-span-8"}>
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] shadow-sm",
              dark ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0A4A13] text-[#F4D27A]",
            )}
          >
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-[#1A1206]" : "bg-[#F4D27A]")} />
            {kicker}
          </motion.p>
          <motion.h2
            id={id}
            data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-4 text-[2.1rem] font-black leading-[1.05] tracking-tight sm:text-5xl",
              !stacked && "lg:text-[3.6rem]",
              dark ? "text-white" : "text-[#0B1F10]",
            )}
          >
            {before}
            {hl && (
              <span className={cn("bg-clip-text text-transparent", dark ? "bg-gradient-to-r from-[#F4D27A] to-[#E9B949]" : "bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]")}>
                {hl}
              </span>
            )}
            {after}
          </motion.h2>
        </div>
        {(intro || action) && (
          <div className={stacked ? undefined : "lg:col-span-4"}>
            {intro && <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/75" : "text-gray-600")}>{intro}</p>}
            {action && <div className="mt-4">{action}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
