import { z } from "zod";

export const loginSchema = z
  .object({
    userName: z.string().min(2, {
      message: "Username phải có ít nhất 2 kí tự"}),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
      .max(32, { message: "Mật khẩu không được quá 32 kí tự" }),
  })
  .strict();

export type LoginSchemaType = z.TypeOf<typeof loginSchema>;

export const loginResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      tokenType: z.string(),
      accessToken: z.string(),
      expiresIn: z.number(),
      refreshToken: z.string(),
      role: z.enum(["Admin", "Operator", "Tourist", "Manager"])
    }),
  })
  .strict();

export type LoginResponseSchemaType = z.TypeOf<typeof loginResponseSchema>;

// - Regular Expression: The string must contain at least one uppercase letter
//   (A-Z) and at least one special character from the set (!@#$%^&*(),.?":{}|<>).

export const registerSchema = z
  .object({
    name: z.string(),
    address: z.string(),
    email: z.string().email("Email không hợp lệ"),
    userName: z.string(),
    phoneNumber: z.string(),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
      .max(32, { message: "Mật khẩu không được quá 32 kí tự" })
      .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
        message:
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa và một ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
      .max(32, { message: "Mật khẩu không được quá 32 kí tự" }),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
    return true;
  });

// Export the type derived from the register schema
export type RegisterSchemaType = z.TypeOf<typeof registerSchema>;

export const registerResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: z.boolean(),
    error: z.array(z.string()).optional(),
  })
  .strict();

export type RegisterResponseSchemaType = z.TypeOf<typeof registerResponseSchema>;

