"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Banknote,
  BadgeCheck,
  Check,
  CircleHelp,
  Clock,
  ClipboardList,
  ExternalLink,
  FileCheck,
  HeartPulse,
  LogOut,
  MapPin,
  MessageCircle,
  MessageSquareWarning,
  RefreshCw,
  ShieldCheck,
  Store,
  UserCheck,
  UserPlus,
  UserRoundCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import Headline from "@/views/theme/Headline";
import {
  FramedPanel,
  Modal,
  PageHero,
  Rise,
  SectionNav,
  ease,
  focus,
  sectionCls,
  spot,
} from "@/views/theme/ui";
import Calculator from "./Calculator";
import { anchorAlias, journeys, portals, type Journey } from "./data";

/**
 * Services, showcase theme (brief §6.2; templates "Guided service journey" and "Online services hub";
 * DES-25, DES-26). Hero with an "I want to…" picker and service tiles → step-by-step journeys (who it's
 * for, eligibility check, what you need, steps, where to go next) → pension calculator → online portals,
 * each with a "before you leave this site" screen → help. Old links (/services#pcc, #ppp, #rsa-transfer,
 * #micro, #ehub …) open the matching journey or section.
 */

const icons: Record<string, LucideIcon> = {
  "user-plus": UserPlus,
  transfer: ArrowLeftRight,
  retiree: UserRoundCheck,
  certificate: Award,
  store: Store,
  complaint: MessageSquareWarning,
};
const portalIcons: Record<string, LucideIcon> = {
  ehub: FileCheck,
  pcrs: Banknote,
  cobra: UserCheck,
  pencap: RefreshCw,
  pencare: HeartPulse,
  ppp: Store,
};

/** Soft green spotlight for white cards, and the theme's hover lift. */
const glowLight =
  "[background-image:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,0%),rgba(54,160,69,0.10),transparent_45%)]";
const lift =
  "transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(18,51,28,0.35)]";
const darkBtn =
  "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1A3A22] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#14892A]";

/** Gold circular arrow chip used at the end of dark buttons. */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-[-45deg]">
      {children}
    </span>
  );
}

const verbs: Record<string, string> = {
  "open-rsa": "open a Retirement Savings Account",
  "rsa-transfer": "move my RSA to another PFA",
  retirement: "get my retirement benefits",
  ppp: "save for retirement as a self-employed person",
  pcc: "get a Pension Clearance Certificate",
  enrolment: "enrol my employees",
  pencare: "join Pencare health insurance",
  complaint: "make a complaint",
};

const onThisPage = [
  { id: "journeys", label: "Step-by-step services" },
  { id: "calculator", label: "Pension calculator" },
  { id: "portals", label: "Online services" },
  { id: "help", label: "Get help" },
];

