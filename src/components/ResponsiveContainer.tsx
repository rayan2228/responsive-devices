import { ExternalLink, Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { devices, themes } from "../data";
import type { Device, DeviceCategory, } from "../types";
import ControlPanel from "./ControlPanel";
import DeviceButton from "./DeviceButton";
import PreviewFrame from "./PreviewFrame";



// Scaling utilities
const getResponsiveScale = (deviceWidth: number, containerWidth: number): number => {
    const maxScale = 0.8; // Maximum scale to prevent overflow
    const minScale = 0.1;
    const padding = 120; // Account for container padding
    const availableWidth = containerWidth - padding;

    if (deviceWidth <= availableWidth) return maxScale;

    const scale = availableWidth / deviceWidth;
    return Math.max(scale, minScale);
};
const ResponsiveContainer: React.FC = () => {
    const [url, setUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isDark, setIsDark] = useState<boolean>(false);
    const [selectedDevice, setSelectedDevice] = useState<Device>(devices[0]);
    const [isLandscape, setIsLandscape] = useState<boolean>(false);
    const [showAllDevices, setShowAllDevices] = useState<boolean>(false);

    const currentTheme = themes[isDark ? 'dark' : 'light'];

    const getDevicesByCategory = (category: DeviceCategory): Device[] => {
        return devices.filter(device => device.category === category);
    };

    const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const scale = getResponsiveScale(deviceWidth, containerWidth);

    const categoryConfig = [
        {
            name: 'Mobile Devices',
            category: 'mobile' as const,
            showCount: showAllDevices ? undefined : 4,
            gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        },
        {
            name: 'Tablets',
            category: 'tablet' as const,
            gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        },
        {
            name: 'Desktop & Laptops',
            category: 'desktop' as const,
            gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }
    ];
    const handlePreview = async () => {
        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        let formattedUrl = url.trim();
        if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
            formattedUrl = "https://" + formattedUrl;
        }

        try {
            new URL(formattedUrl);
            setError("");
            setLoading(true);
            setPreviewUrl(formattedUrl);
            setTimeout(() => setLoading(false), 1000);
        } catch {
            setError("Please enter a valid URL");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handlePreview();
        }
    };


    return (
        <div className={`min-h-screen transition-all duration-500 ${currentTheme.background} relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'white' : 'black'} 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <header className="text-center mb-8 lg:mb-12">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl backdrop-blur-sm ${currentTheme.surface}`}>
                            <Globe className={currentTheme.accent.primary} size={40} />
                        </div>
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${currentTheme.text.primary} tracking-tight`}>
                            Responsive Preview
                        </h1>
                    </div>

                    <p className={`text-lg lg:text-xl ${currentTheme.text.secondary} max-w-3xl mx-auto mb-8`}>
                        Test your website across different devices and screen sizes with our modern, scalable preview tool
                    </p>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm ${isDark
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                            }`}
                        aria-label="Toggle dark mode"
                    >
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </header>

                {/* URL Input */}
                <section className={`backdrop-blur-xl rounded-2xl shadow-xl border p-6 lg:p-8 mb-6 lg:mb-8 ${currentTheme.surface}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyPress}
                                type="url"
                                placeholder="Enter your website URL (e.g., example.com)"
                                className={`w-full px-6 py-4 rounded-xl border-2 text-lg transition-all duration-300 
                  focus:scale-[1.01] focus:outline-none backdrop-blur-sm ${isDark
                                        ? 'bg-slate-900/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-900/80'
                                        : 'bg-white/90 border-slate-200/60 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white'
                                    }`}
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap" onClick={handlePreview}
                            disabled={loading}>
                            {loading ? "Loading..." : "Preview"}
                        </button>
                    </div>
                </section>

                {/* Device Selection */}
                <section className={`backdrop-blur-xl rounded-2xl shadow-xl border p-6 lg:p-8 mb-6 lg:mb-8 ${currentTheme.surface}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                        <h2 className={`text-2xl lg:text-3xl font-bold ${currentTheme.text.primary} mb-4 sm:mb-0`}>
                            Device Selection
                        </h2>
                        <button
                            onClick={() => setShowAllDevices(!showAllDevices)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${currentTheme.accent.primary} ${currentTheme.accent.hover} backdrop-blur-sm ${currentTheme.surface}`}
                        >
                            {showAllDevices ? "Show Popular" : "Show All Devices"}
                        </button>
                    </div>

                    {/* Device Categories */}
                    {categoryConfig.map(({ name, category, showCount, gridCols }, index) => (
                        <div key={category} className={index > 0 ? `mt-8 pt-8 border-t ${currentTheme.border}` : ''}>
                            {(showAllDevices || category === 'mobile') && (
                                <>
                                    <h3 className={`text-lg lg:text-xl font-bold ${currentTheme.text.secondary} mb-6`}>
                                        {name}
                                    </h3>
                                    <div className={`grid ${gridCols} gap-4 mb-6`}>
                                        {getDevicesByCategory(category)
                                            .slice(0, showCount)
                                            .map((device) => (
                                                <DeviceButton
                                                    key={device.name}
                                                    device={device}
                                                    isSelected={selectedDevice.name === device.name}
                                                    onClick={setSelectedDevice}
                                                    theme={currentTheme}
                                                    size="md"
                                                />
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Control Panel */}
                    <ControlPanel
                        theme={currentTheme}
                        isLandscape={isLandscape}
                        onToggleLandscape={() => setIsLandscape(!isLandscape)}
                        selectedDevice={selectedDevice}
                        scale={scale}
                    />
                </section>

                {/* Preview Section */}
                <section className={`backdrop-blur-xl rounded-2xl shadow-xl border p-6 lg:p-8 ${currentTheme.surface}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                        <h2 className={`text-2xl lg:text-3xl font-bold ${currentTheme.text.primary} mb-4 sm:mb-0`}>
                            Preview: {selectedDevice.name}
                        </h2>
                        <button className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold ${currentTheme.accent.primary} ${currentTheme.accent.hover} backdrop-blur-sm ${currentTheme.surface}`}>
                            <ExternalLink size={20} />
                            <span>Open in New Tab</span>
                        </button>
                    </div>
                    {
                        previewUrl && (
                            <PreviewFrame
                                device={selectedDevice}
                                isLandscape={isLandscape}
                                theme={currentTheme}
                                scale={scale}
                                loading={loading}
                                previewUrl={previewUrl}
                            />

                        )
                    }
                </section>
            </div >
        </div >
    );
};

export default ResponsiveContainer;