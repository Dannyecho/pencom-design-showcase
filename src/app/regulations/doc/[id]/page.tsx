import type { Metadata } from "next";
import RegDocPage from "@/views/regulations/RegDocPage";
import { library } from "@/views/regulations/library";

type Props = { params: Promise<{ id: string }> };

/** One page per library document, built ahead of time. */
export function generateStaticParams() {
  return library.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const d = library.find((x) => x.id === id);
  return d ? { title: d.title, description: d.summary || `${d.type} issued by the National Pension Commission.` } : { title: "Document not found" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <RegDocPage id={id} />;
}
