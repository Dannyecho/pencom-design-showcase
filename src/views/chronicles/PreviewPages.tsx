"use client";

import type { ReactNode } from "react";
import { awards, issue } from "./data";
import { news } from "@/views/news/data";

/**
 * Digital preview edition, shown in the flip book until the issue PDF is added to /public/magazine.
 * Every page is built from published, sourced PenCom facts; nothing here pretends to be the printed issue's text.
 * Pages are designed at 420 × 594 px (A-series ratio) and scaled to fit the book.
 */

export type Page = { title: string; text: string; node: ReactNode };

const Folio = ({ n, dark }: { n: number; dark?: boolean }) => (
  <div className={`absolute inset-x-8 bottom-5 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] ${dark ? "text-white/50" : "text-gray-400"}`}>
    <span>PenCom Chronicles · Issue 01</span>
    <span>{n}</span>
  </div>
);

const Kicker = ({ children, gold }: { children: ReactNode; gold?: boolean }) => (
  <p className={`text-[10px] font-bold uppercase tracking-[0.24em] ${gold ? "text-[#CB9615]" : "text-[#117F21]"}`}>{children}</p>
);

const paper = "relative h-full w-full overflow-hidden bg-[#FFFDF8] px-8 pt-9 text-[#1F2A1F]";

const top3 = news.slice(0, 3);

