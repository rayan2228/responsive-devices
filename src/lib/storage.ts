import { Monitor } from "lucide-react";
import { resolveDeviceId } from "@/data/devices";
import { FRAMES } from "@/data/frames";
import type { Device } from "@/types";

const KEYS = {
  customDevices: "rd:v1:custom-devices",
  selectedDevice: "rd:v1:selected-device",
  viewports: "rd:v1:viewports",
  layout: "rd:v1:layout",
  zoom: "rd:v1:zoom",
} as const;

/** Pre-rebrand keys, read once during migration then removed. */
const LEGACY_KEYS = {
  customDevices: "responsive-preview-custom-devices",
  selectedDevice: "responsive-preview-selected-device",
  themeMode: "responsive-preview-theme-mode",
} as const;

const isClient = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — non-fatal, preferences just won't persist */
  }
}

/** Shape actually written to storage. Icons and frames are re-attached on read
 *  because functions and component references don't survive JSON. */
interface StoredDevice {
  id: string;
  name: string;
  width: number;
  height: number;
}

const hydrate = (d: StoredDevice): Device => ({
  ...d,
  icon: Monitor,
  category: "custom",
  isCustom: true,
  frame: FRAMES.generic,
});

/**
 * One-time move from the `responsive-preview-*` keys to `rd:v1:*`, translating
 * legacy numeric device ids on the way. Without this, everyone who ever added
 * a custom device loses it on the first load after the rebrand.
 */
function migrateLegacy(): void {
  if (!isClient()) return;
  try {
    const legacyDevices = localStorage.getItem(LEGACY_KEYS.customDevices);
    if (legacyDevices && localStorage.getItem(KEYS.customDevices) === null) {
      const parsed = JSON.parse(legacyDevices) as StoredDevice[];
      write(
        KEYS.customDevices,
        parsed.map((d) => ({
          id: d.id,
          name: d.name,
          width: d.width,
          height: d.height,
        })),
      );
    }

    const legacySelected = localStorage.getItem(LEGACY_KEYS.selectedDevice);
    if (legacySelected && localStorage.getItem(KEYS.selectedDevice) === null) {
      write(KEYS.selectedDevice, resolveDeviceId(legacySelected));
    }

    Object.values(LEGACY_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {
    /* corrupt legacy data — drop it rather than block startup */
  }
}

export const storage = {
  migrateLegacy,

  loadCustomDevices(): Device[] {
    return read<StoredDevice[]>(KEYS.customDevices, []).map(hydrate);
  },

  saveCustomDevices(devices: Device[]): void {
    write(
      KEYS.customDevices,
      devices
        .filter((d) => d.isCustom)
        .map(({ id, name, width, height }) => ({ id, name, width, height })),
    );
  },

  loadSelectedDevice(): string | null {
    const id = read<string | null>(KEYS.selectedDevice, null);
    return id ? resolveDeviceId(id) : null;
  },

  saveSelectedDevice(id: string): void {
    write(KEYS.selectedDevice, id);
  },

  loadLayout: () => read<"single" | "grid" | null>(KEYS.layout, null),
  saveLayout: (v: "single" | "grid") => write(KEYS.layout, v),

  loadZoom: () => read<"fit" | number | null>(KEYS.zoom, null),
  saveZoom: (v: "fit" | number) => write(KEYS.zoom, v),

  loadViewports: () =>
    read<Array<{ key: string; deviceId: string; orientation: string }> | null>(
      KEYS.viewports,
      null,
    ),
  saveViewports: (v: unknown) => write(KEYS.viewports, v),
};
