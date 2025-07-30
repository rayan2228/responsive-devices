import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { defaultDevices, themes } from "../data";
import { DeviceService } from "../services/DeviceService ";
import { StorageService } from "../services/StorageService";
import type { Device, DeviceCategory } from "../types";
import { getResponsiveScale } from "../utils";
import ControlPanel from "./ControlPanel";
import CustomDeviceModal from "./CustomDeviceModal";
import DeviceButton from "./DeviceButton";
import PreviewFrame from "./PreviewFrame";

const ResponsivePreview: React.FC = () => {
  // State initialization with storage
  const [isDark, setIsDark] = useState<boolean>(() => StorageService.loadThemeMode() === 'dark');
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
  const [url, setUrl] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(1200);

  const currentTheme = themes[isDark ? 'dark' : 'light'];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDevicesByCategory = useCallback((category: DeviceCategory): Device[] => {
    return DeviceService.filterByCategory(devices, category);
  }, [devices]);

  const handleThemeToggle = useCallback(() => {
    const newMode = !isDark;
    setIsDark(newMode);
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
              Responsive Preview
            </h1>
            <p className={`text-lg ${currentTheme.text.secondary}`}>
              Test your websites across different device viewports
            </p>
          </div>

          <button
            onClick={handleThemeToggle}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 font-semibold 
              transition-all duration-300 hover:scale-105 active:scale-95 
              ${currentTheme.surface} ${currentTheme.text.primary} ${currentTheme.border} ${currentTheme.borderHover} ${currentTheme.surfaceHover}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* Device Categories */}
        <div className="space-y-8 mb-8">
          {categoryConfig.map(({ name, category, showCount, gridCols }) => {
            const categoryDevices = getDevicesByCategory(category);
            const displayDevices = showCount ? categoryDevices.slice(0, showCount) : categoryDevices;

            if (categoryDevices.length === 0) return null;

            return (
              <div key={category} className={`p-6 rounded-2xl border backdrop-blur-sm ${currentTheme.surface}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${currentTheme.text.primary}`}>
                    {name}
                  </h2>
                  {category === 'mobile' && categoryDevices.length > 4 && (
                    <button
                      onClick={() => setShowAllDevices(!showAllDevices)}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${currentTheme.accent.primary} ${currentTheme.accent.hover}`}
                    >
                      {showAllDevices ? 'Show Less' : `Show All (${categoryDevices.length})`}
                    </button>
                  )}
                </div>

                <div className={`grid ${gridCols} gap-4`}>
                  {displayDevices.map((device) => (
                    <DeviceButton
                      key={device.id}
                      device={device}
                      isSelected={selectedDevice.id === device.id}
                      onClick={handleDeviceSelect}
                      onDelete={device.isCustom ? handleDeleteCustomDevice : undefined}
                      theme={currentTheme}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Control Panel */}
        <div className={`p-6 rounded-2xl border backdrop-blur-sm ${currentTheme.surface}`}>
          <ControlPanel
            theme={currentTheme}
            isLandscape={isLandscape}
            onToggleLandscape={() => setIsLandscape(!isLandscape)}
            selectedDevice={selectedDevice}
            scale={scale}
            onAddCustomDevice={() => setShowCustomModal(true)}
            url={url}
            onUrlChange={setUrl}
          />
        </div>

        {/* Preview Frame */}
        <div className="mt-8">
          <PreviewFrame
            device={selectedDevice}
            isLandscape={isLandscape}
            theme={currentTheme}
            scale={scale}
            url={url}
          />
        </div>

        {/* Custom Device Modal */}
        <CustomDeviceModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSave={handleAddCustomDevice}
          theme={currentTheme}
        />
      </div>
    </div>
  );
};

export default ResponsivePreview;