import { cn } from "@/lib/cn";

/**
 * Three nested screens sharing a bottom-left origin — desktop, tablet, phone.
 * Monochrome and drawn in `currentColor`, so it needs no theme variants and
 * no gradient tile behind it.
 */
export function Logo({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect
        x="1"
        y="3"
        width="22"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.35"
      />
      <rect
        x="1"
        y="7"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.65"
      />
      <rect
        x="1"
        y="11"
        width="7.5"
        height="10"
        rx="1.75"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
