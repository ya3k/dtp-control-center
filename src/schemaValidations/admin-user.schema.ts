import { z } from "zod";

export enum Role {
    Admin = `Admin`,
    Tourist = `Tourist`,
    Operator = `Operator`
}


export const userSchema = z.object({
    id: z.string(),
    userName: z.string(),
    email: z.string(),
    companyName: z.string(),
    roleName: z.string(),
    isActive: z.boolean(),
})

export type UserResType = z.infer<typeof userSchema>;