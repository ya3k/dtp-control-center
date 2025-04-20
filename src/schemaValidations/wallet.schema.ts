import { z } from "zod";

export const WalletResSchema = z.object({
    userId: z.string(),
    balance: z.number()

})

export const WithDrawSchema = z.object({
    amount: z.number().positive().min(100000, "Số tiền tối thiểu là 100,000 VNĐ"),
})

export type WalletResType = z.infer<typeof WalletResSchema>