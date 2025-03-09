
export interface Destination {
    id: string;
    name: string;
    latitude: string;
    longitude: string
    createdBy: string;
    createdAt: string;
    lastModified?: string;
    lastModifiedBy?: string;
    isDeleted: boolean;
}

export interface UpdateDestinationBody{
    name: string;
    latitude: string;
    longitude: string;
}