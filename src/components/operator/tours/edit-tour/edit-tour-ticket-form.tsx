'use client'

import { useState, useEffect } from "react"
import { Loader2, Plus, Calendar as CalendarIcon, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TicketKind, TicketScheduleResType } from "@/schemaValidations/tour-operator.shema"
import tourApiService from "@/apiRequests/tour"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"
import { EditTourTicketDialog } from "./edit-tour-ticket-dialog"

// Vietnamese labels for ticket kinds
const ticketKindLabels: Record<TicketKind, string> = {
    [TicketKind.Adult]: "Người lớn",
    [TicketKind.Child]: "Trẻ em",
    [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
    [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
    [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
    [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
};

interface TourEditTicketFormProps {
    tourId: string
    onUpdateSuccess: () => void
}

interface GroupedTickets {
    [key: string]: TicketScheduleResType[]
}

interface ScheduleType {
    day: string;
    ticketSchedules: TicketScheduleResType[];
}

export default function TourEditTicketForm({ tourId, onUpdateSuccess }: TourEditTicketFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [groupedTickets, setGroupedTickets] = useState<GroupedTickets>({})
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [availableDates, setAvailableDates] = useState<Date[]>([])
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const fetchTicketSchedules = async () => {
        setIsLoading(true)
        try {
            const response = await tourApiService.getTourScheduleTicket(tourId);

            // Group tickets by day
            const grouped = (response.payload.data as ScheduleType[]).reduce((acc: GroupedTickets, schedule) => {
                acc[schedule.day] = schedule.ticketSchedules;
                return acc;
            }, {});

            // Set available dates
            const dates = Object.keys(grouped).map(dateStr => new Date(dateStr));
            setAvailableDates(dates);

            // Set initial selected date to the first available date if exists
            if (dates.length > 0) {
                setSelectedDate(dates[0]);
            }

            setGroupedTickets(grouped);
        } catch (error) {
            console.error("Error fetching ticket schedules:", error)
            toast.error("Failed to fetch ticket schedules")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTicketSchedules()
    }, [tourId])

    // Function to check if a date has tickets
    const hasTickets = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return dateStr in groupedTickets;
    }

    // Function to disable dates without tickets
    const disableDate = (date: Date) => {
        return !availableDates.some(availableDate => isSameDay(availableDate, date));
    }

    // Get tickets for selected date
    const getSelectedDateTickets = () => {
        if (!selectedDate) return [];
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        return groupedTickets[dateStr] || [];
    }

    const handleEditSuccess = () => {
        fetchTicketSchedules();
        onUpdateSuccess();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Lịch vé</h2>
                    <p className="text-muted-foreground">Quản lý lịch vé cho tour</p>
                </div>
                <Button onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Thêm/Cập nhật vé
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Card */}
                <Card className="lg:min-w-[400px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Lịch vé theo ngày
                        </CardTitle>
                        <CardDescription>
                            Chọn ngày để xem chi tiết vé (Chỉ những ngày có vé mới chọn được)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={vi}
                                    disabled={disableDate}
                                    modifiers={{
                                        available: (date) => hasTickets(date),
                                    }}
                                    modifiersStyles={{
                                        available: {
                                            fontWeight: 'bold',
                                            backgroundColor: 'var(--primary-50)',
                                            color: 'var(--primary-900)',
                                        }
                                    }}
                                    className="rounded-md border w-full max-w-[389px]"
                                    classNames={{
                                        months: "w-full",
                                        month: "w-full",
                                        table: "w-full",
                                        head_row: "w-full",
                                        row: "w-full",
                                        cell: "w-10 h-10 text-center p-0 relative [&:has([aria-selected])]:bg-cyan-200 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                        day: "w-10 h-10 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 hover:scale-105",
                                        day_today: "bg-accent text-accent-foreground",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tickets Detail Card */}
                <Card className="lg:max-w-[600px]">
                    <CardHeader>
                        <div className="flex flex-col">
                            <CardTitle>Chi tiết vé</CardTitle>
                            <CardDescription className="font-semibold text-gray-600">
                                {selectedDate ? format(selectedDate, 'EEEE, dd/MM/yyyy', { locale: vi }) : 'Chọn ngày để xem chi tiết'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : getSelectedDateTickets().length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {selectedDate ? 'Không có vé nào trong ngày này' : 'Chọn một ngày để xem chi tiết vé'}
                            </div>
                        ) : (
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {getSelectedDateTickets().map((ticket, index) => (
                                        <div
                                            key={`${ticket.ticketTypeId}-${index}`}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {ticketKindLabels[ticket.ticketKind as TicketKind] || 'Loại vé không xác định'}
                                                    </span>
                                                    <Badge variant="secondary">
                                                        Còn {ticket.availableTicket} vé
                                                    </Badge>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    Giá: {ticket.netCost.toLocaleString('vi-VN')} VND
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>

            <EditTourTicketDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                tourId={tourId}
                onUpdateSuccess={handleEditSuccess}
            />
        </div>
    )
}