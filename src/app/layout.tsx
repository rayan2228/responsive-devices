import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Head from 'next/head';
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Responsihub – Responsive Device Preview Tool',
    template: '%s | Responsihub',
  },
  description: 'Preview your designs across multiple devices with Responsihub – built for designers, developers, and QA engineers.',
  keywords: ['responsihub', 'responsive design', 'device preview', 'web design', 'UI testing', 'mockup tool'],
  authors: [{ name: 'Responsihub Team', url: 'https://www.responsihub.com' }],
  creator: 'Responsihub Team',
  generator: 'Next.js',
  metadataBase: new URL('https://www.responsihub.com'),
  openGraph: {
    title: 'Responsihub – Responsive Design Preview Tool',
    description: 'Test your designs live on real devices with Responsihub.',
    url: 'https://www.responsihub.com',
    siteName: 'Responsihub',
    images: [
      {
        url: 'https://www.responsihub.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Responsihub Preview',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@responsihub',
    creator: '@responsihub',
    title: 'Responsihub – Responsive Design Tool',
    description: 'Easily test your UI designs on various devices.',
    images: ['https://www.responsihub.com/twitter-card.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  verification: {
    google: 'pODC2wrngSGaNlkVCpYajNJvI748aMcdqLTKpxtRIpc',
  }
};


const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Responsihub",
  url: "https://www.responsihub.com",
  operatingSystem: "All",
  applicationCategory: "DesignApplication",
  offers: {
    "@type": "Offer",
    price: "0", // Or real price
    priceCurrency: "USD"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "218"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://www.responsihub.com/" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <GoogleAnalytics gaId="G-3F2DSRTZ9P" />
        <GoogleTagManager gtmId="GTM-MMZVGMSM" />
      </body>
    </html>
  );
}



