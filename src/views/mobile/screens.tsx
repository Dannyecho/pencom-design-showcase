"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightLeft, Bell, BookOpen, Bot, CheckCircle, ClipboardList, ChevronDown, ChevronLeft, ChevronRight, Download, Eye, EyeOff, FileCheck, FileText, HeartHandshake,
  Landmark, MapPin, MessageSquare, Paperclip, Phone, Search, Send, Sparkles, Store, ThumbsDown, ThumbsUp, Type, UserPlus, Volume2, WifiOff,
} from "lucide-react";
import { operators } from "@/lib/data";
import { cn } from "@/lib/utils";
import { fallbackAnswer, findAnswer, suggestedPrompts } from "@/components/chat/answers";
import { focus } from "@/views/theme/ui";
import { journeys } from "@/views/services/data";
import { guides, notifications as seedNotifications, publications, type ScreenName, type Tone } from "./data";

/**
 * The screens inside the phone, in the showcase look: cream app background, white rounded cards with a hairline ring,
 * dark-green icon tiles with gold icons, labelled controls (words next to icons), 15–17 px text and large touch targets.
 */

export type A11yPrefs = { textSize: number; screenReader: boolean; highContrast: boolean; reduceMotion: boolean; voiceNav: boolean };

const card = "rounded-2xl bg-white ring-1 ring-black/10";
const tile = "flex shrink-0 items-center justify-center rounded-xl bg-[#105D1D] text-[#F4D27A]";
const goldBtn = cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F4D27A] px-4 text-[15px] font-bold text-[#1A1206] transition hover:bg-[#FFE08F]", focus);
const outlineBtn = cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#14892A] px-4 text-[15px] font-semibold text-[#105D1D] transition hover:bg-[#14892A] hover:text-white", focus);
const field = cn("w-full rounded-xl bg-[#E8EEE5] px-4 py-3 text-base text-[#0B1F10] ring-1 ring-black/10 placeholder:text-gray-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14892A]");

/** Scrolling body of a screen; focusable so keyboard users can scroll it. */
function Body({ children, label, className, fab = true }: { children: ReactNode; label: string; className?: string; fab?: boolean }) {
  return (
    <div tabIndex={0} aria-label={label} className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[#FFD84D]", className, fab && "pb-24")}>
      {children}
    </div>
  );
}

/** White top bar of an inner screen: a labelled Back button and the screen title. */
function Bar({ title, onBack, action, children }: { title: string; onBack: () => void; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="shrink-0 border-b border-black/10 bg-white px-4 pb-3 pt-2">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={onBack} className={cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold text-[#105D1D] hover:bg-[#E8F5E9]", focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back
        </button>
        {action}
      </div>
      <h2 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-[#0B1F10]">{title}</h2>
      {children}
    </div>
  );
}

function SearchField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#105D1D]" aria-hidden="true" />
        <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(field, "pl-11")} />
      </div>
    </div>
  );
}

/* ───────────────────────── Home (public: no sign-in, no account data) ───────────────────────── */

export function HomeScreen({ go, items, unread }: { go: (s: ScreenName) => void; items: typeof seedNotifications; unread: number }) {
  const actions = [
    { label: "Services", icon: ClipboardList, screen: "services" as const },
    { label: "Service Guide", icon: FileCheck, screen: "guidance" as const },
    { label: "Publications", icon: BookOpen, screen: "publications" as const },
    { label: "Find a PFA", icon: Landmark, screen: "pfa" as const },
  ];
  const guidesShort = [
    { label: "Open an RSA", icon: UserPlus },
    { label: "Transfer your RSA", icon: ArrowRightLeft },
  ];
  return (
    <Body label="Home" className="bg-[#F2F6F0]">
      <div className="relative isolate overflow-hidden rounded-b-[2rem] bg-[#105D1D] px-5 pb-7 pt-3 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-[#CB9615]/25 blur-3xl" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pencom-logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="text-base font-bold">PenCom Mobile</span>
          </span>
          <button type="button" onClick={() => go("notifications")} aria-label={`Notifications, ${unread} new`} className={cn("relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 hover:bg-white/20", focus)}>
            <Bell className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" />
            {unread > 0 && (
              <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#F4D27A] px-1 text-xs font-bold text-[#1A1206] ring-2 ring-[#105D1D]">{unread}</span>
            )}
          </button>
        </div>
        <h2 className="mt-6 text-[24px] font-bold leading-tight tracking-tight">Pensions made clear</h2>
        <p className="mt-1.5 text-[15px] leading-snug text-white/85">Guides, publications and PFA contacts from the National Pension Commission.</p>
      </div>

      <div className="mt-5 px-4">
        <h2 className="text-lg font-bold text-[#0B1F10]">What would you like to do?</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {actions.map((a) => (
            <button key={a.label} type="button" onClick={() => go(a.screen)} className={cn(card, "group flex min-h-[5.5rem] flex-col items-start justify-between gap-2 p-3.5 text-left transition hover:ring-2 hover:ring-[#14892A]", focus)}>
              <span className={cn(tile, "h-10 w-10 transition-transform group-hover:-rotate-6")}><a.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="text-base font-bold leading-snug text-[#0B1F10]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 px-4">
        <h2 className="text-lg font-bold text-[#0B1F10]">Popular guides</h2>
        <ul className={cn(card, "mt-3 divide-y divide-black/5")}>
          {guidesShort.map((g) => (
            <li key={g.label}>
              <button type="button" onClick={() => go("services")} className={cn("group flex min-h-14 w-full items-center gap-3 p-3.5 text-left", focus)}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#105D1D]"><g.icon className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                <span className="flex-1 text-[15px] font-semibold text-[#0B1F10]">{g.label}</span>
                <ChevronRight className="h-5 w-5 text-[#105D1D] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 px-4 pb-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-[#0B1F10]">Latest from PenCom</h2>
          <span className="rounded-full bg-[#E8EEE5] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-[#7A5200]">Sample</span>
        </div>
        <ul className={cn(card, "mt-3 divide-y divide-black/5")}>
          {items.map((n) => (
            <li key={n.title} className="flex items-start gap-3 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#105D1D]"><Bell className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#0B1F10]">{n.title}</span>
                <span className="block text-sm leading-snug text-gray-700">{n.body}</span>
              </span>
              <span className="shrink-0 text-[13px] text-gray-600">{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </Body>
  );
}

/* ───────────────────────── Publications ───────────────────────── */

/** Library filters: a few plain groups rather than every document type (calm: fewer choices on screen). */
const pubKinds = [
  { id: "all", label: "All", types: [] as string[] },
  { id: "reports", label: "Reports", types: ["Annual Report", "Quarterly Report"] },
  { id: "guidelines", label: "Guidelines", types: ["Guideline", "Code"] },
  { id: "laws", label: "Laws", types: ["Legislation"] },
];

export function PublicationsScreen({ onBack }: { onBack: () => void }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [offline, setOffline] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const isSaved = (p: (typeof publications)[number]) => saved[p.title] ?? p.downloaded;
  const term = q.trim().toLowerCase();
  const inKind = (p: (typeof publications)[number], k: string) => k === "all" || pubKinds.find((x) => x.id === k)!.types.includes(p.type);
  const matches = (p: (typeof publications)[number]) =>
    (!term || p.title.toLowerCase().includes(term) || p.type.toLowerCase().includes(term)) && (!offline || isSaved(p));
  const list = publications.filter((p) => matches(p) && inKind(p, kind));
  const filtered = term !== "" || kind !== "all" || offline;
  const clear = () => { setQ(""); setKind("all"); setOffline(false); };
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar title="Publications" onBack={onBack}>
        <SearchField id="app-pub-search" label="Search publications" value={q} onChange={setQ} placeholder="For example, annual report" />
      </Bar>
      <Body label="Publications list" className="space-y-3 p-4">
        <p id="app-pub-kind" className="text-sm font-bold text-gray-700">Filter by type</p>
        <div role="group" aria-labelledby="app-pub-kind" className="flex flex-wrap gap-2">
          {pubKinds.map((k) => {
            const on = kind === k.id;
            const n = publications.filter((p) => matches(p) && inKind(p, k.id)).length;
            return (
              <button key={k.id} type="button" aria-pressed={on} onClick={() => setKind(k.id)} className={cn("inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[15px] font-semibold ring-1 transition", on ? "bg-[#105D1D] text-[#F4D27A] ring-[#105D1D]" : "bg-white text-[#105D1D] ring-[#14892A]/40 hover:bg-[#E8F5E9]", focus)}>
                {k.label}
                <span className={cn("rounded-full px-1.5 text-xs font-bold", on ? "bg-white/15 text-white" : "bg-[#E8EEE5] text-gray-700")}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" role="switch" aria-checked={offline} onClick={() => setOffline(!offline)} className={cn("inline-flex min-h-11 items-center gap-2.5 rounded-xl text-[15px] font-semibold text-[#0B1F10]", focus)}>
            <span aria-hidden="true" className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", offline ? "bg-[#14892A]" : "bg-gray-400")}>
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", offline ? "left-[18px]" : "left-0.5")} />
            </span>
            <WifiOff className="h-4 w-4 text-[#105D1D]" aria-hidden="true" /> Saved offline only
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm text-gray-700" aria-live="polite">
          <span>Showing {list.length} of {publications.length}</span>
          {filtered && (
            <button type="button" onClick={clear} className={cn("min-h-10 rounded-lg px-2 font-semibold text-[#105D1D] underline underline-offset-4 hover:bg-[#E8F5E9]", focus)}>Clear filters</button>
          )}
        </div>
        {list.map((p) => {
          const on = isSaved(p);
          return (
            <div key={p.title} className={cn(card, "p-4")}>
              <div className="flex items-start gap-3">
                <span className={cn(tile, "h-11 w-11")}><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold leading-snug text-[#0B1F10]">{p.title}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px]">
                    <span className="rounded-full bg-[#E8EEE5] px-2 py-0.5 text-gray-700">{p.type}</span>
                    <span className="text-gray-600">{p.size}</span>
                    {on && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2 py-0.5 font-semibold text-[#105D1D]">
                        <WifiOff className="h-3.5 w-3.5" aria-hidden="true" /> Saved offline
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSaved((s) => ({ ...s, [p.title]: !on }))}
                  className={on ? cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E8F5E9] px-4 text-[15px] font-bold text-[#105D1D] ring-1 ring-[#14892A]/25", focus) : goldBtn}
                >
                  {on ? <CheckCircle className="h-5 w-5" aria-hidden="true" /> : <Download className="h-5 w-5" aria-hidden="true" />}
                  {on ? "Downloaded" : "Download"}
                </button>
                <button type="button" className={outlineBtn}>Read</button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-base text-gray-700">No publications match these filters.</p>
            <button type="button" onClick={clear} className={cn(outlineBtn, "mt-4")}>Clear filters</button>
          </div>
        )}
      </Body>
    </div>
  );
}

/* ───────────────────────── PFA directory ───────────────────────── */

export function PfaScreen({ onBack }: { onBack: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const s = q.trim().toLowerCase();
  const list = operators.filter((o) => o.name.toLowerCase().includes(s) || o.address.toLowerCase().includes(s));
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar title="PFA Directory" onBack={onBack}>
        <SearchField id="app-pfa-search" label="Search by name or city" value={q} onChange={setQ} placeholder="For example, Abuja" />
      </Bar>
      <Body label="PFA list" className="space-y-3 p-4">
        <p className="text-sm text-gray-700">{list.length} administrators</p>
        {list.map((o, i) => {
          const isOpen = open === o.name;
          return (
            <div key={o.name} className={cn(card, "overflow-hidden", isOpen && "ring-2 ring-[#14892A]")}>
              <button type="button" aria-expanded={isOpen} aria-controls={`pfa-${i}`} onClick={() => setOpen(isOpen ? null : o.name)} className={cn("flex w-full items-start gap-3 p-4 text-left", focus)}>
                <span className={cn(tile, "h-10 w-10")}><Landmark className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-snug text-[#0B1F10]">{o.name}</span>
                  <span className="block text-sm text-gray-700">{o.address}</span>
                </span>
                <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-[#105D1D] transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`pfa-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="space-y-2 border-t border-black/5 px-4 pb-4 pt-3 text-[15px] text-gray-700">
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#105D1D]" aria-hidden="true" /> {o.phone}</p>
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#105D1D]" aria-hidden="true" /> {o.address}, Nigeria</p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a href={`tel:${o.phone.replace(/[^\d+]/g, "")}`} className={goldBtn}><Phone className="h-4 w-4" aria-hidden="true" /> Call</a>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.name}, ${o.address}, Nigeria`)}`} target="_blank" rel="noreferrer" className={outlineBtn}>
                          <MapPin className="h-4 w-4" aria-hidden="true" /> Directions
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {list.length === 0 && <p className="py-10 text-center text-base text-gray-700">No PFAs found.</p>}
      </Body>
    </div>
  );
}

/* ───────────────────────── Service guide ───────────────────────── */

export function GuideScreen({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar title="Service Guide" onBack={onBack} />
      <Body label="Service guides" className="space-y-3 p-4">
        {guides.map((g, i) => {
          const isOpen = open === i;
          return (
            <div key={g.service} className={cn(card, "overflow-hidden", isOpen && "ring-2 ring-[#14892A]")}>
              <button type="button" aria-expanded={isOpen} aria-controls={`guide-${i}`} onClick={() => setOpen(isOpen ? null : i)} className={cn("flex w-full items-center gap-3 p-4 text-left", focus)}>
                <span className={cn(tile, "h-10 w-10")}><g.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="flex-1 text-base font-bold text-[#0B1F10]">{g.service}</span>
                <ChevronDown className={cn("h-5 w-5 shrink-0 text-[#105D1D] transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`guide-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <ol className="relative space-y-3.5 border-t border-black/5 px-4 pb-4 pt-4">
                      <span aria-hidden="true" className="absolute bottom-7 left-[1.9rem] top-7 w-0.5 rounded-full bg-gradient-to-b from-[#14892A] to-[#CB9615]/60" />
                      {g.steps.map((step, si) => (
                        <li key={step} className="relative flex items-start gap-3">
                          <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#105D1D] text-[13px] font-bold text-[#F4D27A] ring-4 ring-white">{si + 1}</span>
                          <span className="pt-0.5 text-[15px] leading-snug text-gray-800">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Body>
    </div>
  );
}

/* ───────────────────────── Notifications ───────────────────────── */

const toneDot: Record<Tone, string> = { critical: "bg-[#B52026]", warning: "bg-[#CB9615]", info: "bg-[#14892A]", success: "bg-[#105D1D]" };
const toneLabel: Record<Tone, string> = { critical: "Important", warning: "Reminder", info: "Update", success: "Update" };

export function NotificationsScreen({ onBack, items, setItems }: { onBack: () => void; items: typeof seedNotifications; setItems: (f: (p: typeof seedNotifications) => typeof seedNotifications) => void }) {
  const unread = items.filter((n) => !n.read).length;
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar
        title="Notifications"
        onBack={onBack}
        action={
          <button type="button" disabled={unread === 0} onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))} className={cn("min-h-11 rounded-xl px-2 text-[15px] font-semibold text-[#105D1D] underline underline-offset-4 hover:bg-[#E8F5E9] disabled:text-gray-500 disabled:no-underline", focus)}>
            Mark all as read
          </button>
        }
      >
        <p className="mt-1 text-sm text-gray-700">{unread === 0 ? "You are all caught up." : `${unread} unread`}</p>
      </Bar>
      <Body label="Notification list" className="space-y-2.5 p-4">
        {items.map((n, i) => (
          <button
            key={n.title}
            type="button"
            onClick={() => setItems((p) => p.map((x, j) => (j === i ? { ...x, read: true } : x)))}
            className={cn(card, "flex w-full items-start gap-3 p-4 text-left transition", !n.read && "bg-[#E8F5E9]/70 ring-[#14892A]/30", focus)}
          >
            <span aria-hidden="true" className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full", n.read ? "bg-gray-300" : toneDot[n.type])} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-[#0B1F10]">{n.title}</span>
                {!n.read && <span className="rounded-full bg-[#105D1D] px-2 py-0.5 text-xs font-bold text-[#F4D27A]">New</span>}
              </span>
              <span className="mt-0.5 block text-[15px] leading-snug text-gray-700">{n.body}</span>
              <span className="mt-1 block text-[13px] text-gray-600">{toneLabel[n.type]} · {n.time}</span>
            </span>
          </button>
        ))}
      </Body>
    </div>
  );
}

/* ───────────────────────── Feedback ───────────────────────── */

export function FeedbackScreen({ onBack }: { onBack: () => void }) {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState("Complaint");
  const [file, setFile] = useState("");
  const types = ["Complaint", "Suggestion", "Inquiry", "Report Employer"];
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar title="Feedback and complaints" onBack={onBack} />
      <Body label="Feedback form" className="p-4">
        {sent ? (
          <div className="flex flex-col items-center py-12 text-center" role="status">
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9] ring-8 ring-[#E8F5E9]/50">
              <CheckCircle className="h-10 w-10 text-[#105D1D]" aria-hidden="true" />
            </motion.span>
            <h3 className="mt-5 text-[22px] font-bold text-[#0B1F10]">Sent</h3>
            <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-gray-700">Your feedback has been received. PenCom will respond within 14 working days.</p>
            <button type="button" onClick={() => { setSent(false); setFile(""); }} className={cn(outlineBtn, "mt-6")}>Send another</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <fieldset className={cn(card, "p-4")}>
              <legend className="sr-only">Type</legend>
              <p aria-hidden="true" className="text-[15px] font-bold text-[#0B1F10]">What is this about?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <label key={t} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-[15px] font-semibold ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", type === t ? "bg-[#105D1D] text-[#F4D27A] ring-[#105D1D]" : "bg-white text-[#105D1D] ring-[#14892A]/40 hover:bg-[#E8F5E9]")}>
                    <input type="radio" name="app-fb-type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={cn(card, "space-y-3.5 p-4")}>
              <div>
                <label htmlFor="app-fb-name" className="mb-1 block text-[15px] font-bold text-[#0B1F10]">Full name</label>
                <input id="app-fb-name" autoComplete="name" className={field} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="app-fb-pin" className="mb-1 block text-[15px] font-bold text-[#0B1F10]">RSA PIN <span className="font-normal text-gray-600">(optional)</span></label>
                <input id="app-fb-pin" className={field} placeholder="PENCOM-XXXXXXX" />
              </div>
              <div>
                <label htmlFor="app-fb-msg" className="mb-1 block text-[15px] font-bold text-[#0B1F10]">Describe the issue</label>
                <textarea id="app-fb-msg" rows={4} className={cn(field, "resize-none")} placeholder="Tell us what happened" />
              </div>
              <div>
                <span className="mb-1 block text-[15px] font-bold text-[#0B1F10]">Attach a file <span className="font-normal text-gray-600">(optional)</span></span>
                <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#14892A]/40 px-3 text-center text-[15px] font-semibold text-[#105D1D] transition hover:border-[#14892A] hover:bg-[#E8F5E9] has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]">
                  <Paperclip className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 truncate">{file || "Add a document or photo"}</span>
                  <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
                </label>
              </div>
            </div>
            <button type="submit" className={cn(goldBtn, "min-h-14 w-full text-base")}>
              <Send className="h-5 w-5" aria-hidden="true" /> Send {type === "Report Employer" ? "report" : "feedback"}
            </button>
          </form>
        )}
      </Body>
    </div>
  );
}

/* ───────────────────────── Accessibility ───────────────────────── */

function Switch({ icon: Icon, title, desc, on, onChange }: { icon: typeof Eye; title: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={cn(card, "flex w-full items-center gap-3 p-4 text-left transition", on && "ring-2 ring-[#14892A]", focus)}>
      <span className={cn(tile, "h-10 w-10")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-[#0B1F10]">{title}</span>
        <span className="block text-sm text-gray-700">{desc}</span>
      </span>
      <span className="flex shrink-0 flex-col items-center gap-1">
        <span aria-hidden="true" className={cn("relative h-7 w-12 rounded-full transition-colors", on ? "bg-[#14892A]" : "bg-gray-400")}>
          <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
        </span>
        <span aria-hidden="true" className={cn("text-xs font-bold", on ? "text-[#105D1D]" : "text-gray-600")}>{on ? "On" : "Off"}</span>
      </span>
    </button>
  );
}

export function AccessibilityScreen({ onBack, prefs, setPrefs }: { onBack: () => void; prefs: A11yPrefs; setPrefs: (p: A11yPrefs) => void }) {
  const set = (k: keyof A11yPrefs) => (v: boolean) => setPrefs({ ...prefs, [k]: v });
  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <Bar title="Accessibility" onBack={onBack} />
      <Body label="Accessibility settings" className="space-y-3 p-4">
        <div className={cn(card, "p-4")}>
          <div className="flex items-center gap-3">
            <span className={cn(tile, "h-10 w-10")}><Type className="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <label htmlFor="app-text-size" className="block text-base font-bold text-[#0B1F10]">Text size</label>
              <span className="block text-sm text-gray-700">Make words in the app bigger</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span aria-hidden="true" className="text-sm font-bold text-gray-600">A</span>
            <input id="app-text-size" type="range" min={14} max={24} value={prefs.textSize} onChange={(e) => setPrefs({ ...prefs, textSize: Number(e.target.value) })} aria-valuetext={`${prefs.textSize} pixels`} className="h-2 flex-1 cursor-pointer accent-[#14892A]" />
            <span aria-hidden="true" className="text-2xl font-bold text-gray-600">A</span>
          </div>
          <p className="mt-3 rounded-xl bg-[#E8EEE5] px-3 py-2.5 leading-snug text-[#0B1F10] transition-[font-size]" style={{ fontSize: prefs.textSize }}>
            Your pension, made clear.
          </p>
          <p className="mt-1.5 text-center text-[13px] text-gray-600">{prefs.textSize} px</p>
        </div>
        <Switch icon={Volume2} title="Screen reader" desc="Voice-over for all UI elements" on={prefs.screenReader} onChange={set("screenReader")} />
        <Switch icon={Eye} title="High contrast" desc="Increase visual contrast" on={prefs.highContrast} onChange={set("highContrast")} />
        <Switch icon={EyeOff} title="Reduce motion" desc="Turns off movement in this preview" on={prefs.reduceMotion} onChange={set("reduceMotion")} />
        <Switch icon={Send} title="Voice navigation" desc="Navigate using voice commands" on={prefs.voiceNav} onChange={set("voiceNav")} />
      </Body>
    </div>
  );
}

/* ───────────────────────── PenCom AI Assistant (RAG chat) ───────────────────────── */

export type ChatMsg = { id: string; role: "user" | "assistant"; content: string; source?: string; vote?: "up" | "down" };

export const chatWelcome: ChatMsg = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm PenCom's AI Digital Assistant. I can help you with questions about pension services, RSA transfers, the Contributory Pension Scheme, and more. How can I assist you today?",
};

export function ChatScreen({ onBack, messages, setMessages }: { onBack: () => void; messages: ChatMsg[]; setMessages: (f: (p: ChatMsg[]) => ChatMsg[]) => void }) {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    // Scroll only the conversation box (scrollIntoView would also scroll the page around the phone).
    if (messages.length === 1 && !typing) return;
    const box = endRef.current?.parentElement;
    box?.scrollTo({ top: box.scrollHeight, behavior: messages.length > 1 ? "smooth" : "auto" });
  }, [messages, typing]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || typing) return;
    setMessages((p) => [...p, { id: `u${Date.now()}`, role: "user", content: q }]);
    setInput("");
    setTyping(true);
    timer.current = window.setTimeout(() => {
      const hit = findAnswer(q);
      setMessages((p) => [...p, { id: `a${Date.now()}`, role: "assistant", content: hit ? hit.answer : fallbackAnswer, source: hit ? hit.source : "PenCom General Knowledge" }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };
  const vote = (id: string, v: "up" | "down") => setMessages((p) => p.map((m) => (m.id === id ? { ...m, vote: m.vote === v ? undefined : v } : m)));

  return (
    <div className="flex h-full flex-col bg-[#F2F6F0]">
      <div className="shrink-0 border-b border-black/10 bg-white px-4 pb-3 pt-2">
        <button type="button" onClick={onBack} className={cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold text-[#105D1D] hover:bg-[#E8F5E9]", focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back
        </button>
        <div className="mt-1 flex items-center gap-3">
          <span className={cn(tile, "h-11 w-11 rounded-2xl")}><Bot className="h-5 w-5" aria-hidden="true" /></span>
          <span>
            <h2 className="text-[20px] font-bold leading-tight tracking-tight text-[#0B1F10]">PenCom AI Assistant</h2>
            <span className="flex items-center gap-1 text-sm text-gray-700">
              <Sparkles className="h-3.5 w-3.5 text-[#7A5200]" aria-hidden="true" /> Answers from PenCom documents
            </span>
          </span>
        </div>
      </div>

      <Body label="Conversation" className="space-y-4 p-4" fab={false}>
        <div role="log" aria-live="polite" aria-relevant="additions" className="space-y-4">
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              {m.role === "assistant" && <span aria-hidden="true" className={cn(tile, "mt-0.5 h-8 w-8")}><Bot className="h-4 w-4" /></span>}
              <div className={cn("max-w-[84%] rounded-2xl px-3.5 py-3 text-[15px] leading-relaxed", m.role === "assistant" ? "rounded-tl-md bg-white text-[#0B1F10] ring-1 ring-black/10" : "rounded-tr-md bg-[#105D1D] text-white")}>
                <span className="sr-only">{m.role === "assistant" ? "Assistant: " : "You: "}</span>
                <p>{m.content}</p>
                {m.source && (
                  <div className="mt-2.5 space-y-2 border-t border-black/10 pt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[13px] font-semibold text-[#105D1D]">
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Source: {m.source}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["up", "down"] as const).map((v) => (
                        <button key={v} type="button" aria-pressed={m.vote === v} onClick={() => vote(m.id, v)} className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ring-1 transition", m.vote === v ? "bg-[#105D1D] text-[#F4D27A] ring-[#105D1D]" : "text-gray-700 ring-black/15 hover:bg-[#E8F5E9]", focus)}>
                          {v === "up" ? <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />}
                          {v === "up" ? "Helpful" : "Not helpful"}
                        </button>
                      ))}
                      {m.vote && <span className="text-[13px] text-gray-600">Thanks for telling us.</span>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <span aria-hidden="true" className={cn(tile, "mt-0.5 h-8 w-8")}><Bot className="h-4 w-4" /></span>
              <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-md bg-white px-3.5 py-3 text-sm text-gray-700 ring-1 ring-black/10">
                <span aria-hidden="true" className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-[#14892A]" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </span>
                Searching PenCom documents…
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && !typing && (
          <div className="pt-1">
            <h3 className="text-base font-bold text-[#0B1F10]">Try asking</h3>
            <div className="mt-2 flex flex-col gap-2">
              {suggestedPrompts.slice(0, 4).map((p) => (
                <button key={p} type="button" onClick={() => send(p)} className={cn("group flex min-h-12 items-center justify-between gap-2 rounded-2xl bg-white px-3.5 py-2 text-left text-[15px] text-[#0B1F10] ring-1 ring-[#14892A]/30 transition hover:bg-[#105D1D] hover:text-white", focus)}>
                  {p}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </Body>

      <form className="shrink-0 border-t border-black/10 bg-white p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <label htmlFor="app-chat-input" className="sr-only">Your question</label>
        <div className="flex items-center gap-2">
          <input id="app-chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question" autoComplete="off" className={cn(field, "min-h-12 min-w-0 flex-1 py-2")} />
          <button type="submit" disabled={!input.trim() || typing} className={cn(goldBtn, "shrink-0 px-3.5 disabled:cursor-not-allowed disabled:opacity-50")}>
            <Send className="h-4 w-4" aria-hidden="true" /> Send
          </button>
        </div>
        <p className="mt-1.5 text-center text-[13px] text-gray-600">For information only. Answers show their source.</p>
      </form>
    </div>
  );
}

/* ───────────────────────── Services (same journeys as the website's /services) ───────────────────────── */

const serviceIcon: Record<string, typeof Eye> = {
  "user-plus": UserPlus, transfer: ArrowRightLeft, retiree: HeartHandshake, store: Store, certificate: FileCheck, complaint: MessageSquare,
};

export function ServicesScreen({ onBack, go }: { onBack: () => void; go: (s: ScreenName) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const j = journeys.find((x) => x.id === sel);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => { boxRef.current?.querySelector<HTMLElement>("[tabindex='0']")?.scrollTo({ top: 0 }); }, [sel]);

  if (!j) {
    return (
      <div ref={boxRef} className="flex h-full flex-col bg-[#F2F6F0]">
        <Bar title="Services" onBack={onBack}>
          <p className="mt-1 text-[15px] text-gray-700">Choose a service to see who it is for, what you need and the steps.</p>
        </Bar>
        <Body label="Services list" className="space-y-3 p-4">
          {journeys.map((s) => {
            const Icon = serviceIcon[s.icon] ?? FileCheck;
            return (
              <button key={s.id} type="button" onClick={() => setSel(s.id)} className={cn(card, "group flex w-full items-start gap-3 p-4 text-left transition hover:ring-2 hover:ring-[#14892A]", focus)}>
                <span className={cn(tile, "h-11 w-11 transition-transform group-hover:-rotate-6")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold uppercase tracking-wider text-[#7A5200]">{s.audience}</span>
                  <span className="block text-base font-bold leading-snug text-[#0B1F10]">{s.short}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-gray-700">{s.forWho}</span>
                </span>
                <ChevronRight className="mt-6 h-5 w-5 shrink-0 text-[#105D1D] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            );
          })}
        </Body>
      </div>
    );
  }

  const Icon = serviceIcon[j.icon] ?? FileCheck;
  return (
    <div ref={boxRef} className="flex h-full flex-col bg-[#F2F6F0]">
      <div className="shrink-0 border-b border-black/10 bg-white px-4 pb-3 pt-2">
        <button type="button" onClick={() => setSel(null)} className={cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold text-[#105D1D] hover:bg-[#E8F5E9]", focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> All services
        </button>
        <div className="mt-1 flex items-center gap-3">
          <span className={cn(tile, "h-11 w-11")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className="text-[20px] font-bold leading-tight tracking-tight text-[#0B1F10]">{j.title}</h2>
        </div>
      </div>
      <Body label={j.short} className="space-y-4 p-4">
        <p className="text-[15px] leading-relaxed text-gray-800">{j.intro}</p>
        <dl className={cn(card, "divide-y divide-black/5 text-[15px]")}>
          {[
            { k: "Who it is for", v: j.forWho },
            { k: "Where", v: j.where },
            { k: "How long", v: j.standard ?? j.time },
          ].map((r) => (
            <div key={r.k} className="px-4 py-3">
              <dt className="text-[13px] font-bold uppercase tracking-wider text-[#7A5200]">{r.k}</dt>
              <dd className="mt-0.5 leading-snug text-[#0B1F10]">{r.v}</dd>
            </div>
          ))}
        </dl>
        {j.needs.length > 0 && (
          <div className={cn(card, "p-4")}>
            <h3 className="text-base font-bold text-[#0B1F10]">What you need</h3>
            <ul className="mt-2 space-y-2">
              {j.needs.map((n) => (
                <li key={n} className="flex items-start gap-2 text-[15px] leading-snug text-gray-800">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#14892A]" aria-hidden="true" /> {n}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={cn(card, "p-4")}>
          <h3 className="text-base font-bold text-[#0B1F10]">Steps</h3>
          <ol className="relative mt-3 space-y-4">
            <span aria-hidden="true" className="absolute bottom-3 left-[0.85rem] top-3 w-0.5 rounded-full bg-gradient-to-b from-[#14892A] to-[#CB9615]/60" />
            {j.steps.map((s, i) => (
              <li key={s.title} className="relative flex items-start gap-3">
                <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#105D1D] text-[13px] font-bold text-[#F4D27A] ring-4 ring-white">{i + 1}</span>
                <span>
                  <span className="block text-[15px] font-bold text-[#0B1F10]">{s.title}</span>
                  <span className="block text-sm leading-snug text-gray-700">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-2">
          <button type="button" onClick={() => go("chat")} className={goldBtn}>
            <Sparkles className="h-5 w-5" aria-hidden="true" /> Ask AI about this
          </button>
          <a href={`/services#${j.anchor}`} className={outlineBtn}>Full guide on the website</a>
        </div>
      </Body>
    </div>
  );
}
