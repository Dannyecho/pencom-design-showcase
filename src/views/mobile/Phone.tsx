"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Accessibility, BatteryFull, Bell, BookOpen, ChevronRight, ClipboardList, FileCheck, Home, Landmark, MessageSquare, MoreHorizontal, Signal, Sparkles, Wifi, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { focus } from "@/views/theme/ui";
import { notifications as seed, type ScreenName } from "./data";
import {
  AccessibilityScreen, FeedbackScreen, GuideScreen, NotificationsScreen, PfaScreen, PublicationsScreen,
  ChatScreen, ServicesScreen, chatWelcome, type A11yPrefs, type ChatMsg,
} from "./screens";
import { HomeScreen } from "./home";
import { sk } from "./skin";

/**
 * The phone's screen: status bar, the current app screen, the floating "Ask AI" button, the "More" sheet and the tab
 * bar. Same file in every theme: colours and the tab bar's shape (docked or floating, pill or line indicator) come from
 * `./skin`, and the home screen is the theme's own `./home`; the theme's MobilePage draws the bezel around it and
 * owns `screen`, so its feature list and the phone stay in step. Content and behaviour come from the original
 * prototype (app/src/pages/MobileApp.tsx).
 */

/** Bottom nav keeps only the essentials; everything else lives in the "More" sheet. */
const tabs: { key: ScreenName; label: string; icon: typeof Home }[] = [
  { key: "dashboard", label: "Home", icon: Home },
  { key: "services", label: "Services", icon: ClipboardList },
  { key: "publications", label: "Library", icon: BookOpen },
];

const moreItems: { key: ScreenName; label: string; desc: string; icon: typeof Home }[] = [
  { key: "pfa", label: "Find a PFA", desc: "Contacts and directions", icon: Landmark },
  { key: "guidance", label: "Service Guide", desc: "Step-by-step instructions", icon: FileCheck },
  { key: "notifications", label: "Notifications", desc: "New circulars and updates", icon: Bell },
  { key: "feedback", label: "Feedback", desc: "Complaints and suggestions", icon: MessageSquare },
  { key: "accessibility", label: "Accessibility", desc: "Text size, contrast, motion", icon: Accessibility },
];

export const titles: Record<ScreenName, string> = {
  dashboard: "Home", chat: "PenCom AI Assistant", services: "Services", publications: "Publications", pfa: "PFA Directory", guidance: "Service Guide",
  notifications: "Notifications", feedback: "Feedback", accessibility: "Accessibility",
};

/** Active-tab marker that slides between tabs: a pill behind the icon, or a line along the bar's top edge (docked). */
function Indicator() {
  return sk.navIndicator === "line" ? (
    <motion.span layoutId="app-tab-ind" transition={{ type: "spring", stiffness: 420, damping: 34 }} className={cn("absolute -top-2 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-b-full", sk.navPill)} />
  ) : (
    <motion.span layoutId="app-tab-ind" transition={{ type: "spring", stiffness: 420, damping: 34 }} className={cn("absolute inset-0 rounded-full", sk.navPill)} />
  );
}

