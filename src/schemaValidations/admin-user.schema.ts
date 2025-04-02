import { z } from "zod";

export enum Role {
    Admin = `Admin`,
    Tourist = `Tourist`,
    Operator = `Operator`
}


export const userSchema = z.object({
    id: z.string(),
    userName: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
    companyName: z.string(),
    roleName: z.string(),
    isActive: z.boolean(),
})

export type UserResType = z.infer<typeof userSchema>;

export const postUserSchema = z.object({
    name: z.string(),
    userName: z.string(),
    email: z.string(),
    address: z.string(),
    roleName: z.string(),
    phoneNumber: z.string(),
    companyId: z.string().optional(),
});

export type PostUserBodyType = z.infer<typeof postUserSchema>;

export const putUserSchema = z.object({
    id: z.string(),
    userName: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
    roleName: z.string(),
});

export type PutUserBodyType = z.infer<typeof putUserSchema>;
