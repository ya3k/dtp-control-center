export interface Order {
    orderId: string;
    tourName: string;
    tourThumnail: string;
    tourDate: string;
    orderTickets: OrderTicket[];
    finalCost: number;
}

export interface OrderTicket {
    code: string;
    ticketTypeId: string;
    quantity: number;
    grossCost: number;
    ticketKind: number;
}
