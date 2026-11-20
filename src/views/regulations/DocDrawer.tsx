"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router";
import { motion } from "framer-motion";
import { ArrowLeftRight, Calendar, Check, Download, FileText, Link2, Scale, Tag, Users } from "lucide-react";
import { Drawer } from "@/views/theme/ui";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { library, type RegDoc } from "./library";
import { byId, fmtDate, statusStyle, typeStyle } from "./search";

function Related({ label, docs, onOpen }: { label: string; docs: RegDoc[]; onOpen: (id: string) => void }) {
  if (!docs.length) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{label}</h3>
      <ul className="mt-2 space-y-2">
        {docs.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => onOpen(d.id)}
              className="group flex w-full items-start gap-3 rounded-xl p-3 text-left text-sm ring-1 ring-black/10 transition hover:ring-[#117F21]/40 hover:bg-[#F2F6F0] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
            >
              <span aria-hidden="true" className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", typeStyle[d.type].dot)} />
              <span className="flex-1">
                <span className="block font-semibold text-[#0A2E10] group-hover:text-[#117F21]">{d.title}</span>
                <span className="mt-0.5 block font-mono text-xs text-gray-500">{d.type} · {fmtDate(d.date)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Regulatory item (brief §7): metadata, status, relationships, summary and the signed PDF. */
export default function DocDrawer({ id, onClose, onOpen }: { id: string | null; onClose: () => void; onOpen: (id: string) => void }) {
  const live = byId(id);
  const last = useRef(live);
  useEffect(() => {
    if (live) last.current = live;
  }, [live]);
  const d = live ?? last.current;
  const [copied, setCopied] = useState(false);

  const supersededBy = d?.revisedBy ? [byId(d.revisedBy)!] : [];
  const replaces = d?.revises ? [byId(d.revises)!] : [];
  const amends = d?.amends ? [byId(d.amends)!] : [];
  const amendedBy = (d?.amendedBy ?? []).map((x) => byId(x)!).filter(Boolean);
  const more = d
    ? library
        .filter((o) => o.id !== d.id && o.subjects.some((s) => s !== "General" && d.subjects.includes(s)))
        .slice(0, 3)
    : [];

  return (
    <Drawer open={!!live} onClose={onClose} labelledBy="doc-drawer-title">
        {d && (
          <motion.div key={d.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, ease }}>
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0A4A13] to-[#117F21] px-6 pb-7 pt-8 text-white sm:px-8">
              <Scale aria-hidden="true" className="absolute -right-10 -top-6 h-48 w-48 text-white/[0.05]" />
              <div className="flex flex-wrap items-center gap-2 pr-10 text-xs">
                <span className={cn("rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider", typeStyle[d.type].chip)}>{d.type}</span>
                <span className={cn("rounded-full px-2.5 py-0.5 font-semibold ring-1", statusStyle[d.status])}>{d.status}</span>
              </div>
              <h2 id="doc-drawer-title" className="mt-4 text-2xl font-bold leading-snug text-white">{d.title}</h2>
              <p className="mt-2 text-sm text-white/65">
                Issued {fmtDate(d.date)} by the National Pension Commission
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to={`/regulations/doc/${d.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-[#0A4A13] hover:bg-[#F4D27A] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]">Open full page</Link>
                <a
                  href={d.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#CB9615] px-4 text-sm font-semibold text-[#1A1206] transition hover:bg-[#E0AA22] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Official document (PDF)
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                  {copied ? "Link copied" : "Copy link"}
                </button>
                <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
              </div>
            </div>

            <div className="space-y-7 px-6 py-7 sm:px-8">
              {d.status === "Revised version available" && supersededBy[0] && (
                <div className="flex gap-3 rounded-2xl border border-[#B52026]/20 bg-[#FDE8E8] p-4 text-sm text-[#5C1013]">
                  <ArrowLeftRight className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <p>
                    A revised version was issued on {fmtDate(supersededBy[0].date)}.{" "}
                    <button type="button" onClick={() => onOpen(supersededBy[0].id)} className="font-semibold underline underline-offset-2">
                      Read the revised version
                    </button>
                    .
                  </p>
                </div>
              )}

              {/* Metadata (DES-23) */}
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-black/10 text-sm ring-1 ring-black/10">
                {[
                  { icon: FileText, k: "Document type", v: d.type },
                  { icon: Calendar, k: "Date issued", v: fmtDate(d.date) },
                  { icon: Tag, k: "Reference number", v: null },
                  { icon: Calendar, k: "Effective date", v: null },
                  { icon: Users, k: "Applies to", v: d.appliesTo.join(", ") },
                  { icon: Tag, k: "Subject", v: d.subjects.join(", ") },
                ].map((m) => (
                  <div key={m.k} className="bg-white p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <m.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {m.k}
                    </dt>
                    <dd className={cn("mt-1 font-semibold text-[#0A2E10]", !m.v && "font-normal italic text-gray-400")}>
                      {m.v ?? "To be added from the CMS"}
                    </dd>
                  </div>
                ))}
              </dl>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Summary</h3>
                {d.summary ? (
                  <p className="mt-2 leading-relaxed text-gray-700">{d.summary}</p>
                ) : (
                  <p className="mt-2 leading-relaxed text-gray-500">A plain-language summary will be published with this document.</p>
                )}
                <p className="mt-3 rounded-xl bg-[#F2F6F0] p-3 text-xs leading-relaxed text-gray-600">
                  Summaries help you understand the document. The official wording is in the signed PDF, and that is what applies.
                </p>
              </div>

              <Related label="Replaced by" docs={supersededBy} onOpen={onOpen} />
              <Related label="Replaces" docs={replaces} onOpen={onOpen} />
              <Related label="Amends" docs={amends} onOpen={onOpen} />
              <Related label="Amended by" docs={amendedBy} onOpen={onOpen} />
              <Related label="Related documents" docs={more} onOpen={onOpen} />
            </div>
          </motion.div>
        )}
    </Drawer>
  );
}
