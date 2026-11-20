import type { Metadata } from "next";
import ServicesPage from "@/views/services/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Step-by-step guides to PenCom services, a pension calculator and the right online portal for each task.",
};

export default function Page() {
  return <ServicesPage />;
}