export const previewPages: Page[] = [
  {
    title: "Cover",
    text: `${issue.title}. ${issue.edition}, ${issue.date}. Pension assets pass ₦31 trillion. Benefit approvals in 48 hours. Media Excellence Awards 2026. Personal Pension Plan: closing the funding gap.`,
    node: (
      <div className="relative h-full w-full overflow-hidden bg-[#0A4A13] text-white">
        <img src={issue.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A4A13]/90 via-[#0A4A13]/10 to-[#0A4A13]" />
        <div className="relative px-7 pt-7">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.25em] text-[#F4D27A]"><span>Issue 01</span><span>{issue.date}</span></div>
          <p className="mt-3 font-serif text-[64px] font-bold leading-[0.85] tracking-tight">PenCom</p>
          <p className="font-serif text-[46px] italic leading-none text-[#F4D27A]">Chronicles</p>
          <div className="mt-3 h-px w-full bg-gradient-to-r from-[#F4D27A] to-transparent" />
          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-white/70">The magazine of the National Pension Commission</p>
        </div>
        <div className="absolute inset-x-7 bottom-8 space-y-3">
          <p className="inline-block bg-[#CB9615] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#1A1206]">Inaugural edition</p>
          <p className="font-serif text-[30px] font-bold leading-[1.02]">Pension assets pass ₦31 trillion</p>
          <ul className="space-y-1.5 border-l-2 border-[#F4D27A] pl-3 text-[11px] leading-snug text-white/90">
            <li>Benefit approvals in 48 hours</li>
            <li>Media Excellence Awards 2026</li>
            <li>Personal Pension Plan: closing the funding gap</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "About this magazine",
    text: "About this magazine. PenCom Chronicles is the Commission’s flagship corporate magazine. It documents the Commission’s activities, reforms and industry developments, and gives stakeholders space to share their views. Published by the Corporate Communications Department, National Pension Commission, Abuja.",
    node: (
      <div className={paper}>
        <Kicker>About this magazine</Kicker>
        <p className="mt-4 font-serif text-[26px] font-bold leading-tight text-[#0A2E10]">A platform for PenCom to tell its story</p>
        <p className="mt-4 font-serif text-[12.5px] leading-[1.7]">PenCom Chronicles is the Commission’s flagship corporate magazine. It documents the work of the Commission, its reforms and developments across Nigeria’s pension industry, so that contributors, retirees, employers and operators can follow how the system is changing.</p>
        <p className="mt-3 font-serif text-[12.5px] leading-[1.7]">Each edition carries news, interviews, industry updates, human-interest stories, features and commentaries, and gives stakeholders space to share their views.</p>
        <div className="mt-6 rounded-lg bg-[#F1F7EF] p-4 text-[10.5px] leading-relaxed">
          <p className="font-bold uppercase tracking-[0.16em] text-[#117F21]">Published by</p>
          <p className="mt-1">Corporate Communications Department<br />National Pension Commission<br />174 Adetokunbo Ademola Crescent, Wuse II, Abuja</p>
          <p className="mt-2">info@pencom.gov.ng · @PenComNig</p>
        </div>
        <Folio n={2} />
      </div>
    ),
  },
  {
    title: "Contents",
    text: "Contents. From the Director-General, page 4. The industry in numbers, page 5. Where the money is invested, page 6. News in brief, page 7. Media Excellence Awards 2026, page 8. Feature: the Personal Pension Plan, page 9. Your rights, page 10. Share your story, page 11.",
    node: (
      <div className={paper}>
        <Kicker gold>In this preview</Kicker>
        <p className="mt-3 font-serif text-[40px] font-bold leading-none text-[#0A2E10]">Contents</p>
        <ol className="mt-6 divide-y divide-[#E6E1D3]">
          {[
            ["04", "From the Director-General", "Why the Commission is launching a magazine"],
            ["05", "The industry in numbers", "Assets, members and retirees"],
            ["06", "Where the money is invested", "Asset allocation, August 2026"],
            ["07", "News in brief", "Recent announcements"],
            ["08", "Media Excellence Awards 2026", "Honouring pension journalism"],
            ["09", "Feature", "The Personal Pension Plan funding gap"],
            ["10", "Your rights", "Service standards you can expect"],
            ["11", "Share your story", "Write for the next edition"],
          ].map(([n, t, s]) => (
            <li key={n} className="flex gap-4 py-2.5">
              <span className="font-serif text-[22px] font-bold leading-none text-[#CB9615]">{n}</span>
              <span><span className="block text-[12px] font-bold text-[#0A2E10]">{t}</span><span className="block text-[10px] text-gray-500">{s}</span></span>
            </li>
          ))}
        </ol>
        <Folio n={3} />
      </div>
    ),
  },
  {
    title: "From the Director-General",
    text: "From the Director-General. At the launch in Lagos on 6 October 2026, Director-General Omolola Oloworaran described the inaugural edition as the beginning of a platform through which PenCom will tell its story. She said the magazine will help close gaps in public understanding of the pension sector, and set the editorial and digital direction for later editions.",
    node: (
      <div className={paper}>
        <Kicker>From the Director-General</Kicker>
        <p className="mt-4 font-serif text-[24px] font-bold leading-tight text-[#0A2E10]">“The beginning of a platform through which PenCom will tell its story”</p>
        <div className="my-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#117F21] to-[#CB9615]" />
        <p className="font-serif text-[12.5px] leading-[1.7]"><span className="float-left mr-2 mt-1 font-serif text-[44px] font-bold leading-[0.8] text-[#117F21]">A</span>t the launch of PenCom Chronicles in Lagos on 6 October 2026, the Director-General, Ms Omolola Oloworaran, presented the magazine as the Commission’s flagship corporate publication.</p>
        <p className="mt-3 font-serif text-[12.5px] leading-[1.7]">She said it would help close gaps in public understanding of what happens in the pension sector, record the Commission’s initiatives and its contribution to the industry, and set the editorial and digital direction for future editions.</p>
        <p className="absolute bottom-12 left-8 right-8 text-[9.5px] italic text-gray-500">Reported by the News Agency of Nigeria, 6 October 2026.</p>
        <Folio n={4} />
      </div>
    ),
  },
  {
    title: "The industry in numbers",
    text: "The industry in numbers, as at August 2026 (unaudited). Total pension assets ₦31.80 trillion, up 13.41% since January. 11,391,008 Retirement Savings Account holders. 819,411 retirees on monthly pension in July 2026. ₦3.44 trillion paid in benefits to date.",
    node: (
      <div className="relative h-full w-full overflow-hidden bg-[#0A4A13] px-8 pt-9 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#117F21]/50 blur-3xl" />
        <Kicker gold>The industry in numbers</Kicker>
        <p className="relative mt-3 font-serif text-[30px] font-bold leading-tight">₦31.80<span className="text-[18px] text-white/60"> trillion</span></p>
        <p className="relative text-[11px] text-[#B9F0C2]">Total pension assets, August 2026 · ▲ 13.41% since January</p>
        <div className="relative mt-7 grid grid-cols-2 gap-3">
          {[
            ["11.39m", "Retirement Savings Account holders"],
            ["819,411", "Retirees on monthly pension*"],
            ["₦3.44tn", "Paid in benefits to date*"],
            ["938,229", "New members in two years*"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="font-serif text-[22px] font-bold text-[#F4D27A]">{v}</p>
              <p className="mt-1 text-[10px] leading-snug text-white/70">{l}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 300 70" className="relative mt-6 h-16 w-full" aria-hidden="true">
          <polyline points="0,62 25,58 50,57 75,55 100,50 125,48 150,46 175,40 200,28 225,27 250,14 275,9 300,6" fill="none" stroke="#F4D27A" strokeWidth="2.5" />
        </svg>
        <p className="relative text-[9px] text-white/50">Assets, Jan 2025 to Aug 2026. Unaudited. *As at July 2026.</p>
        <Folio n={5} dark />
      </div>
    ),
  },
  {
    title: "Where the money is invested",
    text: "Where the money is invested, August 2026. Federal Government securities ₦17.80 trillion, 56%. Domestic equities ₦6.32 trillion, 20%. Corporate debt ₦2.21 trillion, 7%. Other, including money market and mutual funds, ₦5.47 trillion, 17%.",
    node: (
      <div className={paper}>
        <Kicker>Where the money is invested</Kicker>
        <p className="mt-3 font-serif text-[24px] font-bold leading-tight text-[#0A2E10]">More than half sits in Federal Government securities</p>
        <div className="mt-6 flex h-6 overflow-hidden rounded-full">
          {[["#117F21", 56], ["#CB9615", 20], ["#2E7DAF", 7], ["#9AA59B", 17]].map(([c, w]) => <span key={c} style={{ background: c as string, width: `${w}%` }} />)}
        </div>
        <ul className="mt-5 space-y-3 text-[12px]">
          {[["#117F21", "FGN securities", "₦17.80tn", "56%"], ["#CB9615", "Domestic equities", "₦6.32tn", "20%"], ["#2E7DAF", "Corporate debt", "₦2.21tn", "7%"], ["#9AA59B", "Other (money market, funds, cash)", "₦5.47tn", "17%"]].map(([c, k, v, p]) => (
            <li key={k} className="flex items-center justify-between gap-3 border-b border-[#E6E1D3] pb-2">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />{k}</span>
              <span className="font-bold">{v} <span className="font-normal text-gray-500">{p}</span></span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-serif text-[12px] leading-[1.7]">Equity holdings grew from ₦3.96 trillion at the end of 2025 to ₦6.32 trillion in August 2026, a rise of about 60% in eight months.</p>
        <Folio n={6} />
      </div>
    ),
  },
  {
    title: "News in brief",
    text: `News in brief. ${top3.map((n) => `${n.title}. ${n.excerpt}`).join(" ")}`,
    node: (
      <div className={paper}>
        <Kicker gold>News in brief</Kicker>
        <ul className="mt-4 space-y-4">
          {top3.map((n, i) => (
            <li key={n.slug} className={i ? "border-t border-[#E6E1D3] pt-4" : ""}>
              {i === 0 && <img src={n.image} alt="" className="mb-3 h-28 w-full rounded object-cover" />}
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#117F21]">{n.category} · {new Date(n.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
              <p className="mt-1 font-serif text-[15px] font-bold leading-snug text-[#0A2E10]">{n.title}</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-gray-600">{n.excerpt}</p>
            </li>
          ))}
        </ul>
        <Folio n={7} />
      </div>
    ),
  },
  {
    title: "Media Excellence Awards 2026",
    text: `Media Excellence Awards 2026. Presented at the launch of PenCom Chronicles. ${awards.map((a) => `${a.cat}: ${a.name}${a.outlet ? `, ${a.outlet}` : ""}.`).join(" ")}`,
    node: (
      <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#FFF6DC] to-[#FFFDF8] px-8 pt-9">
        <Kicker gold>PenCom Media Excellence Awards 2026</Kicker>
        <p className="mt-3 font-serif text-[26px] font-bold leading-tight text-[#0A2E10]">Honouring the journalists who explain pensions</p>
        <p className="mt-3 font-serif text-[12px] leading-[1.7] text-gray-700">Three journalists were recognised at the magazine’s launch for reporting that helps Nigerians understand the pension system.</p>
        <ul className="mt-6 space-y-3">
          {awards.map((a) => (
            <li key={a.cat} className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm ring-1 ring-[#CB9615]/25">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F4D27A] to-[#CB9615] text-[18px]">★</span>
              <span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-[#9A6F06]">{a.cat}</span>
                <span className="block text-[13px] font-bold text-[#0A2E10]">{a.name}</span>
                {a.outlet && <span className="block text-[10px] text-gray-500">{a.outlet}</span>}
              </span>
            </li>
          ))}
        </ul>
        <Folio n={8} />
      </div>
    ),
  },
  {
    title: "Feature: the Personal Pension Plan",
    text: "Feature: the Personal Pension Plan. By March 2026, 219,316 Personal Pension Plan accounts had been opened, but only 18,811 had received a contribution. The plan lets self-employed and informal-sector workers save any amount, as often as they can, with a licensed PFA.",
    node: (
      <div className={paper}>
        <img src="/images/opt/pencom-woman-headscarf-1080.webp" alt="" className="-mx-8 -mt-9 mb-5 h-40 w-[calc(100%+4rem)] max-w-none object-cover" />
        <Kicker>Feature</Kicker>
        <p className="mt-2 font-serif text-[22px] font-bold leading-tight text-[#0A2E10]">219,316 accounts opened. 18,811 funded.</p>
        <p className="mt-3 font-serif text-[12px] leading-[1.7]">The Personal Pension Plan lets traders, artisans, farmers and other self-employed Nigerians save for retirement in any amount, as often as their income allows. Opening an account is the easy part: by March 2026, fewer than one in ten accounts had received a contribution.</p>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-[#FFF8E1] p-3">
          <span className="font-serif text-[28px] font-bold text-[#9A6F06]">8.6%</span>
          <span className="text-[10.5px] leading-snug text-[#5C4300]">of PPP accounts had received money by March 2026</span>
        </div>
        <Folio n={9} />
      </div>
    ),
  },
  {
    title: "Your rights",
    text: "Your rights. Service standards from the PenCom Service Charter: we aim to reply to enquiries within 48 hours and resolve complaints within 14 working days. Complete benefit applications sent by PFAs are approved within 48 hours. You can report an employer that is not remitting your contributions.",
    node: (
      <div className={paper}>
        <Kicker>Your rights</Kicker>
        <p className="mt-3 font-serif text-[24px] font-bold leading-tight text-[#0A2E10]">What you can expect from us</p>
        <ul className="mt-5 space-y-3">
          {[["48 hours", "to reply to an enquiry"], ["14 working days", "to resolve a complaint"], ["48 hours", "to approve a complete benefit application from your PFA"], ["Any time", "report an employer that isn’t remitting your pension"]].map(([v, l]) => (
            <li key={l} className="flex items-center gap-3 rounded-lg border border-[#E6E1D3] p-3">
              <span className="w-24 shrink-0 font-serif text-[16px] font-bold text-[#117F21]">{v}</span>
              <span className="text-[11px] leading-snug">{l}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[10.5px] text-gray-600">Contact us at pencom.gov.ng/connect, call +234 209 460 3955, or visit any of our six zonal offices.</p>
        <Folio n={10} />
      </div>
    ),
  },
  {
    title: "Share your story",
    text: "Share your story. PenCom Chronicles gives stakeholders space to share their views. Contributors, retirees, employers and operators can propose stories and commentaries for the next edition through the contact form on pencom.gov.ng.",
    node: (
      <div className="relative h-full w-full overflow-hidden bg-[#117F21] px-8 pt-9 text-white">
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#F4D27A]/25 blur-3xl" />
        <Kicker gold>Share your story</Kicker>
        <p className="relative mt-3 font-serif text-[30px] font-bold leading-tight">Your pension story could be in the next edition</p>
        <p className="relative mt-4 font-serif text-[12.5px] leading-[1.7] text-white/85">Each edition gives stakeholders space to share their views. If you are a contributor, retiree, employer or operator with a story or a commentary to share, tell us.</p>
        <p className="relative mt-6 inline-block rounded bg-white px-3 py-2 text-[11px] font-bold text-[#0A4A13]">pencom.gov.ng/connect → Ask a question</p>
        <Folio n={11} dark />
      </div>
    ),
  },
  {
    title: "Back cover",
    text: "Back cover. Read the full printed edition of PenCom Chronicles at pencom.gov.ng. Follow PenCom on X @PenComNig, Facebook, Instagram, LinkedIn and YouTube.",
    node: (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0A4A13] px-10 text-center text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(244,210,122,0.35) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
        <img src="/pencom-logo.png" alt="" className="relative h-16 w-16 rounded-full bg-white object-contain p-1" />
        <p className="relative mt-5 font-serif text-[34px] font-bold leading-none">PenCom <span className="italic text-[#F4D27A]">Chronicles</span></p>
        <p className="relative mt-3 text-[11px] text-white/70">Read the full printed edition at pencom.gov.ng</p>
        <div className="relative mt-8 h-px w-24 bg-[#F4D27A]/60" />
        <p className="relative mt-4 text-[10px] uppercase tracking-[0.2em] text-white/60">X @PenComNig · Facebook · Instagram · LinkedIn · YouTube</p>
        <p className="absolute bottom-6 text-[9px] text-white/40">National Pension Commission · pencom.gov.ng</p>
      </div>
    ),
  },
];
