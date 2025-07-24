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

export type { Device, DeviceCategory, ThemeColors };

