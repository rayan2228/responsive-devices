"use client";

import { memo } from "react";
import { FRAMES } from "@/data/frames";
import { frameSize } from "@/lib/devices";
import type {
  Device,
  DeviceFrame as DeviceFrameSpec,
  Orientation,
} from "@/types";
import { DeviceChrome } from "./chrome/DeviceChrome";
import { PreviewIframe } from "./PreviewIframe";

interface DeviceFrameProps {
  device: Device;
  orientation: Orientation;
  scale: number;
  url: string;
  reloadNonce: number;
}

function DeviceFrameImpl({
  device,
  orientation,
  scale,
  url,
  reloadNonce,
}: DeviceFrameProps) {
  const geom = frameSize(device, orientation);
  const frame: DeviceFrameSpec = device.frame ?? FRAMES.generic;

  let origin: string | null = null;
  try {
    origin = url ? new URL(url).host : null;
  } catch {
    /* leave null */
  }

  return (
    /*
     * Two layers on purpose.
     *
     * The outer box reserves the *scaled* footprint in the document flow. The
     * inner box is built at true device pixels and scaled once by a transform.
     *
     * The previous implementation multiplied every dimension by `scale`
     * individually, which is why bezels, notch and corner radii drifted out of
     * proportion and produced the blur this codebase has two commits trying to
     * fix. It also matters correctness-wise: a CSS transform does not affect
     * the layout viewport, so the guest page still reports its true CSS-pixel
     * width to media queries — which is the entire premise of the tool.
     */
    <div
      style={{
        width: geom.width * scale,
        height: geom.height * scale,
      }}
      className="shrink-0"
    >
      <div
        style={{
          width: geom.width,
          height: geom.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          borderRadius: frame.radius,
          paddingTop: frame.bezel[0],
          paddingRight: frame.bezel[1],
          paddingBottom: frame.bezel[2],
          paddingLeft: frame.bezel[3],
        }}
        className="relative flex flex-col overflow-hidden bg-[#16171a] shadow-frame
                   ring-1 ring-black/40 dark:bg-[#1b1c20] dark:ring-white/10"
      >
        {frame.chrome.kind === "browser" && (
          <DeviceChrome
            chrome={frame.chrome}
            screenWidth={geom.screen.width}
            origin={origin}
          />
        )}

        <div
          className="relative shrink-0 overflow-hidden bg-white"
          style={{
            width: geom.screen.width,
            height: geom.screen.height,
            borderRadius: frame.screenRadius,
          }}
        >
          {frame.chrome.kind !== "browser" && (
            <DeviceChrome
              chrome={frame.chrome}
              screenWidth={geom.screen.width}
              origin={origin}
            />
          )}

          <PreviewIframe
            url={url}
            width={geom.screen.width}
            height={geom.screen.height}
            reloadNonce={reloadNonce}
          />

          {frame.homeIndicator && (
            <div
              className="pointer-events-none absolute bottom-2 left-1/2 z-10 h-[5px]
                         -translate-x-1/2 rounded-full bg-black/25"
              style={{ width: Math.min(140, geom.screen.width * 0.35) }}
            />
          )}
        </div>

        {frame.buttons?.map((button, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute rounded-full bg-black/50 dark:bg-white/10"
            style={{
              [button.side]: -2,
              top: button.y,
              width: 3,
              height: button.len,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const DeviceFrame = memo(DeviceFrameImpl);
