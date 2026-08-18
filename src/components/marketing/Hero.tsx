import { siteConfig } from "@/config/site";

/** Server component. Deliberately compact — the tool is the hero, this just
 *  frames it. */
export function Hero() {
  return (
    <div className="pb-8 pt-12 text-center sm:pt-16">
      <p className="text-eyebrow uppercase text-faint">Responsive testing</p>

      <h1 className="mx-auto mt-3 max-w-3xl text-display text-ink text-balance">
        {siteConfig.tagline}
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
        Paste a URL and see it render across phones, tablets and desktops at
        once. Runs entirely in your browser — nothing is uploaded, nothing to
        install.
      </p>
    </div>
  );
}
