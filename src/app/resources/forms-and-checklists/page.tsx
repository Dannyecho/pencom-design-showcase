import type { Metadata } from "next";
import FormsPage from "@/views/forms/FormsPage";

export const metadata: Metadata = {
  title: "Forms and checklists",
  description: "Checklists of the documents you need for common pension requests, from the Service Charter, and every official PenCom form to download.",
};

export default function Page() {
  return <FormsPage />;
}
