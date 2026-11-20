"use client";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Download, FileText, HelpCircle, LayoutGrid, MapPin, MessageSquareWarning, Newspaper, Users, X, type LucideIcon,
} from "lucide-react";

type QuickLink = { label: string; to: string; icon: LucideIcon };

/** Floating quick-access button (modelled on ndic.gov.ng). Present on every page, bottom-left. */
const links: QuickLink[] = [
  { label: "Lodge a complaint", to: "/connect#report", icon: MessageSquareWarning },
  { label: "Find a PFA", to: "/operators#pfas", icon: Users },
  { label: "FAQs", to: "/resources/faq", icon: HelpCircle },
  { label: "Download forms", to: "/resources#downloads", icon: Download },
  { label: "Regulations", to: "/regulations", icon: FileText },
  { label: "Latest news", to: "/connect", icon: Newspaper },
  { label: "Zonal offices", to: "/connect#zonal-offices", icon: MapPin },
];

export default function QuickLinks() {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverOpened = useRef(false); // opened by hover, not yet clicked
  const pinned = useRef(false); // opened by click/tap: stays open until closed
  const reduce = useReducedMotion();
  const location = useLocation();

  // Close on route change, Escape and outside click.
  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) {
      pinned.current = false;
      hoverOpened.current = false;
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Mouse users can open it by hovering; touch and keyboard users click/tap.
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    if (!open) hoverOpened.current = true;
    setOpen(true);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (pinned.current) return;
    hoverTimer.current = window.setTimeout(() => setOpen(false), 350);
  };

  return (
    <div
      ref={wrap}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="fixed bottom-6 left-4 z-40 sm:left-6 print:hidden"
    >
      <AnimatePresence>
        {open && (
          <motion.nav
            id="quick-links"
            aria-label="Quick links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute bottom-[4.25rem] left-0"
          >
            <ul className="flex flex-col-reverse gap-2.5">
              {links.map((l, i) => (
                <motion.li
                  key={l.to + l.label}
                  initial={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.7 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28, delay: reduce ? 0 : i * 0.035 }}
                  style={{ transformOrigin: "left bottom" }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="group flex min-h-11 items-center gap-3 focus-visible:outline-none"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#117F21] to-[#0A4A13] text-white shadow-[0_10px_24px_-8px_rgba(10,74,19,0.8)] ring-2 ring-white transition duration-200 group-hover:scale-110 group-hover:from-[#CB9615] group-hover:to-[#9A6F06] group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-2 group-focus-visible:outline-[#FFD84D]">
                      <l.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#0A2E10] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition group-hover:-translate-x-0 group-hover:text-[#117F21] group-hover:ring-[#117F21]/30">
                      {l.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.button
        ref={toggle}
        type="button"
        aria-expanded={open}
        aria-controls="quick-links"
        aria-label={open ? "Close quick links" : "Open quick links"}
        onClick={() => {
          if (hoverOpened.current) {
            // The pointer already opened it on hover: a click pins it open instead of closing it.
            hoverOpened.current = false;
            pinned.current = true;
            setOpen(true);
            return;
          }
          pinned.current = !open;
          setOpen((o) => !o);
        }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#04240A] text-white shadow-[0_16px_36px_-10px_rgba(4,36,10,0.9)] ring-2 ring-white/80 transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
      >
        {!open && !reduce && (
          <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#117F21]/40 [animation-iteration-count:2]" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "grid"}
            initial={{ rotate: reduce ? 0 : -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: reduce ? 0 : 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <LayoutGrid className="h-6 w-6 text-[#F4D27A]" aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
