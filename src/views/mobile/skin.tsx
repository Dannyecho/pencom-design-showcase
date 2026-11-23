"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { focus } from "@/views/theme/ui";

/**
 * The app preview's design tokens for the showcase theme. `screens.tsx` and `Phone.tsx` are the same file in every
 * theme and read all their colours, radii and flourishes from here, so a theme restyles the app by editing this file.
 *
 * Showcase look, scaled to a phone: cinematic near-black green (#04140A → #0A4A13) header with a faint grid and gold
 * and green glows, heavy (font-black) titles, large-radius white cards with a hairline ring, fully rounded pills and
 * buttons, gold CTA with a dark chip, and a dark tab bar whose gold pill slides between tabs.
 */

export const sk = {
  /* Type and text colours */
  ink: "text-[#0B1F10]",
  accent: "text-[#117F21]",
  eyebrow: "text-[#7A5200]",
  check: "text-[#117F21]",
  /* Surfaces */
  appBg: "bg-[#F2F6F0]",
  muted: "bg-[#E8EEE5]",
  softColors: "bg-[#E8F5E9] text-[#0A4A13]",
  hoverSoft: "hover:bg-[#E8F5E9]",
  card: "rounded-[1.4rem] bg-white ring-1 ring-black/10",
  cardHover: "transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-24px_rgba(4,20,10,0.65)] hover:ring-[#CB9615]/60",
  cardOn: "ring-2 ring-[#CB9615]",
  tile: "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-[#F4D27A] shadow-[0_8px_18px_-10px_rgba(4,20,10,0.8)]",
  tileHover: "transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
  bar: "bg-[#04140A] text-white border-b border-white/10",
  barTitle: "font-black text-white",
  barMuted: "text-white/75",
  barBack: "text-[#F4D27A] hover:bg-white/10",
  toast: "bg-[#F4D27A] text-[#1A1206]",
  composer: "border-t border-black/10 bg-white",
  /* Controls */
  goldBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#F4D27A] px-5 text-[15px] font-bold text-[#1A1206] shadow-[0_12px_26px_-14px_rgba(203,150,21,0.9)] transition hover:bg-[#FFE08F]", focus),
  outlineBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B1F10] px-5 text-[15px] font-semibold text-white transition hover:bg-[#117F21]", focus),
  savedBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#E8F5E9] px-5 text-[15px] font-bold text-[#0A4A13] ring-1 ring-[#117F21]/30", focus),
  field: "w-full rounded-full bg-[#E8EEE5] px-5 py-3 text-base text-[#0B1F10] ring-1 ring-black/10 placeholder:text-gray-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CB9615]",
  chipOn: "bg-[#0B1F10] text-[#F4D27A] ring-[#0B1F10]",
  chipOff: "bg-white text-[#0A4A13] ring-black/15 hover:bg-[#E8F5E9]",
  solid: "bg-[#117F21]",
  range: "accent-[#CB9615]",
  promptBtn: "bg-white text-[#0B1F10] ring-1 ring-black/10 hover:bg-[#0B1F10] hover:text-[#F4D27A]",
  dashed: "border-[#0A4A13]/30 text-[#0A4A13] hover:border-[#CB9615] hover:bg-[#FFF8E6]",
  /* Home screen header */
  hero: "rounded-b-[2.25rem] bg-gradient-to-br from-[#04140A] via-[#0B1F10] to-[#0A4A13] text-white",
  heroTitle: "text-[27px] font-black leading-[1.05] tracking-tight",
  heroBell: "bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/20",
  heroBellIcon: "text-[#F4D27A]",
  heroBadge: "bg-[#F4D27A] text-[#1A1206] ring-[#0B1F10]",
  /* Lists, steps, notices, chat */
  stepDot: "bg-[#0B1F10] text-[#F4D27A] ring-4 ring-white",
  stepLine: "bg-gradient-to-b from-[#117F21] via-[#2E913D] to-[#CB9615]",
  unread: "bg-[#FFF8E6] ring-[#CB9615]/40",
  newBadge: "bg-[#F4D27A] text-[#1A1206]",
  /** "dot": a coloured dot per notice; "bar": a coloured bar down the left edge (classic notices). */
  notice: "dot" as "dot" | "bar",
  bubbleUser: "rounded-tr-md bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-white",
  bubbleBot: "rounded-tl-md bg-white text-[#0B1F10] ring-1 ring-black/10",
  success: "bg-[#FFF8E6] ring-8 ring-[#F4D27A]/30",

  /* Phone shell (Phone.tsx) */
  navIndicator: "pill" as "pill" | "line",
  navFloat: true,
  statusHome: "bg-[#04140A] text-white",
  statusInner: "bg-[#04140A] text-white",
  island: "bg-black",
  homeBar: "bg-white/70",
  nav: "bg-[#0B1F10]/90 ring-1 ring-white/15 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md",
  navOn: "text-[#1A1206]",
  navPill: "bg-[#F4D27A] shadow-[0_6px_18px_-6px_rgba(244,210,122,0.8)]",
  navOff: "text-white/70",
  navText: "text-[13px]",
  navLabelOn: "font-bold text-[#F4D27A]",
  navLabelOff: "font-medium text-white/75",
  navDot: "bg-[#F4D27A] ring-[#0B1F10]",
  fab: "bg-[#F4D27A] text-[#1A1206] ring-2 ring-white shadow-[0_18px_36px_-14px_rgba(203,150,21,0.95)] hover:bg-[#FFE08F]",
  fabIcon: "bg-[#0B1F10] text-[#F4D27A]",
  fabPulse: "ring-[#0B1F10]",
  backdrop: "bg-[#04140A]/55 backdrop-blur-[2px]",
  sheet: "rounded-t-[2rem] bg-[#F2F6F0] shadow-[0_-24px_50px_-24px_rgba(4,20,10,0.8)]",
  sheetTitle: "font-black text-[#0B1F10]",
  sheetList: "rounded-[1.4rem] bg-white ring-1 ring-black/10 divide-black/5",
  sheetRowOn: "bg-[#FFF8E6]",
  sheetBadge: "bg-[#0B1F10] text-[#F4D27A]",
  closeBtn: "text-[#0B1F10] ring-1 ring-black/15 hover:bg-[#0B1F10] hover:text-[#F4D27A]",
};

/** Cinematic header backdrop: faint grid, gold and green glows, and a slow light sweep. */
export function HeroDecor() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_100%_0%,rgba(203,150,21,0.35),transparent),radial-gradient(60%_70%_at_0%_100%,rgba(54,160,69,0.45),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "0%" }}
        animate={{ x: "520%" }}
        transition={{ duration: 2.2, delay: 0.6, ease: "easeInOut" }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-3 right-3 -z-10 select-none text-[5.5rem] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.18)]">
        App
      </span>
    </>
  );
}

/** Section title inside the app: heavy title with a gold gradient tick in front. */
export function ScreenTitle({ children, aside }: { n?: number; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-[#0B1F10]">
        <motion.span
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-5 w-1.5 origin-bottom rounded-full bg-gradient-to-b from-[#F4D27A] to-[#117F21]"
        />
        {children}
      </h2>
      {aside}
    </div>
  );
}
