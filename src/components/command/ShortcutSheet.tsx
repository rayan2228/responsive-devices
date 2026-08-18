"use client";

import { useEffect, useRef } from "react";
import { KbdGroup } from "@/components/ui/Kbd";
import { usePreview } from "@/state/preview-context";
import { SHORTCUTS } from "@/state/useKeyboardShortcuts";

export function ShortcutSheet() {
  const { state, dispatch } = usePreview();
  const ref = useRef<HTMLDialogElement>(null);
  const open = state.shortcutsOpen;

  const close = () => dispatch({ t: "ui/shortcuts", open: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label="Keyboard shortcuts"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-panel border border-subtle
                 bg-surface p-0 text-ink shadow-pop backdrop:bg-black/50
                 backdrop:backdrop-blur-[2px]"
    >
      <div className="border-b border-subtle px-5 py-4">
        <h2 className="text-[15px] font-semibold">Keyboard shortcuts</h2>
      </div>
      <ul className="divide-y divide-subtle">
        {SHORTCUTS.map((shortcut) => (
          <li
            key={shortcut.label}
            className="flex items-center justify-between gap-4 px-5 py-2.5"
          >
            <span className="text-[13px] text-muted">{shortcut.label}</span>
            <KbdGroup keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </dialog>
  );
}
