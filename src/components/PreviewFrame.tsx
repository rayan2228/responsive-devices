import { Globe } from "lucide-react";
import type { PreviewFrameProps } from "../types";

const PreviewFrame: React.FC<PreviewFrameProps> = ({ device, isLandscape, theme, scale }) => {
    const width = isLandscape ? device.height : device.width;
    const height = isLandscape ? device.width : device.height;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    return (
        <div className="flex justify-center items-center p-8">
            <div className="relative">
                <div
                    className={`relative rounded-3xl p-6 shadow-2xl backdrop-blur-sm ${theme.surface.includes('dark') ? 'bg-slate-900/80' : 'bg-slate-800/90'
                        }`}
                    style={{
                        width: scaledWidth + 48,
                        height: scaledHeight + 48
                    }}
                >
                    <div
                        className="bg-white rounded-2xl overflow-hidden shadow-inner relative"
                        style={{
                            width: scaledWidth,
                            height: scaledHeight
                        }}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <div className="text-center">
                                <Globe size={Math.min(64, scaledWidth * 0.1)} className="mx-auto mb-4 text-slate-400" />
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
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
                    </div>
                </div>
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-3xl blur-2xl opacity-60" />
            </div>
        </div>
    );
};

export default PreviewFrame;