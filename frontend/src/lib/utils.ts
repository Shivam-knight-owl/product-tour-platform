import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlaceholderImage(index: number = 0): string {
  const placeholders = [
    "https://placehold.co/600x400/2563eb/ffffff?text=Step+Image",
    "https://placehold.co/600x400/16a34a/ffffff?text=Tutorial+Step",
    "https://placehold.co/600x400/dc2626/ffffff?text=Product+Tour",
    "https://placehold.co/600x400/9333ea/ffffff?text=Feature+Demo",
  ];
  return placeholders[index % placeholders.length];
} 