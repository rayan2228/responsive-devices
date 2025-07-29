import { useCallback, useState } from "react";
import { StorageService } from "../services/StorageService";
import { getResponsiveScale } from "../utils";
import { DeviceService } from "../services/DeviceService ";
import { defaultDevices, themes } from "../data";
import type { Device, ThemeMode } from "../types";
import { Globe } from "lucide-react";
import DeviceButton from "./DeviceButton";
import ControlPanel from "./ControlPanel";

const ResponsiveContainer: React.FC = () => {
    const [isDark, setIsDark] = useState<ThemeMode>(() => StorageService.loadThemeMode() === 'dark');
    const [devices, setDevices] = useState<Device[]>(() => {
        const defaultWithIds = DeviceService.createDevicesWithIds(defaultDevices);
        const customDevices = StorageService.loadCustomDevices();
        return [...defaultWithIds, ...customDevices];
    });
    const [selectedDevice, setSelectedDevice] = useState<Device>(() => {
        const allDevices = [
            ...DeviceService.createDevicesWithIds(defaultDevices),
            ...StorageService.loadCustomDevices()
        ];
        const savedDeviceId = StorageService.loadSelectedDevice();
        const savedDevice = savedDeviceId ? DeviceService.findById(allDevices, savedDeviceId) : null;
        return savedDevice || allDevices[0];
    });
    const [isLandscape, setIsLandscape] = useState<boolean>(false);
    const [showAllDevices, setShowAllDevices] = useState<boolean>(false);
    const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

    const currentTheme = themes[isDark ? 'dark' : 'light'];

    const getDevicesByCategory = useCallback((category: DeviceCategory): Device[] => {
        return DeviceService.filterByCategory(devices, category);
    }, [devices]);

    const handleThemeToggle = useCallback(() => {
        const newMode = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        StorageService.saveThemeMode(newMode ? 'dark' : 'light');
    }, [isDark]);

    const handleDeviceSelect = useCallback((device: Device) => {
        setSelectedDevice(device);
        StorageService.saveSelectedDevice(device.id);
    }, []);

    const handleAddCustomDevice = useCallback((deviceData: Omit<Device, 'id' | 'icon' | 'category' | 'isCustom'>) => {
        const newDevice = DeviceService.createCustomDevice(deviceData);
        const updatedDevices = [...devices, newDevice];
        setDevices(updatedDevices);
        setSelectedDevice(newDevice);
        StorageService.saveCustomDevices(updatedDevices);
        StorageService.saveSelectedDevice(newDevice.id);
    }, [devices]);

    const handleDeleteCustomDevice = useCallback((deviceToDelete: Device) => {
        if (!deviceToDelete.isCustom) return;

        const updatedDevices = devices.filter(d => d.id !== deviceToDelete.id);
        setDevices(updatedDevices);
        StorageService.saveCustomDevices(updatedDevices);

        // If the deleted device was selected, select the first available device
        if (selectedDevice.id === deviceToDelete.id) {
            const newSelected = updatedDevices[0];
            setSelectedDevice(newSelected);
            StorageService.saveSelectedDevice(newSelected.id);
        }
    }, [devices, selectedDevice]);

    // Calculate responsive values
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
        },
        {
            name: 'Custom Devices',
            category: 'custom' as const,
            gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }
    ];
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
                        {/* Theme Toggle */}
                        <button
                            onClick={handleThemeToggle}
                            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm ${isDark
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                                }`}
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun size={24} /> : <Moon size={24} />}
                        </button>
                    </div>

                    <p className={`text-lg lg:text-xl ${currentTheme.text.secondary} max-w-3xl mx-auto mb-8`}>
                        Test your website across different devices and screen sizes with our modern, scalable preview tool
                    </p>
                </header>

                {/* URL Input */}
                <section className={`backdrop-blur-xl rounded-2xl shadow-xl border p-6 lg:p-8 mb-6 lg:mb-8 ${currentTheme.surface}`}>
                    <form className="flex flex-col sm:flex-row gap-4">
                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            type="url"
                            placeholder="Enter your website URL (e.g., example.com)"
                            className={`w-full px-6 py-4 rounded-xl border-2 text-lg transition-all duration-300 
                  focus:scale-[1.01] focus:outline-none backdrop-blur-sm ${isDark
                                    ? 'bg-slate-900/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-900/80'
                                    : 'bg-white/90 border-slate-200/60 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white'
                                }`}
                        />
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap" onClick={handlePreview}
                            disabled={loading}>
                            {loading ? "Loading..." : "Preview"}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
                        <a target="_blankz" href={previewUrl} className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-semibold ${currentTheme.accent.primary} ${currentTheme.accent.hover} backdrop-blur-sm ${currentTheme.surface}`}>
                            <ExternalLink size={20} />
                            <span>Open in New Tab</span>
                        </a>
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