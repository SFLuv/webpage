import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-brand text-white border-brand hover:bg-brand-hover hover:border-brand-hover shadow-[0_3px_10px_rgb(235_108_108/0.2)]",
  secondary: "bg-surface text-brand-deep border-line hover:bg-brand-tint",
  outline: "bg-transparent text-ink border-ink/25 hover:border-ink/60 hover:bg-ink/5"
} as const;

const sizes = {
  sm: "min-h-9 px-3.5 text-sm",
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-12 px-7 text-base"
} as const;

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
  /** Force target/rel for off-site links. Auto-detected from the href otherwise. */
  external?: boolean;
  /** Side effect on activation, e.g. closing the menu a link sits inside. */
  onClick?: () => void;
};

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

function classesFor({ variant = "primary", size = "md", className }: BaseProps) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl border font-medium leading-tight",
    "no-underline transition-[background-color,border-color,transform,box-shadow] duration-150",
    "hover:-translate-y-px disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );
}

export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

/** Primary call-to-action. Renders a Link, an anchor, or a button from its props. */
export function Button(props: LinkProps | ButtonProps) {
  if (typeof props.href === "string") {
    const { href, external, children, variant, size, className, onClick } = props as LinkProps;
    const classes = classesFor({ children, variant, size, className });
    const isExternal = external ?? isExternalHref(href);

    if (isExternal) {
      return (
        <a className={classes} href={href} target="_blank" rel="noreferrer" onClick={onClick}>
          {children}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { children, variant, size, className, type = "button", ...rest } = props as ButtonProps;

  return (
    <button className={classesFor({ children, variant, size, className })} type={type} {...rest}>
      {children}
    </button>
  );
}
