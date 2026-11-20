import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hammer } from "lucide-react";

/**
 * Pages not yet rebuilt in this theme. Each section gets its own redesigned page in turn; until then,
 * links from the home page land here instead of on an error.
 */
const sections: Record<string, { title: string; blurb: string }> = {
  about: { title: "About PenCom", blurb: "Mission, leadership, history and the Service Charter." },
  services: { title: "Services", blurb: "RSA transfer, Personal Pension Plan, PCC, enrolment, Pencare and the pension calculator." },
  operators: { title: "Operators", blurb: "Licensed PFAs and PFCs, closed operators and related bodies." },
  resources: { title: "Resources", blurb: "Publications, downloads, forms and frequently asked questions." },
  mobile: { title: "Mobile app", blurb: "The PenCom app for Android and iOS." },
  admin: { title: "Admin", blurb: "Content management for Commission staff." },
};

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
    <section className="relative isolate overflow-hidden bg-[#F2F6F0] px-4 py-24 text-[#0E2414] sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]" />
        <div className="absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#117F21] shadow-sm ring-1 ring-black/5">
          <Hammer className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#0A4A13]">Being redesigned</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{s.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-700">{s.blurb} This page is being rebuilt to match the new home page.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white transition hover:bg-[#117F21] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the home page
          </Link>
          <Link href="/#chat" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 transition hover:bg-[#E8F5E9] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
            Ask PenCom Assistant
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
