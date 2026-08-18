"use client";

import { Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { usePreviewOptional } from "@/state/preview-context";

/** Visible affordance for ⌘K — shortcuts only read as polish when they're
 *  discoverable. Renders nothing on pages without the preview tool. */
export function PaletteTrigger() {
  const preview = usePreviewOptional();
  if (!preview) return null;
  const { dispatch } = preview;

  return (
    <button
      onClick={() => dispatch({ t: "ui/palette", open: true })}
      className="hidden h-9 items-center gap-2 rounded-control border border-subtle
                 bg-surface pl-2.5 pr-2 text-[13px] text-faint
                 transition-colors duration-150 hover:bg-elevated hover:text-muted sm:inline-flex"
    >
      <Search size={14} />
      <span className="pr-6">Search devices…</span>
      <Kbd>mod</Kbd>
      <Kbd>K</Kbd>
    </button>
  );
}
