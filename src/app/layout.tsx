import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import { I18nProvider } from "@/i18n/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PenCom Nigeria | National Pension Commission", template: "%s | PenCom" },
  description: "Pensions made clear for every Nigerian: services, regulations, news and help from the National Pension Commission.",
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = { themeColor: "#0A4A13" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The language switcher and first-visit popup set attributes on <html> after load.
    <html lang="en" suppressHydrationWarning>
      <body>
        <I18nProvider>
          <Layout>{children}</Layout>
        </I18nProvider>
      </body>
    </html>
  );
}
