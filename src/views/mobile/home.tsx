"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Bell, BookOpen, ClipboardList, FileCheck, Landmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { focus, spot } from "@/views/theme/ui";
import { journeys } from "@/views/services/data";
import type { notifications as seed, ScreenName } from "./data";
import { Body, stagger } from "./screens";
import { HeroDecor, ScreenTitle, sk } from "./skin";

/**
 * The app's home screen in the showcase look: a cinematic near-black header over the app-user photo (grid, glows, a
 * light sweep and the outlined "APP" ghost word) whose title rises word by word into a gold gradient, a glass "ask"
 * bar, expanding "I am a…" cards (the homepage's signature, as a swipeable row), a bento with a pointer spotlight and
 * a timeline of updates. Public: no sign-in, no account data.
 */

const tones: Record<string, string> = { critical: "bg-[#E2474D]", warning: "bg-[#F4D27A]", info: "bg-[#2E913D]", success: "bg-[#117F21]" };

/** One card per audience: the first service for that audience. */
const audiences = journeys.filter((j, i) => journeys.findIndex((x) => x.audience === j.audience) === i).slice(0, 5);

export function HomeScreen({ go, items, unread }: { go: (s: ScreenName) => void; items: typeof seed; unread: number }) {
  const [open, setOpen] = useState(0);
  const words = ["Pensions,", "made", "clear."];
  return (
    <Body label="Home" className={sk.appBg}>
      {/* cinematic header */}
      <div className="relative isolate overflow-hidden rounded-b-[2.25rem] bg-[#04140A] px-5 pb-7 pt-3 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img src="/images/opt/pencom-app-user-640.webp" alt="" aria-hidden="true" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "easeOut" }} className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[center_25%] opacity-40" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#04140A]/40 via-[#04140A]/85 to-[#04140A]" />
        <HeroDecor />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pencom-logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="rounded-full bg-[#F4D27A] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#1A1206]">PenCom app</span>
          </span>
          <button type="button" onClick={() => go("notifications")} aria-label={`Notifications, ${unread} new`} className={cn("relative flex h-11 w-11 items-center justify-center rounded-full", sk.heroBell, focus)}>
            <Bell className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" />
            {unread > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4D27A] px-1 text-[11px] font-black text-[#1A1206] ring-2 ring-[#04140A]">{unread}</span>}
          </button>
        </div>
        <h2 className="mt-10 text-[34px] font-black leading-[0.98] tracking-tight" aria-label="Pensions, made clear.">
          {words.map((w, i) => (
            <span key={w} aria-hidden="true" className="inline-block overflow-hidden pr-2 align-bottom">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={cn("inline-block", i > 0 && "bg-gradient-to-r from-[#F4D27A] via-[#FFE08F] to-[#CB9615] bg-clip-text text-transparent")}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
        <p className="mt-3 max-w-[17rem] text-[15px] leading-snug text-white/80">Guides, publications and PFA contacts from the National Pension Commission.</p>
        <button type="button" onClick={() => go("chat")} className={cn("group mt-5 flex min-h-14 w-full items-center gap-3 rounded-full bg-white/10 py-1.5 pl-5 pr-1.5 text-left text-[15px] text-white/85 ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98]", focus)}>
          <Sparkles className="h-4 w-4 shrink-0 text-[#F4D27A]" aria-hidden="true" />
          <span className="flex-1">Ask anything about pensions</span>
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
        </button>
      </div>

      {/* I am a… expanding cards */}
      <div className="mt-6">
        <div className="px-4"><ScreenTitle>I am a…</ScreenTitle></div>
        <ul className="mt-3 flex gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {audiences.map((a, i) => {
            const on = open === i;
            return (
              <motion.li key={a.id} layout transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn("shrink-0", on ? "w-[15.5rem]" : "w-[7.5rem]")}>
                <button
                  type="button"
                  aria-expanded={on}
                  onClick={() => (on ? go("services") : setOpen(i))}
                  className={cn("relative flex h-40 w-full flex-col justify-between overflow-hidden rounded-[1.4rem] p-3.5 text-left transition active:scale-[0.98]", on ? "bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] text-white shadow-[0_20px_40px_-22px_rgba(4,20,10,0.9)]" : "bg-white text-[#0B1F10] ring-1 ring-black/10", focus)}
                >
                  {on && <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#F4D27A]/25 blur-2xl" />}
                  <span className={cn("relative font-mono text-xs font-bold", on ? "text-[#F4D27A]" : "text-[#7A5200]")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">
                    <span className={cn("block font-black leading-tight", on ? "text-xl" : "text-base")}>{a.audience}</span>
                    {on && (
                      <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-1.5 flex items-center justify-between gap-2 text-sm text-white/80">
                        {a.short}
                        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206]"><ArrowUpRight className="h-4 w-4" /></span>
                      </motion.span>
                    )}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* bento with spotlight */}
      <div className="mt-5 px-4">
        <ScreenTitle>Explore</ScreenTitle>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <motion.button {...stagger(0)} type="button" onClick={() => go("services")} onMouseMove={spot} className={cn("group relative row-span-2 flex min-h-[13rem] flex-col justify-between overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#0B1F10] to-[#0A4A13] p-4 text-left text-white transition active:scale-[0.98]", focus)}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity [background:radial-gradient(160px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.3),transparent_70%)] group-hover:opacity-100" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F4D27A] text-[#1A1206]"><ClipboardList className="h-5 w-5" aria-hidden="true" /></span>
            <span className="relative">
              <span className="block font-mono text-3xl font-black text-[#F4D27A]">{String(journeys.length).padStart(2, "0")}</span>
              <span className="block text-lg font-black leading-tight">Services, step by step</span>
            </span>
          </motion.button>
          {[
            { label: "Library", icon: BookOpen, screen: "publications" as const },
            { label: "Find a PFA", icon: Landmark, screen: "pfa" as const },
          ].map((t, i) => (
            <motion.button key={t.label} {...stagger(i + 1)} type="button" onClick={() => go(t.screen)} onMouseMove={spot} className={cn("group relative flex min-h-[6.25rem] flex-col justify-between overflow-hidden rounded-[1.4rem] bg-white p-3.5 text-left ring-1 ring-black/10 transition hover:-translate-y-0.5 active:scale-[0.98]", focus)}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity [background:radial-gradient(140px_circle_at_var(--x,50%)_var(--y,50%),rgba(203,150,21,0.16),transparent_70%)] group-hover:opacity-100" />
              <span className={cn(sk.tile, "relative h-10 w-10", sk.tileHover)}><t.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="relative text-base font-black text-[#0B1F10]">{t.label}</span>
            </motion.button>
          ))}
          <motion.button {...stagger(3)} type="button" onClick={() => go("guidance")} className={cn("group col-span-2 flex min-h-14 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-left font-bold text-[#1A1206] transition hover:bg-[#FFE08F] active:scale-[0.98]", focus)}>
            <FileCheck className="h-5 w-5" aria-hidden="true" />
            <span className="flex-1">Open the service guide</span>
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A] transition-transform group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
          </motion.button>
        </div>
      </div>

      {/* timeline of updates */}
      <div className="mt-6 px-4 pb-5">
        <ScreenTitle aside={<span className="rounded-full bg-[#0B1F10] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#F4D27A]">Sample</span>}>Latest</ScreenTitle>
        <ol className="relative mt-4 space-y-4 pl-6">
          <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-0.5 rounded-full bg-gradient-to-b from-[#117F21] via-[#2E913D] to-[#CB9615]" />
          {items.map((n, i) => (
            <motion.li key={n.title} {...stagger(i)} className="relative">
              <span aria-hidden="true" className={cn("absolute -left-6 top-1.5 h-4 w-4 rounded-full ring-4 ring-[#F2F6F0]", n.read ? "bg-gray-300" : tones[n.type])} />
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-black text-[#0B1F10]">{n.title}</span>
                <span className="shrink-0 font-mono text-xs text-gray-600">{n.time}</span>
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-gray-700">{n.body}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </Body>
  );
}
