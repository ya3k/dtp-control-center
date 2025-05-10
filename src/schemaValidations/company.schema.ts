
import { z } from "zod"



export const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    taxCode: z.string(),
    address: z.string(),
    licensed: z.boolean(),
    staff: z.number(),
    tourCount: z.number(),
    commissionRate: z.number()
})

export type CompanyResType = z.infer<typeof CompanySchema>

export const CompanyRequestSchema = z.object({
    name: z.string().min(2, {
        message: "Tên công ty phải có ít nhất 2 ký tự.",
        }),
    email: z.string().email({
        message: "Vui lòng nhập địa chỉ email hợp lệ.",
    }),
    phone: z.string().min(10, {
        message: "Vui lòng nhập số điện thoại hợp lệ.",
    }),
    address: z.string(),

    taxCode: z.string().min(1, {
        message: "Mã số thuế là bắt buộc.",
    }), 
    commissionRate: z.number().min(0, {
        message: "Tỷ lệ hoa hồng phải từ 0 trở lên.",
    }).max(100, {
        message: "Tỷ lệ hoa hồng tối đa là 100.",
    }),})

export type TCompanyQuestBodyType = z.infer<typeof CompanyRequestSchema>



export const CompanyGrantSchema = z.object({
    companyId: z.string(),
    confirmUrl: z.string(),
    accept: z.boolean().default(true),
})

export type TCompanyGrantBodyType = z.infer<typeof CompanyGrantSchema>

export const CompanyPUTSchema = z.object({
    id: z.string(), // ID của công ty (không có ràng buộc cụ thể)
    
    name: z.string().min(2, {
        message: "Tên công ty phải có ít nhất 2 ký tự.",
    }),

    email: z.string().email({
        message: "Vui lòng nhập địa chỉ email hợp lệ.",
    }),

    phone: z.string().min(10, {
        message: "Vui lòng nhập số điện thoại hợp lệ.",
    }),

    address: z.string(), // Địa chỉ (không có ràng buộc cụ thể)

    taxCode: z.string().min(1, {
        message: "Mã số thuế là bắt buộc.",
    }),

    commissionRate: z.number().min(0, {
        message: "Tỷ lệ hoa hồng phải từ 0 trở lên.",
    }).max(100, {
        message: "Tỷ lệ hoa hồng tối đa là 100.",
    }),
});


export type TCompanyPUTBodyType = z.infer<typeof CompanyPUTSchema>