"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import { sk } from "./skin";

/**
 * The screens inside the phone. This file is the same in every theme: colours, radii and flourishes come from
 * `./skin` (the theme's tokens). Labelled controls (words next to icons), 15–17 px text and large touch targets.
 */

export type A11yPrefs = { textSize: number; screenReader: boolean; highContrast: boolean; reduceMotion: boolean; voiceNav: boolean };

const card = sk.card;
const tile = sk.tile;
const goldBtn = sk.goldBtn;
const outlineBtn = sk.outlineBtn;
const field = cn(sk.field);

/** Scrolling body of a screen; focusable so keyboard users can scroll it. */
export function Body({ children, label, className, fab = true }: { children: ReactNode; label: string; className?: string; fab?: boolean }) {
  return (
    <div tabIndex={0} aria-label={label} className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-[#FFD84D]", className, fab && "pb-24")}>
      {children}
    </div>
  );
}

/** White top bar of an inner screen: a labelled Back button and the screen title. */
export function Bar({ title, onBack, action, children }: { title: string; onBack: () => void; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className={cn("shrink-0 px-4 pb-3 pt-2", sk.bar)}>
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={onBack} className={cn(cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold", sk.barBack), focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back
        </button>
        {action}
      </div>
      <h2 className={cn("mt-1 text-[22px] leading-tight tracking-tight", sk.barTitle)}>{title}</h2>
      {children}
    </div>
  );
}

function SearchField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className={cn("mb-1 block text-sm font-semibold", sk.barMuted)}>{label}</label>
      <div className="relative">
        <Search className={cn("pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2", sk.accent)} aria-hidden="true" />
        <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(field, "pl-11")} />
      </div>
    </div>
  );
}

/** Short-lived message at the bottom of a screen (download finished, feedback sent). */
export function Toast({ msg }: { msg: string }) {
  return (
    <div role="status" aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-[7.5rem] z-20 flex justify-center">
      <AnimatePresence>
        {msg && (
          <motion.p
            key={msg}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={cn("flex items-center gap-2 rounded-2xl px-4 py-3 text-[15px] font-semibold shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]", sk.toast)}
          >
            <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" /> {msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const id = window.setTimeout(() => setMsg(""), 2600);
    return () => window.clearTimeout(id);
  }, [msg]);
  return [msg, setMsg] as const;
}

/** Circular download progress (0–100). */
function Ring({ value }: { value: number }) {
  const r = 9, c = 2 * Math.PI * r;
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 -rotate-90">
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} className="transition-[stroke-dashoffset] duration-100" />
    </svg>
  );
}

/** List items rise in one after another when a screen opens. */
export const stagger = (i: number) => ({ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.32, delay: Math.min(i, 8) * 0.045, ease: [0.22, 1, 0.36, 1] as const } });

