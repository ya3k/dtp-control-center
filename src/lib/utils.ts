/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityError } from "@/lib/https";
import { TicketKind } from "@/schemaValidations/tour-operator.shema";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Remove first character of string if it is "/"
// For example: "/abc" => "abc", "abc" => "abc"
export function nomalizePath(path: string) {
  return path.startsWith("/") ? path.slice(1) : path;
}

export function handleErrorApi(
  error: any,
  setError?: UseFormSetError<any>,
  duration?: number,
) {
  if (error instanceof EntityError) {
    error.payload.error.forEach((err) => toast.error(err));
  }
}

export const formatPrice = (price: number) => {
  if (price == null || typeof price == "string") return "0";
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export const getTicketKind = (ticketKind: TicketKind) => {
  switch (ticketKind) {
    case TicketKind.Adult:
      return "Người lớn";
    case TicketKind.Child:
      return "Trẻ em";
    case TicketKind.PerGroupOfThree:
      return "Nhóm 3 người";
    case TicketKind.PerGroupOfFive:
      return "Nhóm 5 người";
    case TicketKind.PerGroupOfSeven:
      return "Nhóm 7 người";
    case TicketKind.PerGroupOfTen:
      return "Nhóm 10 người";
    default:
      return "Loại vé không hợp lệ";
  }
};

export const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

export const isDateInPast = (dateString: string): boolean => {
  // Parse the DD-MM-YYYY format
  const [day, month, year] = dateString.split('-').map(Number);
  const itemDate = new Date(year, month - 1, day); // Month is 0-indexed in JS Date
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of today for proper comparison
  
  return itemDate < today;
};
