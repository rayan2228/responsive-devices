"use client";

import { ExternalLink, Globe, ShieldAlert } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

interface PreviewIframeProps {
  url: string;
  width: number;
  height: number;
  reloadNonce: number;
}

/**
 * Embed-blocking cannot be detected reliably from the client.
 *
 * A site sending `X-Frame-Options: DENY` or a `frame-ancestors` CSP produces
 * one of two behaviours: the frame never fires an event at all, or — as Chrome
 * does — it fires `load` against an error document. The second case is
 * indistinguishable from a successful load, because reading anything inside a
 * cross-origin frame throws by design.
 *
 * So: the timeout catches the silent case, and every pane carries a permanent
 * "open in new tab" control for the case that slips through. Guessing harder
 * would mean false positives on slow sites, which is worse.
 */
const BLOCKED_TIMEOUT_MS = 8000;

function PreviewIframeImpl({
  url,
  width,
  height,
  reloadNonce,
}: PreviewIframeProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "blocked">(
    "idle",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }
    setStatus("loading");
    timer.current = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "blocked" : s));
    }, BLOCKED_TIMEOUT_MS);

    return () => clearTimeout(timer.current);
  }, [url, reloadNonce]);

  if (!url) {
    return <EmptyState width={width} height={height} />;
  }

  return (
    <div className="relative h-full w-full bg-white">
      <iframe
        key={`${url}-${reloadNonce}`}
        src={url}
        title={`Preview at ${width} by ${height} pixels`}
        // `allow-same-origin` is included deliberately. Without it the framed
        // page gets an opaque origin and throws on cookies and localStorage,
        // which breaks a large share of real sites — useless for a preview
        // tool. What is withheld is `allow-top-navigation`, so a framed page
        // cannot redirect the workbench out from under you.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-orientation-lock allow-pointer-lock allow-presentation"
        referrerPolicy="no-referrer"
        loading="lazy"
        className="block h-full w-full border-0"
        onLoad={() => {
          clearTimeout(timer.current);
          setStatus("ready");
        }}
      />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500" />
        </div>
      )}

      {status === "blocked" && <BlockedState url={url} />}
    </div>
  );
}

function EmptyState({ width, height }: { width: number; height: number }) {
  return (
    <div className="grid h-full w-full place-items-center bg-elevated">
      <div className="px-6 text-center">
        <Globe size={24} className="mx-auto mb-3 text-faint" strokeWidth={1.5} />
        <p className="text-sm font-medium text-muted">Enter a URL to preview</p>
        <p className="mt-1 font-mono text-xs text-faint">
          {width} × {height}
        </p>
      </div>
    </div>
  );
}

function BlockedState({ url }: { url: string }) {
  let host = url;
  try {
    host = new URL(url).hostname;
  } catch {
    /* keep the raw string */
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-elevated p-6">
      <div className="max-w-[280px] text-center">
        <ShieldAlert
          size={24}
          strokeWidth={1.5}
          className="mx-auto mb-3 text-warning"
        />
        <p className="text-sm font-medium text-ink">This site blocks embedding</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          <span className="font-mono">{host}</span> sends an{" "}
          <span className="font-mono">X-Frame-Options</span> or{" "}
          <span className="font-mono">frame-ancestors</span> header. That is set
          by the site, and no preview tool can override it.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-control border border-subtle
                     bg-surface px-3 py-1.5 text-[13px] text-ink transition-colors hover:bg-canvas"
        >
          Open in new tab
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

/** Memoised so zoom and orientation changes elsewhere don't remount the frame
 *  and restart the guest page's load. */
export const PreviewIframe = memo(PreviewIframeImpl);
