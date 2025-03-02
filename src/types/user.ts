export type UserRole = "tourist" | "operator" | "manager" | "admin";

export interface User {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
    role: UserRole;
    createAt: string;
    updatedAt?: string;
    isDelete: boolean;
}