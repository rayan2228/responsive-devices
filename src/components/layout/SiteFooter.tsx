import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-subtle">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Wordmark asLink={false} />
            <p className="text-[13px] text-faint">{siteConfig.tagline}</p>
          </div>

          <nav className="flex items-center gap-5 text-[13px]">
            {siteConfig.nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-subtle pt-6 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>
            Built by{" "}
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
            >
              {siteConfig.author.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
