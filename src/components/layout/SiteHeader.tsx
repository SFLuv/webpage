"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { externalLinks, primaryNav, siteConfig, type NavGroup, type NavItem } from "@/lib/site";
import { routes } from "@/lib/routes";

/**
 * Grace period before a hover-opened menu closes.
 *
 * Pointers do not travel in straight lines: moving from a trigger towards its
 * menu often clips a neighbouring element for a frame or two. Closing instantly
 * on `mouseleave` makes the menu feel like it is running away from the cursor.
 */
const MENU_CLOSE_DELAY_MS = 220;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelPendingClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openGroupNow = useCallback(
    (label: string) => {
      cancelPendingClose();
      setOpenGroup(label);
    },
    [cancelPendingClose]
  );

  /** Closes after the grace period, unless the pointer comes back first. */
  const closeGroupSoon = useCallback(() => {
    cancelPendingClose();
    closeTimer.current = setTimeout(() => setOpenGroup(null), MENU_CLOSE_DELAY_MS);
  }, [cancelPendingClose]);

  /** Closes immediately — for clicks, Escape, and focus leaving the group. */
  const closeGroupNow = useCallback(() => {
    cancelPendingClose();
    setOpenGroup(null);
  }, [cancelPendingClose]);

  // Route changes should never leave a menu hanging open.
  useEffect(() => {
    cancelPendingClose();
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname, cancelPendingClose]);

  // Never leave a timer running after unmount.
  useEffect(() => cancelPendingClose, [cancelPendingClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      closeGroupNow();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeGroupNow]);

  return (
    <header className="p-5">
      <div className="mx-auto flex min-h-[78px] w-full max-w-[1400px] items-center justify-between gap-5 rounded-panel bg-canvas px-6 shadow-panel">
        <Link className="flex shrink-0 items-center" href={routes.home} aria-label={`${siteConfig.name} home`}>
          <Image src={siteConfig.logo} alt={siteConfig.name} width={78} height={78} priority />
        </Link>

        <div className="flex items-center gap-5">
          <Button href={externalLinks.webWallet} size="sm">
            <span>Web Wallet</span>
            <ArrowRightIcon className="size-3.5 fill-current" />
          </Button>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {primaryNav.map((group) => (
              <DesktopNavGroup
                key={group.label}
                group={group}
                pathname={pathname}
                open={openGroup === group.label}
                onOpen={() => openGroupNow(group.label)}
                onCloseSoon={closeGroupSoon}
                onCloseNow={closeGroupNow}
              />
            ))}
            <a
              className="font-medium text-ink no-underline transition-colors hover:text-brand"
              href={externalLinks.donate}
              target="_blank"
              rel="noreferrer"
            >
              Donate
            </a>
          </nav>

          <button
            className="rounded-lg p-2 text-ink transition-colors hover:bg-ink/5 lg:hidden"
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon className="size-6 fill-current" />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} pathname={pathname} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

type DesktopNavGroupProps = {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onCloseSoon: () => void;
  onCloseNow: () => void;
};

function DesktopNavGroup({
  group,
  pathname,
  open,
  onOpen,
  onCloseSoon,
  onCloseNow
}: DesktopNavGroupProps) {
  const menuId = `nav-${group.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onCloseSoon}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onCloseNow();
      }}
    >
      <button
        className="flex items-center gap-1.5 font-medium text-ink transition-colors hover:text-brand"
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? onCloseNow() : onOpen())}
      >
        {group.label}
        <ChevronDownIcon className={cn("size-4 fill-current transition-transform", open && "rotate-180")} />
      </button>

      {/*
        The offset below the trigger is padding on this positioned wrapper, not
        a margin on the panel. That keeps the hoverable area continuous from the
        button to the menu — with a margin there is a dead gap between them, and
        crossing it fires `mouseleave` and closes the menu mid-travel.
      */}
      <div
        className={cn(
          "absolute top-full left-1/2 z-20 w-60 -translate-x-1/2 pt-3",
          open ? "block" : "hidden"
        )}
      >
        <div
          id={menuId}
          className="flex flex-col overflow-hidden rounded-2xl bg-surface p-2 shadow-raised"
        >
          {group.items.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onCloseNow} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const active = pathname === item.href;

  return (
    <Link
      className={cn(
        "rounded-lg px-3 py-2 text-ink no-underline transition-colors hover:bg-brand-tint",
        active && "bg-brand-tint font-medium"
      )}
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {item.label}
    </Link>
  );
}

function MobileNav({ open, pathname, onClose }: { open: boolean; pathname: string; onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-ink/40 transition-opacity lg:hidden",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={onClose}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "ml-auto flex h-full w-[min(340px,85vw)] flex-col gap-6 overflow-y-auto bg-canvas p-6 transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="self-end rounded-lg p-2 text-ink transition-colors hover:bg-ink/5"
          type="button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <CloseIcon className="size-6 fill-current" />
        </button>

        <nav className="flex flex-col gap-6" aria-label="Mobile">
          {primaryNav.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <p className="px-3 text-sm font-semibold tracking-wide text-ink-subtle uppercase">{group.label}</p>
              {group.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
              ))}
            </div>
          ))}

          <a
            className="rounded-lg px-3 py-2 font-medium text-ink no-underline transition-colors hover:bg-brand-tint"
            href={externalLinks.donate}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            Donate
          </a>
        </nav>
      </div>
    </div>
  );
}
