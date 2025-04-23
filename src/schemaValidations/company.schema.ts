
import { z } from "zod"



export const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    taxCode: z.string(),
    address: z.string(),
    licensed: z.boolean(),
    staff: z.number(),
    tourCount: z.number(),
    commissionRate: z.number()
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
    address: z.string(),

    taxCode: z.string().min(1, {
        message: "Tax code is required.",
    }),
    commissionRate: z.number()
})

export type TCompanyQuestBodyType = z.infer<typeof CompanyRequestSchema>



export const CompanyGrantSchema = z.object({
    companyId: z.string(),
    confirmUrl: z.string(),
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
    address: z.string(),
    taxCode: z.string().min(1, {
        message: "Tax code is required.",
    }),
    commissionRate: z.number().min(0, {
        message: "Commission rate must be at least 0.",
    }).max(100, {
        message: "Commission rate must be at most 100.",
    }),
})

export type TCompanyPUTBodyType = z.infer<typeof CompanyPUTSchema>