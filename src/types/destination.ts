
export interface Destination {
    id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    lastModified?: string;
    lastModifiedBy?: string;
    isDeleted: boolean;
}