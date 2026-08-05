import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { OrganizationJsonLd } from "@/components/layout/OrganizationJsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

const sora = localFont({
  src: [
    { path: "../assets/fonts/sora_normal_200.ttf", weight: "200", style: "normal" },
    { path: "../assets/fonts/sora_normal_300.ttf", weight: "300", style: "normal" },
    { path: "../assets/fonts/sora_italic_300.ttf", weight: "300", style: "italic" },
    { path: "../assets/fonts/sora_normal_500.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/sora_normal_600.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/sora_italic_600.ttf", weight: "600", style: "italic" },
    { path: "../assets/fonts/sora_normal_700.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-sora",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  icons: {
    icon: siteConfig.icon,
    apple: siteConfig.icon
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.logo, width: 512, height: 512, alt: siteConfig.name }],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={sora.variable}>
      <body className="flex min-h-screen flex-col">
        <OrganizationJsonLd />
        <SiteHeader />
        <main className="grow">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
