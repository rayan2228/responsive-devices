import type { Chrome } from "@/types";

/**
 * Hardware detail drawn over the top of the screen. All sizes are device
 * pixels — the parent applies a single transform, so nothing here is
 * pre-multiplied by the scale factor.
 */
export function DeviceChrome({
  chrome,
  screenWidth,
  origin,
}: {
  chrome: Chrome;
  screenWidth: number;
  origin: string | null;
}) {
  switch (chrome.kind) {
    case "island":
      return (
        <div
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-black"
          style={{ top: 11, width: chrome.w, height: chrome.h }}
        />
      );

    case "notch":
      return (
        <div
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 bg-black"
          style={{
            top: 0,
            width: chrome.w,
            height: chrome.h,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          }}
        />
      );

    case "punch":
      return (
        <div
          className="pointer-events-none absolute z-10 rounded-full bg-black"
          style={{
            top: 12,
            left: `calc(50% + ${chrome.dx}px)`,
            transform: "translateX(-50%)",
            width: chrome.d,
            height: chrome.d,
          }}
        />
      );

    case "browser":
      return <BrowserChrome os={chrome.os} width={screenWidth} origin={origin} />;

    case "none":
    default:
      return null;
  }
}

/** A desktop preset without browser chrome reads as a floating rectangle.
 *  Forty lines of tab strip is what makes it read as a screen. */
function BrowserChrome({
  os,
  width,
  origin,
}: {
  os: "mac" | "win";
  width: number;
  origin: string | null;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b border-black/10 bg-[#e8e8ea] px-4 dark:border-white/10 dark:bg-[#2a2b2e]"
      style={{ height: 40, width }}
    >
      {os === "mac" ? (
        <div className="flex shrink-0 gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
      ) : (
        <div className="ml-auto flex shrink-0 items-center gap-4 text-[#5b606a] dark:text-[#9ba1a9]">
          <span className="block h-px w-3 bg-current" />
          <span className="block h-2.5 w-2.5 border border-current" />
          <span className="block text-[13px] leading-none">✕</span>
        </div>
      )}

      {os === "mac" && (
        <div className="flex h-6 min-w-0 flex-1 items-center rounded-md bg-white/70 px-3 dark:bg-black/25">
          <span className="truncate font-mono text-[11px] text-[#5b606a] dark:text-[#9ba1a9]">
            {origin ?? "about:blank"}
          </span>
        </div>
      )}
    </div>
  );
}
