import type { CustomDeviceForm } from "@/types";

export const MIN_DIMENSION = 100;
export const MAX_DIMENSION = 5000;
export const MAX_NAME_LENGTH = 50;

export function validateCustomDevice(form: CustomDeviceForm): {
  isValid: boolean;
  errors: Partial<CustomDeviceForm>;
} {
  const errors: Partial<CustomDeviceForm> = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = "Device name is required";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Keep the name under ${MAX_NAME_LENGTH} characters`;
  }

  (["width", "height"] as const).forEach((field) => {
    const value = Number.parseInt(form[field], 10);
    if (!form[field] || Number.isNaN(value)) {
      errors[field] = "Required";
    } else if (value < MIN_DIMENSION || value > MAX_DIMENSION) {
      errors[field] = `${MIN_DIMENSION}–${MAX_DIMENSION}px`;
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Normalises loose input into a URL fit for an iframe.
 * Returns null when the input can't be made into one.
 */
export function normalizeUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withScheme);
    // A bare word like "hello" parses as https://hello with no dot — reject it
    // rather than pointing an iframe at a nonexistent host.
    if (!parsed.hostname.includes(".") && parsed.hostname !== "localhost") {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
