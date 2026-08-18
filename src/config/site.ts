/**
 * Single source of truth for everything brand-related.
 *
 * Nothing in the app should hardcode the product name, the domain, or a social
 * handle. Metadata, JSON-LD, the sitemap, robots, the header, the footer and
 * every share link all read from here.
 */
export const siteConfig = {
  name: "Responsive Devices",
  shortName: "ResponsiveDevices",
  domain: "responsivedevices.com",

  // Apex, no `www`. The host redirects www → apex, so this is the one canonical
  // origin. Previously `metadataBase` said www while share links used
  // window.location.origin, which meant shared URLs disagreed with canonicals.
  url: "https://responsivedevices.com",

  tagline: "Preview any site on every device.",
  description:
    "A fast, free responsive design tester. Paste a URL and see it render " +
    "across phones, tablets and desktops side by side — no install, no signup.",

  keywords: [
    "responsive design tester",
    "device preview",
    "viewport tester",
    "mobile preview",
    "responsive checker",
    "browser device emulator",
  ],

  author: {
    name: "Rayan Hossain",
    url: "https://www.linkedin.com/in/rayan2228/",
  },

  social: {
    x: "@responsivedev",
    xUrl: "https://x.com/responsivedev",
    github: "https://github.com/rayan2228/responsihub",
    linkedin: "https://www.linkedin.com/in/rayan2228/",
  },

  contact: {
    email: "contact@xrodev.com",
    url: "https://xrodev.com/",
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-3F2DSRTZ9P",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MMZVGMSM",
  },

  nav: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;

/** Build an absolute URL against the canonical origin. */
export const absoluteUrl = (path = "/"): string =>
  new URL(path, siteConfig.url).toString();
