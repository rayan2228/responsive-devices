import { DEFAULT_DEVICE_ID, defaultDevices } from "@/data/devices";
import { createCustomDevice, filterByCategory, findById } from "@/lib/devices";
import { MAX_VIEWPORTS, newViewportKey } from "@/lib/share";
import { normalizeUrl } from "@/lib/validation";
import type {
  Device,
  DeviceCategory,
  Layout,
  Viewport,
  Zoom,
} from "@/types";

export interface PreviewState {
  /** Raw text in the field — changes on every keystroke. */
  urlInput: string;
  /** Normalised URL. The ONLY value that reaches <iframe src>, so that typing
   *  doesn't fire a navigation per character. */
  committedUrl: string;
  urlError: string | null;
  /** Bumped to force a reload without changing src. */
  reloadNonce: number;

  devices: Device[];
  viewports: Viewport[];
  activeKey: string;

  layout: Layout;
  zoom: Zoom;

  category: DeviceCategory;
  expanded: Record<DeviceCategory, boolean>;

  paletteOpen: boolean;
  customModalOpen: boolean;
  shortcutsOpen: boolean;
}

export type Action =
  | { t: "url/input"; value: string }
  | { t: "url/commit" }
  | { t: "url/clear" }
  | { t: "url/reload" }
  | { t: "layout/set"; value: Layout }
  | { t: "vp/add"; deviceId?: string }
  | { t: "vp/remove"; key: string }
  | { t: "vp/setDevice"; key: string; deviceId: string }
  | { t: "vp/rotate"; key?: string }
  | { t: "vp/focus"; key: string }
  | { t: "vp/select"; deviceId: string }
  | { t: "zoom/set"; value: Zoom }
  | { t: "device/addCustom"; name: string; width: number; height: number }
  | { t: "device/remove"; id: string }
  | { t: "category/set"; value: DeviceCategory }
  | { t: "category/toggleExpanded"; value: DeviceCategory }
  | { t: "ui/palette"; open: boolean }
  | { t: "ui/customModal"; open: boolean }
  | { t: "ui/shortcuts"; open: boolean }
  | { t: "hydrate"; patch: Partial<PreviewState> };

export function initialState(): PreviewState {
  const key = newViewportKey();
  return {
    urlInput: "",
    committedUrl: "",
    urlError: null,
    reloadNonce: 0,

    devices: [...defaultDevices],
    viewports: [{ key, deviceId: DEFAULT_DEVICE_ID, orientation: "portrait" }],
    activeKey: key,

    layout: "single",
    zoom: "fit",

    category: "mobile",
    expanded: { mobile: false, tablet: false, desktop: false, custom: false },

    paletteOpen: false,
    customModalOpen: false,
    shortcutsOpen: false,
  };
}

/** Picks a sensible device for a newly added grid pane: the first preset in
 *  the current category that isn't already on screen. */
function suggestDevice(state: PreviewState): string {
  const used = new Set(state.viewports.map((v) => v.deviceId));
  const order: DeviceCategory[] = ["mobile", "tablet", "desktop"];
  for (const cat of order) {
    const candidate = filterByCategory(state.devices, cat).find(
      (d) => !used.has(d.id),
    );
    if (candidate) return candidate.id;
  }
  return state.viewports.at(-1)?.deviceId ?? DEFAULT_DEVICE_ID;
}

