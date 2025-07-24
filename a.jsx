import { ExternalLink, Globe, Monitor, Moon, RotateCcw, Smartphone, Sun, Tablet } from "lucide-react";
import { useState } from "react";

// Types


// Theme configuration
const themes: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
    surface: 'bg-white/80 border-white/30',
    surfaceHover: 'hover:bg-blue-50/50',
    border: 'border-slate-200/60',
    borderHover: 'hover:border-blue-300/60',
    text: {
      primary: 'text-slate-800',
      secondary: 'text-slate-600',
      muted: 'text-slate-500'
    },
    accent: {
      primary: 'text-blue-600',
      secondary: 'text-purple-600',
      hover: 'hover:text-blue-700'
    }
  },
  dark: {
    background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900',
    surface: 'bg-slate-800/40 border-slate-700/40',
    surfaceHover: 'hover:bg-slate-700/50',
    border: 'border-slate-700/60',
    borderHover: 'hover:border-blue-400/60',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
      muted: 'text-slate-400'
    },
    accent: {
      primary: 'text-blue-400',
      secondary: 'text-purple-400',
      hover: 'hover:text-blue-300'
    }
  }
};

// Device configurations
const devices: Device[] = [
  { name: "iPhone SE", width: 375, height: 667, icon: Smartphone, category: "mobile" },
  { name: "iPhone 14", width: 390, height: 844, icon: Smartphone, category: "mobile" },
  { name: "iPhone 14 Pro Max", width: 428, height: 926, icon: Smartphone, category: "mobile" },
  { name: "Pixel 7", width: 412, height: 915, icon: Smartphone, category: "mobile" },
  { name: "Samsung Galaxy S23", width: 360, height: 780, icon: Smartphone, category: "mobile" },
  { name: "iPad Mini", width: 768, height: 1024, icon: Tablet, category: "tablet" },
  { name: "iPad Air", width: 820, height: 1180, icon: Tablet, category: "tablet" },
  { name: "iPad Pro 12.9", width: 1024, height: 1366, icon: Tablet, category: "tablet" },
  { name: "Surface Pro", width: 912, height: 1368, icon: Tablet, category: "tablet" },
  { name: "MacBook Air", width: 1280, height: 832, icon: Monitor, category: "desktop" },
  { name: "Laptop", width: 1366, height: 768, icon: Monitor, category: "desktop" },
  { name: "Desktop HD", width: 1920, height: 1080, icon: Monitor, category: "desktop" },
  { name: "Desktop QHD", width: 2560, height: 1440, icon: Monitor, category: "desktop" },
  { name: "Desktop 4K", width: 3840, height: 2160, icon: Monitor, category: "desktop" },
];

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

// Component Props
interface DeviceButtonProps {
  device: Device;
  isSelected: boolean;
  onClick: (device: Device) => void;
  theme: ThemeColors;
  size?: 'sm' | 'md' | 'lg';
}

interface ControlPanelProps {
  theme: ThemeColors;
  isLandscape: boolean;
  onToggleLandscape: () => void;
  selectedDevice: Device;
  scale: number;
}

interface PreviewFrameProps {
  device: Device;
  isLandscape: boolean;
  theme: ThemeColors;
  scale: number;
}

// Components




const PreviewFrame: React.FC<PreviewFrameProps> = ({ device, isLandscape, theme, scale }) => {
  const width = isLandscape ? device.height : device.width;
  const height = isLandscape ? device.width : device.height;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative">
        {/* Device Frame */}
        <div
          className={`relative rounded-3xl p-6 shadow-2xl backdrop-blur-sm ${theme.surface.includes('dark') ? 'bg-slate-900/80' : 'bg-slate-800/90'
            }`}
          style={{
            width: scaledWidth + 48,
            height: scaledHeight + 48
          }}
        >
          {/* Screen */}
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-inner relative"
            style={{
              width: scaledWidth,
              height: scaledHeight
            }}
          >
            {/* Preview Content */}
            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center">
                <Globe size={Math.min(64, scaledWidth * 0.1)} className="mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-semibold text-slate-600 mb-2">Website Preview</p>
                <p className="text-sm text-slate-500 px-4">
                  Enter a URL to see your site rendered at {width}×{height}
                </p>
              </div>
            </div>

            {/* Screen Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-8 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-3xl blur-2xl opacity-60" />
      </div>
    </div>
  );
};

// Main Component
const ResponsivePreview: React.FC = () => {
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
                type="url"
                placeholder="Enter your website URL (e.g., example.com)"
                className={`w-full px-6 py-4 rounded-xl border-2 text-lg transition-all duration-300 
                  focus:scale-[1.01] focus:outline-none backdrop-blur-sm ${isDark
                    ? 'bg-slate-900/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-900/80'
                    : 'bg-white/90 border-slate-200/60 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:bg-white'
                  }`}
              />
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap">
              Load Preview
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

          <PreviewFrame
            device={selectedDevice}
            isLandscape={isLandscape}
            theme={currentTheme}
            scale={scale}
          />
        </section>
      </div>
    </div>
  );
};

export default ResponsivePreview;