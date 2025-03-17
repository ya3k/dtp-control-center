
import { z } from "zod"



export const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    taxCode: z.string(),
    lisenced: z.boolean(),
    staff: z.number(),
    tourCount: z.number()
})

export type CompanyResType = z.infer<typeof CompanySchema>

export const CompanyRequestSchema = z.object({
    name: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    taxCode: z.string().min(1, {
        message: "Tax code is required.",
    }),
})

export type TCompanyQuestBodyType = z.infer<typeof CompanyRequestSchema>



export const CompanyGrantSchema = z.object({
    companyId: z.string(),
    accept: z.boolean().default(true),
})

export type TCompanyGrantBodyType = z.infer<typeof CompanyGrantSchema>

export const CompanyPUTSchema = z.object({
    id: z.string(),
    name: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    taxCode: z.string().min(1, {
        message: "Tax code is required.",
    }),
})

export type TCompanyPUTBodyType = z.infer<typeof CompanyPUTSchema>