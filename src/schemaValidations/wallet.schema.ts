import { z } from "zod";

export const WalletResSchema = z.object({
    userId: z.string(),
    balance: z.number()

})

export const WithDrawSchema = z.object({
    amount: z.number().positive().min(5000, "Số tiền tối thiểu là 2000 VNĐ"),
    bankAccountNumber: z.string(),
    bankName: z.string(),
    bankAccount: z.string(),
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

export const AdminExternalTransactionSchema = z.object({
    createdAt: z.string(), // Nếu cần, có thể dùng z.string().datetime() nếu format ISO
    id: z.string().uuid(),
    userId: z.string().uuid(),
    companyName: z.string(),
    companyId: z.string().uuid(),
    externalTransactionCode: z.string(),
    transactionCode: z.string(),
    description: z.string(),
    amount: z.number(),
    type: z.string(),
    status: z.string(),
    bankAccountNumber: z.string(),
    bankName: z.string(),
    bankAccount: z.string()
});

// Optional TypeScript type
export type AdminExternalTransactionType = z.infer<typeof AdminExternalTransactionSchema>;

export const BankInfoSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
    bin: z.number(),
    short_name: z.string(),
    logo_url: z.string().url(),
    icon_url: z.string().url(),
    swift_code: z.string(),
    lookup_supported: z.number().int().nonnegative(),
  });
  
  // TypeScript type (tuỳ chọn)
  export type BankInfoType = z.infer<typeof BankInfoSchema>;