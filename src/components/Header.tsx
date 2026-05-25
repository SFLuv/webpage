"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./icons";

const getInvolved = [
  { href: "/donors", label: "Donors" },
  { href: "/community", label: "Community Members" },
  { href: "/merchants", label: "Merchants" },
  { href: "/improvers", label: "Improvers" },
  { href: "/volunteers", label: "Volunteers" }
];

const about = [
  { href: "/mission-and-vision", label: "Mission and Vision" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "/our-team", label: "Our Team" },
  { href: "/financials-and-reports", label: "Financials and Reports" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link className="site-logo" href="/" onClick={closeMenu} aria-label="SFLuv home">
          <img src="/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png" alt="SFLuv" />
        </Link>

        <div className="site-header__right">
          <a className="wallet-button" href="https://app.sfluv.org/map" target="_blank" rel="noreferrer">
            <span>Web Wallet</span>
            <ArrowRightIcon />
          </a>

          <button className="menu-toggle" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <NavGroup label="Get Involved" items={getInvolved} activePath={pathname} />
            <NavGroup label="About" items={about} activePath={pathname} />
            <a href="https://donate.stripe.com/14k7uH2ng6Jvg1ydQQ">Donate</a>
          </nav>
        </div>
      </div>

      <div className={`mobile-nav ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-nav__panel">
          <button className="mobile-nav__close" type="button" onClick={closeMenu} aria-label="Close menu">
            <CloseIcon />
          </button>

          <MobileGroup label="Get Involved" items={getInvolved} activePath={pathname} onNavigate={closeMenu} />
          <MobileGroup label="About" items={about} activePath={pathname} onNavigate={closeMenu} />
          <a className="mobile-nav__link" href="https://donate.stripe.com/14k7uH2ng6Jvg1ydQQ" onClick={closeMenu}>
            Donate
          </a>
        </div>
      </div>
    </header>
  );
}

function NavGroup({
  label,
  items,
  activePath
}: {
  label: string;
  items: { href: string; label: string }[];
  activePath: string;
}) {
  return (
    <div className="nav-group">
      <button className="nav-group__trigger" type="button">
        {label}
        <span aria-hidden="true">v</span>
      </button>
      <div className="nav-group__menu">
        {items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={activePath === item.href ? "page" : undefined}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({
  label,
  items,
  activePath,
  onNavigate
}: {
  label: string;
  items: { href: string; label: string }[];
  activePath: string;
  onNavigate: () => void;
}) {
  return (
    <div className="mobile-nav__group">
      <p>{label}</p>
      {items.map((item) => (
        <Link key={item.href} className="mobile-nav__link" href={item.href} onClick={onNavigate} aria-current={activePath === item.href ? "page" : undefined}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}
