"use client"
import { Moon, Sun } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { defaultDevices, themes } from "../data";
import { DeviceService } from "../services/DeviceService ";
import { StorageService } from "../services/StorageService";
import type { Device, DeviceCategory } from "../types";
import { getResponsiveScale } from "../utils";
import ControlPanel from "./ControlPanel";
import CustomDeviceModal from "./CustomDeviceModal";
import DeviceButton from "./DeviceButton";
import Footer from "./Footer";
import PreviewFrame from "./PreviewFrame";

const ResponsiveContainer: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => StorageService.loadThemeMode() === 'dark');
  const [devices, setDevices] = useState<Device[]>(() => {
    const customDevices = StorageService.loadCustomDevices();
    return [...defaultDevices, ...customDevices];
  });
  const [selectedDevice, setSelectedDevice] = useState<Device>(() => {
    const allDevices = [
      ...defaultDevices,
      ...StorageService.loadCustomDevices()
    ];
    const savedDeviceId = StorageService.loadSelectedDevice();
    const savedDevice = savedDeviceId ? DeviceService.findById(allDevices, savedDeviceId) : null;
    return savedDevice || allDevices[0];
  });
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<DeviceCategory, boolean>>({
    mobile: false,
    tablet: false,
    desktop: false,
    custom: false
  });
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [formattedUrl, setFormattedUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [activeCategory, setActiveCategory] = useState<DeviceCategory>('mobile');

  const currentTheme = themes[isDark ? 'dark' : 'light'];

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
    window.scrollTo({ top: 780, behavior: 'smooth' });
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
    if (selectedDevice.id === deviceToDelete.id) {
      const newSelected = updatedDevices[0];
      setSelectedDevice(newSelected);
      StorageService.saveSelectedDevice(newSelected.id);
    }
  }, [devices, selectedDevice]);

  const toggleCategoryExpansion = useCallback((category: DeviceCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const scale = getResponsiveScale(deviceWidth, containerWidth);

  const categoryConfig = [
    { name: 'Mobile Devices', category: 'mobile' as const, defaultShowCount: 4, gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
    { name: 'Tablets', category: 'tablet' as const, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
    { name: 'Desktop & Laptops', category: 'desktop' as const, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
    { name: 'Custom Devices', category: 'custom' as const, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }
  ];

  const activeCategoryData = categoryConfig.find(cat => cat.category === activeCategory);
  const activeDevices = getDevicesByCategory(activeCategory);
  const isExpanded = expandedCategories[activeCategory];
  const shouldShowToggle = activeDevices.length > (activeCategoryData?.defaultShowCount || 3);
  const displayDevices = shouldShowToggle && !isExpanded
    ? activeDevices.slice(0, activeCategoryData?.defaultShowCount)
    : activeDevices;
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);




  const [copied, setCopied] = useState(false);
  const handleShare = (width: number, height: number) => {
    if (!url) return;
    const currentUrl = new URL(window.location.origin);
    currentUrl.searchParams.set("url", url);
    currentUrl.searchParams.set("device", selectedDevice.id);
    currentUrl.searchParams.set("orientation", isLandscape ? "landscape" : "portrait");
    currentUrl.searchParams.set("width", width.toString());
    currentUrl.searchParams.set("height", height.toString());
    navigator.clipboard.writeText(currentUrl.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const deviceParam = searchParams.get('device');
    const orientationParam = searchParams.get('orientation');
    const urlParam = searchParams.get('url');
    const widthParam = searchParams.get('width');
    const heightParam = searchParams.get('height');
    if (deviceParam && orientationParam && urlParam && widthParam && heightParam) {
      const device = devices.find(d => d.id === deviceParam);
      if (device) {
        setSelectedDevice(device);
        setIsLandscape(orientationParam === 'landscape');
        setUrl(urlParam);
      } else {
        const newDevice = DeviceService.createCustomDevice({
          name: 'Custom Device',
          width: parseInt(widthParam),
          height: parseInt(heightParam)
        })
        if (newDevice) {
          const updatedDevices = [...devices, newDevice];
          setDevices(updatedDevices);
          setSelectedDevice(newDevice);
          StorageService.saveCustomDevices(updatedDevices);
          setIsLandscape(orientationParam === 'landscape');
          setUrl(urlParam);
        }
      }
    }
  }, [devices, searchParams]);


  const handleUrlChange = (input: string) => {
    if (errorMessage) {
      setErrorMessage('');
    }

    setUrl(input);

    if (!input.trim()) return;

    try {
      let domain = input.trim();

      // Add protocol if missing
      if (!/^https?:\/\//i.test(domain)) {
        domain = "https://" + domain;
      }

      const parsed = new URL(domain);

      // Allow HTTPS always, and allow localhost over HTTP
      if (
        parsed.protocol !== 'https:' &&
        parsed.hostname !== 'localhost' &&
        !/^192\.168\./.test(parsed.hostname) // optional: allow local LAN IPs
      ) {
        setErrorMessage('Only HTTPS URLs are supported due to browser security policies.');
        setFormattedUrl('');
        return;
      }

      setFormattedUrl(parsed.href);
    } catch {
      setErrorMessage("Invalid URL format");
      setFormattedUrl("");
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${currentTheme.background} relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'white' : 'black'} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text mb-2">
              Responsihub
            </h1>
            <p className={`text-base sm:text-lg ${currentTheme.text.secondary}`}>
              Test your websites across real-world device viewports
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className={`text-sm ${currentTheme.text.secondary}`}>Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20out%20Responsihub!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-400 hover:underline"
              >
                <FaXTwitter size={16} />
              </a>

              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=Responsihub&summary=Test%20website%20responsiveness%20across%20devices`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-700 hover:underline"
              >
                <FaLinkedinIn size={16} />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=Check%20out%20Responsihub!%20${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-600 hover:underline"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          <button
            onClick={handleThemeToggle}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition shadow-sm hover:shadow-md active:scale-95
              ${currentTheme.surface} ${currentTheme.text.primary} ${currentTheme.border} ${currentTheme.borderHover} ${currentTheme.surfaceHover}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="mb-6 border-b border-gray-300 dark:border-gray-600 flex gap-4 overflow-x-auto">
          {categoryConfig.map(({ name, category }) => (
            getDevicesByCategory(category).length > 0 && (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 whitespace-nowrap font-medium transition border-b-2
                  ${activeCategory === category
                    ? `border-blue-500 ${currentTheme.text.primary}`
                    : `border-transparent ${currentTheme.text.muted} hover:${currentTheme.accent.hover}`}`}
              >
                {name}
              </button>
            )
          ))}
        </div>

        <div className={`p-6 rounded-2xl border shadow-md ${currentTheme.surface} `}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${currentTheme.text.primary}`}>
              {activeCategoryData?.name}
            </h2>
            {shouldShowToggle && (
              <button
                onClick={() => toggleCategoryExpansion(activeCategory)}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${currentTheme.accent.primary} ${currentTheme.accent.hover}`}
              >
                {isExpanded ? 'Show Less' : `Show All (${activeDevices.length})`}
              </button>
            )}
          </div>

          <div className={`grid ${activeCategoryData?.gridCols} gap-4`}>
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

        <div className={`p-6 rounded-2xl border shadow-md ${currentTheme.surface} mt-8`}>
          <ControlPanel
            theme={currentTheme}
            isLandscape={isLandscape}
            onToggleLandscape={() => setIsLandscape(!isLandscape)}
            selectedDevice={selectedDevice}
            scale={scale}
            onAddCustomDevice={() => setShowCustomModal(true)}
            url={url}
            onUrlChange={handleUrlChange}
          />
        </div>

        <div className="mt-8">
          <PreviewFrame
            device={selectedDevice}
            isLandscape={isLandscape}
            theme={currentTheme}
            scale={scale}
            url={formattedUrl}
            handleShare={handleShare}
            copied={copied}
            errorMessage={errorMessage}
          />
        </div>

        <CustomDeviceModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSave={handleAddCustomDevice}
          theme={currentTheme}
        />
      </div>
      <Footer theme={currentTheme} />

    </div>
  );
};

export default ResponsiveContainer;