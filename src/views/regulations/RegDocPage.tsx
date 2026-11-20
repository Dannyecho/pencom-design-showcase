"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BookOpenText, Calendar, Download, FileText, Scale, Search, Tag, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { library, type RegDoc } from "@/views/regulations/library";
import { byId, fmtDate, statusStyle, typeStyle } from "@/views/regulations/search";
import { webText } from "@/views/regulations/texts";
import { DocHero, DocTools, Loading, Mark, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, ring, sizes, useDocJson } from "@/views/docs/kit";

/**
 * Regulatory item (brief §7 "Regulatory item": reference, dates, status badge, superseded-by link, HTML text, signed PDF,
 * related items; DES-22, DES-23). Route: /regulations/doc/:id
 */

type B = { t: "h"; l: number; x: string } | { t: "p"; n?: string; x: string } | { t: "table"; cap: string; head: string[]; rows: string[][] };
type Text = { id: string; pages: number | null; words: number; blocks: B[] };

const slug = (s: string, i: number) => `h-${i}-${s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;

function DocText({ blocks, q }: { blocks: B[]; q: string }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.t === "h") {
          const H = b.l <= 1 ? "h2" : "h3";
          return <H key={i} id={slug(b.x, i)} className={cn("scroll-mt-48 font-bold text-[#0A2E10]", b.l <= 1 ? "mt-10 border-b border-gray-200 pb-2 text-2xl" : "mt-7 text-lg")}><Mark text={b.x} q={q} /></H>;
        }
        if (b.t === "table") {
          return (
            <figure key={i} className="my-6 overflow-hidden rounded-2xl border border-gray-200">
              {b.cap && <figcaption className="bg-[#F4FAF3] px-4 py-2 text-sm font-semibold text-[#0A4A13]">{b.cap}</figcaption>}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-gray-50"><tr>{b.head.map((h, k) => <th key={k} scope="col" className="px-3 py-2.5 font-semibold text-gray-700">{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, k) => <tr key={k} className="border-t border-gray-100 align-top">{r.map((c, j) => <td key={j} className="px-3 py-2.5 text-gray-700"><Mark text={c} q={q} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            </figure>
          );
        }
        return (
          <p key={i} className={cn("font-serif leading-[1.75] text-gray-800", b.n && "pl-14")}>
            {b.n && <span className="-ml-14 inline-block w-14 font-sans text-sm font-bold text-[#117F21]">{b.n}</span>}
            <Mark text={b.x} q={q} />
          </p>
        );
      })}
    </div>
  );
}

function Related({ title, docs }: { title: string; docs: RegDoc[] }) {
  if (!docs.length) return null;
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{title}</h3>
      <ul className="mt-2 space-y-2">
        {docs.map((d) => (
          <li key={d.id}>
            <Link to={`/regulations/doc/${d.id}`} className={cn("group flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-3 text-sm transition hover:border-[#117F21]/40", ring)}>
              <span aria-hidden="true" className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", typeStyle[d.type].dot)} />
              <span className="flex-1"><span className="block font-semibold text-[#0A2E10] group-hover:text-[#117F21]">{d.title}</span><span className="text-xs text-gray-500">{d.type} · {fmtDate(d.date)}</span></span>
              {webText[d.id] && <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold uppercase text-[#117F21]">Web</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RegDocPage({ id }: { id: string }) {
  const d = byId(id);
  if (!d) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Scale className="mx-auto h-12 w-12 text-[#117F21]" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold text-[#0A2E10]">We can’t find that document</h1>
        <p className="mt-2 text-gray-600">It may have been renamed or withdrawn.</p>
        <Link to="/regulations#library" className={cn("mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#117F21] px-6 font-semibold text-white", ring)}>Search the library <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    );
  }
  return <Doc key={d.id} d={d} />;
}

function Doc({ d }: { d: RegDoc }) {
  const has = webText[d.id];
  const { status, data } = useDocJson<Text>(has ? `/documents/text/${d.id}.json` : "/documents/text/__none__.json");
  const [tab, setTab] = useState<"read" | "about">(has ? "read" : "about");
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [size, setSize] = useState(0);

  const newer = d.revisedBy ? byId(d.revisedBy) : null;
  const replaces = d.revises ? [byId(d.revises)!].filter(Boolean) : [];
  const amends = d.amends ? [byId(d.amends)!].filter(Boolean) : [];
  const amendedBy = d.amendedBy.map((x) => byId(x)!).filter(Boolean);
  const more = library.filter((o) => o.id !== d.id && o.subjects.some((s) => s !== "General" && d.subjects.includes(s))).sort((a, b) => Number(!!webText[b.id]) - Number(!!webText[a.id]) || b.date.localeCompare(a.date)).slice(0, 4);

  const blocks = data?.blocks ?? [];
  const toc = useMemo(() => blocks.map((b, i) => (b.t === "h" && b.l <= 2 && b.x.length < 90 ? { id: slug(b.x, i), label: b.x.charAt(0) + b.x.slice(1).toLowerCase().replace(/\b(pfa|pfc|rsa|pra|cps|pencom|ppp|fgn|ict)s?\b/gi, (m) => m.toUpperCase()), level: b.l <= 1 ? 1 : 2 } : null)).filter(Boolean) as { id: string; label: string; level: number }[], [blocks]);
  const hits = useMemo(() => {
    const t = dq.trim().toLowerCase();
    if (t.length < 2) return null;
    return blocks.reduce((n, b) => n + ((b.t === "table" ? b.rows.flat().join(" ") : b.x).toLowerCase().split(t).length - 1), 0);
  }, [blocks, dq]);
  const minutes = has ? Math.max(1, Math.round(has.words / 220)) : null;

  return (
    <MotionConfig reducedMotion="user">
      {has && <ReadingBar />}
      <DocHero
        crumbs={[{ label: "Home", to: "/" }, { label: "Regulations", to: "/regulations" }, { label: "Library", to: "/regulations#library" }, { label: d.type }]}
        kind={d.type}
        title={d.title}
        badge={<span className={cn("rounded-full px-3 py-1 text-xs font-bold ring-1", statusStyle[d.status])}>{d.status}</span>}
        lead={d.summary || undefined}
        meta={[
          { label: "Issued", value: fmtDate(d.date) },
          { label: "Status", value: d.status },
          { label: "Applies to", value: d.appliesTo.join(", ") || "All" },
          { label: has ? "Reading time" : "Format", value: has ? `${minutes} min · ${has.pages ?? "?"} pp` : "PDF" },
        ]}
        actions={<>
          <PrimaryBtn href={d.pdf} external><Download className="h-4 w-4" aria-hidden="true" /> Signed PDF</PrimaryBtn>
          {has && <button type="button" onClick={() => { setTab("read"); document.getElementById("doc-body")?.scrollIntoView({ behavior: "smooth" }); }} className={cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 hover:ring-[#117F21]", ring)}><BookOpenText className="h-4 w-4" aria-hidden="true" /> Read online</button>}
        </>}
      />

      {newer && (
        <div className="border-b border-[#CB9615]/40 bg-[#FFF8E1]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3 font-semibold text-[#5C4300]"><AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />A newer version of this document has been issued.</p>
            <Link to={`/regulations/doc/${newer.id}`} className={cn("inline-flex items-center gap-2 font-semibold text-[#117F21] underline underline-offset-2", ring)}>{newer.title} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      )}

      <div id="doc-body" className="scroll-mt-24 bg-[#F2F6F0]">
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <div role="tablist" aria-label="Document views" className="inline-flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-200">
            {([["read", "Read online"], ["about", "Details and related"]] as const).map(([k, l]) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} disabled={k === "read" && !has} onClick={() => setTab(k)} className={cn("relative min-h-11 rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40", ring, tab === k ? "text-white" : "text-gray-600 hover:text-[#117F21]")}>
                {tab === k && <motion.span layoutId="doc-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0A4A13] to-[#117F21]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
          {!has && <p className="mt-3 text-sm text-gray-500">A web version of this document is not available yet. Read the signed PDF.</p>}
        </div>

        <AnimatePresence mode="wait">
          {tab === "read" && has ? (
            <motion.div key="read" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="hidden lg:block print:hidden"><div className="sticky top-[120px] space-y-4">{toc.length > 2 && <Toc items={toc} />}</div></aside>
              <div className="min-w-0 space-y-6">
                <div className="sticky top-[95px] z-10 flex flex-col gap-3 rounded-2xl bg-white/90 p-3 ring-1 ring-black/10 backdrop-blur-xl sm:flex-row sm:items-center print:hidden">
                  <label className="relative flex-1">
                    <span className="sr-only">Search this document</span>
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this document" className="min-h-11 w-full rounded-xl border border-gray-300 pl-9 pr-10 focus:border-[#117F21] focus:outline-none focus:ring-4 focus:ring-[#117F21]/15" />
                    {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full hover:bg-gray-100", ring)}><X className="h-4 w-4" aria-hidden="true" /></button>}
                  </label>
                  <span className="text-sm text-gray-600 sm:w-36" aria-live="polite">{hits === null ? "" : `${hits} match${hits === 1 ? "" : "es"}`}</span>
                  <DocTools size={size} setSize={setSize} />
                </div>
                <article className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10" style={{ fontSize: sizes[size] }} aria-label={d.title}>
                  {status === "loading" && <Loading />}
                  {status === "error" && <p>The web version could not be loaded. <a href={d.pdf} className="font-semibold text-[#117F21] underline">Open the signed PDF</a>.</p>}
                  {data && <DocText blocks={blocks} q={dq} />}
                </article>
                <VerifyNote />
              </div>
            </motion.div>
          ) : (
            <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
                  {[
                    [FileText, "Type", d.type], [Calendar, "Date issued", fmtDate(d.date)], [Scale, "Status", d.status],
                    [Users, "Applies to", d.appliesTo.join(", ") || "All"], [Tag, "Subjects", d.subjects.join(", ")], [Calendar, "Effective date", "As stated in the document"],
                  ].map(([Icon, k, v]) => {
                    const I = Icon as typeof FileText;
                    return (
                      <div key={k as string} className="flex gap-3 bg-white p-5">
                        <I className="mt-0.5 h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                        <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{k as string}</dt><dd className="mt-0.5 font-semibold text-[#0A2E10]">{v as string}</dd></div>
                      </div>
                    );
                  })}
                </dl>
                <PdfCard href={d.pdf} title={d.title} meta={`PDF · issued ${fmtDate(d.date)}`} />
                <p className="text-xs text-gray-500">Reference numbers, effective dates and in-force status are being confirmed by Legal Services and will appear here.</p>
              </div>
              <div className="space-y-6 lg:col-span-5">
                <Related title="Replaced by" docs={newer ? [newer] : []} />
                <Related title="Replaces" docs={replaces} />
                <Related title="Amends" docs={amends} />
                <Related title="Amended by" docs={amendedBy} />
                <Related title="Related documents" docs={more} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto max-w-7xl px-4 pb-16">
          <Link to="/regulations#library" className={cn("group flex items-center justify-between rounded-3xl bg-[#0A4A13] p-6 font-semibold text-white", ring)}>
            Back to the regulatory library
            <ArrowRight className="h-5 w-5 text-[#F4D27A] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </MotionConfig>
  );
}
