const generateId = (): string => {
  return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
