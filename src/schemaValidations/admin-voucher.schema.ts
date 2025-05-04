import { z } from "zod";

export const voucherSchema = z.object({
  id: z.string().uuid(),
  expiryDate: z.string(),
  code: z.string(),
  maxDiscountAmount: z.number().nonnegative(),
  percent: z.number().min(0).max(1),
  quantity: z.number().int().min(0),
  availableVoucher: z.number().int().min(0),
  description: z.string(),
  createdAt: z.string(),
  isDeleted: z.boolean(),
});

export const voucherPOSTSchema = z.object({
  maxDiscountAmount: z.number().int().nonnegative(),
  percent: z.number().min(0).max(100).transform((val) => val / 100),
  expiryDate: z.string(),
  quantity: z.number().int().min(0).max(2147483647),
  description: z.string(),
});


export type VoucherResType = z.infer<typeof voucherSchema>;
export type VoucherPOSTType = z.infer<typeof voucherPOSTSchema>;
export type VoucherPUTType = z.infer<typeof voucherPOSTSchema>;