"use client";

import { cn } from "@/lib/cn";

interface SegmentedOption<T> {
  value: T;
  label: string;
  title?: string;
}

interface SegmentedProps<T> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-control border border-subtle bg-surface p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            role="radio"
            aria-checked={selected}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-7 rounded-[7px] px-2.5 text-[13px] transition-colors duration-150",
              selected
                ? "bg-elevated text-ink font-medium shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
