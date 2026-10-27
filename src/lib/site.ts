import { routes } from "./routes";
import { getInTouchLink } from "./get-in-touch-link";

/** Off-site destinations. Kept together so a moved URL is a one-line change. */
export const externalLinks = {
  webWallet: "https://app.sfluv.org/map",
  merchantApproval: "https://app.sfluv.org/settings/merchant-approval",
  appDeleteAccount: "https://app.sfluv.org/delete-account",
  donate: "https://donate.stripe.com/14k7uH2ng6Jvg1ydQQ",
  // The Get Involved Google Form is retired: it sent mail to one inbox with no
  // record, no reference for the sender and no way to tell whether anyone had
  // answered. Those buttons now point at our own page, which carries the
  // subject through so the form arrives knowing what it is about.
  getInvolvedForm: getInTouchLink(),
  becomeImproverForm: getInTouchLink("become-an-improver"),
  merchantEnquiry: getInTouchLink("merchant-onboarding"),
  eventsEnquiry: getInTouchLink("events"),
  donationsEnquiry: getInTouchLink("donations"),
  pressEnquiry: getInTouchLink("press"),
  technicalSupport: getInTouchLink("technical-support"),
  treeStewardSignup: "https://forms.gle/5qRpV47YFmQk6PHh9",
  appStore: {
    ios: "https://apps.apple.com/us/app/sfluv/id6762672190",
    android: "https://play.google.com/store/apps/details?id=org.sfluv.wallet&pcampaignid=web_share"
  },
  partners: {
    intnCity: "https://intn.city",
    citizenWallet: "https://citizenwallet.xyz",
    celo: "https://celo.org/"
  }
} as const;

export const contactEmails = {
  inquiries: "inquiries@sfluv.org",
  support: "techsupport@sfluv.org",
  accountDeletion: "techsupport@sfluv.org"
} as const;

export const socialLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/company/sf-luv", icon: "linkedin" },
  { label: "Facebook", href: "https://www.facebook.com/GiveSFLuv", icon: "facebook" },
  { label: "X", href: "https://x.com/SFLUVcommunity", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/sfluv_community/", icon: "instagram" }
] as const;

export type NavItem = { href: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

export const primaryNav: NavGroup[] = [
  {
    label: "Get Involved",
    items: [
      { href: routes.donors, label: "Donors" },
      { href: routes.merchants, label: "Merchants" },
      { href: routes.improvers, label: "Improvers" },
      { href: routes.volunteers, label: "Volunteers" }
    ]
  },
  {
    label: "About",
    items: [
      { href: routes.missionAndVision, label: "Mission and Vision" },
      { href: routes.howItWorks, label: "How it Works" },
      { href: routes.ourTeam, label: "Our Team" },
      { href: routes.financialsAndReports, label: "Financials and Reports" },
      { href: routes.forms, label: "Forms and Waivers" }
    ]
  }
];

export const footerNav: NavGroup[] = [
  {
    label: "Our Ecosystem",
    items: [{ href: routes.howItWorks, label: "How it Works" }]
  },
  {
    label: "Our Partners",
    items: [
      { href: externalLinks.partners.intnCity, label: "INTN.CITY" },
      { href: externalLinks.partners.citizenWallet, label: "Citizen Wallet" },
      { href: externalLinks.partners.celo, label: "Celo" }
    ]
  },
  {
    label: "Resources",
    items: [
      { href: routes.resources, label: "Learn More" },
      { href: routes.getInTouch, label: "Get in touch" },
      { href: routes.support, label: "Support" }
    ]
  },
  {
    label: "Company",
    items: [
      { href: routes.financialsAndReports, label: "Reports" },
      { href: routes.privacyPolicy, label: "Privacy Policy" },
      { href: routes.termsAndConditions, label: "Terms and Conditions" }
    ]
  }
];

export const siteConfig = {
  name: "SFLuv",
  tagline: "Empowering Merchants, Empowering Communities",
  description: "Empowering merchants, empowering communities.",
  url: "https://sfluv.org",
  logo: "/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png",
  icon: "/assets/wp-content/uploads/2024/06/SFLUV-RESIZED-ICON.png"
} as const;
