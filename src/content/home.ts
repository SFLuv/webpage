import { routes } from "@/lib/routes";
import { externalLinks } from "@/lib/site";
import type { Cta, ImageAsset } from "./types";

export type Partner = {
  name: string;
  href: string;
  logo: ImageAsset;
};

type SplitSection = {
  title: string;
  body: string;
  cta: Cta;
  image: ImageAsset;
  /** Which side the image sits on at desktop widths. */
  imageSide: "left" | "right";
};

export const homeContent = {
  hero: {
    /** Each phrase wraps on its own, so the title breaks after the comma or not at all. */
    title: ["Empowering Merchants,", "Empowering Communities"]
  },

  partners: {
    title: "Our Partners",
    logos: [
      {
        name: "Celo",
        href: externalLinks.partners.celo,
        logo: {
          src: "/assets/partners/celo.png",
          alt: "Celo",
          width: 680,
          height: 166
        }
      },
      {
        name: "Citizen Wallet",
        href: externalLinks.partners.citizenWallet,
        logo: {
          src: "/assets/partners/citizen-wallet.png",
          alt: "Citizen Wallet",
          width: 515,
          height: 134
        }
      },
      {
        name: "GLIDE",
        href: externalLinks.partners.glide,
        logo: {
          src: "/assets/partners/glide.png",
          alt: "GLIDE",
          width: 600,
          height: 464
        }
      },
      {
        name: "St. Anthony's",
        href: externalLinks.partners.stAnthonys,
        logo: {
          src: "/assets/partners/st-anthonys.png",
          alt: "St. Anthony's",
          width: 1412,
          height: 279
        }
      },
      {
        name: "City Hope",
        href: externalLinks.partners.cityHope,
        logo: {
          src: "/assets/partners/city-hope.png",
          alt: "City Hope San Francisco",
          width: 700,
          height: 700
        }
      }
    ] satisfies Partner[]
  },

  upcomingEvents: {
    title: "Upcoming volunteer opportunities",
    lead: "Join a cleanup, a planting, or a meal service — and earn SFLuv you can spend with local merchants.",
    cta: { href: routes.volunteers, label: "More opportunities" } satisfies Cta
  }
};

/** Explicitly typed so `imageSide` stays a union even when one side is unused. */
export const homeSplits: SplitSection[] = [
    {
      title: "Our Mission",
      body: "At SFLuv, our mission is to support local merchants and small businesses in underserved neighborhoods through community improvements, civic engagement, and purposeful development of local economies. By harnessing blockchain technology, we are developing a community project management platform that enables small businesses and merchants to identify community needs, cultivate consensus, and direct improvement funds effectively. We further boost economic development by rewarding laborers and others who address these needs with SFLuv tokens, encouraging them to redeem their rewards at participating merchants.",
      cta: { href: routes.volunteers, label: "Get Involved" },
      image: {
        src: "/assets/wp-content/uploads/2024/06/AdobeStock_599890447-resize.jpg",
        alt: "",
        width: 5800,
        height: 3869
      },
      imageSide: "left"
    }
];
