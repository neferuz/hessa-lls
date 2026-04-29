import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { API_BASE_URL } from "./config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | null | undefined) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("data:")) return url;
  
  const backendBase = API_BASE_URL.replace(/\/$/, "");
  
  // If it's a relative path from the backend storage
  if (url.startsWith("/static/uploads")) {
    return `${backendBase}${url}`;
  }
  
  // Standard transformation for paths like /banners-img/... or simple filenames
  // but avoiding common frontend-only paths like /images/
  if (url.startsWith("/") && !url.startsWith("/images")) {
    return `${backendBase}/static/uploads${url}`;
  }
  
  if (!url.startsWith("/") && !url.startsWith("images/")) {
    return `${backendBase}/static/uploads/${url}`;
  }

  return url;
}
