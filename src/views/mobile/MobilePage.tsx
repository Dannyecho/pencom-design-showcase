"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Accessibility, BatteryFull, Bell, BookOpen, ChevronRight, ClipboardList, FileCheck, Home, Info, Landmark, MessageSquare, MoreHorizontal, Sparkles, Signal, Smartphone, Wifi, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero, focus } from "@/views/theme/ui";
import { features, notifications as seed, type ScreenName } from "./data";
import {
  AccessibilityScreen, FeedbackScreen, GuideScreen, NotificationsScreen, PfaScreen, PublicationsScreen,
  ChatScreen, HomeScreen, ServicesScreen, chatWelcome, type A11yPrefs, type ChatMsg,
} from "./screens";

/**
 * /mobile: a working preview of the planned PenCom app, in the showcase look. The light page hero carries the
 * feature list (large labelled buttons that switch the phone's screen); the phone sits in the hero's aside,
 * framed like the calm arch photos (ink bezel, thin gold outline, soft mint and gold glow behind).
 * Content and behaviour come from the original prototype (app/src/pages/MobileApp.tsx).
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

const titles: Record<ScreenName, string> = {
  dashboard: "Home", chat: "PenCom AI Assistant", services: "Services", publications: "Publications", pfa: "PFA Directory", guidance: "Service Guide",
  notifications: "Notifications", feedback: "Feedback", accessibility: "Accessibility",
};

export default function MobilePage() {
  const [screen, setScreen] = useState<ScreenName>("dashboard");
  const [items, setItems] = useState(seed);
  const [chat, setChat] = useState<ChatMsg[]>([chatWelcome]);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtn = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const inMore = moreItems.some((m) => m.key === screen);
  const go = (s: ScreenName) => { setMoreOpen(false); setScreen(s); };
  const closeMore = () => { setMoreOpen(false); moreBtn.current?.focus({ preventScroll: true }); };

  // "More" sheet: focus the first item on open, Escape closes and returns focus to the More tab.
  useEffect(() => {
    if (!moreOpen) return;
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setMoreOpen(false); moreBtn.current?.focus({ preventScroll: true }); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [moreOpen]);
  const [prefs, setPrefs] = useState<A11yPrefs>({ textSize: 18, screenReader: false, highContrast: false, reduceMotion: false, voiceNav: false });
  const phoneRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.read).length;

  // Feature list: switch the phone, and on narrow screens bring the phone into view.
  const pick = (s: ScreenName) => {
    setMoreOpen(false);
    setScreen(s);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      phoneRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };
  const home = () => go("dashboard");

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

  const featureList = (
    <div>
      <h2 className="text-xl font-bold text-white">Choose a feature to try</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {features.map((f) => {
          const on = screen === f.screen;
          return (
            <li key={f.screen}>
              <button
                type="button"
                aria-pressed={on}
                aria-controls="app-screen"
                onClick={() => pick(f.screen)}
                className={cn(
                  "group flex h-full w-full items-center gap-3.5 rounded-2xl bg-white p-3.5 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-28px_rgba(16,93,29,0.55)] hover:ring-2 hover:ring-[#14892A]",
                  on && "bg-[#E8F5E9] ring-2 ring-[#14892A]",
                  focus,
                )}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#105D1D] text-[#F4D27A] transition-transform duration-300 group-hover:-rotate-6">
                  <f.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-bold leading-tight text-[#0B1F10]">{f.label}</span>
                  <span className="mt-0.5 block text-base leading-snug text-gray-700">{f.desc}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 flex items-start gap-2.5 rounded-2xl bg-[#E8EEE5] p-4 text-base leading-relaxed text-gray-800">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#105D1D]" aria-hidden="true" />
        <span>This is a design preview. The app is open to everyone, with no sign-in. Updates shown in it are sample content.</span>
      </p>
    </div>
  );

  const phone = (
    <div ref={phoneRef} className="relative mx-auto w-full max-w-[392px] scroll-mt-[110px]">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 top-10 bottom-10 -z-10 rounded-full bg-[#E8F5E9] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-8 -z-10 h-56 w-56 rounded-full bg-[#CB9615]/20 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[3.25rem] bg-[#0B1F10] p-2.5 shadow-[0_40px_80px_-40px_rgba(16,93,29,0.75)] outline outline-2 outline-offset-[10px] outline-[#CB9615]/50"
      >
        <section aria-label="PenCom app preview" className="relative h-[calc(100svh-210px)] max-h-[780px] min-h-[600px] lg:h-[calc(100svh-120px)] lg:min-h-[640px] overflow-hidden rounded-[2.6rem] bg-[#F2F6F0]">
          {/* Status bar */}
          <div className={cn("absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between px-7 text-sm font-semibold", screen === "dashboard" ? "bg-[#105D1D] text-white" : "bg-white text-[#0B1F10]")}>
            <span aria-hidden="true">9:41</span>
            <span aria-hidden="true" className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#0B1F10]" />
            <span aria-hidden="true" className="flex items-center gap-1.5">
              <Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" />
            </span>
          </div>

          <p className="sr-only" aria-live="polite">Showing: {titles[screen]}</p>

          <div
            id="app-screen"
            className={cn("absolute inset-x-0 top-11 transition-[filter]", "bottom-[84px]", prefs.highContrast && "contrast-125 saturate-150")}
          >
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
                className={cn("group absolute bottom-[98px] right-4 z-30 flex min-h-14 items-center gap-2 rounded-full bg-[#105D1D] py-2 pl-2 pr-5 text-base font-bold text-white shadow-[0_18px_36px_-14px_rgba(16,93,29,0.9)] ring-2 ring-white transition hover:bg-[#14892A]", focus)}
              >
                <span aria-hidden="true" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206]">
                  <motion.span className="absolute inset-0 rounded-full ring-2 ring-[#F4D27A]" initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.45, opacity: 0 }} transition={{ duration: 1.6, repeat: 2, delay: 0.6 }} />
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
                  className="absolute inset-x-0 bottom-[84px] top-0 z-30 bg-[#0B1F10]/40"
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
                  className="absolute inset-x-0 bottom-[84px] z-30 rounded-t-[1.75rem] bg-[#F2F6F0] px-4 pb-4 pt-2.5 shadow-[0_-20px_40px_-24px_rgba(16,93,29,0.6)]"
                >
                  <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-black/15" />
                  <div className="mt-2 flex items-center justify-between">
                    <h2 id="app-more-title" className="text-[20px] font-bold tracking-tight text-[#0B1F10]">More</h2>
                    <button type="button" onClick={closeMore} className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-[#0B1F10] ring-1 ring-black/15 hover:bg-[#105D1D] hover:text-white", focus)}>
                      <X className="h-4 w-4" aria-hidden="true" /> Close
                    </button>
                  </div>
                  <ul className="mt-3 divide-y divide-black/5 overflow-hidden rounded-2xl bg-white ring-1 ring-black/10">
                    {moreItems.map((m) => {
                      const on = screen === m.key;
                      return (
                        <li key={m.key}>
                          <button type="button" aria-current={on ? "page" : undefined} onClick={() => go(m.key)} className={cn("group flex min-h-[3.75rem] w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-[#E8F5E9]", on && "bg-[#E8F5E9]", focus)}>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#105D1D] text-[#F4D27A] transition-transform group-hover:-rotate-6">
                              <m.icon className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-2 text-base font-bold text-[#0B1F10]">
                                {m.label}
                                {m.key === "notifications" && unread > 0 && <span className="rounded-full bg-[#F4D27A] px-2 py-0.5 text-xs font-bold text-[#1A1206]">{unread} new</span>}
                              </span>
                              <span className="block text-sm text-gray-700">{m.desc}</span>
                            </span>
                            <ChevronRight className="h-5 w-5 shrink-0 text-[#105D1D] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Bottom nav: the essentials, then "More" (icon and word on every tab) */}
          <nav aria-label="App" className="absolute inset-x-0 bottom-0 z-40 flex h-[84px] items-start justify-around border-t border-black/10 bg-white px-2 pt-2">
            {tabs.map((t) => {
              const on = screen === t.key && !moreOpen;
              return (
                <button key={t.key} type="button" aria-current={on ? "page" : undefined} onClick={() => go(t.key)} className={cn("flex min-w-[4.25rem] flex-col items-center gap-1 rounded-xl px-1 py-0.5", focus)}>
                  <span className={cn("flex h-8 w-14 items-center justify-center rounded-full transition-colors", on ? "bg-[#105D1D] text-[#F4D27A]" : "text-gray-600")}>
                    <t.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className={cn("text-[13px]", on ? "font-bold text-[#105D1D]" : "font-medium text-gray-700")}>{t.label}</span>
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
              <span className={cn("relative flex h-8 w-14 items-center justify-center rounded-full transition-colors", moreOpen || inMore ? "bg-[#105D1D] text-[#F4D27A]" : "text-gray-600")}>
                {moreOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MoreHorizontal className="h-5 w-5" aria-hidden="true" />}
                {!moreOpen && unread > 0 && <span aria-hidden="true" className="absolute right-2.5 top-0.5 h-2.5 w-2.5 rounded-full bg-[#CB9615] ring-2 ring-white" />}
              </span>
              <span className={cn("text-[13px]", moreOpen || inMore ? "font-bold text-[#105D1D]" : "font-medium text-gray-700")}>{moreOpen ? "Close" : "More"}</span>
            </button>
          </nav>
          <span aria-hidden="true" className={cn("absolute bottom-1.5 left-1/2 z-30 h-1 w-32 -translate-x-1/2 rounded-full", "bg-[#0B1F10]")} />
        </section>
      </motion.div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-white text-[#0B1F10]">
        <PageHero
          id="mobile-title"
          crumbs={[{ label: "Home", to: "/" }, { label: "Mobile app" }]}
          pill={{ icon: Smartphone, label: "App preview" }}
          title="The PenCom app, in your pocket"
          mark="in your pocket"
          intro={<p>A preview of the PenCom app for Android and iOS. Choose a feature below to see it on the phone, or tap around the phone itself.</p>}
          actions={featureList}
          aside={phone}
        />
      </div>
    </MotionConfig>
  );
}
