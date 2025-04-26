import { z } from "zod";

export enum Role {
    Admin = `Admin`,
    Tourist = `Tourist`,
    Operator = `Operator`
}


export const userSchema = z.object({
    id: z.string(),
    userName: z.string(),
    name: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
    companyName: z.string(),
    roleName: z.string(),
    isActive: z.boolean(),
})

export type UserResType = z.infer<typeof userSchema>;

export const postUserSchema = z.object({
    name: z.string(),
    userName: z.string(),
    email: z.string(),
    address: z.string(),
    roleName: z.string(),
    phoneNumber: z.string(),
    companyId: z.string().optional(),
});

export type PostUserBodyType = z.infer<typeof postUserSchema>;


export const putUserSchema = z.object({
    id: z.string(),
    userName: z
      .string()
      .min(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
      .max(30, { message: 'Tên đăng nhập không được vượt quá 30 ký tự' }),
    name: z
      .string()
      .min(1, { message: 'Họ tên không được để trống' })
      .max(50, { message: 'Họ tên không được vượt quá 50 ký tự' }),
    email: z
      .string()
      .email({ message: 'Email không hợp lệ' }),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9]{9,15}$/, { message: 'Số điện thoại không hợp lệ (9–15 chữ số, có thể có dấu +)' }),
    address: z
      .string()
      .min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' })
      .max(100, { message: 'Địa chỉ không được vượt quá 150 ký tự' }),
    roleName: z.string(),
  });

export type PutUserBodyType = z.infer<typeof putUserSchema>;
