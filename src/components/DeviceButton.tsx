"use client"
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import type { Device } from "../types";

interface DeviceButtonProps {
  device: Device;
  isSelected: boolean;
  onClick: (device: Device) => void;
  onDelete?: (device: Device) => void;
  isDark: boolean;
}

const DeviceButton: React.FC<DeviceButtonProps> = ({
  device,
  isSelected,
  onClick,
  onDelete,
  isDark,
}) => {
  const Icon = device.icon;

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(device);
  }, [device, onDelete]);

  return (
    <button
      onClick={() => onClick(device)}
      className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full
        ${isSelected
          ? isDark
            ? 'bg-cyan-400/[0.07] border-cyan-400/40 shadow-[0_0_20px_rgba(0,212,255,0.1)]'
            : 'bg-cyan-500/[0.07] border-cyan-500/40 shadow-[0_4px_20px_rgba(0,212,255,0.1)]'
          : isDark
            ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]'
            : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.04] hover:border-black/[0.12]'
        }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
        ${isSelected
          ? isDark ? 'bg-cyan-400/15 text-cyan-400' : 'bg-cyan-500/10 text-cyan-600'
          : isDark ? 'bg-white/[0.04] text-slate-500 group-hover:text-slate-300' : 'bg-black/[0.04] text-slate-400 group-hover:text-slate-600'
        }`}>
        <Icon size={16} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold text-sm truncate ${isSelected
            ? isDark ? 'text-cyan-300' : 'text-cyan-700'
            : isDark ? 'text-slate-200' : 'text-slate-700'
          }`}>
            {device.name}
          </span>
          {device.isCustom && (
            <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-bold flex-shrink-0
              ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-500/10 text-violet-600'}`}>
              Custom
            </span>
          )}
        </div>
        <span className={`font-mono text-xs ${isSelected
          ? isDark ? 'text-cyan-500' : 'text-cyan-600'
          : isDark ? 'text-slate-600' : 'text-slate-400'
        }`}>
          {device.width}×{device.height}
        </span>
      </div>

      {/* Delete button for custom devices */}
      {device.isCustom && onDelete && (
        <button
          onClick={handleDelete}
          className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-all duration-200
            ${isDark
              ? 'text-slate-600 hover:text-red-400 hover:bg-red-400/10'
              : 'text-slate-300 hover:text-red-500 hover:bg-red-500/10'
            }`}
          aria-label="Delete device"
        >
          <Trash2 size={11} />
        </button>
      )}

      {/* Active indicator */}
      {isSelected && (
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full
          ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
      )}
    </button>
  );
};

export default DeviceButton;
