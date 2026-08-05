import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { isExternalHref } from "./Button";

type CardProps = {
  children: ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  className?: string;
};

/** Content tile. Becomes an anchor when given an href, otherwise a plain box. */
export function Card({ children, href, className }: CardProps) {
  const classes = cn(
    "flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-5 no-underline",
    "text-ink shadow-panel transition-shadow duration-150",
    href && "hover:shadow-raised focus-visible:shadow-raised",
    className
  );

  if (!href) {
    return <div className={classes}>{children}</div>;
  }

  if (isExternalHref(href)) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="font-medium text-ink">{children}</h3>;
}

export function CardBody({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm text-ink-muted">{children}</p>;
}
