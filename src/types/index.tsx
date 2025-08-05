interface Device {
    id: string;
    name: string;
    width: number;
    height: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    category: DeviceCategory;
    isCustom?: boolean;
}

type DeviceCategory = "mobile" | "tablet" | "desktop" | "custom";

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    borderHover: string;
    text: {
        primary: string;
        secondary: string;
        muted: string;
    };
    accent: {
        primary: string;
        secondary: string;
        hover: string;
    };
}

interface CustomDeviceForm {
    name: string;
    width: string;
    height: string;
}

interface DeviceButtonProps {
    device: Device;
    isSelected: boolean;
    onClick: (device: Device) => void;
    onDelete?: (device: Device) => void;
    theme: ThemeColors;
    size?: 'sm' | 'md' | 'lg';
}

interface ControlPanelProps {
    theme: ThemeColors;
    isLandscape: boolean;
    onToggleLandscape: () => void;
    selectedDevice: Device;
    scale: number;
    onAddCustomDevice: () => void;
    url: string;
    onUrlChange: (url: string) => void;
}

interface CustomDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (device: Omit<Device, 'id' | 'icon' | 'category' | 'isCustom'>) => void;
    theme: ThemeColors;
}

interface PreviewFrameProps {
    device: Device;
    isLandscape: boolean;
    theme: ThemeColors;
    scale: number;
    url: string | undefined;
    handleShare: (width: number, height: number) => void;
    copied: boolean;
}

export type { ControlPanelProps, CustomDeviceForm, CustomDeviceModalProps, Device, DeviceButtonProps, DeviceCategory, PreviewFrameProps, ThemeColors, ThemeMode };

