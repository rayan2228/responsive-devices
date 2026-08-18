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

  /** Display form, without the `www.` prefix — used in the OG image footer. */
  domain: "responsivedevices.com",

  /**
   * Canonical origin, and it must be the `www.` form.
   *
   * The live host 308-redirects the apex to www, so `www` is the URL that
   * actually serves. A canonical pointing at the apex would name a URL that
   * immediately redirects, which defeats the purpose of declaring one.
   *
   * If the redirect is ever flipped to www → apex, change this to match — the
   * rule is that this string names whatever URL responds 200.
   */
  url: "https://www.responsivedevices.com",

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
    // No `x` handle on purpose. @responsivedev was a placeholder that does not
    // exist, and pointing twitter:site / twitter:creator at a 404 attributes
    // every shared card to a non-existent account. The summary_large_image
    // card works fine without it. Add the handle here and restore the two
    // fields in layout.tsx if an account is ever registered.
    github: "https://github.com/rayan2228/responsive-devices",
    linkedin: "https://www.linkedin.com/in/rayan2228/",
  },

  // Referenced by the privacy policy and terms as the contact of record, so
  // mail on this address needs to actually be routed somewhere you read.
  contact: {
    email: "contact@responsivedevices.com",
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "G-3F2DSRTZ9P",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MMZVGMSM",
  },

  /**
   * Google Search Console verification.
   *
   * The previous token was bound to responsihub.com and does not validate on
   * the new domain, so there is no default here. Verify the new property in
   * Search Console, then set NEXT_PUBLIC_GOOGLE_VERIFICATION in the Vercel
   * project — no code change needed. Until it is set, the meta tag is simply
   * omitted rather than shipping a dead one.
   */
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? null,

  nav: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;

/** Build an absolute URL against the canonical origin. */
export const absoluteUrl = (path = "/"): string =>
  new URL(path, siteConfig.url).toString();
