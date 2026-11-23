"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { DarkBackdrop, ease, focus, spot } from "@/views/theme/ui";

/**
 * Mega menu for the showcase theme: a full-width cinematic band under the nav (near-black, gold and green
 * glows, faint grid, a gold spotlight that follows the pointer, the section name as a huge ghost word).
 * Groups sit in a rail on the left; pointing at or focusing a group shows its links as glass tiles on the
 * right. In the DOM each group's tiles follow its rail button, so Tab goes button → its links → next button.
 */

type Link_ = { label: string; href: string; plain?: boolean; note?: string };
type Item = { label: string; href: string; description?: string; megaMenu?: { columns: { title: string; links: Link_[] }[] } };

function NavLink({ to, plain, ...rest }: { to: string; plain?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return plain ? <a href={to} {...rest} /> : <Link to={to} {...rest} />;
}

export default function MegaPanel({ item, pathname }: { item: Item; pathname: string }) {
  const reduce = useReducedMotion();
  const cols = item.megaMenu?.columns ?? [];
  // Open on the group holding the current page, else the first.
  const [group, setGroup] = useState(() => Math.max(0, cols.findIndex((c) => c.links.some((l) => l.href === pathname))));
  const id = `mega-${item.label.toLowerCase().replace(/\W+/g, "-")}`;

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.4, ease }}
      className="absolute inset-x-0 top-full z-10"
    >
      <div
        onMouseMove={spot}
        className="relative isolate overflow-hidden bg-[#04140A] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] [background-image:radial-gradient(520px_circle_at_var(--x,70%)_var(--y,0%),rgba(244,210,122,0.12),transparent_45%)]"
      >
        <DarkBackdrop animate={false} />
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F4D27A]/70 to-transparent" />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#117F21] via-[#F4D27A] to-[#117F21]" />
        <span
          aria-hidden="true"
          data-no-translate
          className="pointer-events-none absolute -bottom-10 right-4 -z-10 select-none text-[9rem] font-black leading-none tracking-tighter text-white/[0.04]"
        >
          {item.label}
        </span>

        <div className="mx-auto grid max-w-7xl grid-cols-[17rem_1fr] gap-x-10 px-4 py-8">
          {cols.map((col, i) => {
            const on = group === i;
            return (
              <div key={col.title} className="contents">
                <button
                  type="button"
                  onMouseEnter={() => setGroup(i)}
                  onFocus={() => setGroup(i)}
                  onClick={() => setGroup(i)}
                  aria-expanded={on}
                  aria-controls={`${id}-${i}`}
                  style={{ gridRow: i + 1 }}
                  className={cn(
                    "group/g relative col-start-1 flex min-h-[3.25rem] items-center gap-3 rounded-xl px-4 text-left transition-colors",
                    on ? "bg-white/[0.08] text-white" : "text-white/70 hover:text-white",
                    focus,
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId={`${id}-bar`}
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#F4D27A] to-[#CB9615]"
                    />
                  )}
                  <span className={cn("font-mono text-xs", on ? "text-[#F4D27A]" : "text-white/40")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-base font-semibold">{col.title}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs tabular-nums", on ? "bg-[#F4D27A] text-[#1A1206]" : "bg-white/10 text-white/70")}>
                    {col.links.length}
                  </span>
                </button>

                {on && (
                  <div id={`${id}-${i}`} className="col-start-2" style={{ gridRow: `1 / span ${cols.length + 1}` }}>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#F4D27A]">{col.title}</p>
                    <ul className="grid grid-cols-2 gap-3">
                        {col.links.map((link, k) => {
                          const here = pathname === link.href;
                          return (
                            <motion.li
                              key={link.label}
                              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: reduce ? 0 : k * 0.04, ease }}
                            >
                              <NavLink
                                to={link.href}
                                plain={link.plain}
                                aria-current={here ? "page" : undefined}
                                onMouseMove={spot}
                                className={cn(
                                  "group/t relative flex min-h-[4.25rem] items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-sm transition duration-300 [background-image:radial-gradient(200px_circle_at_var(--x,50%)_var(--y,50%),rgba(244,210,122,0.18),transparent_60%)]",
                                  here ? "border-[#F4D27A]/60 bg-white/[0.08]" : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-[#F4D27A]/40",
                                  focus,
                                )}
                              >
                                <span className="min-w-0">
                                  <span className={cn("block text-[15px] font-semibold", here && "text-[#F4D27A]")}>{link.label}</span>
                                  {link.note && <span className="mt-0.5 block text-xs leading-snug text-white/70">{link.note}</span>}
                                </span>
                                <ArrowUpRight
                                  className="h-4 w-4 shrink-0 text-white/40 transition duration-300 group-hover/t:-translate-y-0.5 group-hover/t:translate-x-0.5 group-hover/t:text-[#F4D27A]"
                                  aria-hidden="true"
                                />
                              </NavLink>
                            </motion.li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          {/* Section summary under the rail */}
          <div className="col-start-1 mt-5 border-t border-white/10 px-4 pt-5" style={{ gridRow: cols.length + 1 }}>
            {item.description && <p className="text-sm leading-relaxed text-white/70">{item.description}</p>}
            <Link
              to={item.href}
              className={cn("group/o mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] px-5 text-sm font-bold text-[#1A1206] transition hover:bg-[#FFE08F]", focus)}
            >
              Overview
              <ArrowRight className="h-4 w-4 transition-transform group-hover/o:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
