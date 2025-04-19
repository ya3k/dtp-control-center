import { z } from "zod";

// Enum for ticket types
export enum TicketKind {
  Adult = 0,
  Child = 1,
  PerGroupOfThree = 2,
  PerGroupOfFive = 3,
  PerGroupOfSeven = 4,
  PerGroupOfTen = 5,
}

// Basic information schema (Step 1)
export const BasicTourInfoSchema = z.object({
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  img: z.array(z.string())
    .min(1, "At least one image is required"),
  categoryid: z.string(),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),

});

// Schedule information schema (Step 2)
export const ScheduleInfoSchema = z.object({
  // Can be today or in future
  openDay: z.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Open day must be today or in the future"),
  // Can be today or in future
  closeDay: z.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Close day must be today or in the future"),
  scheduleFrequency: z.string()
    .min(1, "Schedule frequency is required"),
}).superRefine((data, ctx) => {
  // Allow closeDay to be the same as openDay
  if (data.closeDay < data.openDay) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Close day must be on or after open day",
      path: ["closeDay"],
    });
  }
});

//destination activities schema
export const destinationActivities = z.object({
  name: z.string()
    .min(3, "Activity name must be at least 3 characters"),
  startTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format. Use HH:MM:SS"),
  endTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format. Use HH:MM:SS"),
  sortOrder: z.number()
    .int("Sort order must be an integer")
    .nonnegative("Sort order must be non-negative"),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Destination schema (Step 3)
export const DestinationSchema = z.object({
  destinationId: z.string().uuid("Invalid destination ID"),
  destinationActivities: z.array(destinationActivities),
  startTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format. Use HH:MM:SS"),
  endTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Invalid time format. Use HH:MM:SS"),
  sortOrder: z.number()
    .int("Sort order must be an integer")
    .nonnegative("Sort order must be non-negative"),
  sortOrderByDate: z.number()
    .int("Sort order by date must be an integer")
    .nonnegative("Sort order by date must be non-negative"),
  img: z.array(z.string().url("Invalid image URL")),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

// Ticket schema (Step 4)
export const TicketSchema = z.object({
  defaultNetCost: z.coerce.number()
    .positive("Price must be positive")
    .nonnegative("Price cannot be negative"),
  minimumPurchaseQuantity: z.number()
    .int("Quantity must be an integer")
    .positive("Quantity must be positive")
    .min(1, "Minimum purchase quantity must be at least 1"),
  ticketKind: z.nativeEnum(TicketKind, {
    errorMap: () => ({ message: "Invalid ticket type" }),
  }),
});

// Additional Information schema (Step 5)
export const AdditionalInfoSchema = z.object({
  about: z.string()
    .min(20, "About section must be at least 20 characters"),

  include: z.string()
    .min(10, "Include section must be at least 10 characters"),

  pickinfor: z.string()
    .min(10, "Pick information must be at least 10 characters")

});

// Complete Tour schema
export const TourSchema = z.object({
  // Basic Info
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must not exceed 100 characters"),
  img: z.array(z.string())
    .min(1, "At least one image is required"),
  categoryid: z.string(),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must not exceed 1000 characters"),


  // Schedule Info
  openDay: z.date()
    .min(new Date(), "Open day must be in the future"),
  closeDay: z.date(),
  scheduleFrequency: z.string()
    .min(1, "Schedule frequency is required"),

  // Destinations and Tickets
  destinations: z.array(DestinationSchema)
    .min(1, "At least one destination is required"),
  tickets: z.array(TicketSchema)
    .min(1, "At least one ticket type is required"),

  // Additional Info
  about: z.string()
    .min(20, "About section must be at least 20 characters")
    .max(2000, "About section must not exceed 2000 characters"),
  include: z.string()
    .min(10, "Include section must be at least 10 characters")
    .max(1000, "Include section must not exceed 1000 characters"),
  pickinfor: z.string()
    .min(10, "Pick information must be at least 10 characters")
    .max(1000, "Pick information must not exceed 1000 characters"),
}).superRefine((data, ctx) => {
  if (data.closeDay <= data.openDay) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Close day must be after open day",
      path: ["closeDay"],
    });
  }
});
// Type definitions for POST requests
export type POSTBasicTourInfoType = z.infer<typeof BasicTourInfoSchema>;
export type POSTTourScheduleInfoType = z.infer<typeof ScheduleInfoSchema>;
export type POSTTourAdditionalInfoType = z.infer<typeof AdditionalInfoSchema>;
export type POSTTourDestinationActivitiesType = z.infer<typeof destinationActivities>;
export type POSTTourDestinationType = z.infer<typeof DestinationSchema>;
export type POSTTourTicketType = z.infer<typeof TicketSchema>;
export type POSTTourType = z.infer<typeof TourSchema>;


