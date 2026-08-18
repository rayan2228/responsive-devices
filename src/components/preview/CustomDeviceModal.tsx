"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  MAX_DIMENSION,
  MIN_DIMENSION,
  validateCustomDevice,
} from "@/lib/validation";
import { usePreview } from "@/state/preview-context";
import type { CustomDeviceForm } from "@/types";

const EMPTY: CustomDeviceForm = { name: "", width: "", height: "" };

export function CustomDeviceModal() {
  const { state, dispatch } = usePreview();
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<CustomDeviceForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<CustomDeviceForm>>({});

  const open = state.customModalOpen;

  // Native <dialog> gives a real focus trap, background inert, Esc-to-close
  // and top-layer stacking — none of which need reimplementing here.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const close = () => {
    setForm(EMPTY);
    setErrors({});
    dispatch({ t: "ui/customModal", open: false });
  };

  const save = () => {
    const result = validateCustomDevice(form);
    setErrors(result.errors);
    if (!result.isValid) return;
    dispatch({
      t: "device/addCustom",
      name: form.name.trim(),
      width: Number.parseInt(form.width, 10),
      height: Number.parseInt(form.height, 10),
    });
    setForm(EMPTY);
    setErrors({});
  };

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        // A click landing on the <dialog> element itself is a backdrop click;
        // clicks on the inner panel have it as an ancestor, not the target.
        if (e.target === ref.current) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-panel border border-subtle
                 bg-surface p-0 text-ink shadow-pop backdrop:bg-black/50
                 backdrop:backdrop-blur-[2px] open:animate-[fade-in_0.15s_ease]"
    >
      <form method="dialog" onSubmit={(e) => e.preventDefault()}>
        <div className="border-b border-subtle px-5 py-4">
          <h2 className="text-[15px] font-semibold">Custom viewport</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            Saved in this browser for next time.
          </p>
        </div>

        <div className="space-y-4 p-5">
          <Field label="Name" error={errors.name}>
            <input
              autoFocus
              value={form.name}
              maxLength={50}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setErrors({ ...errors, name: undefined });
              }}
              placeholder="Kiosk display"
              className={inputCls(Boolean(errors.name))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            {(["width", "height"] as const).map((field) => (
              <Field
                key={field}
                label={field === "width" ? "Width" : "Height"}
                error={errors[field]}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  min={MIN_DIMENSION}
                  max={MAX_DIMENSION}
                  value={form[field]}
                  onChange={(e) => {
                    setForm({ ...form, [field]: e.target.value });
                    setErrors({ ...errors, [field]: undefined });
                  }}
                  placeholder={field === "width" ? "1280" : "800"}
                  className={cn(inputCls(Boolean(errors[field])), "font-mono")}
                />
              </Field>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={close} className="flex-1">
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={save} className="flex-1">
              Add device
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "h-10 w-full rounded-control border bg-canvas px-3 text-[13px] text-ink",
    "outline-none transition-colors placeholder:text-faint",
    hasError ? "border-danger/60" : "border-subtle focus:border-accent",
  );

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-eyebrow uppercase text-faint">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
