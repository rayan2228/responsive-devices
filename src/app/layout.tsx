import { siteConfig } from "@/config/site";
import { appSchema } from "@/lib/schema";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  generator: "Next.js",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    // `site` and `creator` are omitted until a real account exists — see the
    // note in config/site.ts. The card still renders with the OG image.
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: "/",
  },
  ...(siteConfig.googleVerification
    ? { verification: { google: siteConfig.googleVerification } }
    : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};

/**
 * Applies the persisted theme before first paint.
 *
 * Must be inline and synchronous in <head> — `next/script` with
 * `beforeInteractive` still injects after the head is streamed, which is
 * visible as a flash of the wrong theme on hard reload.
 */
const themeScript = `(function(){try{
var s=localStorage.getItem('rd:theme');
var d=s==='system'?matchMedia('(prefers-color-scheme:dark)').matches:s!=='light';
document.documentElement.classList.toggle('dark',d);
document.documentElement.style.colorScheme=d?'dark':'light';
}catch(e){document.documentElement.classList.add('dark')}
try{
if(/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent))
document.documentElement.classList.add('is-apple');
}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema()) }}
        />
      </head>
      {/*
        Browser extensions (ColorZilla's `cz-shortcut-listen`, Grammarly's
        `data-gr-*`, and friends) attach attributes to <body> before React
        hydrates, which React reports as a mismatch. This suppresses one level
        only — the body element's own attributes — so real mismatches anywhere
        in the tree below are still surfaced.
      */}
      <body
        className="bg-canvas text-ink font-sans antialiased"
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.analytics.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <SpeedInsights />
        <GoogleAnalytics gaId={siteConfig.analytics.gaId} />
        <GoogleTagManager gtmId={siteConfig.analytics.gtmId} />
      </body>
    </html>
  );
}
