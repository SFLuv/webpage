/** An image in `public/`, with its intrinsic size so `next/image` can reserve space. */
export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** A call-to-action rendered as a Button. */
export type Cta = {
  href: string;
  label: string;
};
