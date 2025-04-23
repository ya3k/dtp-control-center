import { z } from "zod";

export const WalletResSchema = z.object({
    userId: z.string(),
    balance: z.number()

})

export const WithDrawSchema = z.object({
    amount: z.number().positive().min(100000, "Số tiền tối thiểu là 100,000 VNĐ"),
    otp: z.string().min(6, "Mã OTP phải có ít nhất 6 ký tự").max(10, "Mã OTP không vượt quá 10 ký tự"),
})

export const transactionSchema = z.object({
    id: z.string().uuid(),
    description: z.string().nullable(),
    amount: z.number(),
    type: z.string(),
    transactionId: z.string().uuid(),
    createdAt: z.string().datetime(),
});

export const detailedTransactionSchema = z.object({
    transactionId: z.string().uuid(),
    transactionCode: z.string(),
    description: z.string(),
    refTransactionCode: z.string(),
    afterTransactionBalance: z.number(),
    amount: z.number(),
    type: z.number(),
    status: z.number(),
    createdAt: z.string().datetime(),
});

export type WalletResType = z.infer<typeof WalletResSchema>
export type WithDrawType = z.infer<typeof WithDrawSchema>
export type TransactionType = z.infer<typeof transactionSchema>
export type DetailedTransactionType = z.infer<typeof detailedTransactionSchema>