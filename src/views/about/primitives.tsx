"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import {
  Award, Eye, HeartHandshake, Scale, Shield, ShieldCheck, TrendingUp, Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";

export const icons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  scale: Scale,
  users: Users,
  trend: TrendingUp,
  award: Award,
  eye: Eye,
  heart: HeartHandshake,
  plain: Shield,
};

export const ease = [0.16, 1, 0.3, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};

/** Section ids that share a URL with the mega menu, footer and "On this page" nav. */
export const sectionAliases: Record<string, string> = {
  "why-us": "overview",
  stakeholders: "charter",
  "dg-corner": "executive",
  board: "structure",
  signing: "history-2004",
};

export function scrollToId(id: string, smooth = true) {
  const el = document.getElementById(sectionAliases[id] ?? id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}

/* ─────────────────────────── Eyebrow + heading ─────────────────────────── */

/**
 * Section title used across the site: a pill eyebrow with a glowing dot and a one-time shine,
 * the heading with its key words in a brand gradient and a hand-drawn underline that draws
 * itself in, and an accent bar when there is no highlight. Motion runs once and is skipped
 * for readers who prefer reduced motion.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  center = false,
  dark = false,
  id,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: ReactNode;
  center?: boolean;
  dark?: boolean;
  id?: string;
}) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  // Translate the whole heading, then find the translated highlight inside it.
  const T = t(title);
  const H = highlight ? t(highlight) : undefined;
  const hl = H && T.includes(H) ? H : undefined;
  const [before, after] = hl ? T.split(hl) : [T, ""];
  const done = lang !== "en" && T !== title ? "" : undefined;
  const view = { once: true, margin: "-60px" } as const;

  return (
    <motion.div {...reveal} className={cn("relative max-w-3xl", center && "mx-auto text-center")}>
      {/* Eyebrow pill */}
      <span
        className={cn(
          "relative inline-flex items-center gap-2.5 overflow-hidden rounded-full py-1 pl-1 pr-4 text-[11px] font-bold uppercase tracking-[0.18em] ring-1 backdrop-blur",
          dark ? "bg-white/[0.08] text-[#F4D27A] ring-white/15" : "bg-[#E8F5E9]/80 text-[#0A4A13] ring-[#117F21]/15",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative flex h-6 w-6 items-center justify-center rounded-full",
            dark ? "bg-gradient-to-br from-[#F4D27A] to-[#CB9615]" : "bg-gradient-to-br from-[#2E913D] to-[#0A4A13]",
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", dark ? "bg-[#04240A]" : "bg-[#F4D27A]")} />
          {!reduce && (
            <motion.span
              className={cn("absolute inset-0 rounded-full", dark ? "bg-[#F4D27A]" : "bg-[#2E913D]")}
              initial={{ scale: 1, opacity: 0.5 }}
              whileInView={{ scale: 1.9, opacity: 0 }}
              viewport={view}
              transition={{ duration: 1.4, repeat: 2, ease: "easeOut" }}
            />
          )}
        </span>
        <span className="relative">{eyebrow}</span>
        {!reduce && (
          <motion.span
            aria-hidden="true"
            className={cn("pointer-events-none absolute inset-y-0 w-10 -skew-x-12", dark ? "bg-white/20" : "bg-white/70")}
            initial={{ left: "-20%" }}
            whileInView={{ left: "120%" }}
            viewport={view}
            transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
          />
        )}
      </span>

      <h2
        id={id}
        data-i18n-done={done}
        className={cn(
          "mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-[#0A2E10]",
        )}
      >
        {before}
        {hl && (
          <span className="relative inline-block">
            <span
              className={cn(
                "relative z-10 bg-clip-text text-transparent",
                dark
                  ? "bg-gradient-to-r from-[#F4D27A] via-[#E9B949] to-[#CB9615]"
                  : "bg-gradient-to-r from-[#117F21] via-[#2E913D] to-[#CB9615]",
              )}
            >
              {hl}
            </span>
            {/* Hand-drawn underline */}
            <svg aria-hidden="true" viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-2.5 left-0 h-3.5 w-full overflow-visible">
              <defs>
                <linearGradient id={`ul-${gid}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={dark ? "#F4D27A" : "#2E913D"} />
                  <stop offset="100%" stopColor="#CB9615" />
                </linearGradient>
              </defs>
              <motion.path
                d="M3 10 C 45 3, 95 2, 140 5 S 190 9, 197 6"
                fill="none"
                stroke={`url(#ul-${gid})`}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.9 : 0 }}
                whileInView={{ pathLength: 1, opacity: 0.9 }}
                viewport={view}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
              />
            </svg>
          </span>
        )}
        {after}
      </h2>

      {!hl && (
        <motion.span
          aria-hidden="true"
          className={cn(
            "mt-5 block h-1.5 w-16 rounded-full bg-gradient-to-r",
            dark ? "from-[#F4D27A] to-[#CB9615]" : "from-[#117F21] to-[#CB9615]",
            center ? "mx-auto origin-center" : "origin-left",
          )}
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        />
      )}

      {intro && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-gray-600")}>
          {intro}
        </p>
      )}
    </motion.div>
  );
}

export function CountUp({ value, className, duration = 1.8 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
  const zero = match ? `${match[1]}0${match[3]}` : value;
  const [display, setDisplay] = useState(reduce || !match ? value : zero);

  useEffect(() => {
    if (!match) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const [, pre, num, suf] = match;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = (num.split(".")[1] || "").length;
    const commas = num.includes(",");
    const controls = animate(0, target, {
      duration,
      ease,
      onUpdate: (v) => {
        const s = commas
          ? v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
          : v.toFixed(decimals);
        setDisplay(`${pre}${s}${suf}`);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/* ─────────────────────────── Cursor spotlight ─────────────────────────── */

export function Spotlight({
  children,
  className,
  color = "rgba(203,150,21,0.18)",
  size = 420,
  style,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
      className={cn("group/spot relative isolate overflow-hidden", className)}
      style={style}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ─────────────────────────── 3D tilt card ─────────────────────────── */

export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ x: -py * max, y: px * max });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      animate={{ rotateX: t.x, rotateY: t.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.6 }}
      style={{ transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Subtle dotted grid used behind dark sections. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
  );
}
