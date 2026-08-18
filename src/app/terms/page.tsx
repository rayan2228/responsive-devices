import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms covering use of ${siteConfig.name} — a free, browser-based responsive design preview tool.`,
  alternates: { canonical: "/terms" },
};

const UPDATED = "18 August 2026";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-h1 text-ink">Terms of Use</h1>
        <p className="mt-2 font-mono text-[13px] text-faint">
          Last updated {UPDATED}
        </p>

        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-muted">
          <Section title="Acceptance">
            <p>
              By using{" "}
              <a href={siteConfig.url} className="text-ink underline underline-offset-4">
                {siteConfig.domain}
              </a>{" "}
              you agree to these terms. If you do not agree with them, please
              don&rsquo;t use the service.
            </p>
          </Section>

          <Section title="What the service is">
            <p>
              {siteConfig.name} is a free tool that renders a web address you
              supply inside frames at various device dimensions, so you can check
              how it responds. It runs in your browser. There is no account and
              no charge.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to use the service to:</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Preview content that is illegal where you are</li>
              <li>
                Frame a site in order to misrepresent it, phish, or pass its
                content off as your own
              </li>
              <li>
                Attempt to overload, scrape or automate the service beyond
                ordinary interactive use
              </li>
              <li>
                Circumvent access controls on a site you are not authorised to
                view
              </li>
            </ul>
          </Section>

          <Section title="Third-party content">
            <p>
              Any site you preview belongs to someone else. We do not host,
              control, endorse or take responsibility for it, and their terms
              apply to their content. Some sites decline to be framed at all,
              which is their prerogative and not a fault in this tool.
            </p>
          </Section>

          <Section title="Accuracy">
            <p>
              Viewport dimensions are accurate, and that is what your layout
              responds to. However, previews still render using your desktop
              browser engine, so device-specific font rendering, scrollbars,
              touch behaviour and mobile browser chrome can differ from real
              hardware. Test on real devices before shipping anything critical.
            </p>
          </Section>

          <Section title="Availability and warranty">
            <p>
              The service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo;, without warranties of any kind. It may change,
              break or be withdrawn at any time without notice. We do not
              guarantee it will be uninterrupted or error-free.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the fullest extent permitted by law, we are not liable for any
              indirect or consequential loss arising from use of the service,
              including lost work, lost data or any defect that reaches
              production. It is a preview aid, not a guarantee of correctness.
            </p>
          </Section>

          <Section title="Your data">
            <p>
              Preferences and custom devices are stored in your own browser.
              See the{" "}
              <a href="/privacy" className="text-ink underline underline-offset-4">
                Privacy Policy
              </a>{" "}
              for details.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              These terms may be updated; the date at the top reflects the last
              revision. Continued use after a change means you accept it.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms:{" "}
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
