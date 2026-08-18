import { Monitor } from "lucide-react";
import { FRAMES } from "@/data/frames";
import type {
  Device,
  DeviceCategory,
  DeviceFrame,
  Orientation,
} from "@/types";

/**
 * Ids for custom devices.
 *
 * The old implementation did `Number(lastId) + 1` against the preset ids. Now
 * that presets are slugs, that would evaluate `Number("iphone-se")` → NaN and
 * hand every custom device the id "NaN", so the second one would overwrite the
 * first and lookups would return the wrong device.
 */
const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `custom-${crypto.randomUUID().slice(0, 8)}`
    : `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function createCustomDevice(
  data: Pick<Device, "name" | "width" | "height">,
): Device {
  return {
    id: newId(),
    name: data.name,
    width: data.width,
    height: data.height,
    icon: Monitor,
    category: "custom",
    isCustom: true,
    frame: FRAMES.generic,
  };
}

export const filterByCategory = (
  devices: readonly Device[],
  category: DeviceCategory,
): Device[] => devices.filter((d) => d.category === category);

export const findById = (
  devices: readonly Device[],
  id: string,
): Device | undefined => devices.find((d) => d.id === id);

/** Width/height as displayed, accounting for orientation. */
export function dimensions(
  device: Device,
  orientation: Orientation,
): { width: number; height: number } {
  return orientation === "landscape"
    ? { width: device.height, height: device.width }
    : { width: device.width, height: device.height };
}

/** Outer frame size including bezels, in device pixels. */
export function frameSize(device: Device, orientation: Orientation) {
  const frame: DeviceFrame = device.frame ?? FRAMES.generic;
  const [top, right, bottom, left] = frame.bezel;
  const { width, height } = dimensions(device, orientation);

  // Browser chrome occupies real vertical space above the viewport.
  const chromeBar = frame.chrome.kind === "browser" ? 40 : 0;

  return {
    width: width + left + right,
    height: height + top + bottom + chromeBar,
    screen: { width, height },
    frame,
    chromeBar,
    inset: { top: top + chromeBar, right, bottom, left },
  };
}
