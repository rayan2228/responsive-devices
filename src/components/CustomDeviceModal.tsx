"use client"
import { useCallback, useState } from "react";
import { ValidationService } from "../services/ValidationService ";
import type { CustomDeviceForm, Device } from "../types";

interface CustomDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Omit<Device, 'id' | 'icon' | 'category' | 'isCustom'>) => void;
  isDark: boolean;
}

const CustomDeviceModal: React.FC<CustomDeviceModalProps> = ({
  isOpen, onClose, onSave, isDark,
}) => {
  const [form, setForm] = useState<CustomDeviceForm>({ name: "", width: "", height: "" });
  const [errors, setErrors] = useState<Partial<CustomDeviceForm>>({});

  const handleSave = useCallback(() => {
    const validation = ValidationService.validateCustomDevice(form);
    setErrors(validation.errors);
    if (validation.isValid) {
      onSave({ name: form.name.trim(), width: parseInt(form.width), height: parseInt(form.height) });
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
    else if (e.key === "Escape") handleClose();
  }, [handleSave, handleClose]);

  if (!isOpen) return null;

  const inputCls = (hasError: boolean) => `w-full h-11 px-4 rounded-xl text-sm font-mono border transition-all duration-300 outline-none
    ${hasError
      ? isDark
        ? 'bg-red-500/[0.05] border-red-400/40 text-red-300 focus:border-red-400/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
        : 'bg-red-50 border-red-400/60 text-red-700 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
      : isDark
        ? 'bg-[#050814]/80 border-white/[0.07] text-slate-200 placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-cyan-500/[0.02] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.07)]'
        : 'bg-white border-black/[0.08] text-slate-700 placeholder:text-slate-300 focus:border-cyan-500/50 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md rounded-2xl border overflow-hidden animate-slide-up
          ${isDark
            ? 'bg-[#0a0f22] border-white/[0.08]'
            : 'bg-white border-black/[0.08] shadow-2xl'
          }`}
        onKeyDown={handleKeyDown}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Header */}
        <div className={`flex items-center justify-between px-6 pt-6 pb-5 border-b
          ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
          <div>
            <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Add Custom Device
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Define a custom viewport size
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg leading-none transition-colors
              ${isDark
                ? 'text-slate-600 hover:text-slate-300 hover:bg-white/[0.05]'
                : 'text-slate-400 hover:text-slate-600 hover:bg-black/[0.04]'
              }`}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
              ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Device Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
              placeholder="e.g., Custom Mobile"
              maxLength={50}
              className={inputCls(!!errors.name)}
            />
            {errors.name && (
              <p className="text-xs mt-1.5 text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Width + Height */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Width (px)', field: 'width' as const, placeholder: '375' },
              { label: 'Height (px)', field: 'height' as const, placeholder: '812' },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className={`block text-xs font-semibold uppercase tracking-widest mb-2
                  ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {label}
                </label>
                <input
                  type="number"
                  value={form[field]}
                  onChange={(e) => { setForm({ ...form, [field]: e.target.value }); if (errors[field]) setErrors({ ...errors, [field]: undefined }); }}
                  placeholder={placeholder}
                  min="100" max="5000"
                  className={inputCls(!!errors[field])}
                />
                {errors[field] && (
                  <p className="text-xs mt-1.5 text-red-400">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Dimension preview */}
          {form.width && form.height && !errors.width && !errors.height && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border
              ${isDark ? 'bg-cyan-400/[0.04] border-cyan-400/20' : 'bg-cyan-500/[0.04] border-cyan-500/20'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
              <span className={`text-xs font-mono ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {form.width} × {form.height} px
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleClose}
              className={`flex-1 h-11 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                ${isDark
                  ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
                  : 'bg-black/[0.03] border-black/[0.08] text-slate-500 hover:text-slate-700'
                }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                bg-gradient-to-r from-cyan-500 to-violet-600 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)]"
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
