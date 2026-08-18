import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build rather than shipped as a PNG.
 *
 * The two static images this replaces were 1.19 MB and 2.2 MB. This lands
 * around 40 KB and, more usefully, cannot drift out of sync with the branding
 * in `config/site.ts`.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090a",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand mark — three nested screens */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="3" width="22" height="15" rx="2.5" stroke="#edeef0" strokeWidth="1.5" opacity="0.35" />
            <rect x="1" y="7" width="14" height="14" rx="2" stroke="#edeef0" strokeWidth="1.5" opacity="0.65" />
            <rect x="1" y="11" width="7.5" height="10" rx="1.75" stroke="#edeef0" strokeWidth="1.5" />
          </svg>
          <span style={{ color: "#edeef0", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#edeef0",
              fontSize: 76,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </span>
          <span style={{ color: "#9ba1a9", fontSize: 27, marginTop: 22, maxWidth: 820, lineHeight: 1.4 }}>
            Compare phones, tablets and desktops side by side. Free, instant, no
            install.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", height: 3, width: 76, background: "#6e79f0" }} />
          <span style={{ color: "#63676e", fontSize: 23 }}>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    size,
  );
}
