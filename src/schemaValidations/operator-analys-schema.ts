import { z } from 'zod';

export const DailySaleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format "YYYY-MM-DD"
  ticketsSold: z.number().int().nonnegative(),
  totalIncome: z.number().int().nonnegative(),
});

export const TopTourSchema = z.object({
  tourId: z.string().uuid(),
  tourTitle: z.string(),
  ticketsSold: z.number().int().nonnegative(),
});

export const NewestBookingSchema = z.object({
  bookingId: z.string().uuid(),
  bookingCode: z.string(),
  createdAt: z.string().datetime(), // ISO string date-time
  tourTitle: z.string(),
  totalCost: z.number().int().nonnegative(),
});

export const OpAnalysDataSchema = z.object({
  dailySales: z.array(DailySaleSchema),
  topTours: z.array(TopTourSchema),
  newestBookings: z.array(NewestBookingSchema),
});

export type DailySale = z.infer<typeof DailySaleSchema>;
export type TopTour = z.infer<typeof TopTourSchema>;
export type NewestBooking = z.infer<typeof NewestBookingSchema>;
export type OpAnalysData = z.infer<typeof OpAnalysDataSchema>;
