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
import { Tilt, ease } from "@/views/about/primitives";
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

/** Printable checklist (DES-41): opens a plain page and prints it. */
function printGuide(g: Guide) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  w.document.write(`<!doctype html><html lang="en"><head><title>${esc(g.title)} – PenCom</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:32px auto;color:#111;line-height:1.5;font-size:16px}
  h1{font-family:Verdana,sans-serif;font-size:24px;margin:0 0 4px}h2{font-family:Verdana,sans-serif;font-size:17px;margin-top:28px;border-bottom:2px solid #117F21;padding-bottom:4px}
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
  const reduce = useReducedMotion();
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    setStep(0);
    setHave(guide ? guide.needs.map(() => false) : []);
    return () => {
      if (canSpeak) window.speechSynthesis.cancel();
      setSpeaking(false);
    };
  }, [guide, canSpeak]);

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

  return (
    <Dialog open={!!guide} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto rounded-3xl border-0 p-0 sm:max-w-3xl [&>button:last-child]:right-4 [&>button:last-child]:top-4 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:bg-white/15 [&>button:last-child]:text-white [&>button:last-child]:opacity-100">
        {guide && (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0A4A13] via-[#0A4A13] to-[#117F21] px-6 pb-7 pt-8 text-white sm:px-9">
              <Icon aria-hidden="true" className="absolute -right-6 -top-6 h-44 w-44 text-white/[0.06]" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F4D27A]">Guide · {guide.audience}</p>
              <DialogTitle className="mt-2 pr-10 text-2xl font-bold leading-tight text-white sm:text-3xl">{guide.title}</DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-white/75">{guide.intro}</DialogDescription>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{guide.where}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{guide.time}</span>
              </div>
              {/* Reading aids */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {canSpeak && (
                  <button type="button" onClick={listen} aria-pressed={speaking} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
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
                <button type="button" onClick={() => printGuide(guide)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                  <Printer className="h-4 w-4" aria-hidden="true" /> Print checklist
                </button>
                <div role="group" aria-label="Text size" className="ml-auto inline-flex items-center rounded-xl border border-white/25">
                  <button type="button" onClick={() => setSize((x) => Math.max(0, x - 1))} disabled={size === 0} aria-label="Smaller text" className="flex h-11 w-11 items-center justify-center disabled:opacity-40"><Minus className="h-4 w-4" aria-hidden="true" /></button>
                  <span className="px-1 text-sm font-semibold" aria-live="polite">Aa{size ? ` +${size}` : ""}</span>
                  <button type="button" onClick={() => setSize((x) => Math.min(2, x + 1))} disabled={size === 2} aria-label="Larger text" className="flex h-11 w-11 items-center justify-center disabled:opacity-40"><Plus className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              </div>
            </div>

            <div className={cn("grid grid-cols-1 gap-8 px-6 py-8 sm:px-9 md:grid-cols-[1fr_1.3fr]", textSizes[size])}>
              {/* Checklist */}
              <div>
                <h3 className="font-bold text-[#0A2E10]">What you need</h3>
                <ul className="mt-3 space-y-2">
                  {guide.needs.map((n, i) => (
                    <li key={n}>
                      <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition", have[i] ? "border-[#117F21]/40 bg-[#F4FAF3]" : "border-gray-200 hover:border-[#117F21]/30")}>
                        <input type="checkbox" checked={!!have[i]} onChange={() => setHave((h) => h.map((v, j) => (j === i ? !v : v)))} className="peer sr-only" />
                        <span aria-hidden="true" className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#FFD84D]", have[i] ? "border-[#117F21] bg-[#117F21] text-white" : "border-gray-300")}>
                          {have[i] && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        </span>
                        <span className={cn("text-gray-700", have[i] && "text-gray-500 line-through decoration-[#117F21]/50")}>{n}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-gray-500" aria-live="polite">{have.filter(Boolean).length} of {guide.needs.length} ready</p>
              </div>

              {/* Stepper */}
              <div>
                <h3 className="font-bold text-[#0A2E10]">Steps</h3>
                <ol className="mt-3 flex gap-2" aria-label="Progress">
                  {guide.steps.map((st, i) => (
                    <li key={st.title} className="flex-1">
                      <button type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} aria-label={`Step ${i + 1}: ${st.title}`} className="group block w-full py-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">
                        <span className="block h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <motion.span className="block h-full bg-[#117F21]" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4, ease }} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="relative mt-3 min-h-[11rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div key={step} initial={{ opacity: 0, x: reduce ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : -24 }} transition={{ duration: 0.25, ease }}>
                      <p className="font-mono text-sm text-[#9A6F06]">Step {step + 1} of {guide.steps.length}</p>
                      <p className="mt-1 text-[1.35em] font-bold leading-snug text-[#0A2E10]">{s?.title}</p>
                      <p className="mt-2 leading-relaxed text-gray-700">{s?.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-gray-200 px-4 text-sm font-semibold disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
                  </button>
                  {step < guide.steps.length - 1 ? (
                    <button type="button" onClick={() => setStep((x) => x + 1)} className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white hover:bg-[#0A4A13]">
                      Next step <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <Link to={guide.link.href} onClick={onClose} className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] hover:bg-[#E0AA22]">
                      {guide.link.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
    <section id="guides" aria-labelledby="guides-title" className="scroll-mt-[160px] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          id="guides-title"
          eyebrow="Step-by-step guides"
          title="Get things done, one step at a time"
          highlight="one step at a time"
          intro="Each guide tells you who it’s for, what to bring and where to go. Listen to it, make the text bigger, or print a checklist."
        />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => {
            const Icon = guideIcons[g.icon];
            return (
              <motion.li key={g.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease }}>
                <Tilt className="h-full">
                  <button
                    type="button"
                    onClick={() => setOpenId(g.id)}
                    className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl ring-1 ring-black/10/80 bg-white p-7 text-left transition-shadow duration-300 hover:shadow-[0_30px_60px_-30px_rgba(10,74,19,0.5)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]"
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#117F21] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#117F21] transition duration-500 group-hover:rotate-[-6deg] group-hover:bg-[#117F21] group-hover:text-white">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-[#FFF8E1] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7A5604]">{g.audience}</span>
                    </span>
                    <span className="mt-6 block text-xl font-bold leading-snug text-[#0A2E10] group-hover:text-[#117F21]">{g.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-gray-600">{g.intro}</span>
                    <span className="mt-auto flex items-center justify-between pt-6 text-sm">
                      <span className="flex items-center gap-3 text-gray-500">
                        <span>{g.steps.length} steps</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1"><Headphones className="h-3.5 w-3.5" aria-hidden="true" /> Listen</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#117F21]">
                        Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
