"use client"
import { Globe, Plus, RotateCcw } from "lucide-react";
import type { Device } from "../types";

interface ControlPanelProps {
  isDark: boolean;
  isLandscape: boolean;
  onToggleLandscape: () => void;
  selectedDevice: Device;
  scale: number;
  onAddCustomDevice: () => void;
  url: string;
  onUrlChange: (url: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isDark,
  isLandscape,
  onToggleLandscape,
  selectedDevice,
  scale,
  onAddCustomDevice,
  url,
  onUrlChange,
}) => {
  const displayW = isLandscape ? selectedDevice.height : selectedDevice.width;
  const displayH = isLandscape ? selectedDevice.width : selectedDevice.height;

  return (
    <div className="flex flex-col gap-5">
      {/* URL row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className={`block text-xs font-semibold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Target URL
          </label>
          <div className="relative">
            <Globe
              size={16}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
            />
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://your-website.com"
              className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm font-mono transition-all duration-300
                ${isDark
                  ? 'bg-[#050814]/80 border border-white/[0.07] text-slate-200 placeholder:text-slate-700 focus:border-cyan-400/50 focus:bg-cyan-500/[0.03] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]'
                  : 'bg-white border border-black/[0.08] text-slate-700 placeholder:text-slate-300 focus:border-cyan-500/50 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]'
                } outline-none`}
            />
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          {/* Landscape toggle */}
          <button
            onClick={onToggleLandscape}
            className={`group flex items-center gap-2.5 h-10 px-5 rounded-xl text-sm font-semibold
              border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
              ${isLandscape
                ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-orange-400/40 text-orange-300 shadow-[0_0_20px_rgba(251,146,60,0.15)]'
                : isDark
                  ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.15]'
                  : 'bg-black/[0.03] border-black/[0.07] text-slate-500 hover:text-slate-700'
              }`}
          >
            <RotateCcw
              size={15}
              className={`transition-transform duration-500 ${isLandscape ? 'rotate-90' : ''}`}
            />
            Landscape
          </button>

          {/* Add custom device */}
          <button
            onClick={onAddCustomDevice}
            className={`flex items-center gap-2.5 h-10 px-5 rounded-xl text-sm font-semibold
              border transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]
              ${isDark
                ? 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]'
                : 'bg-black/[0.03] border-black/[0.07] text-slate-500 hover:text-cyan-600 hover:border-cyan-500/30'
              }`}
          >
            <Plus size={15} />
            Custom Device
          </button>
        </div>

        {/* Viewport info */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 h-10 px-4 rounded-xl border
            ${isDark
              ? 'bg-[#050814]/60 border-white/[0.07]'
              : 'bg-white/80 border-black/[0.08]'
            }`}>
            <span className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              Viewport
            </span>
            <span className={`font-mono text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {displayW}<span className={`${isDark ? 'text-slate-600' : 'text-slate-300'} mx-0.5`}>×</span>{displayH}
            </span>
          </div>

          {scale < 0.8 && (
            <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.05]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono text-amber-400">{Math.round(scale * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
