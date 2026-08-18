"use client";

import {
  Columns2,
  Keyboard,
  Moon,
  Plus,
  RotateCw,
  Search,
  Share2,
  Square,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/lib/cn";
import { rank } from "@/lib/fuzzy";
import { buildShareUrl } from "@/lib/share";
import { ZOOM_LEVELS } from "@/lib/scale";
import { usePreview } from "@/state/preview-context";
import type { Action } from "@/state/preview-reducer";
import type { Zoom } from "@/types";

const GROUP_ORDER = ["View", "Actions", "Devices"];

/** Stable identity so the memos below short-circuit while the palette is shut. */
const EMPTY_ITEMS: Item[] = [];

interface Item {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  run: () => void;
}

export function CommandPalette() {
  const { state, dispatch } = usePreview();
  const ref = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const open = state.paletteOpen;

  const close = () => {
    dispatch({ t: "ui/palette", open: false });
    setQuery("");
    setIndex(0);
  };

  // Gated on `open`. This subscribes to the whole preview state, so without
  // the gate every keystroke in the URL field, every zoom change and every
  // device click rebuilt ~30 command objects and re-ranked them — while the
  // palette was closed and none of it was rendered.
  const items = useMemo(
    () => (open ? buildItems(state, dispatch, close) : EMPTY_ITEMS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, state],
  );

  const results = useMemo(() => {
    if (items.length === 0) return EMPTY_ITEMS;
    const ranked = rank(query, items, (i) => `${i.label} ${i.keywords ?? ""}`);
    // Ranking mixes groups by score; re-group with a stable sort so relevance
    // order survives inside each group but headings never repeat.
    return ranked.sort(
      (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
    );
  }, [query, items]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  // Keep the active row in view during keyboard navigation.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[index]?.run();
    }
  };

  let lastGroup = "";

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label="Command palette"
      // A native <dialog> centres itself with `margin: auto`. Setting only
      // margin-top leaves margin-bottom on auto, which pushes the panel to the
      // bottom of the screen — mb-auto has to be explicit.
      className="mx-auto mb-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg rounded-panel
                 border border-subtle bg-surface p-0 text-ink shadow-pop
                 backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-2.5 border-b border-subtle px-4">
        <Search size={15} className="shrink-0 text-faint" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search devices and actions…"
          aria-label="Search commands"
          aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
          aria-controls="command-list"
          // The dialog itself is the focus context here, so the input doesn't
          // need its own ring on top of it.
          className="h-12 flex-1 bg-transparent text-sm outline-none
                     placeholder:text-faint focus-visible:outline-none"
        />
        <Kbd>Esc</Kbd>
      </div>

      <div
        ref={listRef}
        id="command-list"
        role="listbox"
        aria-label="Commands"
        className="max-h-[min(60vh,380px)] overflow-y-auto p-1.5"
      >
        {results.length === 0 && (
          <p className="px-3 py-8 text-center text-[13px] text-faint">
            Nothing matches “{query}”
          </p>
        )}

        {results.map((item, i) => {
          const showGroup = item.group !== lastGroup;
          lastGroup = item.group;
          const Icon = item.icon;
          const active = i === index;

          return (
            <div key={item.id}>
              {showGroup && (
                <p className="px-2.5 pb-1 pt-3 text-eyebrow uppercase text-faint first:pt-1">
                  {item.group}
                </p>
              )}
              <div
                id={`cmd-${item.id}`}
                role="option"
                aria-selected={active}
                data-index={i}
                onClick={item.run}
                onMouseMove={() => { if (i !== index) setIndex(i); }}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-control px-2.5 py-2 text-[13px]",
                  active ? "bg-elevated text-ink" : "text-muted",
                )}
              >
                {Icon && (
                  <Icon size={14} className={active ? "text-ink" : "text-faint"} />
                )}
                <span className="flex-1 truncate">{item.label}</span>
                {item.hint && (
                  <span className="shrink-0 font-mono text-[11px] text-faint">
                    {item.hint}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </dialog>
  );
}

function buildItems(
  state: ReturnType<typeof usePreview>["state"],
  dispatch: (a: Action) => void,
  close: () => void,
): Item[] {
  const act = (fn: () => void) => () => {
    fn();
    close();
  };

  const devices: Item[] = state.devices.map((device) => ({
    id: `device-${device.id}`,
    label: device.name,
    hint: `${device.width}×${device.height}`,
    group: "Devices",
    keywords: device.category,
    icon: device.icon,
    run: act(() => dispatch({ t: "vp/select", deviceId: device.id })),
  }));

  const zoom: Item[] = ZOOM_LEVELS.map((level) => ({
    id: `zoom-${level.value}`,
    label: `Zoom ${level.label}`,
    group: "View",
    keywords: "scale size",
    icon: ZoomIn,
    run: act(() => dispatch({ t: "zoom/set", value: level.value as Zoom })),
  }));

  const actions: Item[] = [
    {
      id: "layout-single",
      label: "Single view",
      group: "View",
      keywords: "one device",
      icon: Square,
      run: act(() => dispatch({ t: "layout/set", value: "single" })),
    },
    {
      id: "layout-grid",
      label: "Grid view",
      group: "View",
      keywords: "compare side by side multiple",
      icon: Columns2,
      run: act(() => dispatch({ t: "layout/set", value: "grid" })),
    },
    {
      id: "rotate",
      label: "Rotate device",
      hint: "R",
      group: "Actions",
      keywords: "landscape portrait orientation",
      icon: RotateCw,
      run: act(() => dispatch({ t: "vp/rotate" })),
    },
    {
      id: "custom",
      label: "Add custom size",
      group: "Actions",
      keywords: "new viewport dimensions",
      icon: Plus,
      run: act(() => dispatch({ t: "ui/customModal", open: true })),
    },
    {
      id: "theme",
      label: "Toggle theme",
      group: "Actions",
      keywords: "dark light mode appearance",
      icon: Moon,
      run: act(() => {
        const dark = document.documentElement.classList.toggle("dark");
        document.documentElement.style.colorScheme = dark ? "dark" : "light";
        localStorage.setItem("rd:theme", dark ? "dark" : "light");
      }),
    },
    {
      id: "shortcuts",
      label: "Keyboard shortcuts",
      hint: "?",
      group: "Actions",
      keywords: "keys help bindings",
      icon: Keyboard,
      run: act(() => dispatch({ t: "ui/shortcuts", open: true })),
    },
  ];

  if (state.committedUrl) {
    actions.push({
      id: "share",
      label: "Copy share link",
      group: "Actions",
      keywords: "url copy clipboard",
      icon: Share2,
      run: act(() => {
        const url = buildShareUrl(
          {
            url: state.committedUrl,
            viewports: state.viewports,
            layout: state.layout,
            zoom: state.zoom,
          },
          state.devices,
          window.location.origin,
        );
        void navigator.clipboard.writeText(url);
      }),
    });
  }

  return [...actions, ...zoom, ...devices];
}
