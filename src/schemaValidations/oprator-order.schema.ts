import { z } from "zod";

export enum TicketKind {
    Adult,
    Child,
    PerGroupOfThree,
    PerGroupOfFive,
    PerGroupOfSeven,
    PerGroupOfTen,
  }
  

 export enum BookingStatus
  {
      Submitted,
      AwaitingPayment,
      Completed,
      Cancelled,
      Paid,
  }
export enum PaymentStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  PAID = "Paid",
  CANCELED = "Canceled",
}


export const OrderTicketSchema = z.object({
    code: z.string(),
    ticketTypeId: z.string().uuid(),
    quantity: z.number(),
    grossCost: z.number(),
    ticketKind: z.string(),
});

export const TourOrderSchema = z.object({
    id: z.string().uuid(),
    code: z.string(),
    refCode: z.number(),
    name: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    tourName: z.string(),
    tourScheduleId: z.string().uuid(),
    tourDate: z.string().datetime(),
    orderDate: z.string().datetime(),
    discountAmount: z.number(),
    grossCost: z.number(),
    status: z.string(), 
    paymentStatus: z.string(), 
    orderTickets: z.array(OrderTicketSchema)
});

// Optional: TypeScript type from schema
export type TourOrderType = z.infer<typeof TourOrderSchema>;