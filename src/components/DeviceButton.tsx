"use client"
import { Edit3, Trash2 } from "lucide-react";
import { useCallback } from "react";
import type { DeviceButtonProps } from "../types";

const DeviceButton: React.FC<DeviceButtonProps> = ({
    device,
    isSelected,
    onClick,
    onDelete,
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

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(device);
        }
    }, [device, onDelete]);

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
                {
                    device.isCustom ? (
                        <div className="flex items-center gap-2 w-full">
                            <span className={`font-semibold text-${size} truncate flex-1`}>
                                {device.name}
                            </span>
                            {device.isCustom && (
                                <div className="flex items-center gap-1">
                                    <Edit3 size={12} className={`${isSelected ? 'text-blue-100' : theme.text.muted}`} />
                                    {onDelete && (
                                        <button
                                            onClick={handleDelete}
                                            className={`p-1 rounded hover:bg-red-500/20 transition-colors ${isSelected ? 'text-red-200 hover:text-red-100' : 'text-red-500 hover:text-red-600'
                                                }`}
                                            aria-label="Delete custom device"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : <span className={`font-semibold text-${size} truncate flex-1`}>
                        {device.name}
                    </span>
                }
                <span className={`text-sm ${isSelected ? 'text-white' : theme.text.muted
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