/**
 * Every internal route the site exposes.
 *
 * This is the single source of truth: navigation, the footer, and the sitemap
 * all derive from it, so adding a page here is the only place a URL is typed.
 */
export const routes = {
  home: "/",

  missionAndVision: "/mission-and-vision",
  howItWorks: "/how-it-works",
  ourTeam: "/our-team",
  financialsAndReports: "/financials-and-reports",

  donors: "/donors",
  community: "/community",
  merchants: "/merchants",
  improvers: "/improvers",
  volunteers: "/volunteers",
  treeStewardProgram: "/tree-steward-program",

  resources: "/resources",
  roadmap: "/roadmap",
  quiz: "/sfluv-quiz",

  contact: "/contact",
  support: "/support",
  submitW9: "/submit-w9",
  deleteAccount: "/delete-account",

  privacyPolicy: "/privacy-policy",
  termsAndConditions: "/terms-and-conditions"
} as const;

export type Route = (typeof routes)[keyof typeof routes];

/** Routes included in sitemap.xml, with their relative crawl priority. */
export const sitemapRoutes: { path: Route; priority: number }[] = [
  { path: routes.home, priority: 1 },
  { path: routes.missionAndVision, priority: 0.9 },
  { path: routes.howItWorks, priority: 0.9 },
  { path: routes.ourTeam, priority: 0.7 },
  { path: routes.financialsAndReports, priority: 0.6 },
  { path: routes.donors, priority: 0.8 },
  { path: routes.community, priority: 0.8 },
  { path: routes.merchants, priority: 0.8 },
  { path: routes.improvers, priority: 0.8 },
  { path: routes.volunteers, priority: 0.8 },
  { path: routes.treeStewardProgram, priority: 0.6 },
  { path: routes.resources, priority: 0.5 },
  { path: routes.roadmap, priority: 0.3 },
  { path: routes.quiz, priority: 0.4 },
  { path: routes.contact, priority: 0.6 },
  { path: routes.support, priority: 0.5 },
  { path: routes.deleteAccount, priority: 0.3 },
  { path: routes.privacyPolicy, priority: 0.3 },
  { path: routes.termsAndConditions, priority: 0.3 }
];
