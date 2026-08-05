import type { BlockNode } from "@/components/content/document";
import type { ImageAsset } from "./types";

export type TeamMember = {
  name: string;
  role: string;
  photo: ImageAsset;
  bio: BlockNode[];
  links?: { label: string; href: string }[];
};

export const teamMembers: TeamMember[] = [
  {
    name: "Beth O’Leary, CPA/MPA",
    role: "CEO",
    photo: {
      src: "/assets/wp-content/uploads/2024/08/Beth-OLeary-Head-Shot-1.jpg",
      alt: "Beth O’Leary",
      width: 1067,
      height: 1600
    },
    bio: [
      {
        type: "paragraph",
        children: [
          "Beth has lived in San Francisco for 30 years, raising 3 sons together with her husband, Paul while working for small and medium sized businesses. As a result, she holds a deep loyalty to the City and the local business community that lends San Francisco its unique sense of place. Committed to responsive governance and equity, Beth is grateful for the opportunity to collaborate with local business owners, to improve their communities and expand their economic opportunities."
        ]
      }
    ]
  },
  {
    name: "Vipul Vyas, MBA",
    role: "Treasurer",
    photo: {
      src: "/assets/wp-content/uploads/2024/08/Vipul-Vyas-Head-Shot.jpg",
      alt: "Vipul Vyas",
      width: 200,
      height: 200
    },
    bio: [
      {
        type: "paragraph",
        children: [
          "Vipul has a passion for city planning, urban beautification, and public transportation. He also has over 20 years of experience in technology, blockchain, and artificial intelligence. Vipul hopes to leverage this experience to improve city life through compelling projects that beautify our civic surroundings. He is particularly passionate about empowering communities to determine for themselves what their needs are and ease the process of realizing their aspirations."
        ]
      }
    ],
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/vipulnvyas" }]
  },
  {
    name: "William Riggs, PhD",
    role: "Secretary",
    photo: {
      src: "/assets/wp-content/uploads/2024/08/Billy-Riggs-Head-Shot.jpg",
      alt: "William Riggs",
      width: 218,
      height: 218
    },
    bio: [
      {
        type: "paragraph",
        children: [
          "William (Billy) Riggs, is a San Francisco resident as well as a professor and consultant in urban technology and sustainability development. He teaches and leads research at the University of San Francisco, and is co-director of the ",
          {
            type: "link",
            href: "https://www.usfca.edu/arts-sciences/research/centers-institutes/autonomous-vehicles-city-initiative",
            children: ["Autonomous Vehicles and the City Initiative"]
          },
          ". He has authored over 100 publications, including the 2022 Mineta Transportation Institute report, ",
          {
            type: "link",
            href: "/assets/external/transweb.sjsu.edu/2165-Riggs-Blockchain-Financial-Ecosystem-Infrastructure-2f02c6278a52.pdf",
            children: [
              "Blockchain and Distributed Autonomous Community Ecosystems: Opportunities to Democratize Finance and Delivery of Transport, Housing, Urban Greening and Community Infrastructure"
            ]
          },
          ". Dr. Riggs’s most recent book is, ",
          {
            type: "link",
            href: "https://bristoluniversitypress.co.uk/end-of-the-road",
            children: ["End of the Road: Reimagining the Street as the Heart of the City"]
          },
          ", which envisions a distributed and sustainable future for our cities."
        ]
      }
    ],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/billyriggs" },
      { label: "Twitter", href: "https://twitter.com/billyriggs" }
    ]
  },
  {
    name: "Paul O’Leary",
    role: "Technical Advisor",
    photo: {
      src: "/assets/wp-content/uploads/2024/08/Paul-OLeary-Head-Shot.jpg",
      alt: "Paul O’Leary",
      width: 860,
      height: 999
    },
    bio: [
      {
        type: "paragraph",
        children: [
          "Paul has lived in San Francisco for over 30 years and raised three sons in The City with his wife Beth. Paul is a Silicon Valley veteran having worked as an engineer, technical leader, founder and CEO of multiple successful software startups. His passion for innovation and transformational technology has recently led him to focus on blockchain and applied cryptographic applications that have the potential to radically improve the way that value is created and distributed in local and global communities."
        ]
      }
    ]
  },
  {
    name: "PJ O’Leary",
    role: "Lead Developer",
    photo: {
      src: "/assets/wp-content/uploads/2025/07/pj_profile.jpeg",
      alt: "PJ O’Leary",
      width: 730,
      height: 856
    },
    bio: [
      {
        type: "paragraph",
        children: [
          "Born and raised in San Francisco, PJ has an intimate connection with the city and its culture. As a native San Franciscan, he has seen firsthand both the challenges that the city faces, and the resilience of communities that take them on. Alongside his love of innovation and wonder at the possibilities that blockchain unlocks, this understanding led him to the logical conclusion that brought him to work on SFLUV today: We must utilize new technologies to aid our communities and bring about social good for all."
        ]
      }
    ]
  }
];
