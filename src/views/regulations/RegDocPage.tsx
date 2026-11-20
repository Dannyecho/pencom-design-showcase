"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { AlertTriangle, BookOpenText, Calendar, Download, FileText, Scale, Search, Tag, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";
import { library, type RegDoc } from "@/views/regulations/library";
import { byId, fmtDate, statusStyle, typeStyle } from "@/views/regulations/search";
import { webText } from "@/views/regulations/texts";
import { ArrowChip, DocHero, DocTools, GhostBtn, Loading, Mark, PdfCard, PrimaryBtn, ReadingBar, Toc, VerifyNote, darkCard, glowLight, ring, sizes, useDocJson } from "@/views/docs/kit";
import { spot } from "@/views/theme/ui";

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
          return (
            <H key={i} id={slug(b.x, i)} className={cn("scroll-mt-48 text-[#0B1F10]", b.l <= 1 ? "mt-12 text-2xl font-black tracking-tight first:mt-0" : "mt-8 text-lg font-extrabold")}>
              <Mark text={b.x} q={q} />
              {b.l <= 1 && <span aria-hidden="true" className="mt-3 block h-1 w-16 rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" />}
            </H>
          );
        }
        if (b.t === "table") {
          return (
            <figure key={i} className="my-8 overflow-hidden rounded-3xl bg-white ring-1 ring-black/10 shadow-[0_24px_50px_-36px_rgba(4,20,10,0.5)]">
              {b.cap && <figcaption className="flex items-center gap-2 bg-[#F2F6F0] px-5 py-3 text-sm font-bold text-[#0A4A13]"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#CB9615]" />{b.cap}</figcaption>}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="bg-[#0B1F10] print:bg-white"><tr>{b.head.map((h, k) => <th key={k} scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#F4D27A] print:text-black">{h}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, k) => <tr key={k} className="border-t border-black/5 align-top transition-colors even:bg-[#F2F6F0]/60 hover:bg-[#E8F5E9]">{r.map((c, j) => <td key={j} className={cn("px-4 py-3 text-gray-800", j === 0 && "font-semibold text-[#0B1F10]")}><Mark text={c} q={q} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            </figure>
          );
        }
        return (
          <p key={i} className={cn("font-serif leading-[1.75] text-gray-800", b.n && "pl-14")}>
            {b.n && <span className="-ml-14 inline-block w-14 font-mono text-sm font-bold text-[#117F21]">{b.n}</span>}
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
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#7F5A04]">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {docs.map((d) => (
          <li key={d.id}>
            <Link to={`/regulations/doc/${d.id}`} onMouseMove={spot} className={cn("group flex items-center gap-3 rounded-3xl bg-white p-4 text-sm ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(4,20,10,0.35)]", glowLight, ring)}>
              <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-[#F2F6F0]", typeStyle[d.type].dot)} />
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-snug text-[#0B1F10]">{d.title}</span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">{d.type} · {fmtDate(d.date)}{webText[d.id] && <span className="rounded-full bg-[#0B1F10] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F4D27A]">Web</span>}</span>
              </span>
              <ArrowChip />
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
        <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0B1F10]">We can’t find that document</h1>
        <p className="mt-2 text-gray-600">It may have been renamed or withdrawn.</p>
        <Link to="/regulations#library" className={cn("group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#0B1F10] py-1.5 pl-6 pr-1.5 font-semibold text-white transition hover:bg-[#117F21]", ring)}>Search the library <ArrowChip /></Link>
      </div>
    );
  }
  return <Doc key={d.id} d={d} />;
}

