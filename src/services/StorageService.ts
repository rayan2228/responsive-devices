"use client";
import { Monitor } from "lucide-react";
import { STORAGE_KEYS } from "../data";
import type { Device, ThemeMode } from "../types";

export class StorageService {
  // Helper method to check if we're on the client side
  private static isClient(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  static saveCustomDevices(devices: Device[]): void {
    if (!this.isClient()) return;

    try {
      const customDevices = devices.filter((d) => d.isCustom);
      const serializedDevices = customDevices.map((device) => ({
        id: device.id,
        name: device.name,
        width: device.width,
        height: device.height,
        category: device.category,
        isCustom: device.isCustom,
      }));
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_DEVICES,
        JSON.stringify(serializedDevices)
      );
    } catch (error) {
      console.warn("Failed to save custom devices:", error);
    }
  }

  static loadCustomDevices(): Device[] {
    if (!this.isClient()) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_DEVICES);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      return parsed.map((device: Device) => ({
        ...device,
        icon: Monitor,
        category: "custom" as const,
        isCustom: true,
      }));
    } catch (error) {
      console.warn("Failed to load custom devices:", error);
      return [];
    }
  }

  static saveThemeMode(mode: ThemeMode): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.warn("Failed to save theme mode:", error);
    }
  }

  static loadThemeMode(): ThemeMode {
    if (!this.isClient()) return "dark"; // Default fallback for SSR

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return (stored as ThemeMode) || "dark";
    } catch (error) {
      console.warn("Failed to load theme mode:", error);
      return "dark";
    }
  }

  static saveSelectedDevice(deviceId: string): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_DEVICE, deviceId);
    } catch (error) {
      console.warn("Failed to save selected device:", error);
    }
  }

  static loadSelectedDevice(): string | null {
    if (!this.isClient()) return null; // Default fallback for SSR

    try {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_DEVICE);
    } catch (error) {
      console.warn("Failed to load selected device:", error);
      return null;
    }
  }

  static clearAll(): void {
    if (!this.isClient()) return;

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("Failed to clear storage:", error);
    }
  }
}
