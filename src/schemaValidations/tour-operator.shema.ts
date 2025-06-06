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
  startTime: z.string(), // Ensures HH:MM:SS format
  endTime: z.string(), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
  img: z.string()
});



// Ticket schema
export const TicketSchema = z.object({
  defaultNetCost: z.coerce.number().positive().nonnegative(),
  minimumPurchaseQuantity: z.number().int().positive().min(1, "Minimum purchase quantity must be at least 1."),
  ticketKind: z.nativeEnum(TicketKind),
});

// Tour schema for creating/updating
export const TourSchema = z.object({
  title: z.string(),
  categoryid: z.string().uuid(),
  description: z.string(),
  destinations: z.array(DestinationSchema),
  tickets: z.array(TicketSchema),
  openDay: z.date(),
  closeDay: z.date(),
  scheduleFrequency: z.string(),
  img: z.string(),
  about: z.string(),
  include: z.string(),
  pickinfor: z.string()
});

export const tourInfoPostSchema = z.object({
  title: z.string().min(1, "Hãy nhập tiêu đề"),
  img: z.string(),
  categoryid: z.string().min(1, "Hãy chọn loại tour"),
  description: z.string().min(1, "Nhập điểm nổi bật của tour"),
  openDay: z.date(),
  closeDay: z.date(),
  scheduleFrequency: z.string().min(1, "Hãy nhập chu kì tour"),
  about: z.string().min(1, "Về dịch vụ này là bắt buộc."),
  include: z.string().min(1, "Bao gồm là bắt buộc."),
  pickinfor: z.string().min(1, "Đón và gặp khách là bắt buộc."),
});

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


/// tour by company res

export const tourByCompanyResSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  companyId: z.string().uuid(),
  categoryId: z.string().uuid(),
  description: z.string(),
  about: z.string(),
  include: z.string(),
  pickinfor: z.string(),
  isDeleted: z.boolean(),
})

export type tourByCompanyResType = z.infer<typeof tourByCompanyResSchema>;

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
  about: z.string().min(1, "Về dịch vụ này là bắt buộc."),
  include: z.string().min(1, "Bao gồm là bắt buộc."),
  pickinfor: z.string().min(1, "Đón và gặp khách là bắt buộc."),
  img: z.array(z.string())
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
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  about: z.string().min(1, "about is required"),
  include: z.string().min(1, "include is required"),
  pickinfor: z.string().min(1, "pickifor is required"),
  img: z.array(z.string())
})
export type TourInfoResType = z.infer<typeof tourInfoResSchema>;

// Schema cho từng hoạt động trong destinationActivities
export const destinationActivitySchema = z.object({
  name: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Định dạng HH:MM:SS
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Định dạng HH:MM:SS
  sortOrder: z.number(),
});

// Schema chính cho tourDestinationRes
export const tourDestinationResSchema = z.object({
  id: z.string().uuid(),
  destinationId: z.string().uuid(),
  destinationName: z.string(), // Là tên địa điểm, không phải UUID
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Định dạng HH:MM:SS
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Định dạng HH:MM:SS
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
  img: z.string().url(),
  destinationActivities: z.array(destinationActivitySchema),
});

export type TourDestinationResType = z.infer<typeof tourDestinationResSchema>;

export const PUTDestinationSchema = z.object({
  destinationId: z.string().uuid(),
  destinationActivities: z.array(destinationActivities),
  startTime: z.string(),
  endTime: z.string(),
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
  img: z.array(z.string()),
});
export type PUTDestinationType = z.infer<typeof PUTDestinationSchema>;

export const PUTTourDestinationSchema = z.object({
  tourId: z.string().uuid(),
  destinations: z.array(DestinationSchema),
});

export type PUTTourDestinationType = z.infer<typeof PUTTourDestinationSchema>;


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

export const getTourScheduleResSchema = z.object({
  openDate: z.string(),
  status: z.string()
})

export type getTourScheduleResType = z.infer<typeof getTourScheduleResSchema>;

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
  endDay: z.string(),
  remark: z.string()
})

export type DELETETourScheduleBodyType = z.infer<typeof DELETEtourScheduleSchema>;

export const TicketScheduleSchema = z.object({
  ticketTypeId: z.string(),
  ticketKind: z.number(), // 0 or 1 — if needed, can be refined
  netCost: z.number().nonnegative(),
  availableTicket: z.number().int().nonnegative(),
  tourScheduleId: z.string()
});

export const ListTicketScheduleSchema = z.object({
  day: z.string(),
  ticketSchedules: z.array(TicketScheduleSchema)
})

export type TicketScheduleResType = z.infer<typeof TicketScheduleSchema>;
