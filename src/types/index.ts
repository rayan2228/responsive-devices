import type { LucideIcon } from "lucide-react";

export type DeviceCategory = "mobile" | "tablet" | "desktop" | "custom";

export type Orientation = "portrait" | "landscape";

/** `fit` scales to the available column; the numbers are literal zoom levels. */
export type Zoom = "fit" | 0.5 | 0.75 | 1;

export type Layout = "single" | "grid";

/** Hardware detail drawn around the screen. Discriminated so each variant
 *  carries only the measurements it actually needs. */
export type Chrome =
  | { kind: "none" }
  | { kind: "notch"; w: number; h: number }
  | { kind: "island"; w: number; h: number }
  | { kind: "punch"; d: number; dx: number }
  | { kind: "browser"; os: "mac" | "win" };

/** All measurements in device pixels — the frame renders 1:1 and is scaled
 *  once by a CSS transform, so nothing here is pre-multiplied. */
export interface DeviceFrame {
  chrome: Chrome;
  /** [top, right, bottom, left] */
  bezel: [number, number, number, number];
  radius: number;
  screenRadius: number;
  homeIndicator?: boolean;
  buttons?: Array<{ side: "left" | "right"; y: number; len: number }>;
}

export interface Device {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: LucideIcon;
  category: DeviceCategory;
  isCustom?: boolean;
  /** Falls back to the generic frame when absent — which is what every
   *  user-created custom device gets, so they need no migration. */
  frame?: DeviceFrame;
}

/** One pane in the preview stage. `key` is separate from `deviceId` because
 *  the grid may legitimately show the same device twice. */
export interface Viewport {
  key: string;
  deviceId: string;
  orientation: Orientation;
}

export interface CustomDeviceForm {
  name: string;
  width: string;
  height: string;
}

export type ThemeMode = "light" | "dark" | "system";
