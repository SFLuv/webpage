import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedInIcon, XIcon } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="footer-links">
          <FooterColumn title="Our Ecosystem" links={[{ href: "/how-it-works", label: "How it Works" }]} />
          <FooterColumn
            title="Our Partners"
            links={[
              { href: "http://intn.city", label: "INTN.CITY" },
              { href: "http://citizenwallet.xyz", label: "Citizen Wallet" },
              { href: "https://www.berachain.com/", label: "Berachain" }
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              { href: "/resources", label: "Learn More" },
              { href: "/contact", label: "Contact Us" },
              { href: "/support", label: "Support" }
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "/financials-and-reports", label: "Reports" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-and-conditions", label: "Terms and Conditions" }
            ]}
          />
        </div>

        <ul className="social-links" aria-label="Social links">
          <li>
            <a href="https://linkedin.com/company/sf-luv" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/GiveSFLuv" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </li>
          <li>
            <a href="https://x.com/SFLUVcommunity" aria-label="X">
              <XIcon />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/sfluv_community/" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </li>
        </ul>
      </div>

      <div className="site-footer__bottom">
        <Link className="footer-logo" href="/" aria-label="SFLuv home">
          <img src="/assets/wp-content/uploads/2024/06/cropped-SFLUV-Currency-Symbol-Logo-1.png" alt="SFLuv" />
        </Link>
        <p>
          Designed with <a href="https://wordpress.org" rel="nofollow">WordPress</a>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="footer-column">
      <p>
        <strong>{title}</strong>
      </p>
      {links.map((link) => {
        const external = /^https?:\/\//.test(link.href);
        if (external) {
          return (
            <p key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </p>
          );
        }

        return (
          <p key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </p>
        );
      })}
    </div>
  );
}
