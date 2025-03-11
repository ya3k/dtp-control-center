export type UserRole = "Tourist" | "Operator" | "Manager" | "Admin";

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

export enum UserRoleEnum {
    Tourist = "Tourist",
    Operator = "Operator",
    Manager = "Manager",
    Admin = "Admin",
}