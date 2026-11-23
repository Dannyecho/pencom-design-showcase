import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hammer } from "lucide-react";

/**
 * Pages not yet rebuilt in this theme. Each section gets its own redesigned page in turn; until then,
 * links from the home page land here instead of on an error. Server-rendered, so the dark showcase backdrop
 * is drawn with plain CSS layers (no motion).
 */
const sections: Record<string, { title: string; blurb: string }> = {
  about: { title: "About PenCom", blurb: "Mission, leadership, history and the Service Charter." },
  services: { title: "Services", blurb: "RSA transfer, Personal Pension Plan, PCC, enrolment, Pencare and the pension calculator." },
  operators: { title: "Operators", blurb: "Licensed PFAs and PFCs, closed operators and related bodies." },
  resources: { title: "Resources", blurb: "Publications, downloads, forms and frequently asked questions." },
  admin: { title: "Admin", blurb: "Content management for Commission staff." },
};

const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: (sections[slug.join("/")] ?? sections[slug[0]])?.title ?? "Page not found" };
}

export default async function ComingSoon({ params }: Props) {
  const { slug } = await params;
  const s = sections[slug.join("/")] ?? sections[slug[0]];
  if (!s) notFound();
  return (
    <section className="relative isolate overflow-hidden bg-[#12331C] px-4 py-24 text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.30),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(54,160,69,0.40),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <p className="absolute inset-x-0 bottom-0 select-none overflow-hidden whitespace-nowrap text-center text-[4.5rem] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(244,210,122,0.18)] sm:text-[8rem] lg:text-[11rem]">{s.title}</p>
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#F4D27A] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A1206] shadow-[0_12px_30px_-12px_rgba(244,210,122,0.8)]">
          <Hammer className="h-3.5 w-3.5" aria-hidden="true" />
          Being redesigned
        </p>
        <h1 className="mt-6 text-[2.5rem] font-black leading-[1.03] tracking-tight sm:text-6xl">{s.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80">{s.blurb} This page is being rebuilt to match the new home page.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-1.5 pr-5 font-bold text-[#1A1206] shadow-[0_18px_40px_-18px_rgba(244,210,122,0.85)] transition hover:bg-[#FFE08F] ${focus}`}>
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A] transition-transform duration-300 group-hover:-translate-y-0.5">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to the home page
          </Link>
          <Link href="/#chat" className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-white/10 px-6 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20 hover:ring-[#F4D27A]/60 ${focus}`}>
            Ask PenCom Assistant
            <ArrowRight className="h-4 w-4 text-[#F4D27A]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
