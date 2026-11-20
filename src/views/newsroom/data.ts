import { news, newsPath, type Category } from "@/views/news/data";
import { albums, photoSrc, photos, thumb, videos } from "@/views/media/data";

/**
 * Newsroom catalogue (questionnaire "Anything else": a dedicated news and media centre for press releases,
 * official statements, speeches, media coverage, event reports, photographs and videos; brief §7 "News and
 * events": listing, article, event detail, gallery with alt text; brief §6: News & events gets its own URL).
 *
 * One list built from the CMS content types already in the prototype:
 * - articles (press releases, statements, reports, regulation news, speeches, event reports) → article page;
 * - media coverage (broadcast news about PenCom) → the video player on the Photos and videos page;
 * - photo albums → the gallery, shown in their own strip because albums are not dated.
 * Items dated in the future stay hidden until that date (scheduled publishing).
 */

export type Kind = Category | "Media coverage";

export type NewsItem = {
  id: string;
  kind: Kind;
  title: string;
  excerpt: string;
  date: string; // ISO date used for sorting and the year archive
  dateLabel: string;
  image: string;
  imageAlt: string;
  to: string; // in-site link
  meta: string; // "4 min read" or broadcaster
  action: string; // link text
  attachment?: boolean;
};

const today = new Date().toISOString().slice(0, 10);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
/** Smaller copy of the site photos for cards (the -960 files sit beside the -1920 ones). */
export const cardImage = (src: string) => src.replace(/-1920\.webp$/, "-960.webp");

const fromArticles: NewsItem[] = news.map((a) => ({
  id: a.id,
  kind: a.category,
  title: a.title,
  excerpt: a.excerpt,
  date: a.date,
  dateLabel: fmt(a.date),
  image: a.image,
  imageAlt: a.imageAlt,
  to: newsPath(a),
  meta: `${a.readMins} min read`,
  action: "Read the story",
  attachment: !!a.attachment,
}));

const fromVideos: NewsItem[] = videos.map((v) => {
  const [m, y] = v.month.split(" ");
  const iso = `${y}-${String(months.indexOf(m) + 1).padStart(2, "0")}-01`;
  return {
    id: `video-${v.id}`,
    kind: "Media coverage" as const,
    title: v.title,
    excerpt: v.blurb,
    date: iso,
    dateLabel: v.month,
    image: thumb(v.id),
    imageAlt: "",
    to: `/media?video=${v.id}#videos`,
    meta: v.channel,
    action: "Watch the report",
  };
});

export const items: NewsItem[] = [...fromArticles, ...fromVideos]
  .filter((i) => i.date <= today)
  .sort((a, b) => b.date.localeCompare(a.date));

/** Filter chips, in the order a reader is most likely to want them. */
export const kinds: { id: Kind; label: string }[] = [
  { id: "Press release", label: "Press releases" },
  { id: "Statement", label: "Statements" },
  { id: "Speech", label: "Speeches" },
  { id: "Event", label: "Events" },
  { id: "Reports", label: "Reports" },
  { id: "Regulation", label: "Regulation" },
  { id: "Media coverage", label: "Media coverage" },
];

export const years = Array.from(new Set(items.map((i) => i.date.slice(0, 4)))).sort((a, b) => b.localeCompare(a));

export const galleries = albums.map((al) => {
  const list = photos.filter((p) => p.album === al.id);
  return { ...al, count: list.length, cover: list.slice(0, 3).map((p) => ({ src: photoSrc(p), alt: p.alt })), to: `/media?album=${al.id}#photos` };
});

export const totals = {
  stories: fromArticles.length,
  coverage: fromVideos.length,
  photos: photos.length,
};