export function Phone({ screen, setScreen, className }: { screen: ScreenName; setScreen: (s: ScreenName) => void; className?: string }) {
  const [items, setItems] = useState(seed);
  const [chat, setChat] = useState<ChatMsg[]>([chatWelcome]);
  const [prefs, setPrefs] = useState<A11yPrefs>({ textSize: 18, screenReader: false, highContrast: false, reduceMotion: false, voiceNav: false });
  const [moreOpen, setMoreOpen] = useState(false);
  // Close the sheet when the screen is changed from outside (the page's feature list).
  const [shown, setShown] = useState(screen);
  if (shown !== screen) { setShown(screen); setMoreOpen(false); }
  const moreBtn = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inMore = moreItems.some((m) => m.key === screen);
  const unread = items.filter((n) => !n.read).length;
  const go = (s: ScreenName) => { setMoreOpen(false); setScreen(s); };
  const closeMore = () => { setMoreOpen(false); moreBtn.current?.focus({ preventScroll: true }); };
  const home = () => go("dashboard");

  // "More" sheet: focus the first item on open, Escape closes and returns focus to the More tab.
  useEffect(() => {
    if (!moreOpen) return;
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMoreOpen(false); moreBtn.current?.focus({ preventScroll: true }); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const render = () => {
    switch (screen) {
      case "chat": return <ChatScreen onBack={home} messages={chat} setMessages={setChat} />;
      case "services": return <ServicesScreen onBack={home} go={setScreen} />;
      case "publications": return <PublicationsScreen onBack={home} />;
      case "pfa": return <PfaScreen onBack={home} />;
      case "guidance": return <GuideScreen onBack={home} />;
      case "notifications": return <NotificationsScreen onBack={home} items={items} setItems={setItems} />;
      case "feedback": return <FeedbackScreen onBack={home} />;
      case "accessibility": return <AccessibilityScreen onBack={home} prefs={prefs} setPrefs={setPrefs} />;
      default: return <HomeScreen go={setScreen} items={items} unread={unread} />;
    }
  };

  return (
    <section aria-label="PenCom app preview" className={cn("relative overflow-hidden", className)}>
      {/* Status bar */}
      <div className={cn("absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 text-sm font-semibold transition-colors duration-300", screen === "dashboard" ? sk.statusHome : sk.statusInner)}>
        <span aria-hidden="true">9:41</span>
        <span aria-hidden="true" className={cn("absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full", sk.island)} />
        <span aria-hidden="true" className="flex items-center gap-1.5">
          <Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" />
        </span>
      </div>

      <p className="sr-only" aria-live="polite">Showing: {titles[screen]}</p>

      <div id="app-screen" className={cn("absolute inset-x-0 bottom-[84px] top-11 transition-[filter]", prefs.highContrast && "contrast-125 saturate-150")}>
        <MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={screen} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="h-full">
              {render()}
            </motion.div>
          </AnimatePresence>
        </MotionConfig>
      </div>

      {/* Floating "Ask AI" button: opens the PenCom AI Assistant from any screen */}
      <AnimatePresence>
        {screen !== "chat" && !moreOpen && (
          <motion.button
            type="button"
            onClick={() => setScreen("chat")}
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ duration: 0.25 }}
            className={cn("group absolute bottom-[98px] right-4 z-30 flex min-h-14 items-center gap-2 rounded-full py-2 pl-2 pr-5 text-base font-bold transition", sk.fab, focus)}
          >
            <span aria-hidden="true" className={cn("relative flex h-10 w-10 items-center justify-center rounded-full", sk.fabIcon)}>
              <motion.span className={cn("absolute inset-0 rounded-full ring-2", sk.fabPulse)} initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.45, opacity: 0 }} transition={{ duration: 1.6, repeat: 2, delay: 0.6 }} />
              <Sparkles className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            </span>
            Ask AI
          </motion.button>
        )}
      </AnimatePresence>

      {/* "More" sheet: slides up above the tab bar over a soft backdrop */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={closeMore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn("absolute inset-x-0 bottom-[84px] top-0 z-30", sk.backdrop)}
            />
            <motion.div
              ref={sheetRef}
              id="app-more"
              role="dialog"
              aria-modal="true"
              aria-labelledby="app-more-title"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn("absolute inset-x-0 bottom-[84px] z-30 px-4 pb-4 pt-2.5", sk.sheet)}
            >
              <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-black/15" />
              <div className="mt-2 flex items-center justify-between">
                <h2 id="app-more-title" className={cn("text-[20px] tracking-tight", sk.sheetTitle)}>More</h2>
                <button type="button" onClick={closeMore} className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold", sk.closeBtn, focus)}>
                  <X className="h-4 w-4" aria-hidden="true" /> Close
                </button>
              </div>
              <ul className={cn("mt-3 divide-y overflow-hidden", sk.sheetList)}>
                {moreItems.map((m, i) => {
                  const on = screen === m.key;
                  return (
                    <motion.li key={m.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.08 + i * 0.04 }}>
                      <button type="button" aria-current={on ? "page" : undefined} onClick={() => go(m.key)} className={cn("group flex min-h-[3.75rem] w-full items-center gap-3 px-3.5 py-2.5 text-left transition", sk.hoverSoft, on && sk.sheetRowOn, focus)}>
                        <span className={cn(sk.tile, "h-10 w-10", sk.tileHover)}>
                          <m.icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("flex items-center gap-2 text-base font-bold", sk.ink)}>
                            {m.label}
                            {m.key === "notifications" && unread > 0 && <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", sk.sheetBadge)}>{unread} new</span>}
                          </span>
                          <span className="block text-sm text-gray-700">{m.desc}</span>
                        </span>
                        <ChevronRight className={cn("h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1", sk.accent)} aria-hidden="true" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav: the essentials, then "More" (icon and word on every tab); the active pill slides between tabs */}
      <nav aria-label="App" className={cn("absolute z-40 flex justify-around", sk.navFloat ? "inset-x-3 bottom-4 h-[66px] items-center rounded-[1.75rem] px-1" : "inset-x-0 bottom-0 h-[84px] items-start px-2 pt-2", sk.nav)}>
        {tabs.map((t) => {
          const on = screen === t.key && !moreOpen;
          return (
            <button key={t.key} type="button" aria-current={on ? "page" : undefined} onClick={() => go(t.key)} className={cn("flex min-w-[4.25rem] flex-col items-center gap-1 rounded-xl px-1 py-0.5", focus)}>
              <span className={cn("relative flex h-8 w-14 items-center justify-center rounded-full transition-colors", on ? sk.navOn : sk.navOff)}>
                {on && <Indicator />}
                <t.icon className="relative h-5 w-5" aria-hidden="true" />
              </span>
              <span className={cn(sk.navText, on ? sk.navLabelOn : sk.navLabelOff)}>{t.label}</span>
            </button>
          );
        })}
        <button
          ref={moreBtn}
          type="button"
          aria-expanded={moreOpen}
          aria-controls="app-more"
          onClick={() => (moreOpen ? closeMore() : setMoreOpen(true))}
          className={cn("flex min-w-[4.25rem] flex-col items-center gap-1 rounded-xl px-1 py-0.5", focus)}
        >
          <span className={cn("relative flex h-8 w-14 items-center justify-center rounded-full transition-colors", moreOpen || inMore ? sk.navOn : sk.navOff)}>
            {(moreOpen || inMore) && <Indicator />}
            {moreOpen ? <X className="relative h-5 w-5" aria-hidden="true" /> : <MoreHorizontal className="relative h-5 w-5" aria-hidden="true" />}
            {!moreOpen && unread > 0 && <span aria-hidden="true" className={cn("absolute right-2.5 top-0.5 h-2.5 w-2.5 rounded-full ring-2", sk.navDot)} />}
          </span>
          <span className={cn(sk.navText, moreOpen || inMore ? sk.navLabelOn : sk.navLabelOff)}>{moreOpen ? "Close" : "More"}</span>
        </button>
      </nav>
      <span aria-hidden="true" className={cn("absolute bottom-1 left-1/2 z-40 h-1 w-32 -translate-x-1/2 rounded-full", sk.homeBar)} />
    </section>
  );
}
