"use client"
import { Moon, Sun } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { defaultDevices } from "../data";
import { DeviceService } from "../services/DeviceService ";
import { StorageService } from "../services/StorageService";
import type { Device, DeviceCategory } from "../types";
import { getResponsiveScale } from "../utils";
import ControlPanel from "./ControlPanel";
import CustomDeviceModal from "./CustomDeviceModal";
import DeviceButton from "./DeviceButton";
import Footer from "./Footer";
import PreviewFrame from "./PreviewFrame";

const categoryConfig = [
  { label: 'Mobile', category: 'mobile' as DeviceCategory, defaultShowCount: 4, gridCols: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4' },
  { label: 'Tablet', category: 'tablet' as DeviceCategory, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' },
  { label: 'Desktop', category: 'desktop' as DeviceCategory, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' },
  { label: 'Custom', category: 'custom' as DeviceCategory, defaultShowCount: 3, gridCols: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' },
];

const ResponsiveContainer: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [devices, setDevices] = useState<Device[]>(() => {
    const customDevices = StorageService.loadCustomDevices();
    return [...defaultDevices, ...customDevices];
  });
  const [selectedDevice, setSelectedDevice] = useState<Device>(() => {
    const allDevices = [...defaultDevices, ...StorageService.loadCustomDevices()];
    const savedDeviceId = StorageService.loadSelectedDevice();
    const savedDevice = savedDeviceId ? DeviceService.findById(allDevices, savedDeviceId) : null;
    return savedDevice || allDevices[0];
  });
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<DeviceCategory, boolean>>({
    mobile: false, tablet: false, desktop: false, custom: false
  });
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const [formattedUrl, setFormattedUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [activeCategory, setActiveCategory] = useState<DeviceCategory>('mobile');
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    StorageService.saveThemeMode(isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDevicesByCategory = useCallback((category: DeviceCategory): Device[] => {
    return DeviceService.filterByCategory(devices, category);
  }, [devices]);

  const handleThemeToggle = useCallback(() => setIsDark(d => !d), []);

  const handleDeviceSelect = useCallback((device: Device) => {
    setSelectedDevice(device);
    StorageService.saveSelectedDevice(device.id);
    setTimeout(() => {
      const el = document.getElementById('preview-section');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
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
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  }, []);

  const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const scale = getResponsiveScale(deviceWidth, containerWidth);

  const activeCategoryData = categoryConfig.find(c => c.category === activeCategory);
  const activeDevices = getDevicesByCategory(activeCategory);
  const isExpanded = expandedCategories[activeCategory];
  const shouldShowToggle = activeDevices.length > (activeCategoryData?.defaultShowCount || 3);
  const displayDevices = shouldShowToggle && !isExpanded
    ? activeDevices.slice(0, activeCategoryData?.defaultShowCount)
    : activeDevices;

  const handleShare = (width: number, height: number) => {
    if (!url) return;
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set("url", url);
    shareUrl.searchParams.set("device", selectedDevice.id);
    shareUrl.searchParams.set("orientation", isLandscape ? "landscape" : "portrait");
    shareUrl.searchParams.set("width", width.toString());
    shareUrl.searchParams.set("height", height.toString());
    navigator.clipboard.writeText(shareUrl.toString()).then(() => {
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
          name: 'Shared Device',
          width: parseInt(widthParam),
          height: parseInt(heightParam)
        });
        const updatedDevices = [...devices, newDevice];
        setDevices(updatedDevices);
        setSelectedDevice(newDevice);
        StorageService.saveCustomDevices(updatedDevices);
        setIsLandscape(orientationParam === 'landscape');
        setUrl(urlParam);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleUrlChange = (input: string) => {
    if (errorMessage) setErrorMessage('');
    setUrl(input);
    if (!input.trim()) { setFormattedUrl(''); return; }
    try {
      let domain = input.trim();
      if (!/^https?:\/\//i.test(domain)) domain = "https://" + domain;
      const parsed = new URL(domain);
      setFormattedUrl(parsed.href);
    } catch {
      setErrorMessage("Invalid URL format");
      setFormattedUrl("");
    }
  };

  const visibleCategories = categoryConfig.filter(c => getDevicesByCategory(c.category).length > 0);

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-500 ${isDark ? 'bg-[#050814]' : 'bg-slate-100'}`}>
      {/* Ambient background orbs */}
      {isDark && (
        <>
          <div className="ambient-orb-1" />
          <div className="ambient-orb-2" />
        </>
      )}

      {/* Grid background */}
      {isDark && (
        <div className="fixed inset-0 opacity-[0.025] pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ──────────────────────────────── */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6 animate-slide-up">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {/* Logo mark */}
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 opacity-20 blur-sm" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="1" y="4" width="11" height="8" rx="1.5" stroke="white" strokeWidth="1.5"/>
                    <rect x="14" y="6" width="5" height="6" rx="1" stroke="white" strokeWidth="1.5"/>
                    <line x1="6.5" y1="12" x2="6.5" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="4" y1="15" x2="9" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight shimmer-text">
                Responsihub
              </h1>
            </div>
            <p className={`text-sm sm:text-base font-light tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'} ml-[52px]`}>
              Preview · Test · Perfect your responsive designs
            </p>

            {/* Social share */}
            <div className="flex items-center gap-3 ml-[52px] mt-1">
              <span className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Share</span>
              <div className="flex items-center gap-2">
                {[
                  { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, icon: <FaFacebookF size={12}/>, color: 'hover:text-blue-400' },
                  { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check%20out%20Responsihub!`, icon: <FaXTwitter size={12}/>, color: 'hover:text-sky-400' },
                  { href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`, icon: <FaLinkedinIn size={12}/>, color: 'hover:text-blue-500' },
                  { href: `https://api.whatsapp.com/send?text=Check%20out%20Responsihub!%20${encodeURIComponent(currentUrl)}`, icon: <FaWhatsapp size={12}/>, color: 'hover:text-green-400' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                      ${isDark ? 'bg-white/[0.04] border border-white/[0.07] text-slate-500' : 'bg-black/[0.04] border border-black/[0.07] text-slate-400'}
                      ${s.color} hover:scale-110 hover:border-white/20`}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              border backdrop-blur-sm hover:scale-105 active:scale-95
              ${isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-white/[0.15]'
                : 'bg-black/[0.04] border-black/[0.08] text-slate-600 hover:bg-black/[0.07]'
              }`}
          >
            {isDark
              ? <><Sun size={15} className="text-amber-400" /><span>Light Mode</span></>
              : <><Moon size={15} className="text-indigo-500" /><span>Dark Mode</span></>
            }
          </button>
        </header>

        {/* ── URL + Controls ───────────────────────── */}
        <section className={`rounded-2xl p-5 sm:p-6 mb-6 border backdrop-blur-2xl
          ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-black/[0.06] shadow-sm'}`}
          style={{ animationDelay: '100ms' }}>
          <ControlPanel
            isDark={isDark}
            isLandscape={isLandscape}
            onToggleLandscape={() => setIsLandscape(!isLandscape)}
            selectedDevice={selectedDevice}
            scale={scale}
            onAddCustomDevice={() => setShowCustomModal(true)}
            url={url}
            onUrlChange={handleUrlChange}
          />
        </section>

        {/* ── Device Grid ──────────────────────────── */}
        <section className={`rounded-2xl border backdrop-blur-2xl overflow-hidden mb-8
          ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/70 border-black/[0.06] shadow-sm'}`}
          style={{ animationDelay: '150ms' }}>

          {/* Tabs */}
          <div className={`flex border-b px-4 sm:px-6 overflow-x-auto
            ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            {visibleCategories.map(({ label, category }) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2
                  ${activeCategory === category
                    ? `border-cyan-400 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`
                    : `border-transparent ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`
                  }`}
              >
                {label}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-mono
                  ${activeCategory === category
                    ? isDark ? 'bg-cyan-400/15 text-cyan-400' : 'bg-cyan-500/10 text-cyan-600'
                    : isDark ? 'bg-white/[0.04] text-slate-600' : 'bg-black/[0.04] text-slate-400'
                  }`}>
                  {getDevicesByCategory(category).length}
                </span>
              </button>
            ))}
          </div>

          {/* Device buttons */}
          <div className="p-4 sm:p-6">
            <div className={`grid ${activeCategoryData?.gridCols} gap-3 stagger-children`}>
              {displayDevices.map((device) => (
                <DeviceButton
                  key={device.id}
                  device={device}
                  isSelected={selectedDevice.id === device.id}
                  onClick={handleDeviceSelect}
                  onDelete={device.isCustom ? handleDeleteCustomDevice : undefined}
                  isDark={isDark}
                />
              ))}
            </div>

            {shouldShowToggle && (
              <button
                onClick={() => toggleCategoryExpansion(activeCategory)}
                className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                  ${isDark
                    ? 'border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/[0.12] hover:bg-white/[0.03]'
                    : 'border-black/[0.06] text-slate-400 hover:text-slate-600 hover:bg-black/[0.02]'
                  }`}
              >
                {isExpanded ? '↑ Show less' : `↓ Show all ${activeDevices.length} devices`}
              </button>
            )}
          </div>
        </section>

        {/* ── Preview ───────────────────────────────── */}
        <section id="preview-section">
          <PreviewFrame
            device={selectedDevice}
            isLandscape={isLandscape}
            isDark={isDark}
            scale={scale}
            url={formattedUrl}
            handleShare={handleShare}
            copied={copied}
            errorMessage={errorMessage}
          />
        </section>

        <CustomDeviceModal
          isOpen={showCustomModal}
          onClose={() => setShowCustomModal(false)}
          onSave={handleAddCustomDevice}
          isDark={isDark}
        />
      </div>

      <Footer isDark={isDark} />
    </div>
  );
};

export default ResponsiveContainer;
