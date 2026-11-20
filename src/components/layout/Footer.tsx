"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Apple, ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, ExternalLink, Facebook, Instagram,
  Linkedin, Mail, MapPin, Phone, Play, Twitter, Youtube,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Site footer, styled after the "for everyone" homepage: warm light background with soft colour
 * fields and a dot grid, a deep-green feature panel (newsletter, app, social), numbered column
 * labels joined by a drawn line, a gold highlighter sweep on the key words, white rounded chips
 * for contact details and portals. Motion runs once; reduced motion shows the finished state.
 */

const columns = [
  {
    title: "About PenCom",
    links: [
      { label: "About the Commission", href: "/about" },
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Leadership", href: "/about#executive" },
      { label: "Service Charter", href: "/about/service-charter" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Pension Services", href: "/services" },
      { label: "RSA Transfer", href: "/services#rsa-transfer" },
      { label: "Personal Pension Plan", href: "/services#ppp" },
      { label: "Pension Clearance", href: "/services#pcc" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Publications", href: "/resources#publications" },
      { label: "PenCom Chronicles", href: "/chronicles" },
      { label: "Photos and videos", href: "/media" },
      { label: "Circulars", href: "/regulations?type=Circular#library" },
      { label: "Downloads", href: "/resources#downloads" },
      { label: "Forms and checklists", href: "/resources/forms-and-checklists" },
      { label: "FAQs", href: "/resources/faq" },
      { label: "Admin Dashboard", href: "/admin" },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: "https://x.com/PenComNig", label: "X (Twitter)" },
  { icon: Instagram, href: "https://instagram.com/pencomnigeria", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/PenCom.gov", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com/channel/UCK7FCj7J1GMk6hrnDDInq9w", label: "YouTube" },
  { icon: Linkedin, href: "https://linkedin.com/company/national-pension-commission", label: "LinkedIn" },
];

const portals = [
  { name: "COBRA", note: "Contributions" },
  { name: "Pencare", note: "Retiree health cover" },
  { name: "PENCAP", note: "Pension capital" },
  { name: "PCRS", note: "Remit contributions" },
];

const contacts = [
  { icon: MapPin, label: "Head office", value: "174, Adetokunbo Ademola Crescent, Wuse II, Abuja", to: "/connect#zonal-offices" },
  { icon: Phone, label: "Call us", value: "09-4611300, 0700-PENCOM (0700-736266)", href: "tel:094611300" },
  { icon: Mail, label: "Email us", value: "info@pencom.gov.ng", href: "mailto:info@pencom.gov.ng" },
];

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

/** Column label: index number joined to the label by a line that draws itself (homepage style). */
function Kicker({ n, children, dark = false }: { n: string; children: string; dark?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <p className={cn("flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] sm:gap-3 sm:tracking-[0.2em] lg:whitespace-nowrap", dark ? "text-white/80" : "text-[#0A4A13]")}>
      <span className={cn("font-mono text-sm tracking-normal", dark ? "text-[#F4D27A]" : "text-[#B07E0C]")}>{n}</span>
      <motion.span
        aria-hidden="true"
        className={cn("h-[2px] w-8 shrink-0 origin-left rounded-full", dark ? "bg-[#F4D27A]/70" : "bg-[#117F21]/50")}
        initial={{ scaleX: reduce ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
      />
      {children}
    </p>
  );
}

/** Gold highlighter swept in behind the key words (homepage style). */
function Mark({ children, dark = false }: { children: string; dark?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={cn(
        "box-decoration-clone rounded-md bg-no-repeat px-1",
        dark ? "bg-[linear-gradient(transparent_68%,rgba(244,210,122,0.28)_68%)] text-[#F4D27A]" : "bg-[linear-gradient(transparent_58%,rgba(244,210,122,0.75)_58%)]",
      )}
      initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.span>
  );
}

export default function Footer() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    <footer className="relative isolate overflow-hidden bg-[#F2F6F0] text-[#0E2414]" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>

      {/* Ambient colour fields + dot grid, as on the homepage hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-24 h-[30rem] w-[30rem] rounded-full bg-[#BFE3C4]/60 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#F8E2A8]/60 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.07)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      </div>
      {/* Brand line across the top */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-[#0A4A13] via-[#CB9615] to-[#117F21]" />

      <div className="mx-auto max-w-7xl px-4 pt-14 sm:pt-16">
        {/* ── Feature panel: newsletter, app, social ── */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="relative"
        >
          <div aria-hidden="true" className="absolute -inset-2 -z-10 translate-x-2 translate-y-2 rounded-[2.2rem] bg-[#CB9615]/25 sm:-inset-3 sm:translate-x-3 sm:translate-y-3" />
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0A4A13] text-white shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)]">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#117F21] blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#CB9615]/30 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-8 p-5 sm:gap-10 sm:p-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <Kicker n="01" dark>
                  Stay informed
                </Kicker>
                <h3 className="mt-4 text-[1.8rem] font-bold leading-[1.15] tracking-tight sm:text-4xl">
                  Pension news, straight to <Mark dark>your inbox</Mark>
                </h3>
                <p className="mt-3 max-w-xl text-white/75">Circulars, deadlines and new services, about once a month. No spam, unsubscribe at any time.</p>

                <form onSubmit={subscribe} className="mt-6">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <AnimatePresence mode="wait" initial={false}>
                    {sent ? (
                      <motion.p
                        key="ok"
                        role="status"
                        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 font-semibold ring-1 ring-white/15"
                      >
                        <CheckCircle2 className="h-6 w-6 shrink-0 text-[#F4D27A]" aria-hidden="true" />
                        Thank you. Check your inbox to confirm your subscription.
                      </motion.p>
                    ) : (
                      <motion.div key="form" exit={{ opacity: 0 }} className="flex flex-col gap-3 rounded-2xl bg-white p-2 shadow-xl sm:flex-row sm:items-center">
                        <span className="flex flex-1 items-center gap-3 px-3">
                          <Mail className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                          <input
                            id="footer-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="min-h-12 w-full bg-transparent text-base text-[#0E2414] placeholder:text-gray-400 focus:outline-none"
                          />
                        </span>
                        <button
                          type="submit"
                          className={cn("group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#CB9615] px-6 font-bold text-[#1A1206] transition hover:bg-[#E0AB24]", focus)}
                        >
                          Subscribe
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              <div className="flex flex-col gap-7 border-t border-white/15 pt-7 sm:flex-row sm:flex-wrap sm:gap-10 lg:col-span-5 lg:flex-col lg:gap-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                <div>
                  <Kicker n="02" dark>
                    Get the app
                  </Kicker>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      { icon: Apple, top: "Download on the", name: "App Store" },
                      { icon: Play, top: "Get it on", name: "Google Play" },
                    ].map((s) => (
                      <Link
                        key={s.name}
                        to="/mobile"
                        className={cn("group inline-flex min-h-14 items-center gap-3 rounded-2xl bg-white/10 px-4 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#0A4A13]", focus)}
                      >
                        <s.icon className="h-6 w-6" aria-hidden="true" />
                        <span className="text-left">
                          <span className="block text-[11px] leading-none opacity-75">{s.top}</span>
                          <span className="block font-bold leading-tight">{s.name}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <Kicker n="03" dark>
                    Follow us
                  </Kicker>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {socialLinks.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${s.label} (opens in a new tab)`}
                          title={s.label}
                          className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)}
                        >
                          <s.icon className="h-5 w-5" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Brand, contact and link columns ── */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-3">
            <Link to="/" className={cn("inline-flex items-center gap-3 rounded-xl", focus)}>
              <img src="/pencom-logo.png" alt="" className="h-12 w-12 rounded-xl bg-white object-contain p-1 ring-1 ring-black/10" />
              <span>
                <span className="block text-lg font-bold leading-tight">PenCom</span>
                <span className="block text-sm text-gray-600">National Pension Commission</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-gray-600">
              Ensuring the safety and security of retirement benefits for all Nigerian workers through effective regulation and supervision of the pension industry.
            </p>
            <ul className="mt-5 space-y-2">
              {contacts.map((c) => {
                const inner = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0A4A13] ring-1 ring-black/10 transition group-hover:bg-[#0A4A13] group-hover:text-white">
                      <c.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#0A4A13]">{c.label}</span>
                      <span className="block break-words text-sm text-gray-700">{c.value}</span>
                    </span>
                  </>
                );
                const cls = cn("group flex items-center gap-3 rounded-xl py-1", focus);
                return <li key={c.label}>{c.to ? <Link to={c.to} className={cls}>{inner}</Link> : <a href={c.href} className={cls}>{inner}</a>}</li>;
              })}
            </ul>
          </div>

          {columns.map((col, ci) => (
            <nav key={col.title} aria-label={t(col.title)} className="lg:col-span-2 [&:first-of-type]:lg:col-span-3 [&:last-of-type]:col-span-2 [&:last-of-type]:lg:col-span-4">
              <Kicker n={`0${ci + 4}`}>{col.title}</Kicker>
              <ul className={cn("mt-5 space-y-1", col.links.length > 4 && "columns-2 gap-6")}>
                {col.links.map((l) => (
                  <li key={l.label} className="break-inside-avoid">
                    <Link to={l.href} className={cn("group inline-flex min-h-9 items-center gap-1.5 rounded py-1 text-[0.95rem] text-gray-700 transition hover:text-[#0A4A13]", focus)}>
                      <span className="relative">
                        {l.label}
                        <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-[#CB9615] transition-transform duration-300 group-hover:scale-x-100" />
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Online services ── */}
        <div className="rounded-3xl bg-white/80 p-5 ring-1 ring-black/5 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4">
            <Kicker n="07">Online services</Kicker>
            <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {portals.map((p) => (
                <li key={p.name}>
                  <a
                    href={`https://${p.name.toLowerCase()}.pencom.gov.ng`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("group flex min-h-12 items-center gap-3 rounded-2xl bg-[#F2F6F0] px-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-[#0A4A13] hover:text-white", focus)}
                  >
                    <span className="font-bold">{p.name}</span>
                    <span className="hidden truncate text-sm text-gray-500 transition group-hover:text-white/75 sm:inline">{p.note}</span>
                    <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-[#F4D27A]" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-auto mt-10 max-w-7xl px-4 pb-8">
        <div className="flex flex-col gap-4 border-t border-[#0E2414]/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-gray-600">
            &copy; 2026 National Pension Commission. All rights reserved. Federal Republic of Nigeria.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[
              { label: "Contact Us", to: "/connect" },
              { label: "Report Employer", to: "/connect#report" },
              { label: "Privacy Policy", to: "/regulations#policies" },
            ].map((l) => (
              <Link key={l.label} to={l.to} className={cn("rounded text-sm font-medium text-gray-700 hover:text-[#0A4A13] hover:underline", focus)}>
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={toTop}
              className={cn("group inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0A4A13] pl-4 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#117F21]", focus)}
            >
              Back to top
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform group-hover:-translate-y-0.5">
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
