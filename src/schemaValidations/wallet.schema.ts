import { z } from "zod";

export const WalletResSchema = z.object({
    userId: z.string(),
    balance: z.number()

})

export type WalletResType = z.infer<typeof WalletResSchema>