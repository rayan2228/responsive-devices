import { Monitor, Smartphone, Tablet } from "lucide-react";
import type { Device, ThemeColors, ThemeMode } from "../types";
const STORAGE_KEYS = {
    CUSTOM_DEVICES: 'responsive-preview-custom-devices',
    THEME_MODE: 'responsive-preview-theme-mode',
    SELECTED_DEVICE: 'responsive-preview-selected-device',
} as const;

const themes: Record<ThemeMode, ThemeColors> = {
    light: {
        background: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
        surface: 'bg-white/80 border-slate-700/20',
        surfaceHover: 'hover:bg-blue-50/50',
        border: 'border-slate-700/20',
        borderHover: 'hover:border-blue-300/60',
        text: {
            primary: 'text-slate-800',
            secondary: 'text-slate-600',
            muted: 'text-slate-800'
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
            muted: 'text-slate-200'
        },
        accent: {
            primary: 'text-blue-400',
            secondary: 'text-purple-400',
            hover: 'hover:text-blue-300'
        }
    }
};

const defaultDevices: Device[] = [
    { id: "1", name: "iPhone SE", width: 375, height: 667, icon: Smartphone, category: "mobile" },
    { id: "2", name: "iPhone 14", width: 390, height: 844, icon: Smartphone, category: "mobile" },
    { id: "3", name: "iPhone 14 Pro Max", width: 428, height: 926, icon: Smartphone, category: "mobile" },
    { id: "4", name: "Pixel 7", width: 412, height: 915, icon: Smartphone, category: "mobile" },
    { id: "5", name: "Samsung Galaxy S23", width: 360, height: 780, icon: Smartphone, category: "mobile" },
    { id: "6", name: "iPad Mini", width: 768, height: 1024, icon: Tablet, category: "tablet" },
    { id: "7", name: "iPad Air", width: 820, height: 1180, icon: Tablet, category: "tablet" },
    { id: "8", name: "iPad Pro 12.9", width: 1024, height: 1366, icon: Tablet, category: "tablet" },
    { id: "9", name: "Surface Pro", width: 912, height: 1368, icon: Tablet, category: "tablet" },
    { id: "10", name: "MacBook Air", width: 1280, height: 832, icon: Monitor, category: "desktop" },
    { id: "11", name: "Laptop", width: 1366, height: 768, icon: Monitor, category: "desktop" },
    { id: "12", name: "Desktop HD", width: 1920, height: 1080, icon: Monitor, category: "desktop" },
    { id: "13", name: "Desktop QHD", width: 2560, height: 1440, icon: Monitor, category: "desktop" },
    { id: "14", name: "Desktop 4K", width: 3840, height: 2160, icon: Monitor, category: "desktop" },
];

export { defaultDevices, STORAGE_KEYS, themes };

