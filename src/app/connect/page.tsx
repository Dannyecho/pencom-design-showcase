import type { Metadata } from "next";
import ConnectPage from "@/views/connect/ConnectPage";

export const metadata: Metadata = {
  title: "Connect",
  description: "Ask a question, make a complaint, report an employer, track a case, find a PenCom office or read the latest news.",
};

export default function Page() {
  return <ConnectPage />;
}
