import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
  if (price == null || typeof price == "string") return "0";
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
