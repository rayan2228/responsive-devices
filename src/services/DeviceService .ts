import { Monitor } from "lucide-react";
import type { Device, DeviceCategory } from "../types";
import { generateId } from "../utils";

export class DeviceService {
  static createDevicesWithIds(devices: Omit<Device, "id">[]): Device[] {
    return devices.map((device) => ({
      ...device,
      id: generateId(),
    }));
  }

  static createCustomDevice(
    data: Omit<Device, "id" | "icon" | "category" | "isCustom">
  ): Device {
    return {
      id: generateId(),
      name: data.name,
      width: data.width,
      height: data.height,
      icon: Monitor,
      category: "custom",
      isCustom: true,
    };
  }

  static filterByCategory(
    devices: Device[],
    category: DeviceCategory
  ): Device[] {
    return devices.filter((device) => device.category === category);
  }

  static findById(devices: Device[], id: string): Device | undefined {
    return devices.find((device) => device.id === id);
  }
}
