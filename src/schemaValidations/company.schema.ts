
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