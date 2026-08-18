"use client";

import { Check, Columns2, Plus, Share2, Square } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Segmented";
import { buildShareUrl, MAX_VIEWPORTS } from "@/lib/share";
import { ZOOM_LEVELS } from "@/lib/scale";
import { usePreview } from "@/state/preview-context";
import type { Layout, Zoom } from "@/types";
import { UrlField } from "./UrlField";

const LAYOUT_OPTIONS = [
  { value: "single" as Layout, label: "Single" },
  { value: "grid" as Layout, label: "Grid" },
];

export function PreviewToolbar() {
  const { state, dispatch } = usePreview();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = buildShareUrl(
      {
        url: state.committedUrl,
        viewports:
          state.layout === "single" ? state.viewports.slice(0, 1) : state.viewports,
        layout: state.layout,
        zoom: state.zoom,
      },
      state.devices,
      window.location.origin,
    );
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied — nothing useful to show */
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-panel border border-subtle bg-surface p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <UrlField />

        <div className="flex shrink-0 items-center gap-2">
          <Segmented
            options={LAYOUT_OPTIONS}
            value={state.layout}
            onChange={(v) => dispatch({ t: "layout/set", value: v })}
            ariaLabel="Preview layout"
          />

          <Button
            variant="secondary"
            size="md"
            onClick={share}
            disabled={!state.committedUrl}
            title="Copy a link to this exact setup"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-subtle pt-3">
        <Segmented
          options={ZOOM_LEVELS.map((z) => ({ value: String(z.value), label: z.label }))}
          value={String(state.zoom)}
          onChange={(v) =>
            dispatch({
              t: "zoom/set",
              value: (v === "fit" ? "fit" : Number(v)) as Zoom,
            })
          }
          ariaLabel="Zoom level"
        />

        <div className="ml-auto flex items-center gap-2">
          {state.layout === "grid" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ t: "vp/add" })}
              disabled={state.viewports.length >= MAX_VIEWPORTS}
              title={`Add a device (max ${MAX_VIEWPORTS})`}
            >
              {state.viewports.length > 1 ? <Columns2 size={13} /> : <Square size={13} />}
              Add device
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ t: "ui/customModal", open: true })}
          >
            <Plus size={13} />
            Custom size
          </Button>
        </div>
      </div>
    </div>
  );
}
