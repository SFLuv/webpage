import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  surface: "bg-surface",
  muted: "bg-surface-muted",
  brand: "bg-brand text-white",
  translucent: "bg-surface/85 backdrop-blur-sm"
} as const;

const paddings = {
  none: "",
  sm: "p-5",
  md: "p-6 sm:p-8",
  lg: "p-7 sm:p-10"
} as const;

type PanelProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
  padding?: keyof typeof paddings;
  bordered?: boolean;
  as?: ElementType;
  className?: string;
  id?: string;
};

/** The rounded card that the whole site is composed of. */
export function Panel({
  children,
  tone = "surface",
  padding = "md",
  bordered = false,
  as: Tag = "div",
  className,
  id
}: PanelProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "rounded-panel shadow-panel",
        tones[tone],
        paddings[padding],
        bordered && "border border-line",
        className
      )}
    >
      {children}
    </Tag>
  );
}
