export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  startDate: Date;
  endDate: Date;
  locations: string[];
  maxGroupSize: number;
  guide: string;
  rating: number;
  reviews: number;
}

/*--------------TourDetail-----------------------*/

export interface TourData {
  tour: TourDetail;
  ratings: Rating[];
  tourDestinations: TourDestination[];
}

interface TourDestination {
  name: string;
  imageUrls: string[];
  startTime: string; // In "HH:MM:SS" format
  endTime: string; // In "HH:MM:SS" format
  sortOrder: number;
}

interface TourDetail {
  id: string;
  title: string;
  companyName: string;
  description: string;
  avgStar: number;
  totalRating: number;
  onlyFromCost: number;
  ticketTypes: TicketType[];
}

interface TicketType {
  id: string;
  defaultNetCost: number;
  minimumPurchaseQuantity: number;
  ticketKind: TicketKind;
  tourId: string;
}

enum TicketKind {
  Adult = 0,
  Child = 1,
  Family = 2,
  Group = 3,
}

interface Rating {
    star: number;
    comment: string;
    createdAt: string; // ISO date string format
  }
