import { Github } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { PaletteTrigger } from "./PaletteTrigger";

/** Server component — only the toggle and palette trigger are client-side. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-subtle bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />

        <div className="flex items-center gap-2">
          <PaletteTrigger />
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source on GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-control
                       border border-subtle bg-surface text-muted
                       transition-colors duration-150 hover:bg-elevated hover:text-ink"
          >
            <Github size={15} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
