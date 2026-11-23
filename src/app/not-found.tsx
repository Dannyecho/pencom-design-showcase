import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** 404 in the showcase look: near-black band with the gold and green glows, grid, and an outlined "404". */
export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-[#12331C] px-4 py-24 text-center text-white sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_0%,rgba(203,150,21,0.30),transparent),radial-gradient(55%_70%_at_0%_100%,rgba(54,160,69,0.40),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>
      <p aria-hidden="true" className="select-none font-mono text-[7rem] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:2px_rgba(244,210,122,0.75)] sm:text-[10rem]">404</p>
      <h1 className="mt-4 text-[2.2rem] font-black leading-tight tracking-tight sm:text-5xl">We can’t find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-white/80">The address may be mistyped, or the page may have moved.</p>
      <Link href="/" className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#F4D27A] py-1.5 pl-1.5 pr-5 font-bold text-[#1A1206] shadow-[0_18px_40px_-18px_rgba(244,210,122,0.85)] transition hover:bg-[#FFE08F] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]">
        <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A3A22] text-[#F4D27A]">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Go to the home page
      </Link>
    </section>
  );
}
