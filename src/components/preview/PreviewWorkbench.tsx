"use client";

import { CommandPalette } from "@/components/command/CommandPalette";
import { ShortcutSheet } from "@/components/command/ShortcutSheet";
import { useKeyboardShortcuts } from "@/state/useKeyboardShortcuts";
import { CustomDeviceModal } from "./CustomDeviceModal";
import { DevicePicker } from "./DevicePicker";
import { PreviewToolbar } from "./PreviewToolbar";
import { ViewportStage } from "./ViewportStage";

export function PreviewWorkbench() {
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col gap-4">
      <PreviewToolbar />
      <DevicePicker />

      <section
        id="preview"
        aria-label="Device preview"
        className="rounded-panel border border-subtle bg-surface"
      >
        <ViewportStage />
      </section>

      <CustomDeviceModal />
      <CommandPalette />
      <ShortcutSheet />
    </div>
  );
}
