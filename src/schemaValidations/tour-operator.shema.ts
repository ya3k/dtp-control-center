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

// Destination schema
export const DestinationSchema = z.object({
  destinationId: z.string().uuid(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
});



// Ticket schema
export const TicketSchema = z.object({
  defaultNetCost: z.coerce.number().positive(),
  defaultTax: z.coerce.number().nonnegative(),
  minimumPurchaseQuantity: z.number().int().positive(),
  ticketKind: z.nativeEnum(TicketKind),
});

// Tour schema for creating/updating
export const TourSchema = z.object({
  title: z.string(),
  companyId: z.string(),
  category: z.string().uuid(),
  description: z.string(),
  destinations: z.array(DestinationSchema),
  tickets: z.array(TicketSchema),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string(),
});

// Tour response schema (includes ID)
export const TourResSchema = TourSchema.extend({
  id: z.string(),
  tourDestinations: z.array(DestinationSchema),
  ticketTypes: z.array(TicketSchema),
});

// Type definitions inferred from Zod schemas
export type TourResType = z.infer<typeof TourResSchema>;
export type TourType = z.infer<typeof TourSchema>;
export type TourDestinationType = z.infer<typeof DestinationSchema>;
export type TourTicketType = z.infer<typeof TicketSchema>;

// Additional types for the UI
export const DestinationUI = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export type Destination = z.infer<typeof DestinationUI>;

// Form data schemas
export const TourInfoFormSchema = TourSchema.pick({
  title: true,
  companyId: true,
  category: true,
  description: true,
});

export const tourInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  companyId: z.string().min(1, "Company ID is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
})


export type TourInfoFormType = z.infer<typeof tourInfoSchema>;

export type TourInfoFormData = z.infer<typeof TourInfoFormSchema>;

export const TicketScheduleFormSchema = z.object({
  tickets: z.array(TicketSchema),
});
export type TicketScheduleFormData = z.infer<typeof TicketScheduleFormSchema>;

export const TourDestinationsFormSchema = z.object({
  destinations: z.array(DestinationSchema),
});
export type TourDestinationsFormData = z.infer<typeof TourDestinationsFormSchema>;

// Update tour API schemas
export const UpdateTourInfoRequestSchema = TourInfoFormSchema.extend({
  tourId: z.string(),
});
export type UpdateTourInfoRequest = z.infer<typeof UpdateTourInfoRequestSchema>;

export const UpdateTicketScheduleRequestSchema = z.object({
  tourId: z.string(),
  tickets: z.array(TicketSchema),
});
export type UpdateTicketScheduleRequest = z.infer<typeof UpdateTicketScheduleRequestSchema>;

export const UpdateTourDestinationsRequestSchema = z.object({
  tourId: z.string(),
  destinations: z.array(DestinationSchema),
});
export type UpdateTourDestinationsRequest = z.infer<typeof UpdateTourDestinationsRequestSchema>;