import { z } from "zod";

export const feedBackSchema = z.object({
    id: z.string(),
    tourScheduleId : z.string(),
    userId : z.string(),
    userName : z.string(),
    description : z.string(),
    tourTitle : z.string(),
    openDate : z.string(),
    companyName : z.string()
});

export type FeedBackType = z.infer<typeof feedBackSchema>;