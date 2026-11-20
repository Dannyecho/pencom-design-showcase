import type { Metadata } from "next";
import NewsCatalog from "@/views/newsroom/NewsCatalog";

export const metadata: Metadata = {
  title: "News",
  description: "Press releases, statements, speeches, events, reports, photos and videos from the National Pension Commission.",
};

export default function Page() {
  return <NewsCatalog />;
}
