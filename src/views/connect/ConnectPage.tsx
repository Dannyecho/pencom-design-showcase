"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, Headphones, Mail, MapPin, MessageCircle, MessageSquareWarning, Phone, Search, Send } from "lucide-react";
import { useLocation, useNavigate } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { FramedPanel, PageHero, SectionNav, ease, focus } from "@/views/theme/ui";
import CaseForm from "./CaseForm";
import { Newsroom, Offices, Tracker } from "./Sections";
import { headOffice, offices, social, type TopicId } from "./data";

/**
 * Connect, "for everyone" theme (brief §6.2 Connect; templates "Complaint, enquiry and employer report forms",
 * "Case status tracker", "Utility pages: contact and zonal offices", "News and events").
 * Hero with the four things people come here to do → three-step form → case tracker → offices map → newsroom.
 * #report and #complaint open the form on the right topic.
 */

const sections = [
  { id: "contact", label: "Contact us" },
  { id: "track", label: "Track a case" },
  { id: "zonal-offices", label: "Offices" },
  { id: "news", label: "Newsroom" },
];

export default function ConnectPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<TopicId>("enquiry");
  const [lastRef, setLastRef] = useState<string | null>(null);

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    if (id === "report") setTopic("employer");
    if (id === "complaint") setTopic("pfa");
    const target = id === "report" || id === "complaint" ? "contact" : id;
    const t1 = window.setTimeout(() => scrollToId(target, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(target, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  const go = (id: string, t?: TopicId) => {
    if (t) setTopic(t);
    navigate(`/connect#${id}`, { replace: true, preventScrollReset: true });
    scrollToId(id, !reduce);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#0B1F10]">
        <Hero go={go} />
        <SectionNav sections={sections} pillId="connect-nav-pill" />
        <CaseForm topic={topic} setTopic={setTopic} onSubmitted={setLastRef} />
        <Tracker prefill={lastRef} />
        <Offices />
        <Newsroom />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

const actions: { id: string; topic?: TopicId; icon: typeof Send; title: string; body: string }[] = [
  { id: "contact", topic: "enquiry", icon: Send, title: "Ask a question", body: "Send us an enquiry" },
  { id: "contact", topic: "pfa", icon: MessageSquareWarning, title: "Make a complaint", body: "About a PFA or PenCom" },
  { id: "contact", topic: "employer", icon: Building2, title: "Report an employer", body: "Pension not remitted" },
  { id: "track", icon: Search, title: "Track a case", body: "Use your case reference" },
];

function Hero({ go }: { go: (id: string, topic?: TopicId) => void }) {
  const reduce = useReducedMotion();
  return (
    <PageHero
      id="connect-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Connect" }]}
      pill={{ icon: Headphones, label: "Contact and support" }}
      title="How can we help you?"
      mark="help you?"
      intro={`Ask a question, make a complaint, report an employer or track a case. Or visit us at our head office in Abuja or one of ${offices.length} zonal offices.`}
      actions={
        <ul className="grid max-w-xl grid-cols-2 gap-3">
          {actions.map((a, i) => (
            <motion.li key={a.title} initial={{ opacity: 0, y: reduce ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease }}>
              <button
                type="button"
                onClick={() => go(a.id, a.topic)}
                className={cn(
                  "group flex h-full w-full flex-col items-start gap-3 rounded-2xl bg-white/85 p-4 text-left ring-1 ring-black/5 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-[#0A4A13] hover:text-white hover:shadow-[0_24px_40px_-24px_rgba(10,74,19,0.8)] sm:flex-row sm:items-center",
                  focus,
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#117F21] transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                  <a.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug">{a.title}</span>
                  <span className="mt-0.5 block text-sm text-gray-500 transition group-hover:text-white/70">{a.body}</span>
                </span>
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#F4D27A] sm:block" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </ul>
      }
      aside={
        <FramedPanel>
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0A4A13] to-[#117F21] px-6 pb-6 pt-6 text-white sm:px-7">
            <span aria-hidden="true" className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#F4D27A]/20 blur-2xl" />
            <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">National Pension Commission</p>
            <p className="relative mt-2 text-2xl font-bold leading-tight">Talk to us directly</p>
            <p className="relative mt-1 text-sm text-white/75">Call, email or visit the head office in Abuja.</p>
          </div>
          <ul className="space-y-1 p-3 sm:p-4">
            <li>
              <a href={`tel:${headOffice.phone.replace(/\s/g, "")}`} className={cn("group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-[#F2F6F0]", focus)}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#117F21] transition group-hover:bg-[#117F21] group-hover:text-white">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-gray-500">Call</span>
                  <span className="block text-lg font-bold">{headOffice.phone}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${headOffice.email}`} className={cn("group flex items-center gap-4 rounded-2xl p-3 transition hover:bg-[#F2F6F0]", focus)}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#117F21] transition group-hover:bg-[#117F21] group-hover:text-white">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-gray-500">Email</span>
                  <span className="block break-all text-lg font-bold">{headOffice.email}</span>
                </span>
              </a>
            </li>
            <li>
              <button type="button" onClick={() => go("zonal-offices")} className={cn("group flex w-full items-center gap-4 rounded-2xl p-3 text-left transition hover:bg-[#F2F6F0]", focus)}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#117F21] transition group-hover:bg-[#117F21] group-hover:text-white">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-gray-500">Head office</span>
                  <span className="block font-semibold leading-snug">{headOffice.address}</span>
                </span>
                <span className="hidden shrink-0 text-xs font-semibold text-[#117F21] sm:block">All offices →</span>
              </button>
            </li>
          </ul>
          <div className="border-t border-black/5 px-6 pb-6 pt-4 sm:px-7">
            <button
              type="button"
              onClick={() => document.getElementById("chat-trigger")?.click()}
              className={cn("inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#CB9615] font-semibold text-[#1A1206] transition hover:bg-[#E0AA22]", focus)}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat with PenCom Assistant
            </button>
            <p className="mt-4 text-xs text-gray-500">Follow our verified accounts</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={cn("inline-flex min-h-9 items-center rounded-full bg-[#F2F6F0] px-3 text-xs font-semibold text-[#0A4A13] ring-1 ring-black/5 transition hover:bg-[#0A4A13] hover:text-white", focus)}>
                    {s.name}
                    <span className="sr-only"> {s.handle} (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </FramedPanel>
      }
    />
  );
}
