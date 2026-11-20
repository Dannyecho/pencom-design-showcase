import type { Metadata } from "next";
import MediaPage from "@/views/media/MediaPage";

export const metadata: Metadata = {
  title: "Photos and videos",
  description: "Photos from PenCom events, campaigns and visits, and the Commission’s work as reported on national television.",
};

export default function Page() {
  return <MediaPage />;
}
