'use client'

import { useState, useEffect } from "react"
import { format, parseISO, addDays } from "date-fns"
import { CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import tourApiService from "@/apiRequests/tour"

// Định nghĩa schema để xác thực form thêm lịch trình
const addScheduleSchema = z.object({
    openDay: z.date({
        required_error: "Ngày bắt đầu là bắt buộc",
    }),
    closeDay: z.date({
        required_error: "Ngày kết thúc là bắt buộc",
    })
        .refine(date => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, {
            message: "Ngày kết thúc phải ở trong tương lai",
        }),
    scheduleFrequency: z.string({
        required_error: "Tần suất là bắt buộc",
    }),
}).refine((data) => data.closeDay >= data.openDay, {
    message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
    path: ["closeDay"], // This shows the error on the closeDay field
});

interface AddScheduleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tourId: string
    frequencyOptions: { value: string; label: string }[]
    onAddSuccess: () => void
}

export default function AddScheduleDialog({
    open,
    onOpenChange,
    tourId,
    frequencyOptions,
    onAddSuccess
}: AddScheduleDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [existingDates, setExistingDates] = useState<Date[]>([])
    const [validationMessage, setValidationMessage] = useState<string | null>(null)

    // Cài đặt form cho việc thêm lịch trình
    const form = useForm<z.infer<typeof addScheduleSchema>>({
        resolver: zodResolver(addScheduleSchema),
        defaultValues: {
            openDay: new Date(),
            closeDay: new Date(),
            scheduleFrequency: "Daily",
        }
    })

    // Theo dõi giá trị form để thực hiện xác thực tùy chỉnh
    const openDay = form.watch("openDay")
    const closeDay = form.watch("closeDay")

    // Update closeDay when openDay changes if closeDay is before openDay
    useEffect(() => {
        const currentCloseDay = form.getValues("closeDay")
        if (openDay && currentCloseDay < openDay) {
            form.setValue("closeDay", openDay)
        }
    }, [openDay, form])

    // Thực hiện xác thực khi ngày thay đổi
    useEffect(() => {
        validateDateRange(openDay, closeDay)
    }, [openDay, closeDay, existingDates])

    // Xác thực rằng không có xung đột trong phạm vi ngày
    const validateDateRange = (start: Date, end: Date) => {
        if (!start || !end) return;

        // Kiểm tra xem có ngày đã tồn tại nào rơi vào phạm vi không
        const conflicts = existingDates.filter(existingDate => {
            // Định dạng thành YYYY-MM-DD để so sánh chỉ ngày (không phải giờ)
            const existingDateStr = format(existingDate, 'yyyy-MM-dd')

            // Kiểm tra các ngày trong phạm vi
            let currentDate = new Date(start)
            while (currentDate <= end) {
                if (format(currentDate, 'yyyy-MM-dd') === existingDateStr) {
                    return true
                }
                currentDate = addDays(currentDate, 1)
            }
            return false
        })

        if (conflicts.length > 0) {
            // Tạo danh sách các ngày xung đột
            const conflictDates = conflicts.map(d => format(d, 'dd/MM/yyyy')).join(', ')
            setValidationMessage(`Khoảng thời gian đã chọn có chứa ngày đã được lên lịch: ${conflictDates}`)
        } else {
            setValidationMessage(null)
        }
    }


    // Fetch existing schedules
    useEffect(() => {
        const fetchExistingSchedules = async () => {
            try {
                const response = await tourApiService.getTourSchedule(tourId);

                if (response.payload && Array.isArray(response.payload.data)) {
                    // Filter out cancelled schedules and parse dates
                    const dates = response.payload.data
                        .filter((schedule: { openDate: string, status: string }) => schedule.status !== 'cancel')
                        .map((schedule: { openDate: string, status: string }) => {
                            try {
                                return parseISO(schedule.openDate);
                            } catch (error) {
                                console.error("Error parsing date:", schedule.openDate, error);
                                return null;
                            }
                        })
                        .filter((date: Date | null): date is Date => date !== null);

                    setExistingDates(dates);
                }
            } catch (error) {
                console.error("Failed to fetch existing schedules:", error);
                toast.error("Failed to load existing schedules.");
            }
        };

        if (open) {
            fetchExistingSchedules();
        }
    }, [open, tourId]);

    // Kiểm tra xem một ngày đã có lịch trình chưa
    const isDateBooked = (date: Date) => {
        return existingDates.some(existingDate =>
            format(existingDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        );
    };

    // Xử lý thêm lịch trình mới
    const onSubmit = async (values: z.infer<typeof addScheduleSchema>) => {
        try {
            // Kiểm tra xung đột ngày một lần nữa trước khi gửi
            let hasConflict = false;
            let currentDate = new Date(values.openDay);

            while (currentDate <= values.closeDay) {
                if (isDateBooked(currentDate)) {
                    hasConflict = true;
                    toast.error(`Xung đột ngày tại ${format(currentDate, 'dd/MM/yyyy')}`);
                    break;
                }
                currentDate = addDays(currentDate, 1);
            }

            if (hasConflict) {
                return;
            }

            setIsSubmitting(true);

            // Fix timezone issue by ensuring dates are sent with time set to noon
            // This prevents date shifts due to timezone differences
            const openDayFixed = new Date(values.openDay);
            openDayFixed.setHours(12, 0, 0, 0);
            
            const closeDayFixed = new Date(values.closeDay);
            closeDayFixed.setHours(12, 0, 0, 0);

            const scheduleData = {
                tourId: tourId,
                openDay: openDayFixed.toISOString(),
                closeDay: closeDayFixed.toISOString(),
                scheduleFrequency: values.scheduleFrequency,
            };

            // console.log("Sending schedule data:", {
            //     openDay: format(openDayFixed, 'yyyy-MM-dd HH:mm:ss'),
            //     closeDay: format(closeDayFixed, 'yyyy-MM-dd HH:mm:ss'),
            //     originalOpenDay: format(values.openDay, 'yyyy-MM-dd HH:mm:ss'),
            //     originalCloseDay: format(values.closeDay, 'yyyy-MM-dd HH:mm:ss'),
            // });

            const response = await tourApiService.postTourSchedule(tourId, scheduleData);

            if (!response.payload) {
                throw new Error('Không thể thêm lịch trình');
            }

            toast.success("Thêm lịch trình thành công");

            // Reset form nhưng giữ dialog mở
            form.reset({
                openDay: new Date(),
                closeDay: new Date(),
                scheduleFrequency: "Daily",
            });

            // Gọi callback thành công
            onAddSuccess();

            // Tạo các ngày giữa ngày bắt đầu và kết thúc để thêm vào existingDates
            const newDates: Date[] = [];
            let dateToAdd = new Date(values.openDay);

            while (dateToAdd <= values.closeDay) {
                newDates.push(new Date(dateToAdd));
                dateToAdd = addDays(dateToAdd, 1);
            }

            // Cập nhật state cục bộ của những ngày hiện có
            setExistingDates(prev => [...prev, ...newDates]);

            // Close the dialog only on success
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi thêm lịch trình:", error);
            toast.error("Không thể thêm lịch trình");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Thêm lịch trình mới</DialogTitle>
                    <DialogDescription>
                        Thêm lịch trình mới cho tour. Chọn ngày bắt đầu và kết thúc.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {validationMessage && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {validationMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            control={form.control}
                            name="openDay"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Ngày mở Tour</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Chọn ngày</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => {
                                                    const isInPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                                    const isAlreadyBooked = isDateBooked(date);
                                                    return isInPast || isAlreadyBooked;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="closeDay"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Ngày đóng Tour</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "dd/MM/yyyy")
                                                    ) : (
                                                        <span>Chọn ngày</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => {
                                                    const isBeforeOpenDay = date < openDay;
                                                    const isAlreadyBooked = isDateBooked(date);
                                                    return isBeforeOpenDay || isAlreadyBooked;
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="scheduleFrequency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tần suất</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn tần suất" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {frequencyOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label === "Daily" ? "Hàng ngày" :
                                                        option.label === "Weekly" ? "Hàng tuần" :
                                                            option.label === "Monthly" ? "Hàng tháng" : option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Tần suất tour sẽ hoạt động trong khoảng thời gian này.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Hoàn tất
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !!validationMessage}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    "Tạo lịch trình"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}