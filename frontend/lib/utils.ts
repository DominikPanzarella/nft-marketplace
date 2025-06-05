import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { addToast } from "@heroui/react";

export function truncateMiddle(str?: string | null, maxLength: number = 15): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;

  const start = str.slice(0, maxLength / 2);
  const end = str.slice(-maxLength / 2);

  return `${start}...${end}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const requireLogInSnakeBar = () =>
  addToast({
    title: "Error",
    description: "Please log in use this feature",
    color: "danger",
  });

export const searchInObject = (obj: any, searchTerm: string): boolean => {
  if (obj === null || obj === undefined) return false;

  if (Array.isArray(obj)) {
    return obj.some((item) => searchInObject(item, searchTerm));
  }

  if (typeof obj === "object") {
    return Object.values(obj).some((value) => searchInObject(value, searchTerm));
  }

  if (typeof obj === "object" && "toString" in obj) {
    return obj.toString().toLowerCase().includes(searchTerm);
  }

  return String(obj).toLowerCase().includes(searchTerm);
};
