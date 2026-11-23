"use client";

import { useEffect } from "react";
import { useLocation } from "@/lib/router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import CookieConsent from "@/components/CookieConsent";
import PromoPopup from "@/components/PromoPopup";
import { scrollToId } from "./about/primitives";
import Banner from "./homeshowcase/Banner";
import { Alerts, AudienceDock, Circulars, CommandSearch, FiguresBand, HelpBlock, NewsBento, Portals, ScrollProgress } from "./homeshowcase/Sections";

/**
 * Home, showcase design (/home-showcase): cinematic curtain-wipe banner, expanding "I am a…" cards,
 * a command-style search ("/" to focus), spotlight alert cards, a circulars carousel, tilting portal
 * cards, a news bento, glowing figure cards and a reading-progress line. Order follows DES-19 after the
 * banner: quick links → search and common services → alerts → circulars → online services → news →
 * figures → FAQs and contact. Section titles: giant outlined words drifting behind each title.
 */
export default function HomeShowcase() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id || id === "chat") return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <CookieConsent />
      <PromoPopup />
      <ScrollProgress />
      <div className="bg-white text-[#1A3A22]">
        <Banner />
        <AudienceDock />
        <CommandSearch />
        <Alerts />
        <Circulars />
        <Portals />
        <NewsBento />
        <FiguresBand />
        <HelpBlock />
      </div>
    </MotionConfig>
  );
}