function Doc({ d }: { d: RegDoc }) {
  const has = webText[d.id];
  const { status, data } = useDocJson<Text>(has ? `/documents/text/${d.id}.json` : null);
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
          {has && <GhostBtn onClick={() => { setTab("read"); document.getElementById("doc-body")?.scrollIntoView({ behavior: "smooth" }); }}><BookOpenText className="h-4 w-4" aria-hidden="true" /> Read online</GhostBtn>}
        </>}
      />

      {newer && (
        <div className="bg-[#F2F6F0] pt-6">
          <div className="mx-auto max-w-7xl px-4">
          <div className="relative flex flex-col gap-3 overflow-hidden rounded-3xl bg-[#FFF8E1] p-4 pl-6 ring-1 ring-[#CB9615]/40 sm:flex-row sm:items-center sm:justify-between">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#F4D27A] to-[#CB9615]" />
            <p className="flex items-center gap-3 font-semibold text-[#5C4300]"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1F10] text-[#F4D27A]"><AlertTriangle className="h-4 w-4" /></span>A newer version of this document has been issued.</p>
            <Link to={`/regulations/doc/${newer.id}`} className={cn("group inline-flex min-h-11 items-center gap-3 self-start rounded-full bg-[#0B1F10] py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition hover:bg-[#117F21] sm:self-auto", ring)}><span className="line-clamp-2">{newer.title}</span> <ArrowChip /></Link>
          </div>
          </div>
        </div>
      )}

      <div id="doc-body" className="scroll-mt-24 bg-[#F2F6F0] text-[#0B1F10]">
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <div role="tablist" aria-label="Document views" className="inline-flex max-w-full rounded-full bg-white p-1.5 shadow-[0_24px_50px_-30px_rgba(4,20,10,0.45)] ring-1 ring-black/10">
            {([["read", "Read online"], ["about", "Details and related"]] as const).map(([k, l]) => (
              <button key={k} role="tab" type="button" aria-selected={tab === k} disabled={k === "read" && !has} onClick={() => setTab(k)} className={cn("relative min-h-11 rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:px-5", ring, tab === k ? "text-[#F4D27A]" : "text-gray-700 hover:text-[#0B1F10]")}>
                {tab === k && <motion.span layoutId="doc-tab" className="absolute inset-0 rounded-full bg-[#0B1F10] shadow-[0_10px_24px_-12px_rgba(4,20,10,0.8)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
          {!has && <p className="mt-3 text-sm text-gray-600">A web version of this document is not available yet. Read the signed PDF.</p>}
        </div>

        <AnimatePresence mode="wait">
          {tab === "read" && has ? (
            <motion.div key="read" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="hidden lg:block print:hidden"><div className="sticky top-[120px] space-y-4">{toc.length > 2 && <Toc items={toc} />}</div></aside>
              <div className="min-w-0 space-y-6">
                <div className="sticky top-[95px] z-10 flex flex-col gap-2 rounded-[1.75rem] bg-white/90 p-1.5 shadow-[0_24px_50px_-30px_rgba(4,20,10,0.55)] ring-1 ring-black/10 backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full print:hidden">
                  <label className="flex flex-1 items-center gap-3 rounded-full pl-4 pr-1 has-[input:focus-visible]:outline has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-[#FFD84D]">
                    <Search className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                    <span className="sr-only">Search this document</span>
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this document" className="min-h-12 w-full min-w-0 bg-transparent text-base placeholder:text-gray-500 focus:outline-none focus-visible:outline-none focus-visible:ring-0" />
                    {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-600 transition hover:rotate-90 hover:bg-[#F2F6F0] hover:text-[#0B1F10]", ring)}><X className="h-4 w-4" aria-hidden="true" /></button>}
                  </label>
                  <div className="flex items-center justify-between gap-2 px-2 pb-1 sm:px-0 sm:pb-0">
                    <span className="text-sm text-gray-600 sm:w-28" aria-live="polite">{hits === null ? "" : <><strong className="rounded-full bg-[#0B1F10] px-2 py-0.5 font-mono tabular-nums text-[#F4D27A]">{hits}</strong> match{hits === 1 ? "" : "es"}</>}</span>
                    <DocTools size={size} setSize={setSize} />
                  </div>
                </div>
                <article className="relative overflow-hidden rounded-[1.75rem] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(4,20,10,0.45)] ring-1 ring-black/10 sm:p-10 print:shadow-none print:ring-0" style={{ fontSize: sizes[size] }} aria-label={d.title}>
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
                <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] bg-black/10 ring-1 ring-black/10 sm:grid-cols-2">
                  {[
                    [FileText, "Type", d.type], [Calendar, "Date issued", fmtDate(d.date)], [Scale, "Status", d.status],
                    [Users, "Applies to", d.appliesTo.join(", ") || "All"], [Tag, "Subjects", d.subjects.join(", ")], [Calendar, "Effective date", "As stated in the document"],
                  ].map(([Icon, k, v]) => {
                    const I = Icon as typeof FileText;
                    return (
                      <div key={k as string} onMouseMove={spot} className={cn("group flex gap-4 bg-white p-5 transition-colors hover:bg-[#F2F6F0]", glowLight)}>
                        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0B1F10] text-[#F4D27A] transition duration-300 group-hover:-rotate-6"><I className="h-5 w-5" /></span>
                        <div className="min-w-0"><dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7F5A04]">{k as string}</dt><dd className="mt-1 font-semibold text-[#0B1F10]">{v as string}</dd></div>
                      </div>
                    );
                  })}
                </dl>
                <PdfCard href={d.pdf} title={d.title} meta={`PDF · issued ${fmtDate(d.date)}`} />
                <p className="text-xs text-gray-600">Reference numbers, effective dates and in-force status are being confirmed by Legal Services and will appear here.</p>
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
          <Link to="/regulations#library" onMouseMove={spot} className={cn("group flex items-center justify-between gap-4 rounded-3xl p-6 font-bold text-white shadow-[0_30px_60px_-34px_rgba(4,20,10,0.9)] transition duration-300 hover:-translate-y-1", darkCard, ring)}>
            Back to the regulatory library
            <ArrowChip dark />
          </Link>
        </div>
      </div>
    </MotionConfig>
  );
}
