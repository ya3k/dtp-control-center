import { z } from "zod";

// Enum for ticket types
export enum TicketKind {
  Adult = 0,
  Child = 1,
  PerGroupOfThree = 2,
  PerGroupOfFive = 3,
  PerGroupOfSeven = 4,
  PerGroupOfTen = 5,
}

// Basic information schema (Step 1)
export const BasicTourInfoSchema = z.object({
  title: z.string()
    .min(5, "Tên tour phải có ít nhất 5 ký tự")
    .max(100, "Tên tour không được vượt quá 100 ký tự"),
  img: z.array(z.string()),
  categoryid: z.string(),
  description: z.string()
    .min(20, "Điểm nổi bật phải có ít nhất 20 ký tự")
    .max(10000, "Điểm nổi bật không được vượt quá 1000 ký tự"),

});

// Schedule information schema (Step 2)
export const ScheduleInfoSchema = z.object({
  // Can be today or in future
  openDay: z.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Ngày bắt đầu phải từ hôm nay trở đi"),
  // Can be today or in future
  closeDay: z.date()
    .min(new Date(new Date().setHours(0, 0, 0, 0)), "Ngày kết thúc phải từ hôm nay trở đi"),
  scheduleFrequency: z.string()
    .min(1, "Vui lòng chọn tần suất lịch trình"),
}).superRefine((data, ctx) => {
  // Allow closeDay to be the same as openDay
  if (data.closeDay < data.openDay) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["closeDay"],
    });
  }
});

//destination activities schema
export const destinationActivities = z.object({
  name: z.string()
    .min(3, "Tên hoạt động phải có ít nhất 3 ký tự"),
  startTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Định dạng thời gian không hợp lệ. Sử dụng HH:MM:SS"),
  endTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Định dạng thời gian không hợp lệ. Sử dụng HH:MM:SS"),
  sortOrder: z.number()
    .int("Thứ tự phải là số nguyên")
    .nonnegative("Thứ tự không được âm"),
});

// Destination schema (Step 3)
export const DestinationSchema = z.object({
  destinationId: z.string().uuid("ID điểm đến không hợp lệ"),
  destinationActivities: z.array(destinationActivities),
  startTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Định dạng thời gian không hợp lệ. Sử dụng HH:MM:SS"),
  endTime: z.string()
    .regex(/^\d{2}:\d{2}:\d{2}$/, "Định dạng thời gian không hợp lệ. Sử dụng HH:MM:SS"),
  sortOrder: z.number()
    .int("Thứ tự phải là số nguyên")
    .nonnegative("Thứ tự không được âm"),
  sortOrderByDate: z.number()
    .int("Thứ tự theo ngày phải là số nguyên")
    .nonnegative("Thứ tự theo ngày không được âm"),
  img: z.array(z.string().url("URL hình ảnh không hợp lệ")),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  return end > start;
}, {
  message: "Thời gian kết thúc phải sau thời gian bắt đầu",
  path: ["endTime"],
});

// Ticket schema (Step 4)
export const TicketSchema = z.object({
  defaultNetCost: z.coerce.number()
    .positive("Giá vé phải lớn hơn 0")
    .nonnegative("Giá vé không được âm"),
  minimumPurchaseQuantity: z.number()
    .int("Số lượng phải là số nguyên")
    .positive("Số lượng phải lớn hơn 0")
    .min(1, "Số lượng mua tối thiểu phải từ 1 trở lên"),
  ticketKind: z.nativeEnum(TicketKind, {
    errorMap: () => ({ message: "Loại vé không hợp lệ" }),
  }),
});

// Additional Information schema (Step 5)
export const AdditionalInfoSchema = z.object({
  about: z.string()
    .min(50, "Phần giới thiệu phải có ít nhất 30 ký tự"),

  include: z.string()
    .min(50, "Phần bao gồm phải có ít nhất 30 ký tự"),

  pickinfor: z.string()
    .min(50, "Thông tin đón khách phải có ít nhất 30 ký tự")

});

// Complete Tour schema
export const TourSchema = z.object({
  // Basic Info
  title: z.string()
    .min(5, "Tên tour phải có ít nhất 5 ký tự")
    .max(100, "Tên tour không được vượt quá 100 ký tự"),
  img: z.array(z.string()),
  categoryid: z.string(),
  description: z.string()
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được vượt quá 1000 ký tự"),


  // Schedule Info
  openDay: z.date()
    .min(new Date(), "Ngày bắt đầu phải từ hôm nay trở đi"),
  closeDay: z.date(),
  scheduleFrequency: z.string()
    .min(1, "Vui lòng chọn tần suất lịch trình"),

  // Destinations and Tickets
  destinations: z.array(DestinationSchema)
    .min(1, "Phải có ít nhất một điểm đến"),
  tickets: z.array(TicketSchema)
    .min(1, "Phải có ít nhất một loại vé"),

  // Additional Info
  about: z.string()
    .min(20, "Phần giới thiệu phải có ít nhất 20 ký tự")
    .max(2000, "Phần giới thiệu không được vượt quá 2000 ký tự"),
  include: z.string()
    .min(10, "Phần bao gồm phải có ít nhất 10 ký tự")
    .max(1000, "Phần bao gồm không được vượt quá 1000 ký tự"),
  pickinfor: z.string()
    .min(10, "Thông tin đón khách phải có ít nhất 10 ký tự")
    .max(1000, "Thông tin đón khách không được vượt quá 1000 ký tự"),
}).superRefine((data, ctx) => {
  if (data.closeDay <= data.openDay) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["closeDay"],
    });
  }
});
// Type definitions for POST requests
export type POSTBasicTourInfoType = z.infer<typeof BasicTourInfoSchema>;
export type POSTTourScheduleInfoType = z.infer<typeof ScheduleInfoSchema>;
export type POSTTourAdditionalInfoType = z.infer<typeof AdditionalInfoSchema>;
export type POSTTourDestinationActivitiesType = z.infer<typeof destinationActivities>;
export type POSTTourDestinationType = z.infer<typeof DestinationSchema>;
export type POSTTourTicketType = z.infer<typeof TicketSchema>;
export type POSTTourType = z.infer<typeof TourSchema>;


