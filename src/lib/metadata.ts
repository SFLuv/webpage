import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { Route } from "./routes";

type PageMetadataInput = {
  title: string;
  description: string;
  path: Route;
  image?: string;
};

/** Builds per-page metadata with canonical URL and OG overrides applied. */
export function pageMetadata({ title, description, path, image }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      type: "website",
      images: image ? [{ url: image, alt: title }] : undefined
    }
  };
}
