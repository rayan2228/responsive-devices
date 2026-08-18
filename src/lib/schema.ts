import { absoluteUrl, siteConfig } from "@/config/site";
import type { FaqItem } from "@/data/faq";

/**
 * JSON-LD for the app itself.
 *
 * `WebApplication` rather than `SoftwareApplication` — this runs in the
 * browser, there is nothing to install.
 *
 * Note: this deliberately carries no `aggregateRating`. The previous version
 * hardcoded 4.9 from 218 reviews with no reviewable source behind it, which is
 * a Google structured-data policy violation and grounds for a manual action on
 * the whole property. Do not add one back without real, displayed reviews.
 */
export function appSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    featureList: [
      "Preview any URL across phone, tablet and desktop viewports",
      "Compare up to four devices side by side",
      "Custom viewport sizes",
      "Portrait and landscape orientation",
      "Shareable preview links",
      "Keyboard shortcuts and command palette",
    ],
  };
}

/**
 * FAQ schema, generated from the same data the visible FAQ renders.
 * Never hand-write this separately — schema that disagrees with the page is
 * the other common trigger for a structured-data manual action.
 */
export function faqSchema(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(trail: ReadonlyArray<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
