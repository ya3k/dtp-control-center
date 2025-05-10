import { z } from "zod";

export const SystemSettingSchema = z.object({
    id: z.string(),
    settingCode: z.string(),
    settingKey: z.string(),
    settingValue: z.number().nonnegative()

});
export const putSystemSettingSchema = z.object({
    id: z.string(),
    
    settingValue: z.number().nonnegative()

});

export type SystemSetting = z.infer<typeof SystemSettingSchema>;

export type PUTSystemType = z.infer<typeof putSystemSettingSchema>;