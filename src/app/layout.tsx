import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./wp-extracted.css";
import "./uag.css";
import "./lativ.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sfluv.org"),
  title: {
    default: "SFLuv | Empowering Merchants, Empowering Communities",
    template: "%s | SFLuv"
  },
  description: "Empowering merchants, empowering communities.",
  icons: {
    icon: "/assets/wp-content/uploads/2024/06/SFLUV-RESIZED-ICON.png",
    apple: "/assets/wp-content/uploads/2024/06/SFLUV-RESIZED-ICON.png"
  },
  openGraph: {
    title: "SFLuv",
    description: "Empowering merchants, empowering communities.",
    url: "https://sfluv.org/",
    siteName: "SFLuv",
    images: [
      {
        url: "/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png",
        width: 512,
        height: 512,
        alt: "SFLuv"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>
        <div className="site-shell">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
