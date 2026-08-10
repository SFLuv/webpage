import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const widths = {
  narrow: "max-w-3xl",
  content: "max-w-5xl",
  wide: "max-w-[1400px]"
} as const;

type ContainerProps = {
  children: ReactNode;
  /** Horizontal measure. Defaults to the standard content column. */
  width?: keyof typeof widths;
  as?: ElementType;
  className?: string;
};

/**
 * Centers content at one of three standard measures with page gutters.
 *
 * The desktop gutter is wider than the header's own, so page content sits
 * visibly inside the top bar's edges rather than running flush with them.
 * Full-bleed elements — the partner and event carousels — are deliberately
 * rendered outside a Container and so keep running edge to edge.
 */
export function Container({ children, width = "content", as: Tag = "div", className }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5 lg:px-10", widths[width], className)}>{children}</Tag>;
}
