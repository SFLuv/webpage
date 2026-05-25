import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticContent } from "@/components/StaticContent";
import { getAllPages, getPage } from "@/data/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    return {
      title: "Page Not Found"
    };
  }

  return {
    title: page.title,
    description: page.summary || "SFLuv"
  };
}

export default async function StaticPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) notFound();

  return (
    <main className="site-main site-main--page">
      <StaticContent html={page.html} />
    </main>
  );
}
