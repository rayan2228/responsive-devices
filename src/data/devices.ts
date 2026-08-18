import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import type { Device } from "@/types";
import { FRAMES } from "./frames";

export const defaultDevices: readonly Device[] = [
  // ── Mobile ──────────────────────────────────────────────────────────────
  { id: "iphone-se", name: "iPhone SE", width: 375, height: 667, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneBezel },
  { id: "iphone-13-mini", name: "iPhone 13 mini", width: 375, height: 812, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneNotch },
  { id: "iphone-14", name: "iPhone 14", width: 390, height: 844, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneNotch },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 393, height: 852, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneIsland },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", width: 430, height: 932, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneIsland },
  { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", width: 428, height: 926, icon: Smartphone, category: "mobile", frame: FRAMES.iphoneIsland },
  { id: "pixel-7", name: "Pixel 7", width: 412, height: 915, icon: Smartphone, category: "mobile", frame: FRAMES.androidPunch },
  { id: "pixel-8-pro", name: "Pixel 8 Pro", width: 448, height: 998, icon: Smartphone, category: "mobile", frame: FRAMES.androidPunch },
  { id: "galaxy-s23", name: "Samsung Galaxy S23", width: 360, height: 780, icon: Smartphone, category: "mobile", frame: FRAMES.androidPunch },
  { id: "galaxy-s24-ultra", name: "Galaxy S24 Ultra", width: 384, height: 824, icon: Smartphone, category: "mobile", frame: FRAMES.androidPunch },

  // ── Tablet ──────────────────────────────────────────────────────────────
  { id: "ipad-mini", name: "iPad mini", width: 768, height: 1024, icon: Tablet, category: "tablet", frame: FRAMES.tablet },
  { id: "ipad-air", name: "iPad Air", width: 820, height: 1180, icon: Tablet, category: "tablet", frame: FRAMES.tablet },
  { id: "ipad-pro-11", name: 'iPad Pro 11"', width: 834, height: 1194, icon: Tablet, category: "tablet", frame: FRAMES.tablet },
  { id: "ipad-pro-129", name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: Tablet, category: "tablet", frame: FRAMES.tablet },
  { id: "surface-pro", name: "Surface Pro", width: 912, height: 1368, icon: Tablet, category: "tablet", frame: FRAMES.tablet },

  // ── Desktop ─────────────────────────────────────────────────────────────
  { id: "macbook-air", name: "MacBook Air", width: 1280, height: 832, icon: Laptop, category: "desktop", frame: FRAMES.laptop },
  { id: "macbook-pro-14", name: 'MacBook Pro 14"', width: 1512, height: 982, icon: Laptop, category: "desktop", frame: FRAMES.laptop },
  { id: "laptop-hd", name: "Laptop", width: 1366, height: 768, icon: Laptop, category: "desktop", frame: FRAMES.laptop },
  { id: "desktop-hd", name: "Desktop HD", width: 1920, height: 1080, icon: Monitor, category: "desktop", frame: FRAMES.monitor },
  { id: "desktop-qhd", name: "Desktop QHD", width: 2560, height: 1440, icon: Monitor, category: "desktop", frame: FRAMES.monitor },
  { id: "desktop-4k", name: "Desktop 4K", width: 3840, height: 2160, icon: Monitor, category: "desktop", frame: FRAMES.monitor },
];

/**
 * Device ids used to be positional strings "1"–"14". They are baked into every
 * share link already posted and into every browser's saved selection.
 *
 * Keep this map forever. It is 21 lines and it is the only thing standing
 * between the rebrand and every existing shared link 404-ing into a default.
 */
export const LEGACY_DEVICE_IDS: Readonly<Record<string, string>> = {
  "1": "iphone-se",
  "2": "iphone-14",
  "3": "iphone-14-pro-max",
  "4": "pixel-7",
  "5": "galaxy-s23",
  "6": "ipad-mini",
  "7": "ipad-air",
  "8": "ipad-pro-129",
  "9": "surface-pro",
  "10": "macbook-air",
  "11": "laptop-hd",
  "12": "desktop-hd",
  "13": "desktop-qhd",
  "14": "desktop-4k",
};

/** Resolves either an old numeric id or a current slug to a current slug. */
export const resolveDeviceId = (id: string): string =>
  LEGACY_DEVICE_IDS[id] ?? id;

export const DEFAULT_DEVICE_ID = "iphone-15-pro";

export const CATEGORY_ORDER = [
  { category: "mobile", label: "Mobile" },
  { category: "tablet", label: "Tablet" },
  { category: "desktop", label: "Desktop" },
  { category: "custom", label: "Custom" },
] as const;
