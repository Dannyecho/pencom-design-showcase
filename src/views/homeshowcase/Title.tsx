"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Ghost from "@/views/theme/Ghost";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Showcase section title: a giant outlined "ghost" word drifting sideways as the section scrolls by,
 * an icon tag, and a heavy title whose key phrase is filled with the green-to-gold gradient.
 * The ghost word is decorative (aria-hidden); reduced motion keeps it still.
 */
export default function Title({
  id,
  ghost,
  tag,
  icon: Icon,
  title,
  mark,
  intro,
  action,
  dark = false,
}: {
  id: string;
  ghost: string;
  tag: string;
  icon: LucideIcon;
  title: string;
  mark?: string;
  intro?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
}) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const T = t(title);
  const M = mark ? t(mark) : undefined;
  const hl = M && T.includes(M) ? M : undefined;
  const [before, after] = hl ? T.split(hl) : [T, ""];

  return (
    <header className="relative">
      <Ghost word={ghost} dark={dark} clip={false} />
      <div className="relative grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <motion.span
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] shadow-sm",
              dark ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0A4A13] text-[#F4D27A]",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {tag}
          </motion.span>
          <motion.h2
            id={id}
            data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mt-4 text-[2.1rem] font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.6rem]", dark ? "text-white" : "text-[#0B1F10]")}
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
          <div className="lg:col-span-4">
            {intro && <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/75" : "text-gray-600")}>{intro}</p>}
            {action && <div className="mt-4">{action}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
