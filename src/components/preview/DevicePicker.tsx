"use client";

import { Trash2 } from "lucide-react";
import { CATEGORY_ORDER } from "@/data/devices";
import { cn } from "@/lib/cn";
import { filterByCategory } from "@/lib/devices";
import { usePreview } from "@/state/preview-context";
import type { Device, DeviceCategory } from "@/types";

const DEFAULT_VISIBLE = 8;

export function DevicePicker() {
  const { state, dispatch } = usePreview();

  const visibleCategories = CATEGORY_ORDER.filter(
    ({ category }) =>
      category !== "custom" || filterByCategory(state.devices, "custom").length > 0,
  );

  const devices = filterByCategory(state.devices, state.category);
  const expanded = state.expanded[state.category];
  const canCollapse = devices.length > DEFAULT_VISIBLE;
  const shown = canCollapse && !expanded ? devices.slice(0, DEFAULT_VISIBLE) : devices;

  const selectedIds = new Set(
    (state.layout === "single" ? state.viewports.slice(0, 1) : state.viewports).map(
      (v) => v.deviceId,
    ),
  );

  return (
    <section className="overflow-hidden rounded-panel border border-subtle bg-surface">
      <div
        role="tablist"
        aria-label="Device category"
        className="flex gap-1 overflow-x-auto border-b border-subtle px-2"
      >
        {visibleCategories.map(({ category, label }) => {
          const active = state.category === category;
          return (
            <button
              key={category}
              role="tab"
              aria-selected={active}
              onClick={() =>
                dispatch({ t: "category/set", value: category as DeviceCategory })
              }
              className={cn(
                "relative shrink-0 px-3 py-3 text-[13px] transition-colors",
                active ? "font-medium text-ink" : "text-muted hover:text-ink",
              )}
            >
              {label}
              <span className="ml-1.5 font-mono text-[11px] text-faint">
                {filterByCategory(state.devices, category as DeviceCategory).length}
              </span>
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              selected={selectedIds.has(device.id)}
              onSelect={() => dispatch({ t: "vp/select", deviceId: device.id })}
              onDelete={
                device.isCustom
                  ? () => dispatch({ t: "device/remove", id: device.id })
                  : undefined
              }
            />
          ))}
        </div>

        {canCollapse && (
          <button
            onClick={() =>
              dispatch({ t: "category/toggleExpanded", value: state.category })
            }
            className="mt-2 w-full rounded-control border border-subtle py-2 text-[13px]
                       text-muted transition-colors hover:bg-elevated hover:text-ink"
          >
            {expanded ? "Show fewer" : `Show all ${devices.length}`}
          </button>
        )}
      </div>
    </section>
  );
}

function DeviceCard({
  device,
  selected,
  onSelect,
  onDelete,
}: {
  device: Device;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  const Icon = device.icon;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2.5 rounded-control border px-3 py-2.5 transition-colors",
        selected
          ? "border-accent/50 bg-accent-soft"
          : "border-subtle bg-canvas hover:border-strong hover:bg-elevated",
      )}
    >
      <button
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
        aria-pressed={selected}
      >
        <Icon
          size={15}
          className={cn("shrink-0", selected ? "text-accent" : "text-faint")}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-ink">
            {device.name}
          </span>
          <span className="block font-mono text-[11px] text-faint">
            {device.width}×{device.height}
          </span>
        </span>
      </button>

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label={`Delete ${device.name}`}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] text-faint
                     opacity-0 transition-all hover:bg-danger/10 hover:text-danger
                     focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}
