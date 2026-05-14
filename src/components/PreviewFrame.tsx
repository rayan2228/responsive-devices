"use client";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import type { Device } from "../types";

interface PreviewFrameProps {
  device: Device;
  isLandscape: boolean;
  isDark: boolean;
  scale: number;
  url: string | undefined;
  handleShare: (width: number, height: number) => void;
  copied: boolean;
  errorMessage: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({
  device,
  isLandscape,
  isDark,
  scale,
  url,
  handleShare,
  copied,
  errorMessage,
}) => {
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;

  const [loading, setLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setIframeError(false);
      const timer = setTimeout(() => setLoading(false), 1800);
      return () => clearTimeout(timer);
    }
  }, [url]);

  const outerPad = 28;
  const frameW = width + outerPad * 2;
  const frameH = height + outerPad * 2 + 48; // extra for top notch area

  return (
    <div className={`rounded-2xl border overflow-hidden backdrop-blur-2xl
      ${isDark ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-white/60 border-black/[0.05] shadow-sm'}`}>

      {/* Top bar */}
      <div className={`flex items-center justify-between px-5 py-3.5 border-b
        ${isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
          </div>
          <div className={`h-4 w-px ${isDark ? 'bg-white/[0.07]' : 'bg-black/[0.07]'}`} />
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold font-display uppercase tracking-widest
              ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {device.name}
            </span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded-md
              ${isDark ? 'bg-cyan-400/[0.08] text-cyan-400 border border-cyan-400/20' : 'bg-cyan-500/[0.07] text-cyan-600 border border-cyan-500/20'}`}>
              {width}×{height}
            </span>
            {isLandscape && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                ${isDark ? 'bg-orange-400/10 text-orange-400 border border-orange-400/20' : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'}`}>
                ↔ landscape
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {url && (
            <button
              onClick={() => handleShare(width, height)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border transition-all duration-200
                ${isDark
                  ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.07]'
                  : 'bg-black/[0.03] border-black/[0.07] text-slate-500 hover:text-slate-700 hover:bg-black/[0.06]'
                }`}
            >
              <FiShare2 size={12} />
              {copied ? 'Copied!' : 'Share'}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="overflow-auto py-10 px-4"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at center, rgba(0,212,255,0.02) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }}>
        <div className="flex justify-center items-start min-h-[300px]">
          {/* Device shell */}
          <div
            className="relative flex-shrink-0"
            style={{
              width: frameW * scale,
              height: frameH * scale,
            }}>
            {/* Glow behind device */}
            {url && (
              <div
                className="absolute inset-4 rounded-3xl blur-3xl opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #00d4ff, #7c3aed)' }}
              />
            )}

            {/* Device frame */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                width: frameW * scale,
                height: frameH * scale,
                background: isDark
                  ? 'linear-gradient(145deg, #0e1428, #080c1c)'
                  : 'linear-gradient(145deg, #1a2040, #0c1020)',
                boxShadow: isDark
                  ? `0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)`
                  : `0 0 0 1px rgba(0,0,0,0.15), 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
              }}>

              {/* Top notch bar */}
              <div className="flex items-center justify-center pt-3 pb-2"
                style={{ height: 48 * scale }}>
                <div className="rounded-full bg-black/60"
                  style={{ width: 80 * scale, height: 14 * scale }} />
              </div>

              {/* Screen */}
              <div
                className="relative overflow-hidden bg-white"
                style={{
                  width: width * scale,
                  height: height * scale,
                  marginLeft: outerPad * scale,
                  borderRadius: 4 * scale,
                }}>
                {url ? (
                  <>
                    {loading && (
                      <div className="absolute inset-0 bg-[#0a0f24] flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative w-10 h-10">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
                          </div>
                          <p className="text-xs text-slate-500 font-mono">Loading...</p>
                        </div>
                      </div>
                    )}
                    {iframeError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f24] p-4">
                        <div className="text-center max-w-xs">
                          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                            <span className="text-red-400 text-xl">⚠</span>
                          </div>
                          <p className="text-sm font-semibold text-red-300 mb-1">Cannot embed this site</p>
                          <p className="text-xs text-slate-500">
                            The website may block embedding via X-Frame-Options or CSP headers.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={url}
                        className="border-0 block"
                        style={{
                          width: `${width}px`,
                          height: `${height}px`,
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left',
                          display: 'block',
                        }}
                        title="Website Preview"
                        onLoad={() => { setLoading(false); setIframeError(false); }}
                        onError={() => { setLoading(false); setIframeError(true); }}
                      />
                    )}
                  </>
                ) : errorMessage ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#0a0f24]">
                    <div className="text-center px-6">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                        <span className="text-red-400 text-xl">⚠</span>
                      </div>
                      <p className="text-sm font-semibold text-red-300 mb-1">Invalid URL</p>
                      <p className="text-xs text-slate-500">{errorMessage}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#080d1e] to-[#0a1228]">
                    <div className="text-center px-6">
                      {/* Animated icon */}
                      <div className="relative mx-auto mb-5 w-16 h-16 animate-float">
                        <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 blur-sm" />
                        <div className="relative w-full h-full rounded-2xl bg-cyan-400/[0.07] border border-cyan-400/20 flex items-center justify-center">
                          <Globe size={28} className="text-cyan-400/60" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold font-display text-slate-300 mb-1.5">
                        Enter a URL to preview
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-[160px] mx-auto">
                        Your website will appear here at {width}×{height}
                      </p>
                      {device.isCustom && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                          bg-violet-500/10 border border-violet-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                          <span className="text-[10px] text-violet-400 font-medium">{device.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;
