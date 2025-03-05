import { z } from "zod";

enum TicketKind {
  Adult,
  Child,
  PerGroupOfThree,
  PerGroupOfFive,
  PerGroupOfSeven,
  PerGroupOfTen,
}

const DestinationSchema = z.object({
  destinationId: z.string().uuid(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z.number()
});

const TicketSchema = z.object({
  defaultNetCost: z.number().positive(),
  defaultTax: z.number().nonnegative(),
  minimumPurchaseQuantity: z.number().int().positive(),
  ticketKind: z.nativeEnum(TicketKind)
});

const TourSchema = z.object({
  title: z.string(),
  companyId: z.literal("eed52b33-866d-4eaa-bc49-ec5fc264830b"), // Fixed UUID
  category: z.string().uuid(),
  description: z.string(),
  destinations: z.array(DestinationSchema),
  tickets: z.array(TicketSchema)
});

export type Tour = z.infer<typeof TourSchema>;
export { TourSchema, TicketKind };
