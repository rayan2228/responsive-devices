import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

export function Wordmark({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      <Logo size={22} />
      <span className="text-[15px] font-semibold tracking-[-0.015em]">
        {siteConfig.name}
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className="rounded transition-opacity hover:opacity-80"
    >
      {content}
    </Link>
  );
}
