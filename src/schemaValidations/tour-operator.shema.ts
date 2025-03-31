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

export const destinationActivities = z.object({
  name: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  sortOrder: z.number(),
})

// Destination schema
export const DestinationSchema = z.object({
  destinationId: z.string().uuid(),
  destinationActivities: z.array(destinationActivities),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
  img: z.string()
});



// Ticket schema
export const TicketSchema = z.object({
  defaultNetCost: z.coerce.number().positive(),
  minimumPurchaseQuantity: z.number().int().positive(),
  ticketKind: z.nativeEnum(TicketKind),
});

// Tour schema for creating/updating
export const TourSchema = z.object({
  title: z.string(),
  categoryid: z.string().uuid(),
  description: z.string(),
  destinations: z.array(DestinationSchema),
  tickets: z.array(TicketSchema),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string(),
  img: z.string(),
  about: z.string()
});

export const tourInfoPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  img: z.string(),
  categoryid: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string(),
  about: z.string()
})

export type CreateTourInfoType = z.infer<typeof tourInfoPostSchema>;

export type CreateTourBodyType = z.infer<typeof TourSchema>;
export type TourType = z.infer<typeof TourSchema>;
export type TourCreateDestinationType = z.infer<typeof DestinationSchema>;
export type TourCreateTicketType = z.infer<typeof TicketSchema>;
// Tour response schema (includes ID)
export const TourResSchema = TourSchema.extend({
  id: z.string(),
  tourDestinations: z.array(DestinationSchema),
  ticketTypes: z.array(TicketSchema),
});

// Type definitions inferred from Zod schemas
export type TourResType = z.infer<typeof TourResSchema>;


// Additional types for the UI
export const DestinationUI = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export type Destination = z.infer<typeof DestinationUI>;


export const tourInfoSchema = z.object({
  tourId: z.string(),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  img: z.string()
})

export type PUTTourInfoBodyType = z.infer<typeof tourInfoSchema>;

export const TicketScheduleFormSchema = z.object({
  tickets: z.array(TicketSchema),
});
export type TicketScheduleFormData = z.infer<typeof TicketScheduleFormSchema>;

////////get for update
export const tourInfoResSchema = z.object({
  tourId: z.string(),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  img: z.string()
})
export type TourInfoResType = z.infer<typeof tourInfoResSchema>;

export const tourDestinationResSchema = z.object({
  id: z.string(),
  destinationId: z.string().uuid(),
  destinationName: z.string().uuid(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z?.number(),
  img: z.string()
})

export type TourDestinationResType = z.infer<typeof tourDestinationResSchema>;

export const tourOdataResSchema = z.object({
  id: z.string(),
  thumbnailUrl: z.string(),
  title: z.string(),
  companyName: z.string(),
  description: z.string(),
  avgStar: z.number(),
  totalRating: z.number(),
  onlyFromCost: z.number(),
});
export type tourOdataResType = z.infer<typeof tourOdataResSchema>;

export const POSTtourScheduleSchema = z.object({
  tourId: z.string(),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string()
})

export type POSTTourScheduleBodyType = z.infer<typeof POSTtourScheduleSchema>;

export const DELETEtourScheduleSchema = z.object({
  tourId: z.string(),
  startDay: z.string(),
  endDay: z.string()
})

export type DELETETourScheduleBodyType = z.infer<typeof DELETEtourScheduleSchema>;
