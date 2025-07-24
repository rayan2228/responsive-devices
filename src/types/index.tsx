interface Device {
    name: string;
    width: number;
    height: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    category: DeviceCategory;
}

type DeviceCategory = "mobile" | "tablet" | "desktop";

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
    loading: boolean;
    previewUrl: string;
}

export type { ControlPanelProps, Device, DeviceButtonProps, DeviceCategory, PreviewFrameProps, ThemeColors };

