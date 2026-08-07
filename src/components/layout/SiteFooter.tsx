import Image from "next/image";
import Link from "next/link";
import { socialIcons } from "@/components/icons";
import { AppStoreButtons } from "@/components/layout/AppStoreButtons";
import { isExternalHref } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { footerNav, siteConfig, socialLinks } from "@/lib/site";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-canvas">
      <Container width="wide" as="div" className="py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid grow grid-cols-2 gap-8 md:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <p className="font-semibold text-ink">{group.label}</p>
                {group.items.map((item) =>
                  isExternalHref(item.href) ? (
                    <a
                      key={item.href}
                      className="text-ink-muted no-underline transition-colors hover:text-brand"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      className="text-ink-muted no-underline transition-colors hover:text-brand"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5">
            {/* Desktop only — on mobile these live in the slide-out menu. */}
            <AppStoreButtons className="hidden lg:flex" />

            <ul className="flex gap-3 lg:justify-end" aria-label="Social links">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon];
              return (
                <li key={social.href}>
                  <a
                    className="flex size-10 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-brand hover:text-white"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                  >
                    <Icon className="size-5 fill-current" />
                  </a>
                </li>
              );
            })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between">
          <Link href={routes.home} aria-label={`${siteConfig.name} home`} className="flex items-center">
            <Image src={siteConfig.logo} alt={siteConfig.name} width={56} height={56} />
          </Link>
          <p className="text-sm text-ink-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. A 501(c)(3) nonprofit organization.
          </p>
        </div>
      </Container>
    </footer>
  );
}
