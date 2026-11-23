import type { Metadata } from "next";
import MobilePage from "@/views/mobile/MobilePage";

export const metadata: Metadata = {
  title: "Mobile app",
  description: "A preview of the PenCom app for Android and iOS: RSA dashboard, offline publications, PFA directory, service guides, notifications, feedback and accessibility settings.",
};

export default function Page() {
  return <MobilePage />;
}