export default function ServicesPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(journeys[1].anchor);
  const [handoff, setHandoff] = useState<string | null>(null);

  // /services#pcc → open that journey; #calculator, #portals … → scroll to the section.
  useEffect(() => {
    const raw = hash.replace(/^#/, "");
    if (!raw) return;
    const id = anchorAlias[raw] ?? raw;
    const isJourney = journeys.some((j) => j.anchor === id);
    if (isJourney) setActive(id);
    const t1 = window.setTimeout(
      () => scrollToId(isJourney ? "journeys" : id, !reduce),
      80,
    );
    const t2 = window.setTimeout(
      () => scrollToId(isJourney ? "journeys" : id, false),
      900,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  const choose = (anchor: string, scroll: boolean) => {
    setActive(anchor);
    history.replaceState(null, "", `#${anchor}`);
    if (scroll) scrollToId("journeys", !reduce);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-white text-[#1A3A22]">
        <Hero onPick={(a) => choose(a, true)} />
        <SectionNav sections={onThisPage} pillId="svc-nav-pill" />
        <Journeys
          active={active}
          onChoose={(a) => choose(a, false)}
          onHandoff={setHandoff}
        />
        <Calculator />
        <Portals onHandoff={setHandoff} />
        <Help />
        <Handoff portalKey={handoff} onClose={() => setHandoff(null)} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero({ onPick }: { onPick: (anchor: string) => void }) {
  const [pick, setPick] = useState(journeys[1].anchor);
  return (
    <PageHero
      id="svc-title"
      crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]}
      pill={{ icon: ClipboardList, label: "Pension services" }}
      title="What do you need to do?"
      mark="need to do?"
      intro="Choose a service and we’ll take you through it step by step: who it’s for, what to bring, and which office or portal to use."
      actions={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onPick(pick);
          }}
          className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_40px_-28px_rgba(16,93,29,0.6)] ring-1 ring-black/10 sm:flex-row sm:items-center"
        >
          <label
            htmlFor="svc-pick"
            className="shrink-0 pl-3 font-semibold text-[#105D1D]"
          >
            I want to
          </label>
          <span className="relative min-w-0 flex-1">
            <select
              id="svc-pick"
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              className={cn(
                "min-h-12 w-full appearance-none truncate rounded-xl bg-[#F2F6F0] pl-3 pr-9 font-semibold text-[#1A3A22] ring-1 ring-black/10",
                focus,
              )}
            >
              {journeys.map((j) => (
                <option key={j.anchor} value={j.anchor}>
                  {verbs[j.anchor] ?? j.short}
                </option>
              ))}
            </select>
            <ArrowRight
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-gray-500"
            />
          </span>
          <button
            type="submit"
            className={cn(
              "group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1A3A22] px-5 font-semibold text-white transition hover:bg-[#14892A]",
              focus,
            )}
          >
            Show me how
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4D27A] text-[#1A1206] transition-transform duration-300 group-hover:rotate-[-45deg]">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </button>
        </form>
      }
      aside={
        <FramedPanel className="p-4 sm:p-5">
          <p className="px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#105D1D]">
            Most used services
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5">
            {journeys.map((j, i) => {
              const Icon = icons[j.icon] ?? UserPlus;
              return (
                <motion.li
                  key={j.anchor}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.04, ease }}
                >
                  <button
                    type="button"
                    onClick={() => onPick(j.anchor)}
                    className={cn(
                      "group flex h-full w-full items-start gap-3 rounded-2xl bg-[#F2F6F0] p-3 text-left ring-1 ring-black/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1A3A22] hover:text-white",
                      focus,
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#117F21] shadow-sm transition group-hover:bg-[#F4D27A] group-hover:text-[#1A1206]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-snug">
                        {j.short}
                      </span>
                      <span className="block text-xs text-gray-600 transition group-hover:text-white/75">
                        {j.audience}
                      </span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </FramedPanel>
      }
    />
  );
}

/* ─────────────────────────── Journeys ─────────────────────────── */

function Eligibility({ j }: { j: Journey }) {
  const [ans, setAns] = useState<(boolean | null)[]>(
    j.eligibility!.questions.map(() => null),
  );
  const done = ans.every((a) => a !== null);
  const ok = done && ans.every(Boolean);
  return (
    <div className="rounded-3xl bg-[#F2F6F0] p-5 ring-1 ring-black/10">
      <p className="flex items-center gap-2 font-bold">
        <CircleHelp className="h-5 w-5 text-[#117F21]" aria-hidden="true" />
        {j.eligibility!.intro}
      </p>
      <ol className="mt-4 space-y-2.5">
        {j.eligibility!.questions.map((q, i) => (
          <li key={q}>
            <fieldset className="flex flex-col gap-2 rounded-2xl bg-white p-3.5 ring-1 ring-black/10 sm:flex-row sm:items-center">
              <legend className="sr-only">{q}</legend>
              <span
                aria-hidden="true"
                className="flex-1 text-sm font-medium text-gray-800"
              >
                {q}
              </span>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <label
                    key={String(v)}
                    className={cn(
                      "flex min-h-11 min-w-16 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-[#FFD84D]",
                      ans[i] === v
                        ? v
                          ? "bg-[#1A3A22] text-[#F4D27A] ring-[#1A3A22]"
                          : "bg-[#B52026] text-white ring-[#B52026]"
                        : "text-gray-700 ring-black/10 hover:ring-black/30",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${j.anchor}-q${i}`}
                      className="sr-only"
                      checked={ans[i] === v}
                      onChange={() =>
                        setAns((a) => a.map((x, k) => (k === i ? v : x)))
                      }
                    />
                    {v ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {done && (
            <motion.p
              key={String(ok)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-4 flex gap-3 rounded-2xl p-4 text-sm font-medium",
                ok
                  ? "bg-gradient-to-br from-[#1A3A22] to-[#105D1D] text-white"
                  : "bg-[#FDE8E8] text-[#5C1013]",
              )}
            >
              {ok ? (
                <BadgeCheck
                  className="h-5 w-5 shrink-0 text-[#F4D27A]"
                  aria-hidden="true"
                />
              ) : (
                <X className="h-5 w-5 shrink-0" aria-hidden="true" />
              )}
              {ok ? j.eligibility!.yes : j.eligibility!.no}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({
  j,
  onHandoff,
}: {
  j: Journey;
  onHandoff: (key: string) => void;
}) {
  const reduce = useReducedMotion();
  const Icon = icons[j.icon] ?? UserPlus;
  const portal = portals.find((p) => p.key === j.portal);
  return (
    <motion.article
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : -16 }}
      transition={{ duration: 0.35, ease }}
      aria-labelledby={`${j.anchor}-title`}
      className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_40px_80px_-50px_rgba(18,51,28,0.55)] ring-1 ring-black/10"
    >
      <header
        onMouseMove={spot}
        className="relative isolate flex flex-col gap-5 overflow-hidden p-6 text-white [background-image:radial-gradient(420px_circle_at_var(--x,80%)_var(--y,0%),rgba(244,210,122,0.22),transparent_45%),linear-gradient(135deg,#1A3A22,#105D1D)] sm:flex-row sm:p-8"
      >
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-6 -z-10 h-48 w-48 text-white/[0.06]"
        />
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="inline-flex rounded-full bg-[#F4D27A] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#1A1206]">
            For {j.audience.toLowerCase()}
          </p>
          <h3
            id={`${j.anchor}-title`}
            className="mt-3 text-2xl font-black leading-tight tracking-tight sm:text-[2.1rem]"
          >
            {j.title}
          </h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-white/80">
            {j.intro}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium ring-1 ring-white/15">
              <MapPin
                className="h-3.5 w-3.5 text-[#F4D27A]"
                aria-hidden="true"
              />
              {j.where}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-medium ring-1 ring-white/15">
              <Clock
                className="h-3.5 w-3.5 text-[#F4D27A]"
                aria-hidden="true"
              />
              {j.standard ?? j.time}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 xl:grid-cols-[1fr_1.15fr]">
        <div className="space-y-6">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
              <Users className="h-4 w-4" aria-hidden="true" />
              Who it’s for
            </h4>
            <p className="mt-2 text-gray-700">{j.forWho}</p>
          </div>
          {j.eligibility && <Eligibility key={j.anchor} j={j} />}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
              What you need
            </h4>
            <ul className="mt-3 space-y-2">
              {j.needs.map((n) => (
                <li key={n} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#E8F5E9] text-[#117F21]">
                    <Check
                      className="h-3.5 w-3.5"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
            Steps
          </h4>
          <ol className="relative mt-4 space-y-5 pl-12">
            <motion.span
              aria-hidden="true"
              initial={{ scaleY: reduce ? 1 : 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="absolute bottom-3 left-[19px] top-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#14892A] to-[#CB9615]"
            />
            {j.steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08, ease }}
                className="relative"
              >
                <span className="absolute -left-12 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3A22] font-mono font-bold text-[#F4D27A] ring-4 ring-white">
                  {i + 1}
                </span>
                <p className="pt-1.5 font-bold">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {s.body}
                </p>
              </motion.li>
            ))}
          </ol>

          <div className="relative mt-8 overflow-hidden rounded-3xl bg-[#F2F6F0] p-5 pl-6 ring-1 ring-black/10">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#F4D27A] to-[#CB9615]"
            />
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7F5A04]">
              Where to go next
            </p>
            {portal ? (
              <>
                <p className="mt-2 font-semibold">{portal.full}</p>
                <p className="text-sm text-gray-700">{portal.use}</p>
                <button
                  type="button"
                  onClick={() => onHandoff(portal.key)}
                  className={cn("mt-4", darkBtn, focus)}
                >
                  Go to {portal.name}
                  <Chip>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Chip>
                </button>
              </>
            ) : (
              <Link
                to={
                  j.link.href.startsWith("#")
                    ? `/services${j.link.href}`
                    : j.link.href
                }
                className={cn("mt-3", darkBtn, focus)}
              >
                {j.link.label}
                <Chip>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Chip>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Journeys({
  active,
  onChoose,
  onHandoff,
}: {
  active: string;
  onChoose: (a: string) => void;
  onHandoff: (key: string) => void;
}) {
  const j = journeys.find((x) => x.anchor === active) ?? journeys[0];
  return (
    <section
      id="journeys"
      aria-labelledby="journeys-title"
      className={sectionCls}
    >
      {/* Old links: /services#pcc, #ppp, #rsa-transfer … */}
      {journeys.map((x) => (
        <span
          key={x.anchor}
          id={x.anchor}
          className="block scroll-mt-[170px]"
          aria-hidden="true"
        />
      ))}
      <div className="mx-auto max-w-7xl">
        <Headline
          id="journeys-title"
          n="01"
          kicker="Step-by-step services"
          title="Choose a service and we’ll guide you through it"
          mark="guide you through it"
          intro="Each guide says who it’s for, what to bring, the steps, and where to go next. Some have a quick check so you know you’re ready."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <LayoutGroup id="svc-rail">
            <nav aria-label="Services" className="lg:col-span-4 xl:col-span-3">
              <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:sticky lg:top-[170px] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
                {journeys.map((x) => {
                  const I = icons[x.icon] ?? UserPlus;
                  const on = x.anchor === j.anchor;
                  return (
                    <li key={x.anchor} className="shrink-0">
                      <button
                        type="button"
                        aria-current={on ? "true" : undefined}
                        onClick={() => onChoose(x.anchor)}
                        className={cn(
                          "relative isolate flex min-h-14 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition-colors",
                          on
                            ? "text-white"
                            : "bg-white text-gray-800 ring-1 ring-black/10 hover:bg-[#F2F6F0] lg:bg-transparent lg:ring-0",
                          focus,
                        )}
                      >
                        {on && (
                          <motion.span
                            layoutId="svc-rail-pill"
                            className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-[#1A3A22] to-[#105D1D] shadow-[0_18px_36px_-16px_rgba(18,51,28,0.9)]"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 32,
                            }}
                          />
                        )}
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                            on
                              ? "bg-white/10 text-[#F4D27A]"
                              : "bg-[#E8F5E9] text-[#117F21]",
                          )}
                        >
                          <I className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="whitespace-nowrap lg:whitespace-normal">
                          {x.short}
                        </span>
                        <span
                          className={cn(
                            "ml-auto hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider lg:inline",
                            on
                              ? "bg-[#F4D27A] text-[#1A1206]"
                              : "bg-[#F2F6F0] text-gray-600",
                          )}
                        >
                          {x.audience}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </LayoutGroup>
          <div className="lg:col-span-8 xl:col-span-9">
            <AnimatePresence mode="wait" initial={false}>
              <Panel key={j.anchor} j={j} onHandoff={onHandoff} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Online services ─────────────────────────── */

/** Dark portal card with the home page's 3D tilt and gold pointer spotlight (tilt off under reduced motion). */
function TiltButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [r, setR] = useState({ x: 0, y: 0 });
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseMove={(e) => {
        spot(e);
        if (reduce) return;
        const b = e.currentTarget.getBoundingClientRect();
        setR({
          x: ((e.clientY - b.top) / b.height - 0.5) * -10,
          y: ((e.clientX - b.left) / b.width - 0.5) * 12,
        });
      }}
      onMouseLeave={() => setR({ x: 0, y: 0 })}
      style={{
        transform: `perspective(900px) rotateX(${r.x}deg) rotateY(${r.y}deg)`,
      }}
      className={cn(
        "block w-full text-left transition-transform duration-200 ease-out [transform-style:preserve-3d]",
        className,
        focus,
      )}
    >
      {children}
    </button>
  );
}

function Portals({ onHandoff }: { onHandoff: (key: string) => void }) {
  return (
    <section
      id="portals"
      aria-labelledby="portals-title"
      className={sectionCls}
    >
      <div className="mx-auto max-w-7xl">
        <Headline
          id="portals-title"
          n="03"
          kicker="Online services"
          title="Which portal do you need?"
          mark="portal"
          intro="Some PenCom services run on their own websites. Each card says what it’s for, and we’ll tell you what to have ready before you leave this site."
        />
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((p, i) => {
            const I = portalIcons[p.key] ?? ExternalLink;
            return (
              <li key={p.key}>
                <Rise delay={(i % 3) * 0.07} className="h-full">
                  <TiltButton
                    onClick={() => onHandoff(p.key)}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 text-white shadow-[0_30px_60px_-34px_rgba(18,51,28,0.9)] [background-image:radial-gradient(360px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.22),transparent_45%),linear-gradient(135deg,#1A3A22,#105D1D)]"
                  >
                    <span className="flex items-start justify-between [transform:translateZ(30px)]">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A] ring-1 ring-white/15 transition duration-500 group-hover:rotate-6">
                        <I className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <ArrowUpRight
                        className="h-6 w-6 text-white/60 transition group-hover:-translate-y-1 group-hover:text-[#F4D27A]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-8 block text-3xl font-black tracking-tight [transform:translateZ(40px)]">
                      {p.name}
                    </span>
                    <span className="mt-1 block text-xs text-white/70">
                      {p.full}
                    </span>
                    <span className="mt-3 block leading-relaxed text-white/80">
                      {p.use}
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-[#F4D27A]">
                      Before you go
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </TiltButton>
                </Rise>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-gray-600">
          Descriptions to be confirmed by each portal’s owner before launch.
        </p>
      </div>
    </section>
  );
}

/** "Before you leave this site" screen (DES-26): what the portal is for, what to have ready, what happens next. */
function Handoff({
  portalKey,
  onClose,
}: {
  portalKey: string | null;
  onClose: () => void;
}) {
  const p = portals.find((x) => x.key === portalKey);
  const I = p ? (portalIcons[p.key] ?? ExternalLink) : ExternalLink;
  return (
    <Modal
      open={!!p}
      onClose={onClose}
      labelledBy="handoff-title"
      className="max-w-lg"
    >
      {p && (
        <>
          <div className="relative isolate overflow-hidden bg-gradient-to-br from-[#12331C] via-[#1A3A22] to-[#105D1D] p-7 pr-16 text-white">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_100%_0%,rgba(203,150,21,0.30),transparent)]"
            />
            <I
              aria-hidden="true"
              className="absolute -bottom-8 -right-6 -z-10 h-40 w-40 text-white/[0.07]"
            />
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F4D27A]">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              You’re about to leave this site
            </p>
            <h2
              id="handoff-title"
              className="mt-3 text-2xl font-black tracking-tight"
            >
              {p.full}
            </h2>
            <p className="mt-2 text-white/80">{p.use}</p>
          </div>
          <div className="space-y-5 p-7">
            {p.prepare ? (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
                  Have these ready
                </h3>
                <ul className="mt-3 space-y-2">
                  {p.prepare.map((x) => (
                    <li key={x} className="flex gap-3 text-sm text-gray-700">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]"
                        aria-hidden="true"
                      />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="rounded-2xl bg-[#F2F6F0] p-3 text-sm text-gray-600">
                A checklist for this portal will be added by its owner.
              </p>
            )}
            {p.next && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
                  What happens next
                </h3>
                <p className="mt-2 text-sm text-gray-700">{p.next}</p>
              </div>
            )}
            <p className="relative flex gap-2 overflow-hidden rounded-2xl bg-[#F2F6F0] p-3 pl-4 text-xs text-[#1A3A22] ring-1 ring-black/10">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#CB9615]"
              />
              <ShieldCheck
                className="h-4 w-4 shrink-0 text-[#117F21]"
                aria-hidden="true"
              />
              Check the address bar shows a pencom.gov.ng address before you
              sign in. PenCom will never ask for your password by phone or SMS.
            </p>
            <div className="flex flex-wrap gap-3">
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className={cn(darkBtn, focus)}
                >
                  Continue to {p.name}
                  <Chip>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </Chip>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <span className="inline-flex min-h-11 items-center rounded-full bg-[#F2F6F0] px-5 text-sm font-semibold text-gray-600">
                  Portal link to be confirmed
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "min-h-11 rounded-full px-5 text-sm font-semibold text-gray-700 ring-1 ring-black/10 transition hover:bg-[#F2F6F0]",
                  focus,
                )}
              >
                Stay here
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ─────────────────────────── Help ─────────────────────────── */

function Help() {
  const cards = [
    {
      icon: MessageCircle,
      title: "Ask PenCom Assistant",
      body: "Quick answers in plain language, from our published guidance.",
      chat: true,
      tone: "dark",
    },
    {
      icon: MessageSquareWarning,
      title: "Report an employer",
      body: "Deducting pension from your pay but not remitting it? Tell us.",
      to: "/connect#report",
      tone: "red",
    },
    {
      icon: UserCheck,
      title: "Find a PFA",
      body: "Contacts for every licensed Pension Fund Administrator.",
      to: "/operators#pfas",
      tone: "green",
    },
  ] as const;
  return (
    <section
      id="help"
      aria-labelledby="help-title"
      className={cn(sectionCls, "bg-[#F2F6F0] pb-24")}
    >
      <div className="mx-auto max-w-7xl">
        <Headline
          id="help-title"
          n="04"
          kicker="Get help"
          title="Still not sure? We’ll help"
          mark="We’ll help"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((c, i) => {
            const dark = c.tone === "dark";
            const cls = cn(
              "group relative flex h-full w-full flex-col overflow-hidden rounded-3xl p-7 text-left",
              lift,
              dark
                ? "text-white shadow-[0_30px_60px_-30px_rgba(18,51,28,0.8)] [background-image:radial-gradient(380px_circle_at_var(--x,50%)_var(--y,0%),rgba(244,210,122,0.22),transparent_45%),linear-gradient(135deg,#1A3A22,#105D1D)]"
                : cn("bg-white ring-1 ring-black/10", glowLight),
              focus,
            );
            const inner = (
              <>
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl transition duration-500 group-hover:rotate-6",
                    dark
                      ? "bg-white/10 text-[#F4D27A] ring-1 ring-white/15"
                      : c.tone === "red"
                        ? "bg-[#FCEBEB] text-[#B52026]"
                        : "bg-[#E8F5E9] text-[#117F21]",
                  )}
                >
                  <c.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="mt-6 block text-2xl font-black tracking-tight">
                  {c.title}
                </span>
                <span
                  className={cn(
                    "mt-2 block leading-relaxed",
                    dark ? "text-white/80" : "text-gray-600",
                  )}
                >
                  {c.body}
                </span>
                <span className="mt-auto block pt-7">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-[-45deg]",
                      dark
                        ? "bg-[#F4D27A] text-[#1A1206]"
                        : "bg-[#1A3A22] text-[#F4D27A]",
                    )}
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </span>
              </>
            );
            return (
              <Rise key={c.title} delay={i * 0.07} className="h-full">
                {"chat" in c ? (
                  <button
                    type="button"
                    onMouseMove={spot}
                    onClick={() =>
                      document.getElementById("chat-trigger")?.click()
                    }
                    className={cls}
                  >
                    {inner}
                  </button>
                ) : (
                  <Link to={c.to} onMouseMove={spot} className={cls}>
                    {inner}
                  </Link>
                )}
              </Rise>
            );
          })}
        </div>
      </div>
    </section>
  );
}
