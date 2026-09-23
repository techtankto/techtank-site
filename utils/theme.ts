import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export { cva } from "class-variance-authority";
export type { VariantProps } from "class-variance-authority";
