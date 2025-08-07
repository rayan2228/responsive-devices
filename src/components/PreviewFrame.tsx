"use client";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { FiShare2 } from "react-icons/fi";
import type { PreviewFrameProps } from "../types";

const PreviewFrame: React.FC<PreviewFrameProps> = ({ device, isLandscape, theme, scale, url, handleShare, copied }) => {
    const width = isLandscape ? device.height : device.width;
    const height = isLandscape ? device.width : device.height;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (url) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [url]);

    return (
        <div className="flex justify-center items-center p-8">
            <div className="relative">
                {/* Share Button */}
                {url && (
                    <button
                        onClick={() => handleShare(width, height)}
                        className="absolute top-3 right-3 z-20 bg-white text-sm text-slate-700 border border-slate-300 px-3 py-1 rounded-md flex items-center gap-2 hover:bg-slate-100 transition"
                    >
                        <FiShare2 />
                        Share
                    </button>
                )}

                {/* Share Copied Tooltip */}
                {copied && (
                    <div className="absolute top-14 right-3 z-30 bg-black text-white text-xs px-2 py-1 rounded">
                        Link copied!
                    </div>
                )}

                <div
                    className={`relative rounded-3xl p-6 shadow-2xl backdrop-blur-sm ${theme.surface.includes('dark') ? 'bg-slate-900/80' : 'bg-slate-800/90'}`}
                    style={{
                        width: scaledWidth + 48,
                        height: scaledHeight + 48
                    }}
                >
                    <div
                        className="bg-white rounded-2xl overflow-x-auto overflow-y-hidden shadow-inner relative origin-top-left"
                        style={{
                            width: width,
                            height: height,
                            transform: `scale(${scale})`
                        }}
                    >
                        {url ? (
                            <div className="w-full h-full relative">
                                {loading && (
                                    <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm text-slate-600">Loading website...</p>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    src={url}
                                    className="border-0"
                                    style={{
                                        width: `${width}px`,
                                        height: `${height}px`
                                    }}
                                    title="Website Preview"
                                    onLoad={() => setLoading(false)}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                <div className="text-center">
                                    <Globe size={Math.min(64, width * 0.1)} className="mx-auto mb-4 text-slate-400" />
                                    <p className="text-lg font-semibold text-slate-600 mb-2">Website Preview</p>
                                    <p className="text-sm text-slate-500 px-4">
                                        Enter a URL to see your site rendered at {width}×{height}
                                    </p>
                                    {device.isCustom && (
                                        <p className="text-xs text-blue-500 mt-2 font-medium">
                                            Custom Device: {device.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
                    </div>
                </div>
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-3xl blur-2xl opacity-60 -z-10" />
            </div>
        </div>
    );
};

export default PreviewFrame;