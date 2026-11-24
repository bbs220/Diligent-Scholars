import { isAxiosError } from "axios";
import toast from "react-hot-toast";

// global error handler
export const handleApiError = (error: unknown): void => {
  if (isAxiosError(error)) {
    // catch Zod Validation Errors (Array)
    // checks both the root and the new 'data' wrapper just to be safe
    const zodErrors =
      error.response?.data?.errors || error.response?.data?.data?.errors;

    if (zodErrors && Array.isArray(zodErrors) && zodErrors.length > 0) {
      // toast the very first validation error
      toast.error(zodErrors[0].message);
      return;
    }

    // catch standard Backend Errors ("Email already exists", "Invalid credentials")
    // this perfectly catches our new { success, message, data } shape
    const serverMessage = error.response?.data?.message;

    if (serverMessage) {
      toast.error(serverMessage);
      return;
    }
  }

  // fallback for network timeouts or completely unexpected frontend errors
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred. Please try again.");
  }
};

// capitalize the first letter of a string
export const capitalize = (str: string) => {
  const capitalizedString = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizedString;
};

// compress uploaded image file to data url
export const compressImageFile = (
  file: File,
  maxWidth = 256,
  maxHeight = 256,
  quality = 0.85,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL("image/webp", quality);
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image file"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

// format last active date string to relative time label
export const formatLastActive = (dateString?: string): string => {
  if (!dateString) return "Offline";
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "Offline";
  if (diffInSeconds < 60) return "Active just now";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `Active ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Active ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Active ${days}d ago`;
};
