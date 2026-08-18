import type { DeviceFrame } from "@/types";

/**
 * Six frame presets cover every device in the catalogue, so `devices.ts` stays
 * one terse line per entry instead of carrying a dozen optional fields.
 *
 * All values are device pixels. `DeviceFrame` renders at 1:1 and applies a
 * single CSS transform, so bezels and notches stay proportional at any zoom
 * without per-element multiplication.
 */
export const FRAMES = {
  /** iPhone 14 Pro and later — dynamic island. */
  iphoneIsland: {
    chrome: { kind: "island", w: 126, h: 37 },
    bezel: [14, 14, 14, 14],
    radius: 56,
    screenRadius: 44,
    homeIndicator: true,
    buttons: [
      { side: "left", y: 120, len: 32 },
      { side: "left", y: 172, len: 64 },
      { side: "left", y: 248, len: 64 },
      { side: "right", y: 160, len: 96 },
    ],
  },

  /** iPhone X through 14 — notch. */
  iphoneNotch: {
    chrome: { kind: "notch", w: 160, h: 30 },
    bezel: [12, 12, 12, 12],
    radius: 48,
    screenRadius: 38,
    homeIndicator: true,
    buttons: [
      { side: "left", y: 110, len: 30 },
      { side: "left", y: 156, len: 58 },
      { side: "right", y: 145, len: 84 },
    ],
  },

  /** iPhone SE — real top brow and bottom chin, square screen corners. */
  iphoneBezel: {
    chrome: { kind: "none" },
    bezel: [62, 10, 62, 10],
    radius: 26,
    screenRadius: 2,
  },

  /** Pixel / Galaxy — centred punch-hole camera. */
  androidPunch: {
    chrome: { kind: "punch", d: 22, dx: 0 },
    bezel: [10, 10, 10, 10],
    radius: 44,
    screenRadius: 36,
    homeIndicator: true,
  },

  tablet: {
    chrome: { kind: "none" },
    bezel: [24, 24, 24, 24],
    radius: 28,
    screenRadius: 14,
  },

  laptop: {
    chrome: { kind: "browser", os: "mac" },
    bezel: [0, 10, 10, 10],
    radius: 14,
    screenRadius: 0,
  },

  monitor: {
    chrome: { kind: "browser", os: "win" },
    bezel: [0, 8, 8, 8],
    radius: 10,
    screenRadius: 0,
  },

  /** Default for custom devices and anything without an explicit frame. */
  generic: {
    chrome: { kind: "none" },
    bezel: [8, 8, 8, 8],
    radius: 12,
    screenRadius: 4,
  },
} satisfies Record<string, DeviceFrame>;
