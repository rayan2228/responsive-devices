import { resolveDeviceId } from "@/data/devices";
import { createCustomDevice, findById } from "@/lib/devices";
import type { Device, Layout, Orientation, Viewport, Zoom } from "@/types";

const MAX_VIEWPORTS = 4;

export interface ShareState {
  url: string;
  viewports: Viewport[];
  layout: Layout;
  zoom: Zoom;
}

/** Segment grammar: `<slug>` or `<W>x<H>`, plus optional `:l` for landscape. */
function encodeSegment(vp: Viewport, devices: readonly Device[]): string {
  const device = findById(devices, vp.deviceId);
  const base = device?.isCustom
    ? `${device.width}x${device.height}`
    : (device?.id ?? vp.deviceId);
  return vp.orientation === "landscape" ? `${base}:l` : base;
}

export function buildShareUrl(
  state: ShareState,
  devices: readonly Device[],
  origin: string,
): string {
  const url = new URL(origin);
  url.searchParams.set("u", state.url);
  url.searchParams.set(
    "d",
    state.viewports.map((vp) => encodeSegment(vp, devices)).join(","),
  );
  if (state.zoom !== "fit") url.searchParams.set("z", String(state.zoom));
  return url.toString();
}

let keySeed = 0;
const nextKey = () => `vp-${Date.now().toString(36)}-${keySeed++}`;

interface ParseResult {
  url: string;
  viewports: Viewport[];
  layout: Layout;
  zoom: Zoom;
  /** Devices synthesised from raw WxH segments that matched no preset. */
  createdDevices: Device[];
}

function parseZoom(raw: string | null): Zoom {
  if (raw === "0.5") return 0.5;
  if (raw === "0.75") return 0.75;
  if (raw === "1") return 1;
  return "fit";
}

/**
 * Reads both the current format and the pre-rebrand one.
 *
 * v2: ?u=<url>&d=iphone-15-pro,ipad-air:l,1440x900&z=fit
 * v1: ?url=<url>&device=<numeric id>&orientation=<portrait|landscape>&width=&height=
 *
 * Links in the v1 format are already out in the world. This must keep working.
 */
export function parseShareParams(
  sp: URLSearchParams,
  devices: readonly Device[],
): ParseResult | null {
  const createdDevices: Device[] = [];

  const v2Url = sp.get("u");
  const v2Devices = sp.get("d");

  if (v2Url && v2Devices) {
    const viewports: Viewport[] = [];

    for (const segment of v2Devices.split(",").slice(0, MAX_VIEWPORTS)) {
      const [token, flag] = segment.split(":");
      const orientation: Orientation = flag === "l" ? "landscape" : "portrait";

      const size = token.match(/^(\d+)x(\d+)$/);
      if (size) {
        const width = Number(size[1]);
        const height = Number(size[2]);
        const existing = devices.find(
          (d) => d.isCustom && d.width === width && d.height === height,
        );
        const device =
          existing ??
          createCustomDevice({ name: `${width} × ${height}`, width, height });
        if (!existing) createdDevices.push(device);
        viewports.push({ key: nextKey(), deviceId: device.id, orientation });
        continue;
      }

      const id = resolveDeviceId(token);
      if (findById(devices, id)) {
        viewports.push({ key: nextKey(), deviceId: id, orientation });
      }
    }

    if (viewports.length === 0) return null;

    return {
      url: v2Url,
      viewports,
      layout: viewports.length > 1 ? "grid" : "single",
      zoom: parseZoom(sp.get("z")),
      createdDevices,
    };
  }

  // ── v1 fallback ─────────────────────────────────────────────────────────
  const v1Url = sp.get("url");
  const v1Device = sp.get("device");
  if (!v1Url || !v1Device) return null;

  const orientation: Orientation =
    sp.get("orientation") === "landscape" ? "landscape" : "portrait";
  const id = resolveDeviceId(v1Device);

  let deviceId = id;
  if (!findById(devices, id)) {
    const width = Number.parseInt(sp.get("width") ?? "", 10);
    const height = Number.parseInt(sp.get("height") ?? "", 10);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    const device = createCustomDevice({
      name: "Shared device",
      width,
      height,
    });
    createdDevices.push(device);
    deviceId = device.id;
  }

  return {
    url: v1Url,
    viewports: [{ key: nextKey(), deviceId, orientation }],
    layout: "single",
    zoom: "fit",
    createdDevices,
  };
}

export { nextKey as newViewportKey, MAX_VIEWPORTS };
