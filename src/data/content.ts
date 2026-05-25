import siteContent from "./site-content.json";

export type SitePage = {
  slug: string;
  title: string;
  html: string;
  summary: string;
  link?: string;
};

export type SiteContent = {
  siteName: string;
  tagline: string;
  source: string;
  home: SitePage;
  pages: SitePage[];
};

export const content = siteContent as SiteContent;

export function getPage(slug: string) {
  return content.pages.find((page) => page.slug === slug);
}

export function getAllPages() {
  return content.pages;
}
