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