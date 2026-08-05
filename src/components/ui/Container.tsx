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

/** Centers content at one of three standard measures with page gutters. */
export function Container({ children, width = "content", as: Tag = "div", className }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-5", widths[width], className)}>{children}</Tag>;
}
