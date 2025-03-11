import { z } from "zod";

export const DestinationSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Tên không được để trống"),
    latitude: z.string(),
    longitude: z.string(),
    createdBy: z.string(),
    createdAt: z.string().datetime(),
    lastModified: z.string().datetime().optional(),
    lastModifiedBy: z.string().optional(),
    isDeleted: z.boolean(),
});

export const CreateDestinationBodySchema = z.object({
    name: z.string().min(1, "Tên không được để trống"),
    latitude: z.string(),
    longitude: z.string(),
});
export const UpdateDestinationBodySchema = z.object({
    name: z.string().min(1, "Tên không được để trống"),
    latitude: z.string(),
    longitude: z.string(),
});

export type CreateDestinationBodyType = z.infer<typeof CreateDestinationBodySchema>;

export type DestinationType = z.infer<typeof DestinationSchema>;
export type UpdateDestinationBodyType = z.infer<typeof UpdateDestinationBodySchema>;
