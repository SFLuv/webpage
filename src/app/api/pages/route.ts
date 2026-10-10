import { NextResponse } from "next/server";
import {
  annualImpactReportsAnchor,
  financialDocumentAnchor,
  financialsContent,
  fiscalYearAnchor
} from "@/content/financials";
import { getFinancials, listOpenForms, listPastEvents } from "@/lib/site-content/client";
import type { PublicFinancialDocument } from "@/lib/site-content/types";
import { pastEventPath, pastEventsAnchor, routes, sitemapRoutes } from "@/lib/routes";
import { footerNav, primaryNav } from "@/lib/site";

/** Rebuilt every minute, so a new form or document shows up without a deploy. */
export const revalidate = 60;

/**
 * A place a link can go. `children` are places within it: a single form, a
 * fiscal year, one document. A parent is itself a place too (the whole page).
 * A document also says which file it `opens`, so a button that points at it
 * can open the PDF as well as scroll to it.
 */
type SitePlace = { path: string; title: string; opens?: string; children?: SitePlace[] };
type SitePage = SitePlace & { group: string };

/** Pages that are in the sitemap but in no menu, so have no label of their own. */
const extraTitles: Partial<Record<string, string>> = {
  [routes.treeStewardProgram]: "Tree Steward Program",
  [routes.roadmap]: "Roadmap",
  [routes.quiz]: "SFLUV Quiz",
  [routes.deleteAccount]: "Delete Your Account"
};

const documentLink = (doc: PublicFinancialDocument) =>
  doc.id
    ? [{ path: `${routes.financialsAndReports}#${financialDocumentAnchor(doc.id)}`, title: doc.label, opens: doc.href }]
    : [];

/** The financials page, its impact reports, each fiscal year and each document in it. */
async function financialsChildren(): Promise<SitePage["children"]> {
  const { years, impact_reports: impactReports } = await getFinancials();
  const children: NonNullable<SitePage["children"]> = [];

  if (impactReports.length > 0) {
    children.push({
      path: `${routes.financialsAndReports}#${annualImpactReportsAnchor}`,
      title: financialsContent.annualImpactReportsTitle,
      children: impactReports.flatMap(documentLink)
    });
  }
  for (const year of years) {
    children.push({
      path: `${routes.financialsAndReports}#${fiscalYearAnchor(year)}`,
      title: year.label,
      children: year.periods.flatMap((period) => period.documents.flatMap(documentLink))
    });
  }
  return children;
}

/** Each form open for signing has a page of its own. */
async function formsChildren(): Promise<SitePage["children"]> {
  const forms = await listOpenForms().catch(() => null);
  return (forms ?? []).map((form) => ({ path: `${routes.forms}/${form.slug}`, title: form.title }));
}

/** The volunteers page's Past events section, and each past event's gallery. */
async function volunteersChildren(): Promise<SitePage["children"]> {
  const events = await listPastEvents();
  if (!events || events.length === 0) return [];
  return [
    {
      path: `${routes.volunteers}#${pastEventsAnchor}`,
      title: "Past events",
      children: events.map((event) => ({ path: pastEventPath(event.slug), title: event.title }))
    }
  ];
}

/**
 * Every place on the site a link can point to, for the link picker in the app's
 * Website tools. Built from the same route list and menus as the site's own
 * navigation and sitemap, plus the forms and documents that are live right
 * now, so nothing is listed twice by hand.
 *
 * Public on purpose (it is the sitemap with names), and read from the app's
 * origin, hence the open CORS header.
 */
export async function GET() {
  const [financials, forms, volunteers] = await Promise.all([
    financialsChildren().catch(() => []),
    formsChildren().catch(() => []),
    volunteersChildren().catch(() => [])
  ]);
  const childrenOf: Partial<Record<string, SitePage["children"]>> = {
    [routes.financialsAndReports]: financials,
    [routes.forms]: forms,
    [routes.volunteers]: volunteers
  };

  const pages: SitePage[] = [];
  const seen = new Set<string>();
  const add = (path: string, title: string, group: string) => {
    if (seen.has(path)) return;
    seen.add(path);
    const children = childrenOf[path];
    pages.push(children && children.length > 0 ? { path, title, group, children } : { path, title, group });
  };

  add(routes.home, "Home", "Main pages");
  for (const group of [...primaryNav, ...footerNav]) {
    for (const item of group.items) {
      if (item.href.startsWith("/")) add(item.href, item.label, group.label);
    }
  }
  for (const { path } of sitemapRoutes) {
    add(path, extraTitles[path] ?? path, "Other pages");
  }

  return NextResponse.json(
    { pages },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" } }
  );
}
