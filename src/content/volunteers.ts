import type { ImageAsset } from "./types";

export type ArchivedEvent = {
  title: string;
  /** Display date exactly as published. */
  date?: string;
  href?: string;
  images: ImageAsset[];
};

export const volunteersContent = {
  title: "Volunteer Opportunities",
  /** Metadata only — not rendered on the page. */
  description:
    "Browse upcoming SFLuv volunteer events. All volunteers are thanked with SFLuv perks redeemable at participating community merchants.",
  archiveTitle: "Earlier events",
  archiveLead:
    "A look back at what our volunteers have built, cleaned, planted, and served across the neighborhood."
};

export const archivedEvents: ArchivedEvent[] = [
  {
    title: "GLIDE Business Beautification Day",
    date: "5/16/26",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/05/glide-logo.png",
        alt: "GLIDE logo",
        width: 398,
        height: 308
      }
    ]
  },
  {
    title: "Afternoon + Night of Ideas",
    date: "4/11/26",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/05/Afternoon-of-ideas-compressed.jpg",
        alt: "Afternoon of Ideas event banner",
        width: 6912,
        height: 3456
      },
      {
        src: "/assets/wp-content/uploads/2026/05/Night-of-Ideas.jpg",
        alt: "Night of Ideas event banner",
        width: 6912,
        height: 3456
      }
    ]
  },
  {
    title: "Eid Festival Mosaic Booth & Tile Making Workshop",
    date: "3/28/26",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/03/Eid-Festival-Mosaic-Booth-Facebook-Cover.jpeg",
        alt: "Eid Festival mosaic booth banner",
        width: 851,
        height: 315
      }
    ]
  },
  {
    title: "Oasis for Girls + Elm Alley Gardens",
    date: "3/20/26",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/03/Oasis-for-Girls-Elm-Alley-Gardens-Web-Banner1774989816.png",
        alt: "Oasis for Girls and Elm Alley Gardens banner",
        width: 851,
        height: 315
      }
    ]
  },
  {
    title: "St. Anthony Foundation Dining Room Second Shift",
    date: "2/9/26",
    href: "https://www.stanthonysf.org/volunteer/sign-up-now/",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/01/St-Anthony-Dining-volunteer-image.jpg",
        alt: "St. Anthony Foundation dining room volunteers",
        width: 2000,
        height: 642
      }
    ]
  },
  {
    title: "SuperBowl Saturday Clean Up",
    date: "2/8/26",
    href: "https://www.mobilize.us/civicjoyfund/event/891269/",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/01/Super-Bowl-Saturday.jpeg",
        alt: "Super Bowl Saturday clean up banner",
        width: 2000,
        height: 1600
      }
    ]
  },
  {
    title: "St. Anthony YPC + Outta Sight Pizza Onboarding",
    date: "1/24/2026",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/01/IMG_7194.jpg",
        alt: "St. Anthony YPC and Outta Sight Pizza onboarding",
        width: 4032,
        height: 3024
      }
    ]
  },
  {
    title: "Love Our City District 5 Beautification Day + Falafelland Onboarding",
    date: "1/10/2026",
    images: [
      {
        src: "/assets/wp-content/uploads/2026/01/DPW-Falafel-L-2.jpeg",
        alt: "Love Our City District 5 beautification day",
        width: 2000,
        height: 1545
      }
    ]
  },
  {
    title: "Tenderloin Holiday Tree Decorating + Z Zoul Onboarding",
    date: "12/1/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_6819.jpg",
        alt: "Tenderloin holiday tree decorating",
        width: 3024,
        height: 2882
      }
    ]
  },
  {
    title: "Dia De Los Muertos Children’s Crafting Table",
    date: "11/1/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_6603-1.jpg",
        alt: "Dia De Los Muertos children’s crafting table",
        width: 4032,
        height: 3024
      }
    ]
  },
  {
    title: "St. Anthony’s Clothing Drive & Estrellita’s Onboarding",
    date: "10/13/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_6474.jpg",
        alt: "St. Anthony’s clothing drive",
        width: 4032,
        height: 3024
      }
    ]
  },
  {
    title: "Larkin St. Tree Restoration & SFOrganica Onboarding",
    date: "8/30/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_5903-1.jpg",
        alt: "Larkin Street tree restoration",
        width: 4032,
        height: 3024
      }
    ]
  },
  {
    title: "Azalina’s Onboarding",
    date: "5/30/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_5529.jpg",
        alt: "Azalina’s onboarding",
        width: 4032,
        height: 3024
      }
    ]
  },
  {
    title: "Tilted Brim Onboarding",
    date: "4/3/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/IMG_5198-2.jpg",
        alt: "Tilted Brim onboarding",
        width: 3024,
        height: 4032
      }
    ]
  },
  {
    title: "YWAM Street Outreach & Chamber’s Onboarding",
    date: "3/6/25",
    images: [
      {
        src: "/assets/wp-content/uploads/2025/12/image000004.jpg",
        alt: "YWAM street outreach",
        width: 1131,
        height: 848
      }
    ]
  }
];
