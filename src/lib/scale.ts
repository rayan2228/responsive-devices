import type { Zoom } from "@/types";

/**
 * Scale factor for a frame.
 *
 * The old `getResponsiveScale` hard-capped at 0.8, so even a 375px phone in a
 * wide window rendered at 80% and nothing was ever seen at true size. `fit`
 * now caps at 1.
 */
export function resolveScale(
  zoom: Zoom,
  frameWidth: number,
  availableWidth: number,
  frameHeight?: number,
  availableHeight?: number,
): number {
  if (zoom !== "fit") return zoom;
  if (availableWidth <= 0) return 1;

  const byWidth = availableWidth / frameWidth;
  const byHeight =
    frameHeight && availableHeight ? availableHeight / frameHeight : Infinity;

  return Math.min(1, Math.max(0.1, Math.min(byWidth, byHeight)));
}

export const ZOOM_LEVELS: ReadonlyArray<{ value: Zoom; label: string }> = [
  { value: "fit", label: "Fit" },
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
];
