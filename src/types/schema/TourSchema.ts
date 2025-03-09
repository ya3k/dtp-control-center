import { z } from "zod"

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
const DestinationSchema = z.object({
  destinationId: z.string().uuid(),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  endTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/), // Ensures HH:MM:SS format
  sortOrder: z.number(),
  sortOrderByDate: z.number(),
})

// Ticket schema
const TicketSchema = z.object({
  defaultNetCost: z.number().positive(),
  defaultTax: z.number().nonnegative(),
  minimumPurchaseQuantity: z.number().int().positive(),
  ticketKind: z.nativeEnum(TicketKind),
})

// Tour schema for creating/updating
const TourSchema = z.object({
  title: z.string(),
  companyId: z.string(),
  category: z.string().uuid(),
  description: z.string(),
  destinations: z.array(DestinationSchema),
  tickets: z.array(TicketSchema),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string(),
})

// Tour response schema (includes ID)
const TourResSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyId: z.string(),
  category: z.string().uuid(),
  description: z.string(),
  tourDestinations: z.array(DestinationSchema),
  ticketTypes: z.array(TicketSchema),
  openDay: z.string(),
  closeDay: z.string(),
  scheduleFrequency: z.string(),
})

// Type definitions
export type TourRes = z.infer<typeof TourResSchema>
export type Tour = z.infer<typeof TourSchema>
export type TourDestination = z.infer<typeof DestinationSchema>
export type Ticket = z.infer<typeof TicketSchema>

// For API integration
export { TourSchema }

// Additional types for the UI
export interface Destination {
  id: string
  name: string
  description?: string
}

// Form data types
export interface TourInfoFormData {
  title: string
  companyId: string
  category: string
  description: string
  // openDay: string
  // closeDay: string
  // scheduleFrequency: string
}

export interface TicketScheduleFormData {
  tickets: Ticket[]
}

export interface TourDestinationsFormData {
  destinations: TourDestination[]
}

// Update tour API types
export interface UpdateTourInfoRequest {
  tourId: string
  title: string
  companyId: string
  category: string
  description: string
  // openDay: string
  // closeDay: string
  // scheduleFrequency: string
}

export interface UpdateTicketScheduleRequest {
  tourId: string
  tickets: Ticket[]
}

export interface UpdateTourDestinationsRequest {
  tourId: string
  destinations: TourDestination[]
}

