"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight, ArrowRight, Award, Check, ChevronLeft, ChevronRight, Clock, Headphones, MapPin,
  MessageSquareWarning, Minus, Plus, Printer, Square, Store, UserPlus, UserRoundCheck, type LucideIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./compat";
import { cn } from "@/lib/utils";
import { Tilt } from "@/views/about/primitives";
import { DarkBackdrop, ease, focus, sectionCls, spot } from "@/views/theme/ui";
import { SectionHeading } from "./compat";
import { guides, type Guide } from "./data";

const guideIcons: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  transfer: ArrowLeftRight,
  retiree: UserRoundCheck,
  certificate: Award,
  store: Store,
  complaint: MessageSquareWarning,
};

const textSizes = ["text-base", "text-lg", "text-xl"];

const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(54,160,69,0.10),transparent_45%)]";
const darkBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#14892A]";
const goldBtn = "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] py-1.5 pl-5 pr-1.5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]";
const chip = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]";

/** Printable checklist (DES-41): opens a plain page and prints it. */
function printGuide(g: Guide) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  w.document.write(`<!doctype html><html lang="en"><head><title>${esc(g.title)} – PenCom</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:32px auto;color:#111;line-height:1.5;font-size:16px}
  h1{font-family:Verdana,sans-serif;font-size:24px;margin:0 0 4px}h2{font-family:Verdana,sans-serif;font-size:17px;margin-top:28px;border-bottom:2px solid #14892A;padding-bottom:4px}
  .muted{color:#555}li{margin:8px 0}.box{display:inline-block;width:14px;height:14px;border:2px solid #111;margin-right:10px;vertical-align:-2px}
  ol li::marker{font-weight:bold}footer{margin-top:40px;font-size:12px;color:#555;border-top:1px solid #ccc;padding-top:8px}</style></head><body>
  <p class="muted">National Pension Commission · Guide</p><h1>${esc(g.title)}</h1><p>${esc(g.intro)}</p>
  <p><strong>Where:</strong> ${esc(g.where)} &nbsp; <strong>Time:</strong> ${esc(g.time)}</p>
  <h2>What you need</h2><ul style="list-style:none;padding:0">${g.needs.map((n) => `<li><span class="box"></span>${esc(n)}</li>`).join("")}</ul>
  <h2>Steps</h2><ol>${g.steps.map((s) => `<li><strong>${esc(s.title)}.</strong> ${esc(s.body)}</li>`).join("")}</ol>
  <footer>PenCom · 09-4611300 · www.pencom.gov.ng · Printed ${new Date().toLocaleDateString("en-GB")}</footer>
  <script>window.onload=()=>window.print()</script></body></html>`);
  w.document.close();
}

