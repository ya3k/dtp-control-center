export interface Tour  {
  id: string;
  thumbnailUrl: string;
  title: string;
  companyName: string;
  description: string;
  avgStar: number;
  totalRating: number;
  onlyFromCost: number;
};

export type TourList = Tour[];


/*--------------TourDetail-----------------------*/

export enum TicketKind {
  Adult = 0,
  Child = 1,
  PerGroupOfThree = 2,
  PerGroupOfFive = 3,
  PerGroupOfSeven = 4,
  PerGroupOfTen = 5,
}

export interface TicketType {
  id: string;
  defaultNetCost: number;
  minimumPurchaseQuantity: number;
  ticketKind: TicketKind;
  tourId: string;
}

export interface Rating {
  star: number;
  comment: string;
  createdAt: string;
}

export interface TourDestination {
  name: string;
  imageUrls: string[];
  startTime: string;
  endTime: string;
  sortOrder: number;
}

export interface TourDetail {
  tour: {
    id: string;
    title: string;
    companyName: string;
    description: string;
    avgStar: number;
    totalRating: number;
    onlyFromCost: number;
    ticketTypes: TicketType[];
  };
  ratings: Rating[];
  tourDestinations: TourDestination[];
}
