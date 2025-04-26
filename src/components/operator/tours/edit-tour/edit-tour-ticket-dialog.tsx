import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { format, isSameDay } from "date-fns"
import { z } from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import tourApiService from "@/apiRequests/tour"
import { TicketKind } from "@/schemaValidations/tour-operator.shema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Vietnamese labels for ticket kinds
const ticketKindLabels: Record<TicketKind, string> = {
    [TicketKind.Adult]: "Người lớn",
    [TicketKind.Child]: "Trẻ em",
    [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
    [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
    [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
    [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
};

const ticketUpdateSchema = z.object({
    startDate: z.date({
        required_error: "Vui lòng chọn ngày bắt đầu",
    }),
    endDate: z.date({
        required_error: "Vui lòng chọn ngày kết thúc",
    }),
    ticketKindUpdates: z.array(z.object({
        ticketKind: z.number(),
        newNetCost: z.number().min(0, "Giá vé phải lớn hơn hoặc bằng 0"),
        newAvailableTicket: z.number().min(0, "Số lượng vé phải lớn hơn hoặc bằng 0"),
    })),
}).refine((data) => data.endDate >= data.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
});

type TicketUpdateFormValues = z.infer<typeof ticketUpdateSchema>;

interface EditTourTicketDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tourId: string;
    onUpdateSuccess: () => void;
}

export function EditTourTicketDialog({
    open,
    onOpenChange,
    tourId,
    onUpdateSuccess,
}: EditTourTicketDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableDates, setAvailableDates] = useState<Date[]>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);

    const form = useForm<TicketUpdateFormValues>({
        resolver: zodResolver(ticketUpdateSchema),
        defaultValues: {
            ticketKindUpdates: [
                {
                    ticketKind: 0,
                    newNetCost: 0,
                    newAvailableTicket: 0,
                },
            ],
        },
    });

    // Fetch available schedule dates when dialog opens
    useEffect(() => {
        if (open) {
            fetchAvailableDates();
        }
    }, [open, tourId]);

    const fetchAvailableDates = async () => {
        setIsLoadingDates(true);
        try {
            const response = await tourApiService.getTourSchedule(tourId);
            
            if (response.payload && Array.isArray(response.payload.data)) {
                // Parse dates for calendar
                const dates = response.payload.data.map((dateStr: string) => {
                    try {
                        // Handle different date formats
                        if (dateStr.includes('.') || dateStr.includes(' ')) {
                            return new Date(dateStr.split(' ')[0]);
                        } else if (dateStr.includes('T')) {
                            return new Date(dateStr);
                        } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            return new Date(dateStr);
                        }
                        return new Date(dateStr);
                    } catch (error) {
                        console.error("Error parsing date:", dateStr, error);
                        return null;
                    }
                }).filter((date: Date | null): date is Date => date !== null);
                
                setAvailableDates(dates);
                
                // Set default dates if available
                if (dates.length > 0) {
                    form.setValue('startDate', dates[0]);
                    form.setValue('endDate', dates[0]);
                }
            }
        } catch (error) {
            console.error("Không thể lấy lịch trình tour:", error);
            toast.error("Không thể tải lịch trình tour");
        } finally {
            setIsLoadingDates(false);
        }
    };

    // Function to disable dates without schedules
    const disableDate = (date: Date) => {
        return !availableDates.some(availableDate => isSameDay(availableDate, date));
    };

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "ticketKindUpdates",
    });

    const addTicket = () => {
        // Get current values from the form
        const currentValues = form.getValues("ticketKindUpdates.0");

        // Only append if we have valid values
        if (currentValues.newNetCost > 0 && currentValues.newAvailableTicket > 0) {
            append({
                ticketKind: currentValues.ticketKind,
                newNetCost: currentValues.newNetCost,
                newAvailableTicket: currentValues.newAvailableTicket,
            });

            // Reset only the price and quantity fields, keep the ticket type
            form.setValue("ticketKindUpdates.0.newNetCost", 0);
            form.setValue("ticketKindUpdates.0.newAvailableTicket", 0);
        } else {
            toast.error("Vui lòng nhập giá và số lượng vé lớn hơn 0");
        }
    };

    const onSubmit = async (data: TicketUpdateFormValues) => {
        // Check if we have any tickets added
        if (fields.length <= 1) {
            toast.error("Vui lòng thêm ít nhất một loại vé");
            return;
        }

        // Check if dates are selected
        if (!data.startDate || !data.endDate) {
            toast.error("Vui lòng chọn khoảng thời gian");
            return;
        }

        try {
            setIsSubmitting(true);
            // Remove the first ticket (input form) from submission
            const ticketsToSubmit = data.ticketKindUpdates.slice(1);

            const formattedData = {
                tourId,
                startDate: format(data.startDate, 'yyyy-MM-dd'),
                endDate: format(data.endDate, 'yyyy-MM-dd'),
                ticketKindUpdates: ticketsToSubmit,
            };

            // // Debug logs
            // console.log('Submitting ticket update with data:');
            // console.log('Tour ID:', tourId);
            // console.log('Date Range:', {
            //     start: format(data.startDate, 'dd/MM/yyyy'),
            //     end: format(data.endDate, 'dd/MM/yyyy')
            // });
            // console.log('Ticket Updates:', ticketsToSubmit.map(ticket => ({
            //     type: ticketKindLabels[ticket.ticketKind as TicketKind],
            //     cost: ticket.newNetCost,
            //     quantity: ticket.newAvailableTicket
            // })));
            // console.log('Raw formatted data:', JSON.stringify(formattedData, null, 2));

            await tourApiService.updateTourTickets(tourId, formattedData);
            form.reset();

            toast.success("Cập nhật vé thành công");
            onUpdateSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating tickets:", error);
            toast.error("Cập nhật vé thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] h-[95vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 py-2">
                    <DialogTitle>Cập nhật vé</DialogTitle>
                    <DialogDescription>
                        Chọn khoảng thời gian và cập nhật thông tin vé
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 overflow-hidden px-6">
                            <div className="grid grid-cols-2 gap-6 h-full">
                                {/* Left column - Input Form */}
                                <Card className="flex flex-col min-h-[calc(90vh-13rem)]">
                                    <CardHeader className="px-6 py-4 border-b">
                                        <CardTitle>Nhập thông tin vé</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-6">
                                        <div className="space-y-6">
                                            {/* Date Range */}
                                            <div className="grid grid-cols-2 gap-4 pb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="startDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Ngày bắt đầu</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                            disabled={isLoadingDates}
                                                                        >
                                                                            {isLoadingDates ? (
                                                                                <span>Đang tải lịch trình...</span>
                                                                            ) : field.value ? (
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
                                                                        disabled={disableDate}
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
                                                    name="endDate"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col">
                                                            <FormLabel>Ngày kết thúc</FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                            disabled={isLoadingDates}
                                                                        >
                                                                            {isLoadingDates ? (
                                                                                <span>Đang tải lịch trình...</span>
                                                                            ) : field.value ? (
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
                                                                        disabled={disableDate}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-4 p-4 border rounded-lg">
                                                <FormField
                                                    control={form.control}
                                                    name="ticketKindUpdates.0.ticketKind"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Loại vé</FormLabel>
                                                            <Select
                                                                onValueChange={(value) => field.onChange(Number(value))}
                                                                defaultValue={field.value.toString()}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Chọn loại vé" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {Object.entries(ticketKindLabels).map(([value, label]) => (
                                                                        <SelectItem key={value} value={value}>
                                                                            {label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="ticketKindUpdates.0.newNetCost"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Giá vé</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="1000"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="ticketKindUpdates.0.newAvailableTicket"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Số lượng vé</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={addTicket}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm vé
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Right column - Saved Tickets */}
                                <Card className="flex flex-col min-h-[calc(90vh-13rem)]">
                                    <CardHeader className="px-6 py-4 border-b">
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Danh sách vé đã thêm</CardTitle>
                                            <span className="text-sm text-muted-foreground">
                                                {fields.length - 1} loại vé
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto p-6">
                                        <div className="space-y-4">
                                            {fields.slice(1).map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {ticketKindLabels[form.getValues(`ticketKindUpdates.${index + 1}.ticketKind`) as TicketKind]}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            Giá: {form.getValues(`ticketKindUpdates.${index + 1}.newNetCost`).toLocaleString('vi-VN')} VND
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            Số lượng: {form.getValues(`ticketKindUpdates.${index + 1}.newAvailableTicket`)}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index + 1)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {fields.length <= 1 && (
                                                <div className="text-center text-muted-foreground py-8">
                                                    Chưa có vé nào được thêm
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}