function GuideDialog({ guide, onClose }: { guide: Guide | null; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [size, setSize] = useState(0);
  const [have, setHave] = useState<boolean[]>([]);
  const [speaking, setSpeaking] = useState(false);
  // Read after mount: the server has no speech engine, so the Listen button appears only in the browser.
  const [canSpeak, setCanSpeak] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setCanSpeak("speechSynthesis" in window);
  }, []);

  useEffect(() => {
    setStep(0);
    setHave(guide ? guide.needs.map(() => false) : []);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, [guide]);

  // Audio explanation (DES-41) using the browser's built-in speech: reads the whole guide aloud.
  const listen = () => {
    if (!guide || !canSpeak) return;
    const synth = window.speechSynthesis;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = [guide.title, guide.intro, "What you need:", ...guide.needs, "Steps:", ...guide.steps.map((s, i) => `Step ${i + 1}. ${s.title}. ${s.body}`)].join(". ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-NG";
    u.rate = 0.95;
    const voice = synth.getVoices().find((v) => v.lang === "en-NG") ?? synth.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  };

  const Icon = guide ? guideIcons[guide.icon] : UserPlus;
  const s = guide?.steps[step];
  const ready = have.filter(Boolean).length;

  return (
    <Dialog open={!!guide} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl sm:max-w-3xl">
        {guide && (
          <>
            <div className="relative isolate overflow-hidden bg-[#12331C] px-6 pb-7 pt-8 text-white sm:px-9">
              <DarkBackdrop animate={false} />
              <Icon aria-hidden="true" className="absolute -right-8 -top-8 h-48 w-48 text-[#F4D27A]/[0.07]" />
              <p className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1A1206]">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                Guide · {guide.audience}
              </p>
              <DialogTitle className="mt-4 pr-12 text-2xl font-black leading-tight tracking-tight text-white sm:text-[2rem]">{guide.title}</DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-white/80">{guide.intro}</DialogDescription>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"><MapPin className="h-3.5 w-3.5 text-[#F4D27A]" aria-hidden="true" />{guide.where}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"><Clock className="h-3.5 w-3.5 text-[#F4D27A]" aria-hidden="true" />{guide.time}</span>
              </div>
              {/* Reading aids */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {canSpeak && (
                  <button type="button" onClick={listen} aria-pressed={speaking} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] px-5 text-sm font-bold text-[#1A1206] shadow-[0_14px_30px_-14px_rgba(244,210,122,0.9)] transition hover:bg-[#FFE08A]", focus)}>
                    {speaking ? <Square className="h-4 w-4 fill-current" aria-hidden="true" /> : <Headphones className="h-4 w-4" aria-hidden="true" />}
                    {speaking ? "Stop" : "Listen"}
                    {speaking && (
                      <span aria-hidden="true" className="flex h-4 items-end gap-0.5">
                        {[0, 1, 2].map((b) => (
                          <motion.span key={b} className="w-0.5 rounded-full bg-[#1A1206]" animate={reduce ? undefined : { height: ["30%", "100%", "30%"] }} transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }} style={{ height: "60%" }} />
                        ))}
                      </span>
                    )}
                  </button>
                )}
                <button type="button" onClick={() => printGuide(guide)} className={cn("inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 ring-white/30 transition hover:bg-white/10", focus)}>
                  <Printer className="h-4 w-4" aria-hidden="true" /> Print checklist
                </button>
                <div role="group" aria-label="Text size" className="ml-auto inline-flex items-center rounded-full ring-1 ring-white/30">
                  <button type="button" onClick={() => setSize((x) => Math.max(0, x - 1))} disabled={size === 0} aria-label="Smaller text" className={cn("flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-40", focus)}><Minus className="h-4 w-4" aria-hidden="true" /></button>
                  <span className="px-1 text-sm font-semibold" aria-live="polite">Aa{size ? ` +${size}` : ""}</span>
                  <button type="button" onClick={() => setSize((x) => Math.min(2, x + 1))} disabled={size === 2} aria-label="Larger text" className={cn("flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-40", focus)}><Plus className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              </div>
            </div>

            <div className={cn("grid grid-cols-1 gap-8 px-6 py-8 sm:px-9 md:grid-cols-[1fr_1.3fr]", textSizes[size])}>
              {/* Checklist */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#105D1D]">What you need</h3>
                <ul className="mt-3 space-y-2">
                  {guide.needs.map((n, i) => (
                    <li key={n}>
                      <label className={cn("flex cursor-pointer items-start gap-3 rounded-2xl p-3 ring-1 transition duration-300", have[i] ? "bg-[#F2F6F0] ring-[#14892A]/40" : "bg-white ring-black/10 hover:ring-[#14892A]/40")}>
                        <input type="checkbox" checked={!!have[i]} onChange={() => setHave((h) => h.map((v, j) => (j === i ? !v : v)))} className="peer sr-only" />
                        <span aria-hidden="true" className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#FFD84D]", have[i] ? "border-[#14892A] bg-[#14892A] text-white" : "border-gray-400")}>
                          {have[i] && <Check className="h-3 w-3" strokeWidth={3.5} />}
                        </span>
                        <span className={cn("text-gray-800", have[i] && "text-gray-600 line-through decoration-[#14892A]/60")}>{n}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3">
                  <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F2F6F0]">
                    <motion.span className="block h-full rounded-full bg-gradient-to-r from-[#14892A] to-[#CB9615]" animate={{ width: `${guide.needs.length ? (ready / guide.needs.length) * 100 : 0}%` }} transition={{ duration: 0.4, ease }} />
                  </span>
                  <p className="text-sm text-gray-600" aria-live="polite">{ready} of {guide.needs.length} ready</p>
                </div>
              </div>

              {/* Stepper */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#105D1D]">Steps</h3>
                <ol className="mt-3 flex gap-2" aria-label="Progress">
                  {guide.steps.map((st, i) => (
                    <li key={st.title} className="flex-1">
                      <button type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} aria-label={`Step ${i + 1}: ${st.title}`} className={cn("group block w-full rounded-full py-2", focus)}>
                        <span className="block h-1.5 overflow-hidden rounded-full bg-[#E3EADF] transition group-hover:bg-[#D3DECE]">
                          <motion.span className="block h-full rounded-full bg-gradient-to-r from-[#14892A] to-[#CB9615]" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4, ease }} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="relative mt-3 min-h-[11rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={step} initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -10 }} transition={{ duration: 0.25, ease }}>
                      <p className="font-mono text-sm font-semibold tabular-nums text-[#7F5A04]">Step {step + 1} of {guide.steps.length}</p>
                      <p className="mt-1 text-[1.35em] font-black leading-snug tracking-tight text-[#1A3A22]">{s?.title}</p>
                      <p className="mt-2 leading-relaxed text-gray-700">{s?.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0} className={cn("inline-flex min-h-11 items-center gap-1 rounded-full px-4 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-[#F2F6F0] disabled:opacity-40 disabled:hover:bg-transparent", focus)}>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </button>
                  {step < guide.steps.length - 1 ? (
                    <button type="button" onClick={() => setStep((x) => x + 1)} className={cn(darkBtn, focus)}>
                      Next step
                      <span className={cn(chip, "bg-[#F4D27A] text-[#1A1206] group-hover:rotate-0")}>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  ) : (
                    <Link to={guide.link.href} onClick={onClose} className={cn(goldBtn, focus)}>
                      {guide.link.label}
                      <span className={cn(chip, "bg-[#1A3A22] text-[#F4D27A]")}>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Guides({ openId, setOpenId }: { openId: string | null; setOpenId: (id: string | null) => void }) {
  const guide = guides.find((g) => g.id === openId) ?? null;
  return (
    <section id="guides" aria-labelledby="guides-title" className={cn(sectionCls, "bg-white")}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="guides-title"
          eyebrow="Step-by-step guides"
          title="Get things done, one step at a time"
          highlight="one step at a time"
          intro="Each guide tells you who it’s for, what to bring and where to go. Listen to it, make the text bigger, or print a checklist."
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => {
            const Icon = guideIcons[g.icon];
            return (
              <motion.li key={g.id} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.65, delay: (i % 3) * 0.08, ease }}>
                <Tilt className="h-full" max={5}>
                  <button
                    type="button"
                    onClick={() => setOpenId(g.id)}
                    onMouseMove={spot}
                    className={cn(
                      "group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] bg-white p-7 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)] hover:ring-[#14892A]/30",
                      glowLight,
                      focus,
                    )}
                  >
                    <span aria-hidden="true" className="absolute inset-x-7 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <Icon aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 text-[#105D1D]/[0.04] transition duration-700 group-hover:-translate-y-2 group-hover:rotate-[-8deg] group-hover:text-[#CB9615]/[0.10]" />
                    <span className="flex items-start justify-between gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A3A22] to-[#105D1D] text-[#F4D27A] shadow-[0_14px_30px_-14px_rgba(18,51,28,0.8)] transition duration-500 group-hover:rotate-[-6deg]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-[#F2F6F0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#105D1D]">{g.audience}</span>
                    </span>
                    <span className="mt-6 block text-xl font-black leading-snug tracking-tight text-[#1A3A22] transition group-hover:text-[#117F21]">{g.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-gray-600">{g.intro}</span>
                    <span className="relative mt-auto flex items-center justify-between gap-3 pt-6 text-sm">
                      <span className="flex items-center gap-3 text-gray-600">
                        <span className="font-mono tabular-nums">{g.steps.length} steps</span>
                        <span aria-hidden="true" className="text-[#CB9615]">·</span>
                        <span className="inline-flex items-center gap-1"><Headphones className="h-3.5 w-3.5" aria-hidden="true" /> Listen</span>
                      </span>
                      <span className="inline-flex items-center gap-2 font-semibold text-[#1A3A22]">
                        Open
                        <span aria-hidden="true" className={cn(chip, "bg-[#1A3A22] text-[#F4D27A] group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]")}>
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </span>
                    </span>
                  </button>
                </Tilt>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <GuideDialog guide={guide} onClose={() => setOpenId(null)} />
    </section>
  );
}
