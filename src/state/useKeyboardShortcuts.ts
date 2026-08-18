"use client";

import { useEffect } from "react";
import { filterByCategory } from "@/lib/devices";
import { usePreview } from "./preview-context";

export const SHORTCUTS = [
  { keys: ["mod", "K"], label: "Open command palette" },
  { keys: ["/"], label: "Focus the URL field" },
  { keys: ["R"], label: "Rotate the active device" },
  { keys: ["G"], label: "Toggle grid view" },
  { keys: ["F"], label: "Zoom to fit" },
  { keys: ["1"], label: "Zoom 50%" },
  { keys: ["2"], label: "Zoom 75%" },
  { keys: ["3"], label: "Zoom 100%" },
  { keys: ["mod", "⏎"], label: "Reload the preview" },
  { keys: ["?"], label: "Show this list" },
] as const;

export function useKeyboardShortcuts() {
  const { state, dispatch } = usePreview();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      const mod = e.metaKey || e.ctrlKey;

      // ⌘K must preempt the browser's own binding.
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatch({ t: "ui/palette", open: !state.paletteOpen });
        return;
      }

      if (mod && e.key === "Enter") {
        e.preventDefault();
        dispatch({ t: "url/reload" });
        return;
      }

      // Everything below is a bare key, so bail out while typing, during IME
      // composition, or when any dialog owns the screen.
      if (typing || e.isComposing || mod || e.altKey) return;
      if (document.querySelector("dialog[open]")) return;

      switch (e.key) {
        case "/":
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("rd:focus-url"));
          break;
        case "r":
          dispatch({ t: "vp/rotate" });
          break;
        case "g":
          dispatch({
            t: "layout/set",
            value: state.layout === "grid" ? "single" : "grid",
          });
          break;
        case "f":
          dispatch({ t: "zoom/set", value: "fit" });
          break;
        case "1":
          dispatch({ t: "zoom/set", value: 0.5 });
          break;
        case "2":
          dispatch({ t: "zoom/set", value: 0.75 });
          break;
        case "3":
          dispatch({ t: "zoom/set", value: 1 });
          break;
        case "?":
          dispatch({ t: "ui/shortcuts", open: true });
          break;
        case "d": {
          // Cycle to the next device within the current category.
          const list = filterByCategory(state.devices, state.category);
          const current =
            state.viewports.find((v) => v.key === state.activeKey)?.deviceId ??
            state.viewports[0]?.deviceId;
          const at = list.findIndex((d) => d.id === current);
          const next = list[(at + 1) % list.length];
          if (next) dispatch({ t: "vp/select", deviceId: next.id });
          break;
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [state, dispatch]);
}
