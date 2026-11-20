import type { Metadata } from "next";
import Article from "@/views/news/Article";
import { findArticle, news } from "@/views/news/data";

type Props = { params: Promise<{ slug: string }> };

/** One page per article, built ahead of time. */
export function generateStaticParams() {
  return news.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = findArticle(slug);
  return a
    ? { title: a.title, description: a.excerpt, openGraph: { title: a.title, description: a.excerpt, images: a.image ? [a.image] : undefined, type: "article" } }
    : { title: "Story not found" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <Article slug={slug} />;
}
