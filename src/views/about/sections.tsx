"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Building2, ChevronDown, Clock, Compass, MapPin, MessageSquareWarning, Quote, Target, X } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { CountUp, icons } from "@/views/about/primitives";
import Headline from "@/views/theme/Headline";
import { DarkBackdrop, FramedPanel, Rise, focus, sectionCls, spot } from "@/views/theme/ui";
import { allExecs, arms, chapters, charter, commissioners, dg, dgOffices, mandate, mission, overview, secretary, values, vision, zonalOffices, type Exec } from "./data";

/** Soft green pointer spotlight for white cards; pair with onMouseMove={spot}. */
const glowLight = "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(54,160,69,0.10),transparent_45%)]";

/* ─────────────────────────── Overview ─────────────────────────── */

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline
          id="overview-title"
          kicker="Who we are"
          title="One regulator for every pension in Nigeria"
          mark="every pension"
          intro={
            <>
              {overview[0]}
              <span className="mt-3 block">{overview[1]}</span>
            </>
          }
        />
        <h3 className="sr-only">What we do</h3>
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mandate.map((m, i) => {
            const Icon = icons[m.icon];
            return (
              <li key={m.title}>
                <Rise delay={i * 0.07} className="h-full">
                  <div
                    onMouseMove={spot}
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-7 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.4)]",
                      glowLight,
                    )}
                  >
                    <span aria-hidden="true" className="absolute inset-x-7 top-0 h-[3px] origin-left scale-x-0 rounded-b-full bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#117F21] transition duration-500 group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h4 className="mt-5 text-lg font-bold leading-snug text-[#1A3A22]">{m.title}</h4>
                    <p className="mt-2 leading-relaxed text-gray-600">{m.body}</p>
                  </div>
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── Mission, vision, values ─────────────────────────── */

export function MissionValues() {
  return (
    <section id="mission" aria-labelledby="mission-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <Headline id="mission-title" kicker="What drives us" title="The purpose behind every decision" mark="every decision" />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Rise className="lg:col-span-7">
            <div
              onMouseMove={spot}
              className="relative h-full overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_40px_80px_-40px_rgba(18,51,28,0.8)] [background-image:radial-gradient(420px_circle_at_var(--x,70%)_var(--y,0%),rgba(244,210,122,0.20),transparent_45%),linear-gradient(135deg,#1A3A22,#105D1D)] sm:p-10"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
              <Quote aria-hidden="true" className="absolute right-6 top-6 h-16 w-16 text-[#F4D27A]/15" />
              <p className="relative inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206]">
                <Target className="h-3.5 w-3.5" aria-hidden="true" />
                Our mission
              </p>
              <p className="relative mt-7 text-2xl font-semibold leading-snug sm:text-[1.85rem]">{mission}</p>
            </div>
          </Rise>
          <Rise delay={0.08} className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-white p-7 ring-1 ring-black/10 sm:p-10">
              <span aria-hidden="true" className="absolute inset-y-8 left-0 w-1 rounded-r-full bg-gradient-to-b from-[#F4D27A] to-[#CB9615]" />
              <p className="inline-flex items-center gap-2 rounded-full bg-[#105D1D] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                Our vision
              </p>
              <p className="mt-7 text-xl font-semibold leading-snug text-[#1A3A22] sm:text-2xl">{vision}</p>
            </div>
          </Rise>
        </div>

        <div className="mt-16 flex items-center gap-4">
          <h3 id="values" className="shrink-0 scroll-mt-[190px] text-xs font-bold uppercase tracking-[0.2em] text-[#105D1D]">
            Our core values
          </h3>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-[#105D1D]/25 to-transparent" />
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = icons[v.icon];
            return (
              <li key={v.title}>
                <Rise delay={i * 0.05} className="group h-full rounded-3xl bg-white p-5 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)] sm:p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F5E9] text-[#105D1D] transition duration-300 group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h4 className="mt-4 font-bold text-[#1A3A22]">{v.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{v.desc}</p>
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── History ─────────────────────────── */

export function History() {
  const reduce = useReducedMotion();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 70%", "end 60%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="history" aria-labelledby="history-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline
          id="history-title"
          kicker="Our history"
          title="From unpaid pensions to ₦31.8 trillion in savings"
          mark="₦31.8 trillion"
          intro="How Nigeria moved from budget-funded pensions to the Contributory Pension Scheme, and what has changed since."
        />
        <ol ref={list} className="relative mt-14 space-y-8 pl-10 sm:pl-14">
          {/* Track, and a green-to-gold line that fills as you scroll. */}
          <span aria-hidden="true" className="absolute bottom-2 left-[15px] top-2 w-[3px] rounded-full bg-[#1A3A22]/10 sm:left-[23px]" />
          <motion.span aria-hidden="true" style={{ scaleY: reduce ? 1 : grow }} className="absolute bottom-2 left-[15px] top-2 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#14892A] via-[#36A045] to-[#CB9615] sm:left-[23px]" />
          {chapters.map((c) => (
            <li key={c.id} id={c.id} className="relative scroll-mt-[170px]">
              <span aria-hidden="true" className="absolute -left-10 top-7 flex h-[33px] w-[33px] items-center justify-center rounded-full bg-[#1A3A22] shadow-[0_0_0_6px_#fff] sm:-left-14 sm:h-[49px] sm:w-[49px]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F4D27A] sm:h-3 sm:w-3" />
              </span>
              <Rise>
                <article
                  onMouseMove={spot}
                  className={cn(
                    "group grid grid-cols-1 gap-5 rounded-[1.75rem] bg-white p-6 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)] sm:p-8 lg:grid-cols-12 lg:gap-10",
                    glowLight,
                  )}
                >
                  <div className="lg:col-span-3">
                    <p className="text-5xl font-black leading-none tracking-tight text-[#1A3A22] sm:text-6xl">{c.year}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#117F21]">{c.period}</p>
                    {c.figure && (
                      <p className="mt-5 inline-flex flex-col rounded-2xl bg-gradient-to-br from-[#1A3A22] to-[#105D1D] px-4 py-3 text-white shadow-[0_18px_40px_-20px_rgba(18,51,28,0.8)]">
                        <span className="text-2xl font-black tabular-nums text-[#F4D27A]">{c.figure.value}</span>
                        <span className="text-xs text-white/80">{c.figure.label}</span>
                      </p>
                    )}
                  </div>
                  <div className="lg:col-span-9 lg:border-l lg:border-black/10 lg:pl-10">
                    <h3 className="text-xl font-bold leading-snug tracking-tight sm:text-2xl">{c.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-700">{c.body}</p>
                    {c.points && (
                      <ul className="mt-4 space-y-2">
                        {c.points.map((p) => (
                          <li key={p} className="flex gap-3 text-gray-700">
                            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CB9615]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────── Structure ─────────────────────────── */

const byId = (id: string) => allExecs.find((e) => e.id === id)!;

function Person({ exec, onSelect, size = "md", dark = false }: { exec: Exec; onSelect: (id: string) => void; size?: "md" | "lg"; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exec.id)}
      className={cn("group flex min-h-11 w-full items-center gap-3 rounded-2xl p-2 text-left transition", dark ? "hover:bg-white/10" : "hover:bg-[#F2F6F0]", focus)}
    >
      <img src={exec.image} alt="" className={cn("shrink-0 rounded-full object-cover object-top ring-2", size === "lg" ? "h-16 w-16" : "h-12 w-12", dark ? "ring-[#F4D27A]/60" : "ring-[#E8F5E9]")} loading="lazy" />
      <span className="min-w-0">
        <span className={cn("block text-xs font-bold uppercase tracking-[0.12em]", dark ? "text-[#F4D27A]" : "text-[#117F21]")}>{exec.title.replace("Commissioner, ", "")}</span>
        <span className={cn("block font-bold leading-snug group-hover:underline", dark ? "text-white" : "text-[#1A3A22]")}>{exec.name}</span>
      </span>
    </button>
  );
}

export function Structure({ onSelect }: { onSelect: (id: string) => void }) {
  const [openArm, setOpenArm] = useState<string | null>(null);
  return (
    <section id="structure" aria-labelledby="structure-title" className={cn(sectionCls, "bg-[#F2F6F0]")}>
      <div className="mx-auto max-w-7xl">
        <Headline
          id="structure-title"
          kicker="Structure"
          title="How the Commission is organised"
          mark="organised"
          intro="A Board oversees the Commission. The Director General leads it with four Commissioners, each responsible for a group of departments. Select a name to read their profile."
        />

        {/* Org chart: Board → Director General → four Commissioners, joined by green-to-gold lines. */}
        <div className="mt-12 flex flex-col items-center">
          <Rise className="rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-[0.16em] text-[#105D1D] shadow-sm ring-1 ring-black/10">Board of the Commission</Rise>
          <span aria-hidden="true" className="h-8 w-[2px] bg-gradient-to-b from-[#14892A]/40 to-[#CB9615]/70" />
          <Rise className="w-full max-w-md">
            <div
              onMouseMove={spot}
              className="relative overflow-hidden rounded-[1.75rem] p-3 text-white shadow-[0_30px_60px_-30px_rgba(18,51,28,0.8)] [background-image:radial-gradient(320px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.22),transparent_45%),linear-gradient(135deg,#1A3A22,#105D1D)]"
            >
              <Person exec={dg} onSelect={onSelect} size="lg" dark />
              <ul className="mt-2 flex flex-wrap gap-1.5 px-2 pb-1">
                {dgOffices.map((o) => (
                  <li key={o.name} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85 ring-1 ring-white/10">
                    {o.name}
                  </li>
                ))}
              </ul>
            </div>
          </Rise>
          <span aria-hidden="true" className="h-8 w-[2px] bg-gradient-to-b from-[#CB9615]/70 to-[#14892A]/40" />
        </div>

        <div className="relative">
          {/* Horizontal bus joining the four arms (desktop only). */}
          <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-0 hidden h-[2px] bg-gradient-to-r from-[#14892A]/40 via-[#CB9615]/70 to-[#14892A]/40 lg:block" />
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {arms.map((arm, i) => {
              const exec = byId(arm.execId);
              const open = openArm === arm.execId;
              return (
                <li key={arm.execId} className="relative lg:pt-6">
                  <span aria-hidden="true" className="absolute left-1/2 top-0 hidden h-6 w-[2px] -translate-x-1/2 bg-[#14892A]/40 lg:block" />
                  <Rise delay={i * 0.07} className="flex h-full flex-col rounded-3xl bg-white p-3 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]">
                    <Person exec={exec} onSelect={onSelect} />
                    <div className="mt-2 flex flex-1 flex-col border-t border-black/10 px-2 pt-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">{arm.departments.length} departments</p>
                      <ul className="mt-2 space-y-1.5">
                        {arm.departments.map((d) => (
                          <li key={d.name} className="flex items-start gap-2 text-sm font-semibold text-[#1A3A22]">
                            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                            <span>
                              {d.name}
                              {open && d.units && <span className="mt-1 block text-xs font-normal leading-relaxed text-gray-600">{d.units.join(" · ")}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {arm.departments.some((d) => d.units) && (
                        <button
                          type="button"
                          aria-expanded={open}
                          onClick={() => setOpenArm(open ? null : arm.execId)}
                          className={cn(
                            "mt-auto inline-flex min-h-11 w-fit items-center gap-1.5 self-start rounded-full px-3 text-sm font-semibold transition",
                            open ? "bg-[#1A3A22] text-[#F4D27A]" : "text-[#117F21] hover:bg-[#F2F6F0]",
                            focus,
                          )}
                        >
                          {open ? "Hide units" : "Show units"}
                          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </Rise>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-6 text-sm text-gray-600">Based on the organisational chart in the Commission’s Annual Report. Departments are being confirmed with Human Resources.</p>
      </div>
    </section>
  );
}

/* ─────────────────────────── Leadership ─────────────────────────── */

export function Leadership({ onSelect }: { onSelect: (id: string) => void }) {
  const team = [...commissioners, secretary];
  return (
    <section id="executive" aria-labelledby="executive-title" className={sectionCls}>
      <div className="mx-auto max-w-7xl">
        <Headline id="executive-title" kicker="Leadership" title="The people who lead the Commission" mark="lead the Commission" intro="The Director General leads the Commission with four Commissioners and the Commission Secretary." />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Rise className="lg:col-span-5">
            <button
              type="button"
              onClick={() => onSelect(dg.id)}
              onMouseMove={spot}
              className={cn("group relative isolate block h-full min-h-[28rem] w-full overflow-hidden rounded-[1.75rem] bg-[#1A3A22] text-left shadow-[0_40px_80px_-40px_rgba(18,51,28,0.8)]", focus)}
            >
              <img src={dg.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#12331C] via-[#12331C]/40 to-transparent" />
              <span aria-hidden="true" className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 [background-image:radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.25),transparent_50%)] group-hover:opacity-100" />
              <span className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
                <span className="inline-flex rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1A1206]">{dg.title}</span>
                <span className="mt-3 block text-2xl font-black tracking-tight sm:text-3xl">{dg.name}</span>
                <span className="mt-2 block max-w-md text-white/85">{dg.bio}</span>
                <span className="mt-5 inline-flex items-center gap-3 font-semibold text-[#F4D27A]">
                  View profile
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-[-45deg]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              </span>
            </button>
          </Rise>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {team.map((e, i) => (
              <li key={e.id} className={cn(i === team.length - 1 && "sm:col-span-2")}>
                <Rise delay={i * 0.05} className="h-full">
                  <button
                    type="button"
                    onClick={() => onSelect(e.id)}
                    onMouseMove={spot}
                    className={cn(
                      "group flex h-full w-full items-center gap-4 rounded-3xl bg-white p-4 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]",
                      glowLight,
                      focus,
                    )}
                  >
                    <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F2F6F0] ring-1 ring-black/10">
                      <img src={e.image} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#117F21]">{e.title}</span>
                      <span className="mt-1 block font-bold leading-snug text-[#1A3A22]">{e.name}</span>
                      <span className="mt-1.5 block text-sm font-semibold text-gray-600 group-hover:text-[#117F21]">View profile</span>
                    </span>
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F2F6F0] text-[#1A3A22] transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-[#1A3A22] group-hover:text-[#F4D27A]">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                </Rise>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Profile dialog ─────────────────────────── */

export function ProfileDialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const exec = id ? allExecs.find((e) => e.id === id) ?? null : null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!exec) return;
    opener.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener.current?.focus?.();
    };
  }, [exec, onClose]);

  return (
    <AnimatePresence>
      {exec && (
        <motion.div key="profile" className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#12331C]/70 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-name"
            initial={{ y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: reduce ? 0 : 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative grid max-h-[calc(100svh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] sm:grid-cols-5"
          >
            <div className="relative h-64 bg-[#1A3A22] sm:col-span-2 sm:h-auto">
              <img src={exec.image} alt={`Portrait of ${exec.name}`} className="h-full w-full object-cover object-top" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-1.5 sm:bg-gradient-to-b" />
            </div>
            <div className="p-6 sm:col-span-3 sm:p-8">
              <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close profile" className={cn("absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1A3A22] shadow ring-1 ring-black/10 transition hover:rotate-90", focus)}>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              <p className="inline-flex rounded-full bg-[#105D1D] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#F4D27A]">{exec.title}</p>
              <h2 id="profile-name" className="mt-3 pr-10 text-2xl font-black leading-tight tracking-tight text-[#1A3A22] sm:text-3xl">
                {exec.name}
              </h2>
              <p className="mt-4 leading-relaxed text-gray-700">{exec.bio}</p>
              <p className="mt-6 border-t border-black/10 pt-4 text-sm text-gray-600">National Pension Commission · Federal Republic of Nigeria</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── Service Charter + visit us (the page's dark band) ─────────────────────────── */

export function Charter() {
  return (
    <section id="charter" aria-labelledby="charter-title" className={cn(sectionCls, "relative isolate bg-[#12331C] text-white")}>
      <DarkBackdrop />
      <div className="relative mx-auto max-w-7xl">
        <Headline
          id="charter-title"
          kicker="Service Charter"
          title="The standards you can expect from us"
          mark="expect from us"
          intro="We are committed to efficient, transparent and courteous service. If we fall short, tell us."
          dark
          action={
            <div className="flex flex-wrap gap-3">
              <Link
                to="/about/service-charter"
                className={cn("group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] pl-5 pr-1.5 font-bold text-[#1A1206] shadow-[0_18px_40px_-14px_rgba(244,210,122,0.8)] transition hover:bg-white", focus)}
              >
                Read the full charter
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1206] text-[#F4D27A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link to="/connect" className={cn("inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10", focus)}>
                <MessageSquareWarning className="h-4 w-4" aria-hidden="true" />
                Tell us
              </Link>
            </div>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {charter.map((c, i) => (
            <li key={c.label}>
              <Rise delay={i * 0.05} className="h-full">
                <div
                  onMouseMove={spot}
                  className="group relative h-full overflow-hidden rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/15 backdrop-blur transition duration-300 [background-image:radial-gradient(300px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.16),transparent_50%)] hover:-translate-y-1 hover:ring-[#F4D27A]/40 sm:p-6"
                >
                  <Clock className="h-5 w-5 text-[#F4D27A]" aria-hidden="true" />
                  <p className="mt-4">
                    <CountUp value={c.value} className="text-4xl font-black tracking-tight text-[#F4D27A] sm:text-5xl" />{" "}
                    <span className="text-sm text-white/75">{c.unit}</span>
                  </p>
                  <p className="mt-1 text-sm text-white/85">{c.label}</p>
                </div>
              </Rise>
            </li>
          ))}
        </ul>

        <Rise className="mt-10">
          <FramedPanel className="grid grid-cols-1 items-center gap-5 p-6 text-[#1A3A22] sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="flex items-center gap-3 text-xl font-black tracking-tight sm:text-2xl">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#105D1D] text-[#F4D27A]">
                  <MapPin className="h-5 w-5" />
                </span>
                Visit us in Abuja or at a zonal office
              </h2>
              <p className="mt-2 text-gray-600">Head office: 174 Adetokunbo Ademola Crescent, Wuse II, Abuja.</p>
            </div>
            <ul className="flex flex-wrap gap-2 lg:col-span-5">
              {zonalOffices.map((z) => (
                <li key={z} className="rounded-full bg-[#F2F6F0] px-3.5 py-1.5 text-sm font-semibold text-[#105D1D] ring-1 ring-black/10">
                  {z}
                </li>
              ))}
            </ul>
            <div className="lg:col-span-2 lg:text-right">
              <Link to="/connect#zonal-offices" className={cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] px-5 font-semibold text-white transition hover:bg-[#14892A]", focus)}>
                Find an office
                <ArrowRight className="h-4 w-4 transition-transform group-hover:rotate-[-45deg]" aria-hidden="true" />
              </Link>
            </div>
          </FramedPanel>
        </Rise>
      </div>
    </section>
  );
}
