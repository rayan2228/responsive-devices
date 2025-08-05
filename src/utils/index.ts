import { defaultDevices } from "@/data";
import { StorageService } from "@/services/StorageService";

const generateId = (): string => {
  const existingIds = StorageService.loadCustomDevices();
  if (existingIds.length === 0) {
    return (
      Number(defaultDevices[defaultDevices.length - 1].id) + 1
    ).toString();
  } else {
    return (Number(existingIds[existingIds.length - 1].id) + 1).toString();
  }
};

const getResponsiveScale = (
  deviceWidth: number,
  containerWidth: number
): number => {
  const maxScale = 0.8;
  const minScale = 0.1;
  const padding = 120;
  const availableWidth = containerWidth - padding;

  if (deviceWidth <= availableWidth) return maxScale;

  const scale = availableWidth / deviceWidth;
  return Math.max(scale, minScale);
};

export { generateId, getResponsiveScale };
