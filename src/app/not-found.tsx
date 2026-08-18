import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-screen max-w-[1400px] place-items-center px-6">
      <div className="text-center">
        <Wordmark />
        <p className="mt-8 font-mono text-[13px] text-faint">404</p>
        <h1 className="mt-2 text-h1 text-ink">This page doesn&rsquo;t exist</h1>
        <p className="mt-2 text-[15px] text-muted">
          The link may be out of date, or the address mistyped.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-control bg-ink px-4
                     text-sm font-medium text-canvas transition-opacity hover:opacity-90"
        >
          Back to the preview tool
        </Link>
      </div>
    </div>
  );
}
