import type { ImageAsset } from "./types";

export type Book = {
  title: string;
  author: string;
  href: string;
  cover: ImageAsset;
};

export type Podcast = {
  name: string;
  href: string;
  /** YouTube embed URL for the featured episode. */
  embedUrl: string;
};

export const resourcesContent = {
  title: "Resources",
  readingTitle: "What We’re Reading",
  podcastsTitle: "Podcasts We Love",
  technicalTitle: "Get Technical"
};

export const books: Book[] = [
  {
    title: "Read Write Own",
    author: "Chris Dixon",
    href: "https://readwriteown.com/",
    cover: {
      src: "/assets/external/m.media-amazon.com/71tgNZQXn-L._AC_UF1000-1000_QL80_-bc19111b1df6.jpg",
      alt: "Read Write Own book cover",
      width: 667,
      height: 1000
    }
  },
  {
    title: "How to DAO: Mastering the Future of Internet Coordination",
    author: "Owocki and Puncar",
    href: "https://www.amazon.com/How-DAO-Mastering-Internet-Coordination/dp/059371377X",
    cover: {
      src: "/assets/wp-content/uploads/2025/06/HowToDao.jpg",
      alt: "How to DAO book cover",
      width: 996,
      height: 1500
    }
  },
  {
    title: "The Code of Capital",
    author: "Katharina Pistor",
    href: "https://press.princeton.edu/books/hardcover/9780691178974/the-code-of-capital",
    cover: {
      src: "/assets/external/pup-assets.imgix.net/9780691178974-a9264b85d7b8.jpg",
      alt: "The Code of Capital book cover",
      width: 1500,
      height: 2280
    }
  }
];

export const podcasts: Podcast[] = [
  {
    name: "Bankless",
    href: "https://www.bankless.com/podcast",
    embedUrl: "https://www.youtube.com/embed/Xb4g8LzcFSI"
  },
  {
    name: "The a16z Podcast",
    href: "https://a16z.com/podcasts/a16z-podcast",
    embedUrl: "https://www.youtube.com/embed/S4vaqf55NpQ"
  }
];

export const technicalLinks = [
  { label: "ethereum.org — What is Ethereum?", href: "https://ethereum.org/en/what-is-ethereum/" },
  { label: "polygon.technology", href: "https://polygon.technology/" }
];
