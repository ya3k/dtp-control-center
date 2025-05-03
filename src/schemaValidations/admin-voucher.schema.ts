import { z } from "zod";

export const voucherSchema = z.object({
  id: z.string().uuid(),
  expiryDate: z.string(),
  code: z.string(),
  maxDiscountAmount: z.number(),
  //handle compute percent
  percent: z.number().min(0),
  quantity: z.number().int().nonnegative(),
  availableVoucher: z.number().int().nonnegative(),
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