import { z } from "zod"

export const categorySchema = z.object({
    name: z.string().nonempty(),
    id: z.string(),
    createdAt: z.string().nullable(),
    createdBy: z.string().nullable(),
    lastModified: z.string().nullable(),
    lastModifiedBy: z.string().nullable(),
    isDeleted: z.boolean(),
})

export type CategoryType = z.infer<typeof categorySchema>