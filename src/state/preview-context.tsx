"use client";

import { useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from "react";
import { storage } from "@/lib/storage";
import { parseShareParams } from "@/lib/share";
import {
  initialState,
  reducer,
  type Action,
  type PreviewState,
} from "./preview-reducer";

interface PreviewContextValue {
  state: PreviewState;
  dispatch: Dispatch<Action>;
}

const PreviewContext = createContext<PreviewContextValue | null>(null);

/** Consumers live in different subtrees — the palette is portalled to
 *  document.body, the toolbar is sticky, the picker is a sibling — so this is
 *  context rather than props. */
export function usePreview(): PreviewContextValue {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error("usePreview must be used inside <PreviewProvider>");
  return ctx;
}

/**
 * Null-tolerant variant, for chrome that is shared between the tool and the
 * standalone legal pages — those render `SiteHeader` without a provider.
 */
export function usePreviewOptional(): PreviewContextValue | null {
  return useContext(PreviewContext);
}

const COMMIT_DEBOUNCE_MS = 600;

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const searchParams = useSearchParams();
  const hydrated = useRef(false);

  // ── Hydrate once on mount ────────────────────────────────────────────────
  // Reads happen here, never in useState initialisers: an initialiser runs on
  // the server too (returning empty) and again on the client (returning saved
  // data), which is a hydration mismatch the moment a user has a custom device.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    storage.migrateLegacy();

    const customDevices = storage.loadCustomDevices();
    const devices = [...state.devices, ...customDevices];

    const shared = parseShareParams(searchParams, devices);
    if (shared) {
      dispatch({
        t: "hydrate",
        patch: {
          devices: [...devices, ...shared.createdDevices],
          urlInput: shared.url,
          committedUrl: shared.url,
          viewports: shared.viewports,
          activeKey: shared.viewports[0].key,
          layout: shared.layout,
          zoom: shared.zoom,
        },
      });
      return;
    }

    const savedId = storage.loadSelectedDevice();
    const savedLayout = storage.loadLayout();
    const savedZoom = storage.loadZoom();
    const savedViewports = storage.loadViewports();

    // Restore the whole pane arrangement, dropping any pane whose device no
    // longer exists (a custom device deleted in another tab, say).
    const viewports = savedViewports
      ?.filter((v) => devices.some((d) => d.id === v.deviceId))
      .map((v) => ({
        key: v.key,
        deviceId: v.deviceId,
        orientation: v.orientation === "landscape" ? ("landscape" as const) : ("portrait" as const),
      }));

    const restored =
      viewports && viewports.length > 0
        ? viewports
        : savedId && devices.some((d) => d.id === savedId)
          ? state.viewports.map((v, i) =>
              i === 0 ? { ...v, deviceId: savedId } : v,
            )
          : state.viewports;

    dispatch({
      t: "hydrate",
      patch: {
        devices,
        viewports: restored,
        activeKey: restored[0].key,
        // Layout and pane count have to agree — a saved "grid" with one pane
        // would render a grid toggle that looks stuck.
        layout: savedLayout === "grid" && restored.length > 1 ? "grid" : "single",
        ...(savedZoom !== null ? { zoom: savedZoom as PreviewState["zoom"] } : {}),
      },
    });
    // Intentionally mount-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced URL commit ─────────────────────────────────────────────────
  // The old code fed every keystroke straight to <iframe src>, so typing
  // "example.com" fired eleven navigations.
  useEffect(() => {
    if (!state.urlInput.trim()) return;
    const id = setTimeout(
      () => dispatch({ t: "url/commit" }),
      COMMIT_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [state.urlInput]);

  // ── Persist ──────────────────────────────────────────────────────────────
  // One effect, not scattered across handlers as it was before.
  useEffect(() => {
    if (!hydrated.current) return;
    storage.saveCustomDevices(state.devices);
  }, [state.devices]);

  useEffect(() => {
    if (!hydrated.current) return;
    const first = state.viewports[0];
    if (first) storage.saveSelectedDevice(first.deviceId);
    storage.saveViewports(state.viewports);
  }, [state.viewports]);

  useEffect(() => {
    if (!hydrated.current) return;
    storage.saveLayout(state.layout);
  }, [state.layout]);

  useEffect(() => {
    if (!hydrated.current) return;
    storage.saveZoom(state.zoom);
  }, [state.zoom]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <PreviewContext.Provider value={value}>{children}</PreviewContext.Provider>
  );
}
