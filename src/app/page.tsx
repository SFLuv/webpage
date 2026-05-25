import type { Metadata } from "next";
import { StaticContent } from "@/components/StaticContent";
import { content } from "@/data/content";

export const metadata: Metadata = {
  title: "SFLuv | Empowering Merchants, Empowering Communities",
  description: content.home.summary
};

export default function HomePage() {
  return (
    <main className="site-main site-main--home">
      <StaticContent html={content.home.html} variant="home" />
    </main>
  );
}
