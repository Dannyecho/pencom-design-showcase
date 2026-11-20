"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "@/lib/router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchIndex, type SearchItem } from "./data";

export function openChat() {
  document.getElementById("chat-trigger")?.click();
}

export function go(item: { href?: string; chat?: boolean; external?: boolean }, navigate: (to: string) => void) {
  if (item.chat) return openChat();
  if (!item.href) return;
  if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
  else navigate(item.href);
}

/** Highlight the matched part of a label. */
function Mark({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-[#F4D27A]/50 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/** Typeahead over tasks, services, regulations and FAQs (WAI-ARIA combobox pattern). */
export default function SiteSearch({ dark = false }: { dark?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [] as SearchItem[];
    const words = term.split(/\s+/);
    return searchIndex
      .map((item) => {
        const l = item.label.toLowerCase();
        if (!words.every((w) => l.includes(w))) return null;
        const score = (l.startsWith(term) ? 0 : 1) + (item.group === "Tasks" ? 0 : 0.5);
        return { item, score };
      })
      .filter((x): x is { item: SearchItem; score: number } => !!x)
      .sort((a, b) => a.score - b.score)
      .slice(0, 7)
      .map((x) => x.item);
  }, [q]);

  const show = open && q.trim().length > 0;
  const choose = (item: SearchItem) => {
    setOpen(false);
    go(item, navigate);
  };

  return (
    <div className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results[active]) choose(results[active]);
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search PenCom
        </label>
        <div
          className={cn(
            "group flex items-center gap-3 rounded-2xl border px-4 transition focus-within:ring-4",
            dark
              ? "border-white/20 bg-white text-gray-900 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] focus-within:ring-[#F4D27A]/40"
              : "border-gray-200 bg-white focus-within:border-[#117F21] focus-within:ring-[#117F21]/15",
          )}
        >
          <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="text"
            role="combobox"
            aria-expanded={show}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={show && results[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            placeholder="Try “transfer RSA”, “PCC” or “micro pension”"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            className="min-h-14 w-full bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="hidden min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#117F21] px-4 text-sm font-semibold text-white transition hover:bg-[#0A4A13] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D] sm:inline-flex"
          >
            Search
          </button>
        </div>
      </form>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]"
          >
            <ul id={listId} role="listbox" aria-label="Suggestions" className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li role="presentation" className="px-3 py-4 text-sm text-gray-500">
                  No matches. Try a shorter word, or{" "}
                  <button type="button" onMouseDown={openChat} className="font-semibold text-[#117F21] underline underline-offset-2">
                    ask PenCom Assistant
                  </button>
                  .
                </li>
              )}
              {results.map((r, i) => (
                <li
                  key={r.label}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(r);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                    i === active ? "bg-[#E8F5E9]" : "hover:bg-gray-50",
                  )}
                >
                  <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{r.group}</span>
                  <span className="flex-1 font-medium">
                    <Mark text={r.label} q={q.trim().split(/\s+/)[0]} />
                  </span>
                  {i === active ? (
                    <CornerDownLeft className="h-4 w-4 text-[#117F21]" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-gray-300" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {show ? `${results.length} suggestions` : ""}
      </p>
    </div>
  );
}
