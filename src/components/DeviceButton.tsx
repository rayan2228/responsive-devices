import type { DeviceButtonProps } from "../types";

const DeviceButton: React.FC<DeviceButtonProps> = ({
    device,
    isSelected,
    onClick,
    theme,
    size = 'md'
}) => {
    const Icon = device.icon;

    const sizeClasses = {
        sm: 'px-3 py-2 gap-2',
        md: 'px-4 py-3 gap-3',
        lg: 'px-6 py-4 gap-4'
    };

    const iconSizes = {
        sm: 16,
        md: 18,
        lg: 20
    };

    return (
        <button
            onClick={() => onClick(device)}
            className={`group relative flex items-center ${sizeClasses[size]} rounded-xl border-2 
        transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] 
        backdrop-blur-sm ${isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                    : `${theme.surface} ${theme.text.primary} ${theme.border} ${theme.borderHover} ${theme.surfaceHover}`
                }`}
        >
            <Icon
                size={iconSizes[size]}
                className={`${isSelected ? 'text-white' : theme.text.muted} transition-colors`}
            />
            <div className="flex flex-col items-start min-w-0 flex-1">
                <span className={`font-semibold text-${size} truncate`}>
                    {device.name}
                </span>
                <span className={`text-xs ${isSelected ? 'text-blue-100' : theme.text.muted
                    }`}>
                    {device.width} × {device.height}
                </span>
            </div>
            {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse" />
            )}
        </button>
    );
};

export default DeviceButton;