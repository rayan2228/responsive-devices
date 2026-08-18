import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles data. In short: there is no backend, no account, and nothing you preview is ever sent to us.`,
  alternates: { canonical: "/privacy" },
};

const UPDATED = "18 August 2026";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-h1 text-ink">Privacy Policy</h1>
        <p className="mt-2 font-mono text-[13px] text-faint">
          Last updated {UPDATED}
        </p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted">
          <section className="rounded-panel border border-subtle bg-surface p-5">
            <h2 className="text-[15px] font-semibold text-ink">The short version</h2>
            <p className="mt-2 text-[14px]">
              {siteConfig.name} runs entirely in your browser. There is no
              account to create, no server that stores your data, and the
              websites you preview are loaded directly by your own browser —
              they never pass through us. The only data collected is anonymous
              usage analytics.
            </p>
          </section>

          <Section title="Who we are">
            <p>
              {siteConfig.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates{" "}
              <a href={siteConfig.url} className="text-ink underline underline-offset-4">
                {siteConfig.domain}
              </a>
              . This policy explains what happens to information when you use it.
            </p>
          </Section>

          <Section title="What we do not collect">
            <p>
              We do not ask for or store your name, email address, or any other
              personal detail, because there is nowhere to enter one. There are
              no accounts, no sign-in, and no contact forms.
            </p>
            <p className="mt-3">
              We do not receive, log or store the URLs you preview. When you
              enter an address, your browser loads that site directly inside a
              frame. Nothing about it is transmitted to us.
            </p>
          </Section>

          <Section title="What is stored in your browser">
            <p>
              Your custom viewport sizes, your selected devices, your layout and
              zoom preferences, and your light or dark theme choice are saved in
              your browser&rsquo;s local storage. This data stays on your device.
              It is not synced, not transmitted, and not readable by us. Clearing
              your site data removes it.
            </p>
          </Section>

          <Section title="Analytics">
            <p>
              We use Google Analytics and Google Tag Manager to understand how
              many people use the tool and which features are worth keeping.
              These set cookies and collect standard usage data — approximate
              location, browser and device type, pages visited and time on page.
              This is aggregate and not used to identify you.
            </p>
            <p className="mt-3">
              You can opt out with the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4"
              >
                Google Analytics opt-out add-on
              </a>{" "}
              or by blocking analytics in your browser. The tool works exactly
              the same either way.
            </p>
          </Section>

          <Section title="Third-party sites">
            <p>
              Previewed websites are third parties, and their own privacy
              policies apply to them. Loading a site here is equivalent to
              visiting it in a tab, and it may set its own cookies in your
              browser.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This tool is intended for developers and designers. We do not
              knowingly collect information from anyone under 13 — and, as above,
              we do not collect personal information from anyone.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              If this policy changes, the date at the top of this page changes
              with it. Material changes will be noted on the homepage.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy:{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-ink underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </Section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      <div className="mt-2 text-[14px]">{children}</div>
    </section>
  );
}
