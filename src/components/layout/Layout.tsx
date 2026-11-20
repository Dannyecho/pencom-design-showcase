"use client";

import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "@/lib/router";
import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "@/components/chat/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import QuickLinks from "@/components/QuickLinks";
import LanguageNotice from "@/components/LanguageNotice";

/** Page frame shared by every route: skip link, header, language notice, footer, assistant, quick links. */
export default function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";

  // Any link ending in #chat (menus, slides, quick links) opens the PenCom Assistant.
  useEffect(() => {
    if (hash !== "#chat") return;
    const t = window.setTimeout(() => document.getElementById("chat-trigger")?.click(), 150);
    navigate({ pathname, search }, { replace: true, preventScrollReset: true });
    return () => window.clearTimeout(t);
  }, [hash, pathname, search, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#117F21] focus:px-6 focus:py-3 focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-[92px]" tabIndex={-1}>
        <LanguageNotice />
        {children}
      </main>
      <Footer />
      <Chatbot />
      <QuickLinks />
      {isHome && <AccessibilityWidget />}
    </div>
  );
}
