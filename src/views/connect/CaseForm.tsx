"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, Copy, Landmark, Lock, MessageSquareWarning, Paperclip, Send, ShieldCheck, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { darkCard, glowLight } from "@/views/docs/kit";
import { ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { operators } from "@/views/operators/data";
import { topics, type TopicId } from "./data";

/**
 * Complaint, enquiry and employer report form (brief §7: minimal fields, consent, file upload, inline errors,
 * error summary at the top, confirmation with a case reference). Front-end only in this prototype: the case is
 * kept in this browser so the tracker below can find it.
 *
 * Showcase look: the form floats in a white card with a gold-to-green edge and a pointer spotlight; the steps are a
 * pill bar whose ink pill slides to the current step; topic cards turn ink when chosen; the confirmation shows the
 * reference on a dark spotlight card. Steps swap on `y` (never `x`).
 */

type Values = { name: string; email: string; phone: string; pin: string; pfa: string; employer: string; employerAddress: string; months: string; message: string; consent: boolean };
const empty: Values = { name: "", email: "", phone: "", pin: "", pfa: "", employer: "", employerAddress: "", months: "", message: "", consent: false };

export type SavedCase = { ref: string; topic: TopicId; date: string };
export const CASES_KEY = "pencom:cases";
export function loadCases(): SavedCase[] {
  try {
    return JSON.parse(localStorage.getItem(CASES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

const response: Record<TopicId, string> = {
  enquiry: "We aim to reply within 48 hours.",
  pfa: "We aim to resolve complaints within 14 working days.",
  employer: "We will review your report and follow it up with the employer.",
  pencom: "We aim to resolve complaints within 14 working days.",
};

/** Same icons as the hero's action cards on this page. */
const topicIcon: Record<TopicId, LucideIcon> = { enquiry: Send, pfa: MessageSquareWarning, employer: Building2, pencom: Landmark };

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-[#0B1F10]">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-xs text-gray-600">{hint}</p>}
      <div className="mt-2">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#B52026]">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Input edge #7D8A80 is 3.6:1 on white (WCAG 1.4.11); focus turns it green with a soft green halo. */
const inputCls = (err?: string) =>
  cn(
    "min-h-12 w-full rounded-2xl border bg-white px-4 text-base text-[#0B1F10] shadow-[0_1px_0_rgba(4,20,10,0.04)] transition placeholder:text-gray-500 hover:border-[#0B1F10]/60 focus:outline-none focus:ring-4",
    err ? "border-[#B52026] focus:ring-[#B52026]/20" : "border-[#7D8A80] focus:border-[#117F21] focus:ring-[#117F21]/20",
  );

const pillBtn = "inline-flex min-h-12 items-center gap-2 rounded-full font-semibold transition";

export default function CaseForm({ topic, setTopic, onSubmitted }: { topic: TopicId; setTopic: (t: TopicId) => void; onSubmitted: (ref: string) => void }) {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "file", string>>>({});
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  /* Focus the confirmation when it mounts (with mode="wait" it mounts after the last step's exit animation). */
  const doneRef = useCallback((el: HTMLDivElement | null) => el?.focus(), []);
  const uid = useId();
  const reduce = useReducedMotion();
  const set = (k: keyof Values, val: string | boolean) => setV((x) => ({ ...x, [k]: val }));
  const t = topics.find((x) => x.id === topic)!;
  const TopicIcon = topicIcon[topic];

  const validate = (s: number) => {
    const e: typeof errors = {};
    if (s === 1) {
      if (!v.name.trim()) e.name = "Enter your full name";
      if (!v.email.trim() && !v.phone.trim()) e.email = "Enter an email address or a phone number so we can reply";
      if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter an email address like name@example.com";
      if (v.phone && !/^\+?[\d\s-]{10,16}$/.test(v.phone)) e.phone = "Enter a phone number like 0803 123 4567";
      if (v.pin && !/^PEN\d{12}$/i.test(v.pin.replace(/\s/g, ""))) e.pin = "An RSA PIN is PEN followed by 12 numbers";
      if (topic === "pfa" && !v.pfa) e.pfa = "Choose the PFA your complaint is about";
      if (topic === "employer" && !v.employer.trim()) e.employer = "Enter the employer’s name";
      if (v.message.trim().length < 20) e.message = "Tell us a little more (at least 20 characters)";
      if (file && file.size > 5 * 1024 * 1024) e.file = "The file must be smaller than 5 MB";
    }
    if (s === 2 && !v.consent) e.consent = "Tick the box to agree before you send";
    setErrors(e);
    if (Object.keys(e).length) window.setTimeout(() => summaryRef.current?.focus(), 30);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 || validate(step)) setStep((s) => s + 1);
  };

  const submit = () => {
    if (!validate(2)) return;
    const ref = `PC-${new Date().getFullYear().toString().slice(2)}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    try {
      localStorage.setItem(CASES_KEY, JSON.stringify([{ ref, topic, date: new Date().toISOString() }, ...loadCases()].slice(0, 10)));
    } catch {
      /* storage unavailable: the reference is still shown */
    }
    setDone(ref);
    onSubmitted(ref);
  };

  const reset = () => {
    setDone(null);
    setStep(0);
    setV(empty);
    setFile(null);
    setErrors({});
  };

  const errorList = Object.entries(errors).filter(([, m]) => m) as [string, string][];
  const steps = ["What it’s about", "Your details", "Check and send"];
  const swap = { initial: { opacity: 0, y: reduce ? 0 : 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: reduce ? 0 : -12 }, transition: { duration: 0.32, ease } };

  return (
    <section id="contact" aria-labelledby="form-title" className={cn("relative bg-[#F2F6F0]", sectionCls)}>
      <span id="report" className="block scroll-mt-[170px]" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[180px]">
            <SectionHeading stacked id="form-title" eyebrow="Contact us" title="Send us a message" highlight="message" intro="Three short steps. We only ask for what we need to help you." />
            {/* Reassurances on a dark spotlight card */}
            <ul onMouseMove={spot} className={cn("mt-8 space-y-4 rounded-[1.75rem] p-6 text-sm text-white/85 shadow-[0_30px_60px_-30px_rgba(4,20,10,0.6)]", darkCard)}>
              {[
                [Lock, "Never send your password, BVN or bank details."],
                [ShieldCheck, "Your details are used only to handle your case, under the Nigeria Data Protection Act 2023."],
                [CheckCircle2, "You get a case reference to track progress."],
              ].map(([Icon, text]) => {
                const I = Icon as LucideIcon;
                return (
                  <li key={text as string} className="flex gap-3">
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15"><I className="h-4 w-4" /></span>
                    <span className="pt-1.5">{text as string}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8">
          {/* Card with a thin gold-to-green edge and a pointer spotlight */}
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-px rounded-[calc(1.75rem+1px)] bg-gradient-to-br from-[#CB9615]/60 via-black/5 to-[#117F21]/60" />
            <div onMouseMove={spot} className={cn("relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-50px_rgba(4,20,10,0.55)]", glowLight)}>
              {/* Progress: pill bar; the ink pill slides to the current step */}
              {!done && (
                <div className="border-b border-black/10 bg-[#F2F6F0]/60 p-2 sm:p-3">
                  <ol className="grid grid-cols-3 gap-1.5" aria-label="Progress">
                    {steps.map((s, i) => (
                      <li key={s} aria-current={i === step ? "step" : undefined} className="relative">
                        {i === step && <motion.span layoutId={`${uid}-step`} aria-hidden="true" className="absolute inset-0 rounded-full bg-[#0B1F10] shadow-[0_12px_30px_-14px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                        <span className={cn("relative flex min-h-11 items-center justify-center gap-2 rounded-full px-2 text-xs font-semibold sm:justify-start sm:px-3 sm:text-sm", i === step ? "text-white" : i < step ? "text-[#0A4A13]" : "text-gray-600")}>
                          <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold tabular-nums transition", i < step ? "bg-[#117F21] text-white" : i === step ? "bg-[#F4D27A] text-[#1A1206]" : "bg-white text-gray-600 ring-1 ring-black/10")}>
                            {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : `0${i + 1}`}
                          </span>
                          <span className="hidden truncate sm:inline">{s}</span>
                          <span className="sr-only sm:hidden">{s}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                  <div aria-hidden="true" className="mx-2 mt-2 h-[3px] overflow-hidden rounded-full bg-black/5">
                    <motion.span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" initial={false} animate={{ scaleX: (step + 1) / steps.length }} transition={{ duration: 0.5, ease }} />
                  </div>
                </div>
              )}

              <div className="p-5 sm:p-9">
                {/* Error summary */}
                {errorList.length > 0 && !done && (
                  <div ref={summaryRef} tabIndex={-1} role="alert" aria-labelledby={`${uid}-errs`} className="mb-6 rounded-3xl border-2 border-[#B52026] bg-[#FDF3F3] p-5 focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
                    <p id={`${uid}-errs`} className="flex items-center gap-2 font-bold text-[#8E1A1E]"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />There {errorList.length === 1 ? "is a problem" : `are ${errorList.length} problems`}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-12 text-sm">
                      {errorList.map(([k, m]) => (
                        <li key={k}><a href={`#${uid}-${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(`${uid}-${k}`)?.focus(); }} className="font-medium text-[#B52026] underline underline-offset-2">{m}</a></li>
                      ))}
                    </ul>
                  </div>
                )}

                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.div key="done" ref={doneRef} tabIndex={-1} initial={{ opacity: 0, y: reduce ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} aria-labelledby={`${uid}-done`} className="py-4 text-center focus:outline-none">
                      <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
                        {!reduce && [0, 1].map((r) => (
                          <motion.span key={r} aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-[#CB9615]" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.4, delay: 0.25 + r * 0.35, ease: "easeOut" }} />
                        ))}
                        <motion.span initial={{ scale: reduce ? 1 : 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#117F21] to-[#0A4A13] text-[#F4D27A] shadow-[0_20px_40px_-16px_rgba(10,74,19,0.8)]">
                          <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
                        </motion.span>
                      </span>
                      <h3 id={`${uid}-done`} className="mt-6 text-2xl font-black tracking-tight text-[#0B1F10] sm:text-3xl">We’ve received your {topic === "enquiry" ? "enquiry" : topic === "employer" ? "report" : "complaint"}</h3>
                      <p className="mt-2 text-gray-700">{response[topic]}</p>
                      <div onMouseMove={spot} className={cn("mx-auto mt-6 flex max-w-sm items-center justify-between gap-3 rounded-3xl px-5 py-4 text-left text-white ring-1 ring-[#F4D27A]/30 shadow-[0_30px_60px_-30px_rgba(4,20,10,0.7)]", darkCard)}>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/75">Your case reference</span>
                          <span className="block break-all font-mono text-2xl font-bold text-[#F4D27A]">{done}</span>
                        </span>
                        <button type="button" onClick={() => { navigator.clipboard?.writeText(done); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }} className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-[#F4D27A] hover:text-[#1A1206]", focus)} aria-label="Copy reference">
                          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                      <p className="sr-only" aria-live="polite">{copied ? "Reference copied" : ""}</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button type="button" onClick={() => document.getElementById("track")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" })} className={cn(pillBtn, "group bg-[#0B1F10] py-1.5 pl-5 pr-1.5 text-white hover:bg-[#117F21]", focus)}>
                          Track this case
                          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:-rotate-45"><ArrowRight className="h-4 w-4" /></span>
                        </button>
                        <button type="button" onClick={reset} className={cn(pillBtn, "bg-white px-5 text-[#0B1F10] ring-1 ring-black/15 hover:ring-[#0B1F10]/50", focus)}>Send another</button>
                      </div>
                      <p className="mt-6 text-xs text-gray-600">Prototype: nothing is sent to PenCom yet. The reference is saved in this browser so you can try the tracker.</p>
                    </motion.div>
                  ) : step === 0 ? (
                    <motion.fieldset key="s0" {...swap}>
                      <legend className="text-xl font-black tracking-tight text-[#0B1F10] sm:text-2xl">What is your message about?</legend>
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {topics.map((x) => {
                          const on = topic === x.id;
                          const Icon = topicIcon[x.id];
                          return (
                            <label
                              key={x.id}
                              onMouseMove={spot}
                              className={cn(
                                "group relative flex cursor-pointer flex-col rounded-3xl p-5 ring-1 transition duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FFD84D]",
                                on ? cn(darkCard, "text-white ring-[#0B1F10] shadow-[0_30px_60px_-30px_rgba(4,20,10,0.7)]") : cn("bg-white ring-black/10 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]", glowLight),
                              )}
                            >
                              <input type="radio" name={`${uid}-topic`} value={x.id} checked={on} onChange={() => setTopic(x.id)} className="sr-only" />
                              <span className="flex items-start justify-between gap-3">
                                <span aria-hidden="true" className={cn("flex h-11 w-11 items-center justify-center rounded-2xl transition", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-[#0B1F10] text-[#F4D27A]")}>
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span aria-hidden="true" className={cn("flex h-6 w-6 items-center justify-center rounded-full border-2 transition", on ? "border-[#F4D27A] bg-[#F4D27A] text-[#1A1206]" : "border-[#7D8A80]")}>
                                  {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                                </span>
                              </span>
                              <span className={cn("mt-4 font-bold", on ? "text-white" : "text-[#0B1F10]")}>{x.label}</span>
                              <span className={cn("mt-1 text-sm", on ? "text-white/80" : "text-gray-600")}>{x.body}</span>
                            </label>
                          );
                        })}
                      </div>
                      {topic === "pfa" && <p className="mt-4 rounded-2xl border-l-4 border-[#CB9615] bg-[#FFF8E1] p-4 text-sm text-[#5C4300]">Have you complained to your PFA first? PenCom steps in when a PFA hasn’t resolved it.</p>}
                    </motion.fieldset>
                  ) : step === 1 ? (
                    <motion.div key="s1" {...swap} className="space-y-5">
                      <p className="inline-flex items-center gap-2 rounded-full bg-[#0B1F10] py-1 pl-1 pr-4 text-sm font-semibold text-white">
                        <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206]"><TopicIcon className="h-3.5 w-3.5" /></span>
                        {t.label}
                      </p>
                      <Field id={`${uid}-name`} label="Full name" error={errors.name}>
                        <input id={`${uid}-name`} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-error` : undefined} className={inputCls(errors.name)} />
                      </Field>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field id={`${uid}-email`} label="Email address" hint="Email or phone: one is enough" error={errors.email}>
                          <input id={`${uid}-email`} type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={`${uid}-email-hint${errors.email ? ` ${uid}-email-error` : ""}`} className={inputCls(errors.email)} />
                        </Field>
                        <Field id={`${uid}-phone`} label="Phone number" hint="Optional" error={errors.phone}>
                          <input id={`${uid}-phone`} type="tel" autoComplete="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${uid}-phone-error` : ""}`} className={inputCls(errors.phone)} />
                        </Field>
                      </div>
                      {topic !== "enquiry" && topic !== "pencom" && (
                        <Field id={`${uid}-pin`} label="RSA PIN" hint="Optional. Helps us find your records faster. Starts with PEN." error={errors.pin}>
                          <input id={`${uid}-pin`} value={v.pin} onChange={(e) => set("pin", e.target.value.toUpperCase())} inputMode="text" autoComplete="off" aria-invalid={!!errors.pin} aria-describedby={`${uid}-pin-hint${errors.pin ? ` ${uid}-pin-error` : ""}`} className={cn(inputCls(errors.pin), "font-mono uppercase tracking-wider")} placeholder="PEN" />
                        </Field>
                      )}
                      {topic === "pfa" && (
                        <Field id={`${uid}-pfa`} label="Which PFA is it about?" error={errors.pfa}>
                          <select id={`${uid}-pfa`} value={v.pfa} onChange={(e) => set("pfa", e.target.value)} aria-invalid={!!errors.pfa} aria-describedby={errors.pfa ? `${uid}-pfa-error` : undefined} className={inputCls(errors.pfa)}>
                            <option value="">Choose a PFA</option>
                            {operators.filter((o) => o.type === "PFA").map((o) => <option key={o.id}>{o.name}</option>)}
                          </select>
                        </Field>
                      )}
                      {topic === "employer" && (
                        <>
                          <Field id={`${uid}-employer`} label="Employer’s name" error={errors.employer}>
                            <input id={`${uid}-employer`} value={v.employer} onChange={(e) => set("employer", e.target.value)} aria-invalid={!!errors.employer} aria-describedby={errors.employer ? `${uid}-employer-error` : undefined} className={inputCls(errors.employer)} />
                          </Field>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field id={`${uid}-employerAddress`} label="Employer’s address" hint="Optional">
                              <input id={`${uid}-employerAddress`} value={v.employerAddress} onChange={(e) => set("employerAddress", e.target.value)} aria-describedby={`${uid}-employerAddress-hint`} className={inputCls()} />
                            </Field>
                            <Field id={`${uid}-months`} label="Months not remitted" hint="Optional, e.g. Jan–Jun 2026">
                              <input id={`${uid}-months`} value={v.months} onChange={(e) => set("months", e.target.value)} aria-describedby={`${uid}-months-hint`} className={inputCls()} />
                            </Field>
                          </div>
                        </>
                      )}
                      <Field id={`${uid}-message`} label={topic === "enquiry" ? "Your question" : "What happened?"} error={errors.message}>
                        <textarea id={`${uid}-message`} rows={5} maxLength={2000} value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${uid}-message-error` : undefined} className={cn(inputCls(errors.message), "py-3")} />
                        <div aria-hidden="true" className="mt-1.5 flex items-center gap-3">
                          <span className="h-1 flex-1 overflow-hidden rounded-full bg-black/5">
                            <span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-300" style={{ transform: `scaleX(${Math.min(v.message.length / 2000, 1)})` }} />
                          </span>
                          <span className="font-mono text-xs tabular-nums text-gray-600">{v.message.length} / 2000</span>
                        </div>
                      </Field>
                      <Field id={`${uid}-file`} label="Attach a document" hint="Optional. PDF, JPG or PNG, up to 5 MB" error={errors.file}>
                        <label className={cn("group flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed px-3 transition hover:border-[#117F21] hover:bg-[#F2F6F0] has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FFD84D]", errors.file ? "border-[#B52026]" : file ? "border-[#117F21] bg-[#F2F6F0]" : "border-[#7D8A80]")}>
                          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1F10] text-[#F4D27A] transition-transform duration-300 group-hover:-rotate-12"><Paperclip className="h-4 w-4" /></span>
                          <span className="flex-1 truncate text-sm font-medium text-[#0B1F10]">{file ? file.name : "Choose a file"}</span>
                          {file && <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} aria-label="Remove file" className={cn("flex h-11 w-11 items-center justify-center rounded-full text-gray-700 hover:bg-white hover:text-[#B52026]", focus)}><X className="h-4 w-4" aria-hidden="true" /></button>}
                          <input id={`${uid}-file`} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} aria-describedby={`${uid}-file-hint${errors.file ? ` ${uid}-file-error` : ""}`} className="sr-only" />
                        </label>
                      </Field>
                    </motion.div>
                  ) : (
                    <motion.div key="s2" {...swap}>
                      <h3 className="text-xl font-black tracking-tight text-[#0B1F10] sm:text-2xl">Check your details</h3>
                      <dl className="mt-4 overflow-hidden rounded-3xl ring-1 ring-black/10">
                        {[
                          ["About", t.label],
                          ["Name", v.name],
                          ["Email", v.email || "—"],
                          ["Phone", v.phone || "—"],
                          ...(v.pin ? [["RSA PIN", `${v.pin.slice(0, 3)}••••••••${v.pin.slice(-4)}`]] : []),
                          ...(v.pfa ? [["PFA", v.pfa]] : []),
                          ...(v.employer ? [["Employer", v.employer]] : []),
                          ["Message", v.message],
                          ...(file ? [["Attachment", file.name]] : []),
                        ].map(([k, val]) => (
                          <div key={k} className="grid grid-cols-1 gap-1 px-5 py-3 text-sm odd:bg-[#F2F6F0]/70 even:bg-white sm:grid-cols-3 sm:gap-4">
                            <dt className="text-xs font-bold uppercase tracking-[0.14em] text-[#7F5A04] sm:pt-0.5">{k}</dt>
                            <dd className="break-words text-[#0B1F10] sm:col-span-2">{val}</dd>
                          </div>
                        ))}
                      </dl>
                      <button type="button" onClick={() => setStep(1)} className={cn("mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-semibold text-[#117F21] underline underline-offset-4 hover:text-[#0A4A13]", focus)}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Change details
                      </button>
                      <div className="mt-5">
                        <label className={cn("flex cursor-pointer gap-3 rounded-3xl p-5 ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#FFD84D]", errors.consent ? "bg-[#FDF3F3] ring-2 ring-[#B52026]" : v.consent ? "bg-[#E8F5E9] ring-2 ring-[#117F21]" : "bg-white ring-black/15 hover:ring-[#0B1F10]/40")}>
                          <input id={`${uid}-consent`} type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${uid}-consent-error` : undefined} className="peer sr-only" />
                          <span aria-hidden="true" className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition", v.consent ? "border-[#0B1F10] bg-[#0B1F10] text-[#F4D27A]" : "border-[#7D8A80] bg-white")}>
                            {v.consent && <Check className="h-4 w-4" strokeWidth={3} />}
                          </span>
                          <span className="text-sm text-gray-800">
                            I agree that PenCom may use these details to handle my {topic === "enquiry" ? "enquiry" : "case"}, and share them with the PFA or employer concerned where needed. Read the <Link to="/regulations#policies" className="font-semibold text-[#0A4A13] underline underline-offset-2">privacy notice</Link>.
                          </span>
                        </label>
                        {errors.consent && <p id={`${uid}-consent-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#B52026]"><AlertCircle className="h-4 w-4" aria-hidden="true" /> {errors.consent}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!done && (
                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/10 pt-6">
                    {step > 0 ? (
                      <button type="button" onClick={() => { setErrors({}); setStep((s) => s - 1); }} className={cn(pillBtn, "bg-white px-5 text-[#0B1F10] ring-1 ring-black/15 hover:ring-[#0B1F10]/50", focus)}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                      </button>
                    ) : <span />}
                    <button type="button" onClick={step < 2 ? next : submit} className={cn(pillBtn, "group bg-[#0B1F10] py-1.5 pl-6 pr-1.5 text-white shadow-[0_14px_30px_-14px_rgba(4,20,10,0.8)] hover:bg-[#117F21]", focus)}>
                      {step < 2 ? "Continue" : "Send"}
                      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:-rotate-45">
                        {step < 2 ? <ArrowRight className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
