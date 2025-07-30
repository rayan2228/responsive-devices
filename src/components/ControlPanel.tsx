"use client"
import { Globe, Plus, RotateCcw } from "lucide-react";
import type { ControlPanelProps } from "../types";

const ControlPanel: React.FC<ControlPanelProps> = ({
  theme,
  isLandscape,
  onToggleLandscape,
  selectedDevice,
  scale,
  onAddCustomDevice,
  url,
  onUrlChange
}) => (
  <div className={`flex flex-col gap-4 pt-6 border-t ${theme.border}`}>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label className={`block text-sm font-medium mb-2 ${theme.text.secondary}`}>
          Website URL
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 pl-10 rounded-lg border-2 transition-colors focus:outline-none ${theme.surface.includes('dark')
              ? 'bg-slate-900/60 border-slate-600/60 text-white focus:border-blue-400'
              : 'bg-white/90 border-slate-200/60 text-slate-800 focus:border-blue-400'
              }`}
          />
          <Globe size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.text.muted}`} />
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onToggleLandscape}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold 
            transition-all duration-300 hover:scale-105 active:scale-95 ${isLandscape
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-orange-400 shadow-lg shadow-orange-500/25'
              : `${theme.surface} ${theme.text.primary} ${theme.border} ${theme.borderHover} ${theme.surfaceHover}`
            }`}
        >
          <RotateCcw size={18} />
          <span>Landscape Mode</span>
        </button>

        <button
          onClick={onAddCustomDevice}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold 
            transition-all duration-300 hover:scale-105 active:scale-95 
            ${theme.surface} ${theme.text.primary} ${theme.border} ${theme.borderHover} ${theme.surfaceHover}`}
        >
          <Plus size={18} />
          <span>Custom Device</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${theme.text.secondary}`}>
            Viewport:
          </span>
          <div className={`px-4 py-2 rounded-lg font-mono text-sm backdrop-blur-sm ${theme.surface} ${theme.text.primary}`}>
            {isLandscape ? selectedDevice.height : selectedDevice.width} × {isLandscape ? selectedDevice.width : selectedDevice.height}
          </div>
        </div>

        {scale < 0.8 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500 font-medium">
              Scaled: {Math.round(scale * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ControlPanel;