/** An answer that types itself out word by word (full text for screen readers, and at once under reduced motion). */
function Typewriter({ text, onTick }: { text: string; onTick?: () => void }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const [n, setN] = useState(reduce ? words.length : 0);
  useEffect(() => {
    if (n >= words.length) return;
    const id = window.setTimeout(() => { setN((x) => x + 1); onTick?.(); }, 28);
    return () => window.clearTimeout(id);
  }, [n, words.length, onTick]);
  return (
    <>
      <span aria-hidden="true">
        {words.slice(0, n).join(" ")}
        {n < words.length && <span className={cn("ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm", sk.solid)} />}
      </span>
      <span className="sr-only">{text}</span>
    </>
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
  const [busy, setBusy] = useState<Record<string, number>>({});
  const [toast, setToast] = useToast();
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearInterval(t)), []);
  const download = (title: string) => {
    let p = 0;
    const id = window.setInterval(() => {
      p += 10;
      setBusy((b) => ({ ...b, [title]: p }));
      if (p >= 100) {
        window.clearInterval(id);
        setBusy((b) => { const next = { ...b }; delete next[title]; return next; });
        setSaved((s) => ({ ...s, [title]: true }));
        setToast("Saved for offline reading");
      }
    }, 80);
    timers.current.push(id);
  };
  const isSaved = (p: (typeof publications)[number]) => saved[p.title] ?? p.downloaded;
  const term = q.trim().toLowerCase();
  const inKind = (p: (typeof publications)[number], k: string) => k === "all" || pubKinds.find((x) => x.id === k)!.types.includes(p.type);
  const matches = (p: (typeof publications)[number]) =>
    (!term || p.title.toLowerCase().includes(term) || p.type.toLowerCase().includes(term)) && (!offline || isSaved(p));
  const list = publications.filter((p) => matches(p) && inKind(p, kind));
  const filtered = term !== "" || kind !== "all" || offline;
  const clear = () => { setQ(""); setKind("all"); setOffline(false); };
  return (
    <div className={cn("relative flex h-full flex-col", sk.appBg)}>
      <Toast msg={toast} />
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
              <button key={k.id} type="button" aria-pressed={on} onClick={() => setKind(k.id)} className={cn("inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[15px] font-semibold ring-1 transition", on ? sk.chipOn : sk.chipOff, focus)}>
                {k.label}
                <span className={cn("rounded-full px-1.5 text-xs font-bold", on ? "bg-white/15 text-white" : cn("text-gray-700", sk.muted))}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" role="switch" aria-checked={offline} onClick={() => setOffline(!offline)} className={cn(cn("inline-flex min-h-11 items-center gap-2.5 rounded-xl text-[15px] font-semibold", sk.ink), focus)}>
            <span aria-hidden="true" className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", offline ? sk.solid : "bg-gray-400")}>
              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", offline ? "left-[18px]" : "left-0.5")} />
            </span>
            <WifiOff className={cn("h-4 w-4", sk.accent)} aria-hidden="true" /> Saved offline only
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm text-gray-700" aria-live="polite">
          <span>Showing {list.length} of {publications.length}</span>
          {filtered && (
            <button type="button" onClick={clear} className={cn(cn("min-h-10 rounded-lg px-2 font-semibold underline underline-offset-4", sk.hoverSoft, sk.accent), focus)}>Clear filters</button>
          )}
        </div>
        {list.map((p, i) => {
          const on = isSaved(p);
          const pct = busy[p.title];
          return (
            <motion.div key={p.title} {...stagger(i)} className={cn(card, "p-4")}>
              <div className="flex items-start gap-3">
                <span className={cn(tile, "h-11 w-11")}><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-base font-bold leading-snug", sk.ink)}>{p.title}</p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[13px]">
                    <span className={cn("rounded-full px-2 py-0.5 text-gray-700", sk.muted)}>{p.type}</span>
                    <span className="text-gray-600">{p.size}</span>
                    {on && (
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold", sk.softColors)}>
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
                  aria-busy={pct != null}
                  disabled={pct != null}
                  onClick={() => (on ? setSaved((s) => ({ ...s, [p.title]: false })) : download(p.title))}
                  className={cn(on || pct != null ? sk.savedBtn : goldBtn, "relative overflow-hidden")}
                >
                  {pct != null && <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 opacity-20 transition-[width] duration-100", sk.solid)} style={{ width: `${pct}%` }} />}
                  {pct != null ? <Ring value={pct} /> : on ? <CheckCircle className="h-5 w-5" aria-hidden="true" /> : <Download className="h-5 w-5" aria-hidden="true" />}
                  {pct != null ? `Downloading ${pct}%` : on ? "Downloaded" : "Download"}
                </button>
                <button type="button" className={outlineBtn}>Read</button>
              </div>
            </motion.div>
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
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <Bar title="PFA Directory" onBack={onBack}>
        <SearchField id="app-pfa-search" label="Search by name or city" value={q} onChange={setQ} placeholder="For example, Abuja" />
      </Bar>
      <Body label="PFA list" className="space-y-3 p-4">
        <p className="text-sm text-gray-700">{list.length} administrators</p>
        {list.map((o, i) => {
          const isOpen = open === o.name;
          return (
            <motion.div key={o.name} {...stagger(i)} className={cn(card, "overflow-hidden", isOpen && sk.cardOn)}>
              <button type="button" aria-expanded={isOpen} aria-controls={`pfa-${i}`} onClick={() => setOpen(isOpen ? null : o.name)} className={cn("flex w-full items-start gap-3 p-4 text-left", focus)}>
                <span className={cn(tile, "h-10 w-10")}><Landmark className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-base font-bold leading-snug", sk.ink)}>{o.name}</span>
                  <span className="block text-sm text-gray-700">{o.address}</span>
                </span>
                <ChevronDown className={cn(cn("mt-1 h-5 w-5 shrink-0 transition-transform", sk.accent), isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`pfa-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="space-y-2 border-t border-black/5 px-4 pb-4 pt-3 text-[15px] text-gray-700">
                      <p className="flex items-center gap-2"><Phone className={cn("h-4 w-4", sk.accent)} aria-hidden="true" /> {o.phone}</p>
                      <p className="flex items-center gap-2"><MapPin className={cn("h-4 w-4", sk.accent)} aria-hidden="true" /> {o.address}, Nigeria</p>
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
            </motion.div>
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
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <Bar title="Service Guide" onBack={onBack} />
      <Body label="Service guides" className="space-y-3 p-4">
        {guides.map((g, i) => {
          const isOpen = open === i;
          return (
            <motion.div key={g.service} {...stagger(i)} className={cn(card, "overflow-hidden", isOpen && sk.cardOn)}>
              <button type="button" aria-expanded={isOpen} aria-controls={`guide-${i}`} onClick={() => setOpen(isOpen ? null : i)} className={cn("flex w-full items-center gap-3 p-4 text-left", focus)}>
                <span className={cn(tile, "h-10 w-10")}><g.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className={cn("flex-1 text-base font-bold", sk.ink)}>{g.service}</span>
                <ChevronDown className={cn(cn("h-5 w-5 shrink-0 transition-transform", sk.accent), isOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`guide-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <ol className="relative space-y-3.5 border-t border-black/5 px-4 pb-4 pt-4">
                      <span aria-hidden="true" className={cn("absolute bottom-7 left-[1.9rem] top-7 w-0.5 rounded-full", sk.stepLine)} />
                      {g.steps.map((step, si) => (
                        <li key={step} className="relative flex items-start gap-3">
                          <span className={cn("z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold", sk.stepDot)}>{si + 1}</span>
                          <span className="pt-0.5 text-[15px] leading-snug text-gray-800">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </Body>
    </div>
  );
}

/* ───────────────────────── Notifications ───────────────────────── */

const toneDot: Record<Tone, string> = { critical: "bg-[#B52026]", warning: "bg-[#CB9615]", info: sk.solid, success: sk.solid };
const toneLabel: Record<Tone, string> = { critical: "Important", warning: "Reminder", info: "Update", success: "Update" };

export function NotificationsScreen({ onBack, items, setItems }: { onBack: () => void; items: typeof seedNotifications; setItems: (f: (p: typeof seedNotifications) => typeof seedNotifications) => void }) {
  const unread = items.filter((n) => !n.read).length;
  return (
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <Bar
        title="Notifications"
        onBack={onBack}
        action={
          <button type="button" disabled={unread === 0} onClick={() => setItems((p) => p.map((n) => ({ ...n, read: true })))} className={cn(cn("min-h-11 rounded-xl px-2 text-[15px] font-semibold underline underline-offset-4 disabled:text-gray-500 disabled:no-underline", sk.barBack), focus)}>
            Mark all as read
          </button>
        }
      >
        <p className={cn("mt-1 text-sm", sk.barMuted)}>{unread === 0 ? "You are all caught up." : `${unread} unread. Tap or swipe a notice to mark it as read.`}</p>
      </Bar>
      <Body label="Notification list" className="space-y-2.5 p-4">
        {items.map((n, i) => (
          <motion.div key={n.title} {...stagger(i)} className="relative">
          <span aria-hidden="true" className={cn(card, "absolute inset-0 flex items-center justify-between px-5 text-sm font-bold ring-0", sk.softColors)}>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Read</span>
            <span className="flex items-center gap-1.5">Read <CheckCircle className="h-4 w-4" /></span>
          </span>
          <motion.button
            type="button"
            drag={n.read ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.55}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) setItems((p) => p.map((x, j) => (j === i ? { ...x, read: true } : x))); }}
            onClick={() => setItems((p) => p.map((x, j) => (j === i ? { ...x, read: true } : x)))}
            className={cn(card, "relative flex w-full touch-pan-y items-start gap-3 overflow-hidden p-4 text-left transition-colors", sk.notice === "bar" && "pl-5", !n.read ? sk.unread : "bg-white", focus)}
          >
            {sk.notice === "bar" ? (
              <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", n.read ? "bg-gray-300" : toneDot[n.type])} />
            ) : (
              <span aria-hidden="true" className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full", n.read ? "bg-gray-300" : toneDot[n.type])} />
            )}
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className={cn("text-base font-bold", sk.ink)}>{n.title}</span>
                {!n.read && <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", sk.newBadge)}>New</span>}
              </span>
              <span className="mt-0.5 block text-[15px] leading-snug text-gray-700">{n.body}</span>
              <span className="mt-1 block text-[13px] text-gray-600">{toneLabel[n.type]} · {n.time}</span>
            </span>
          </motion.button>
          </motion.div>
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
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <Bar title="Feedback and complaints" onBack={onBack} />
      <Body label="Feedback form" className="p-4">
        {sent ? (
          <div className="flex flex-col items-center py-12 text-center" role="status">
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className={cn("flex h-20 w-20 items-center justify-center rounded-full", sk.success)}>
              <CheckCircle className={cn("h-10 w-10", sk.accent)} aria-hidden="true" />
            </motion.span>
            <h3 className={cn("mt-5 text-[22px]", sk.barTitle)}>Sent</h3>
            <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-gray-700">Your feedback has been received. PenCom will respond within 14 working days.</p>
            <button type="button" onClick={() => { setSent(false); setFile(""); }} className={cn(outlineBtn, "mt-6")}>Send another</button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <fieldset className={cn(card, "p-4")}>
              <legend className="sr-only">Type</legend>
              <p aria-hidden="true" className={cn("text-[15px] font-bold", sk.ink)}>What is this about?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {types.map((t) => (
                  <label key={t} className={cn("flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-2 text-center text-[15px] font-semibold ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", type === t ? sk.chipOn : sk.chipOff)}>
                    <input type="radio" name="app-fb-type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className={cn(card, "space-y-3.5 p-4")}>
              <div>
                <label htmlFor="app-fb-name" className={cn("mb-1 block text-[15px] font-bold", sk.ink)}>Full name</label>
                <input id="app-fb-name" autoComplete="name" className={field} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="app-fb-pin" className={cn("mb-1 block text-[15px] font-bold", sk.ink)}>RSA PIN <span className="font-normal text-gray-600">(optional)</span></label>
                <input id="app-fb-pin" className={field} placeholder="PENCOM-XXXXXXX" />
              </div>
              <div>
                <label htmlFor="app-fb-msg" className={cn("mb-1 block text-[15px] font-bold", sk.ink)}>Describe the issue</label>
                <textarea id="app-fb-msg" rows={4} className={cn(field, "resize-none")} placeholder="Tell us what happened" />
              </div>
              <div>
                <span className={cn("mb-1 block text-[15px] font-bold", sk.ink)}>Attach a file <span className="font-normal text-gray-600">(optional)</span></span>
                <label className={cn("flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 text-center text-[15px] font-semibold transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]", sk.dashed)}>
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
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={cn(card, "flex w-full items-center gap-3 p-4 text-left transition", on && sk.cardOn, focus)}>
      <span className={cn(tile, "h-10 w-10")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-base font-bold", sk.ink)}>{title}</span>
        <span className="block text-sm text-gray-700">{desc}</span>
      </span>
      <span className="flex shrink-0 flex-col items-center gap-1">
        <span aria-hidden="true" className={cn("relative h-7 w-12 rounded-full transition-colors", on ? sk.solid : "bg-gray-400")}>
          <span className={cn("absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all", on ? "left-[22px]" : "left-0.5")} />
        </span>
        <span aria-hidden="true" className={cn("text-xs font-bold", on ? sk.accent : "text-gray-600")}>{on ? "On" : "Off"}</span>
      </span>
    </button>
  );
}

export function AccessibilityScreen({ onBack, prefs, setPrefs }: { onBack: () => void; prefs: A11yPrefs; setPrefs: (p: A11yPrefs) => void }) {
  const set = (k: keyof A11yPrefs) => (v: boolean) => setPrefs({ ...prefs, [k]: v });
  return (
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <Bar title="Accessibility" onBack={onBack} />
      <Body label="Accessibility settings" className="space-y-3 p-4">
        <div className={cn(card, "p-4")}>
          <div className="flex items-center gap-3">
            <span className={cn(tile, "h-10 w-10")}><Type className="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <label htmlFor="app-text-size" className={cn("block text-base font-bold", sk.ink)}>Text size</label>
              <span className="block text-sm text-gray-700">Make words in the app bigger</span>
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span aria-hidden="true" className="text-sm font-bold text-gray-600">A</span>
            <input id="app-text-size" type="range" min={14} max={24} value={prefs.textSize} onChange={(e) => setPrefs({ ...prefs, textSize: Number(e.target.value) })} aria-valuetext={`${prefs.textSize} pixels`} className={cn("h-2 flex-1 cursor-pointer", sk.range)} />
            <span aria-hidden="true" className="text-2xl font-bold text-gray-600">A</span>
          </div>
          <p className={cn("mt-3 rounded-xl px-3 py-2.5 leading-snug transition-[font-size]", sk.ink, sk.muted)} style={{ fontSize: prefs.textSize }}>
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
      const id = `a${Date.now()}`;
      setStreamId(id);
      setMessages((p) => [...p, { id, role: "assistant", content: hit ? hit.answer : fallbackAnswer, source: hit ? hit.source : "PenCom General Knowledge" }]);
      setTyping(false);
    }, 900 + Math.random() * 600);
  };
  // The newest answer types itself out; older ones (and the welcome) show in full.
  const [streamId, setStreamId] = useState<string | null>(null);
  const keepDown = useCallback(() => { const box = endRef.current?.parentElement; box?.scrollTo({ top: box.scrollHeight }); }, []);
  const vote = (id: string, v: "up" | "down") => setMessages((p) => p.map((m) => (m.id === id ? { ...m, vote: m.vote === v ? undefined : v } : m)));

  return (
    <div className={cn("flex h-full flex-col", sk.appBg)}>
      <div className={cn("shrink-0 px-4 pb-3 pt-2", sk.bar)}>
        <button type="button" onClick={onBack} className={cn(cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold", sk.barBack), focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Back
        </button>
        <div className="mt-1 flex items-center gap-3">
          <span className={cn(tile, "h-11 w-11 rounded-2xl")}><Bot className="h-5 w-5" aria-hidden="true" /></span>
          <span>
            <h2 className={cn("text-[20px] leading-tight tracking-tight", sk.barTitle)}>PenCom AI Assistant</h2>
            <span className={cn("flex items-center gap-1 text-sm", sk.barMuted)}>
              <Sparkles className={cn("h-3.5 w-3.5", sk.eyebrow)} aria-hidden="true" /> Answers from PenCom documents
            </span>
          </span>
        </div>
      </div>

      <Body label="Conversation" className="space-y-4 p-4" fab={false}>
        <div role="log" aria-live="polite" aria-relevant="additions" className="space-y-4">
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              {m.role === "assistant" && <span aria-hidden="true" className={cn(tile, "mt-0.5 h-8 w-8")}><Bot className="h-4 w-4" /></span>}
              <div className={cn("max-w-[84%] rounded-2xl px-3.5 py-3 text-[15px] leading-relaxed", m.role === "assistant" ? sk.bubbleBot : sk.bubbleUser)}>
                <span className="sr-only">{m.role === "assistant" ? "Assistant: " : "You: "}</span>
                <p>{m.id === streamId ? <Typewriter text={m.content} onTick={keepDown} /> : m.content}</p>
                {m.source && (
                  <div className="mt-2.5 space-y-2 border-t border-black/10 pt-2.5">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold", sk.softColors)}>
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Source: {m.source}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["up", "down"] as const).map((v) => (
                        <button key={v} type="button" aria-pressed={m.vote === v} onClick={() => vote(m.id, v)} className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ring-1 transition", m.vote === v ? sk.chipOn : cn("text-gray-700 ring-black/15", sk.hoverSoft), focus)}>
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
              <div className={cn("flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-sm text-gray-700", sk.bubbleBot)}>
                <span aria-hidden="true" className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className={cn("h-2 w-2 rounded-full", sk.solid)} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </span>
                Searching PenCom documents…
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && !typing && (
          <div className="pt-1">
            <h3 className={cn("text-base font-bold", sk.ink)}>Try asking</h3>
            <div className="mt-2 flex flex-col gap-2">
              {suggestedPrompts.slice(0, 4).map((p) => (
                <button key={p} type="button" onClick={() => send(p)} className={cn("group flex min-h-12 items-center justify-between gap-2 rounded-2xl px-3.5 py-2 text-left text-[15px] transition", sk.promptBtn, focus)}>
                  {p}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </Body>

      <form className={cn("shrink-0 p-3", sk.composer)} onSubmit={(e) => { e.preventDefault(); send(); }}>
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
      <div ref={boxRef} className={cn("flex h-full flex-col", sk.appBg)}>
        <Bar title="Services" onBack={onBack}>
          <p className={cn("mt-1 text-[15px]", sk.barMuted)}>Choose a service to see who it is for, what you need and the steps.</p>
        </Bar>
        <Body label="Services list" className="space-y-3 p-4">
          {journeys.map((s, i) => {
            const Icon = serviceIcon[s.icon] ?? FileCheck;
            return (
              <motion.button key={s.id} {...stagger(i)} type="button" onClick={() => setSel(s.id)} className={cn(card, cn("group flex w-full items-start gap-3 p-4 text-left transition", sk.cardHover), focus)}>
                <span className={cn(tile, "h-11 w-11", sk.tileHover)}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[13px] font-bold uppercase tracking-wider", sk.eyebrow)}>{s.audience}</span>
                  <span className={cn("block text-base font-bold leading-snug", sk.ink)}>{s.short}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-gray-700">{s.forWho}</span>
                </span>
                <ChevronRight className={cn("mt-6 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1", sk.accent)} aria-hidden="true" />
              </motion.button>
            );
          })}
        </Body>
      </div>
    );
  }

  const Icon = serviceIcon[j.icon] ?? FileCheck;
  return (
    <div ref={boxRef} className={cn("flex h-full flex-col", sk.appBg)}>
      <div className={cn("shrink-0 px-4 pb-3 pt-2", sk.bar)}>
        <button type="button" onClick={() => setSel(null)} className={cn(cn("-ml-2 inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-[15px] font-semibold", sk.barBack), focus)}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" /> All services
        </button>
        <div className="mt-1 flex items-center gap-3">
          <span className={cn(tile, "h-11 w-11")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
          <h2 className={cn("text-[20px] leading-tight tracking-tight", sk.barTitle)}>{j.title}</h2>
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
              <dt className={cn("text-[13px] font-bold uppercase tracking-wider", sk.eyebrow)}>{r.k}</dt>
              <dd className={cn("mt-0.5 leading-snug", sk.ink)}>{r.v}</dd>
            </div>
          ))}
        </dl>
        {j.needs.length > 0 && (
          <div className={cn(card, "p-4")}>
            <h3 className={cn("text-base font-bold", sk.ink)}>What you need</h3>
            <ul className="mt-2 space-y-2">
              {j.needs.map((n) => (
                <li key={n} className="flex items-start gap-2 text-[15px] leading-snug text-gray-800">
                  <CheckCircle className={cn("mt-0.5 h-4 w-4 shrink-0", sk.check)} aria-hidden="true" /> {n}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={cn(card, "p-4")}>
          <h3 className={cn("text-base font-bold", sk.ink)}>Steps</h3>
          <ol className="relative mt-3 space-y-4">
            <span aria-hidden="true" className={cn("absolute bottom-3 left-[0.85rem] top-3 w-0.5 rounded-full", sk.stepLine)} />
            {j.steps.map((s, i) => (
              <li key={s.title} className="relative flex items-start gap-3">
                <span className={cn("z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold", sk.stepDot)}>{i + 1}</span>
                <span>
                  <span className={cn("block text-[15px] font-bold", sk.ink)}>{s.title}</span>
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
