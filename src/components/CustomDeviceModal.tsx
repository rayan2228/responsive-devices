"use client"
import { useCallback, useState } from "react";
import { ValidationService } from "../services/ValidationService ";
import type { CustomDeviceForm, CustomDeviceModalProps } from "../types";

const CustomDeviceModal: React.FC<CustomDeviceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  theme,
}) => {
  const [form, setForm] = useState<CustomDeviceForm>({
    name: "",
    width: "",
    height: "",
  });
  const [errors, setErrors] = useState<Partial<CustomDeviceForm>>({});

  const handleSave = useCallback(() => {
    const validation = ValidationService.validateCustomDevice(form);
    setErrors(validation.errors);

    if (validation.isValid) {
      onSave({
        name: form.name.trim(),
        width: parseInt(form.width),
        height: parseInt(form.height),
      });
      setForm({ name: "", width: "", height: "" });
      setErrors({});
      onClose();
    }
  }, [form, onSave, onClose]);

  const handleClose = useCallback(() => {
    setForm({ name: "", width: "", height: "" });
    setErrors({});
    onClose();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleSave, handleClose]
  );

  const getInputClasses = (hasError: boolean) => {
    if (hasError) {
      return theme.surface.includes("dark")
        ? "bg-red-900/30 border-red-400 text-red-100 focus:border-red-300 placeholder:text-red-300/60"
        : "bg-red-50 border-red-400 text-red-900 focus:border-red-500 placeholder:text-red-400/60";
    }
    
    return theme.surface.includes("dark")
      ? "bg-slate-900/60 border-slate-600/60 text-white focus:border-blue-400 placeholder:text-slate-400"
      : "bg-white/90 border-slate-200/60 text-slate-800 focus:border-blue-400 placeholder:text-slate-500";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 ${theme.surface}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${theme.text.primary}`}>
            Add Custom Device
          </h3>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${theme.text.muted} hover:${theme.text.primary}`}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}
            >
              Device Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="e.g., Custom Mobile, My Tablet"
              maxLength={50}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${getInputClasses(!!errors.name)}`}
            />
            {errors.name && (
              <p className={`text-sm mt-1 font-medium ${theme.surface.includes("dark") ? "text-red-300" : "text-red-600"}`}>
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}
              >
                Width (px)
              </label>
              <input
                type="number"
                value={form.width}
                onChange={(e) => {
                  setForm({ ...form, width: e.target.value });
                  if (errors.width) setErrors({ ...errors, width: undefined });
                }}
                placeholder="375"
                min="100"
                max="5000"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${getInputClasses(!!errors.width)}`}
              />
              {errors.width && (
                <p className={`text-sm mt-1 font-medium ${theme.surface.includes("dark") ? "text-red-300" : "text-red-600"}`}>
                  {errors.width}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}
              >
                Height (px)
              </label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => {
                  setForm({ ...form, height: e.target.value });
                  if (errors.height) setErrors({ ...errors, height: undefined });
                }}
                placeholder="667"
                min="100"
                max="5000"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${getInputClasses(!!errors.height)}`}
              />
              {errors.height && (
                <p className={`text-sm mt-1 font-medium ${theme.surface.includes("dark") ? "text-red-300" : "text-red-600"}`}>
                  {errors.height}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-300 ${theme.surface} ${theme.text.primary} ${theme.border}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Add Device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDeviceModal;