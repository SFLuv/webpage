import { externalLinks } from "@/lib/site";
import type { Cta, ImageAsset } from "./types";

/**
 * The four audience pages share a shape: a title, an explanatory paragraph, and
 * a single call to action.
 */
export type AudiencePage = {
  title: string;
  body: string;
  cta: Cta;
  /**
   * Search-result snippet. Written for the SERP, not lifted from `body` —
   * search engines truncate around 155 characters, so a full body paragraph
   * gets cut mid-sentence and wastes the snippet.
   */
  metaDescription: string;
};

export const donorsContent: AudiencePage = {
  metaDescription:
    "Donate to SFLuv and fund community improvement projects across San Francisco. As a 501(c)(3) nonprofit, your contribution is tax-deductible.",
  title: "Donors",
  body: "Your donations help us fund projects that benefit local businesses and the community at large. Donations can be made directly through our website. As SFLuv.org is a 501(c)(3) non-profit organization, your donations are tax-deductible. Every contribution counts towards making our neighborhoods vibrant and sustainable.",
  cta: { href: externalLinks.donate, label: "Donate" }
};

export const communityContent: AudiencePage = {
  metaDescription:
    "Support San Francisco businesses that accept SFLuv tokens and help keep money circulating in your own neighborhood.",
  title: "Community Members",
  body: "Support local businesses that accept SFLuv tokens. By choosing to spend your money at these establishments, you are helping to strengthen the local economy and ensuring that resources remain within the community. Check our directory of participating businesses and plan your next purchase with them.",
  cta: { href: externalLinks.getInvolvedForm, label: "Contact Us" }
};

export const improversContent: AudiencePage = {
  metaDescription:
    "Earn SFLuv tokens for improving your neighborhood, then spend them with participating San Francisco merchants.",
  title: "Improvers",
  body: "Service providers and individual community members can become SFLuv Improvers by performing work in the neighborhood in exchange for SFLuv tokens. This alternative currency is accepted by neighborhood merchants and boosts the local economy by keeping money circulating within it.",
  cta: { href: externalLinks.getInvolvedForm, label: "Become an SFLuv Improver" }
};

export const merchantsContent: AudiencePage = {
  metaDescription:
    "Join the SFLuv merchant network: accept SFLuv tokens, vote on community improvement proposals, and help shape your neighborhood.",
  title: "Merchants",
  body: "As a local business owner who accepts SFLuv, you can participate in your local decision-making organization. By voicing your opinions and voting on community improvement proposals, you can help shape the future of your neighborhood. Participation ensures that the needs and desires of the community are accurately represented and addressed. If you own or manage a restaurant, bar, or service business like plumbing, electrical work, or handyman services, consider joining our network.",
  cta: { href: externalLinks.merchantApproval, label: "Become an SFLuv Merchant" }
};

export type Merchant = {
  name: string;
  description: string;
  href: string;
  logo: ImageAsset;
};

/** Businesses currently accepting SFLuv. */
export const merchants: Merchant[] = [
  {
    name: "Azalina’s",
    description: "Mouthwatering Malaysian Cuisine in San Francisco, CA since 2010.",
    href: "https://www.azalinas.com/",
    logo: {
      src: "/assets/external/images.getbento.com/99097CKmJL5kTBytRFQHlzNzO_533593_567145296630856_962075461_n-e4590a521a7e.png",
      alt: "Azalina’s logo",
      width: 270,
      height: 270
    }
  },
  {
    name: "Chamber’s Eat + Drink",
    description: "SF’s premier lounge, restaurant, and event venue.",
    href: "https://www.chambers-sf.com/",
    logo: {
      src: "/assets/external/pbs.twimg.com/kYMkMFps_400x400-086d5a43e2e9.jpg",
      alt: "Chamber’s Eat + Drink logo",
      width: 400,
      height: 400
    }
  },
  {
    name: "Estrellita’s",
    description: "Authentic Salvadoran food in the Tenderloin.",
    href: "https://www.estrellitassf.com/",
    logo: {
      src: "/assets/wp-content/uploads/2025/12/Estrellitas-logo_edited-1.jpg",
      alt: "Estrellita’s logo",
      width: 392,
      height: 313
    }
  },
  {
    name: "Felafalland",
    description: "Fresh Mediterranean cuisine served in traditional Yemeni style.",
    href: "https://falafelland.restaurant/",
    logo: {
      src: "/assets/wp-content/uploads/2026/01/Screenshot-2025-11-23-at-1.39.14-PM.jpg",
      alt: "Felafalland logo",
      width: 432,
      height: 284
    }
  },
  {
    name: "Outta Sight Pizza",
    description: "Your Neighbourhood Slice Shop.",
    href: "https://www.thatsouttasight.com/",
    logo: {
      src: "/assets/wp-content/uploads/2026/01/Outta-Sight-Pizza-Orange-Logo.jpeg",
      alt: "Outta Sight Pizza logo",
      width: 444,
      height: 284
    }
  },
  {
    name: "SFOrganiCA",
    description:
      "San Francisco-based delicatessen dedicated to delivering fresh, quality meals and organic groceries.",
    href: "https://sforganica.com/",
    logo: {
      src: "/assets/wp-content/uploads/2025/12/sf-organica.jpg",
      alt: "SFOrganiCA logo",
      width: 302,
      height: 302
    }
  },
  {
    name: "Tilted Brim",
    description:
      "San Francisco based brand and multi-label retailer, offering high quality clothing and accessories that fuse old-school cool and contemporary fit.",
    href: "https://tiltedbrimsf.com/",
    logo: {
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmAFHy9BdbxX9u8Q9s7WzB3IGRuQCZ1bCHEg&s",
      alt: "Tilted Brim logo",
      width: 396,
      height: 297
    }
  },
  {
    name: "Z Zoul Cafe",
    description: "Authentic Sudanese & Middle Eastern dishes in a casual setting.",
    href: "https://zzoulcafesanfranciscoonline.com/",
    logo: {
      src: "/assets/wp-content/uploads/2025/12/z-zoul.jpeg",
      alt: "Z Zoul Cafe logo",
      width: 284,
      height: 284
    }
  }
];