export function reducer(state: PreviewState, action: Action): PreviewState {
  switch (action.t) {
    case "url/input":
      return { ...state, urlInput: action.value, urlError: null };

    case "url/commit": {
      const trimmed = state.urlInput.trim();
      if (!trimmed) {
        return { ...state, committedUrl: "", urlError: null };
      }
      const normalized = normalizeUrl(trimmed);
      if (!normalized) {
        return { ...state, committedUrl: "", urlError: "That doesn't look like a valid URL" };
      }
      if (normalized === state.committedUrl) {
        return { ...state, urlError: null };
      }
      return { ...state, committedUrl: normalized, urlError: null };
    }

    case "url/clear":
      return { ...state, urlInput: "", committedUrl: "", urlError: null };

    case "url/reload":
      return { ...state, reloadNonce: state.reloadNonce + 1 };

    case "layout/set": {
      if (action.value === state.layout) return state;
      // Viewports are kept intact and merely sliced at render time, so
      // toggling grid → single → grid is lossless.
      if (action.value === "grid" && state.viewports.length === 1) {
        const deviceId = suggestDevice(state);
        return {
          ...state,
          layout: "grid",
          viewports: [
            ...state.viewports,
            { key: newViewportKey(), deviceId, orientation: "portrait" },
          ],
        };
      }
      return { ...state, layout: action.value };
    }

    case "vp/add": {
      if (state.viewports.length >= MAX_VIEWPORTS) return state;
      const deviceId = action.deviceId ?? suggestDevice(state);
      const key = newViewportKey();
      return {
        ...state,
        layout: "grid",
        viewports: [...state.viewports, { key, deviceId, orientation: "portrait" }],
        activeKey: key,
      };
    }

    case "vp/remove": {
      if (state.viewports.length <= 1) return state;
      const viewports = state.viewports.filter((v) => v.key !== action.key);
      return {
        ...state,
        viewports,
        layout: viewports.length > 1 ? state.layout : "single",
        activeKey:
          state.activeKey === action.key ? viewports[0].key : state.activeKey,
      };
    }

    case "vp/setDevice":
      return {
        ...state,
        viewports: state.viewports.map((v) =>
          v.key === action.key ? { ...v, deviceId: action.deviceId } : v,
        ),
      };

    case "vp/rotate": {
      const target = action.key ?? state.activeKey;
      return {
        ...state,
        viewports: state.viewports.map((v) =>
          v.key === target
            ? {
                ...v,
                orientation:
                  v.orientation === "portrait" ? "landscape" : "portrait",
              }
            : v,
        ),
      };
    }

    case "vp/focus":
      return { ...state, activeKey: action.key };

    case "vp/select": {
      // Clicking a device in the picker retargets the active pane in grid
      // mode, or the only pane in single mode.
      const target = state.layout === "single"
        ? state.viewports[0].key
        : state.activeKey;
      return {
        ...state,
        viewports: state.viewports.map((v) =>
          v.key === target ? { ...v, deviceId: action.deviceId } : v,
        ),
      };
    }

    case "zoom/set":
      return { ...state, zoom: action.value };

    case "device/addCustom": {
      const device = createCustomDevice({
        name: action.name,
        width: action.width,
        height: action.height,
      });
      const target = state.layout === "single"
        ? state.viewports[0].key
        : state.activeKey;
      return {
        ...state,
        devices: [...state.devices, device],
        viewports: state.viewports.map((v) =>
          v.key === target ? { ...v, deviceId: device.id } : v,
        ),
        category: "custom",
        customModalOpen: false,
      };
    }

    case "device/remove": {
      const devices = state.devices.filter((d) => d.id !== action.id);
      const fallback =
        findById(devices, DEFAULT_DEVICE_ID)?.id ?? devices[0]?.id;
      return {
        ...state,
        devices,
        // Any pane showing the deleted device is repointed rather than left
        // dangling with an id that resolves to nothing.
        viewports: state.viewports.map((v) =>
          v.deviceId === action.id ? { ...v, deviceId: fallback } : v,
        ),
      };
    }

    case "category/set":
      return { ...state, category: action.value };

    case "category/toggleExpanded":
      return {
        ...state,
        expanded: {
          ...state.expanded,
          [action.value]: !state.expanded[action.value],
        },
      };

    case "ui/palette":
      return { ...state, paletteOpen: action.open };

    case "ui/customModal":
      return { ...state, customModalOpen: action.open };

    case "ui/shortcuts":
      return { ...state, shortcutsOpen: action.open };

    case "hydrate":
      return { ...state, ...action.patch };

    default:
      return state;
  }
}
