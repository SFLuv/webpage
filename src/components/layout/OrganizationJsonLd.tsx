import { siteConfig, socialLinks } from "@/lib/site";

/**
 * Sitewide organization markup.
 *
 * Helps search engines associate the brand, logo, and social profiles with the
 * domain. `NGO` rather than plain `Organization` because SFLuv is a registered
 * 501(c)(3), which is what `nonprofitStatus` records.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteConfig.name,
    alternateName: "SFLuv.org",
    url: siteConfig.url,
    logo: new URL(siteConfig.logo, siteConfig.url).toString(),
    description: siteConfig.description,
    nonprofitStatus: "Nonprofit501c3",
    address: {
      "@type": "PostalAddress",
      streetAddress: "445 Baden St.",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94131",
      addressCountry: "US"
    },
    areaServed: {
      "@type": "City",
      name: "San Francisco"
    },
    sameAs: socialLinks.map((social) => social.href)
  };

  return (
    <script
      type="application/ld+json"
      // Serialized from our own object, not user-supplied markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
