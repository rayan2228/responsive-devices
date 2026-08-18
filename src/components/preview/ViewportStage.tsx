"use client";

import { ExternalLink, RotateCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { findById, frameSize } from "@/lib/devices";
import { resolveScale } from "@/lib/scale";
import { cn } from "@/lib/cn";
import { usePreview } from "@/state/preview-context";
import { DeviceFrame } from "./DeviceFrame";

const GUTTER = 24;
/** Fit is bounded by height as well as width — a 932px phone at 100% would
 *  otherwise run off the bottom and make the grid useless for comparison. */
const MAX_FRAME_HEIGHT = 680;

export function ViewportStage() {
  const { state, dispatch } = usePreview();
  const stageRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(1200);

  // ResizeObserver rather than a window resize listener: the stage can change
  // width without the window doing so (sidebar, scrollbar, layout switch).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setAvailable(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const visible =
    state.layout === "single" ? state.viewports.slice(0, 1) : state.viewports;

  // Every pane shares the row, so divide by the full count rather than a
  // fixed column cap — otherwise four frames each claim half the stage.
  const columns = Math.max(visible.length, 1);
  const perColumn = (available - GUTTER * (columns - 1)) / columns;

  return (
    <div
      ref={stageRef}
      className="w-full overflow-x-auto overflow-y-hidden"
      data-stage
    >
      <div
        className={cn(
          "flex min-h-[360px] flex-wrap items-start justify-center gap-6 py-8",
          visible.length > 1 && "justify-start",
        )}
      >
        {visible.map((vp) => {
          const device = findById(state.devices, vp.deviceId);
          if (!device) return null;

          const geom = frameSize(device, vp.orientation);
          const scale = resolveScale(
            state.zoom,
            geom.width,
            perColumn,
            geom.height,
            MAX_FRAME_HEIGHT,
          );
          const isActive = vp.key === state.activeKey && visible.length > 1;

          return (
            <div
              key={vp.key}
              onFocusCapture={() => dispatch({ t: "vp/focus", key: vp.key })}
              onMouseDown={() => dispatch({ t: "vp/focus", key: vp.key })}
              className="flex flex-col gap-2.5"
            >
              <div
                className={cn(
                  "flex items-center gap-2 rounded-control border px-2.5 py-1.5 transition-colors",
                  isActive
                    ? "border-accent/40 bg-accent-soft"
                    : "border-transparent",
                )}
              >
                <span className="text-[13px] font-medium text-ink">
                  {device.name}
                </span>
                <span className="font-mono text-[11px] text-faint">
                  {geom.screen.width}×{geom.screen.height}
                </span>
                {scale < 0.999 && (
                  <span className="font-mono text-[11px] text-warning">
                    {Math.round(scale * 100)}%
                  </span>
                )}

                <div className="ml-auto flex items-center gap-0.5">
                  {/* Always present, not just on the blocked state — a site
                      that refuses embedding can still look like a blank
                      successful load, and this is the way out of it. */}
                  {state.committedUrl && (
                    <a
                      href={state.committedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${state.committedUrl} in a new tab`}
                      title="Open in new tab"
                      className="grid h-6 w-6 place-items-center rounded-[7px] text-faint
                                 transition-colors hover:bg-elevated hover:text-ink"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <button
                    onClick={() => dispatch({ t: "vp/rotate", key: vp.key })}
                    aria-label={`Rotate ${device.name}`}
                    title="Rotate"
                    className="grid h-6 w-6 place-items-center rounded-[7px] text-faint
                               transition-colors hover:bg-elevated hover:text-ink"
                  >
                    <RotateCw size={12} />
                  </button>
                  {visible.length > 1 && (
                    <button
                      onClick={() => dispatch({ t: "vp/remove", key: vp.key })}
                      aria-label={`Remove ${device.name}`}
                      title="Remove"
                      className="grid h-6 w-6 place-items-center rounded-[7px] text-faint
                                 transition-colors hover:bg-elevated hover:text-danger"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              <DeviceFrame
                device={device}
                orientation={vp.orientation}
                scale={scale}
                url={state.committedUrl}
                reloadNonce={state.reloadNonce}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
