import type { CustomDeviceForm } from "../types";

export class ValidationService {
  static validateCustomDevice(form: CustomDeviceForm): {
    isValid: boolean;
    errors: Partial<CustomDeviceForm>;
  } {
    const errors: Partial<CustomDeviceForm> = {};

    if (!form.name.trim()) {
      errors.name = "Device name is required";
    } else if (form.name.trim().length > 50) {
      errors.name = "Device name must be less than 50 characters";
    }

    const width = parseInt(form.width);
    if (!form.width || isNaN(width) || width < 100 || width > 5000) {
      errors.width = "Width must be between 100-5000px";
    }

    const height = parseInt(form.height);
    if (!form.height || isNaN(height) || height < 100 || height > 5000) {
      errors.height = "Height must be between 100-5000px";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
