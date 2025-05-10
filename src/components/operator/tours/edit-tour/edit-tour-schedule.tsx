'use client'

import { useState, useEffect } from "react"
import { format, parseISO, isBefore, startOfDay } from "date-fns"
import { Loader2, Plus, CalendarIcon, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import tourApiService from "@/apiRequests/tour"
import AddScheduleDialog from "./schedule/add-schedule-dialog"
import DeleteScheduleDialog from "./schedule/delete-schedule-dialog"

// Định nghĩa các tùy chọn tần suất
const frequencyOptions = [
    { value: "Daily", label: "Hàng ngày" },
    { value: "Weekly", label: "Hàng tuần" },
    { value: "Monthly", label: "Hàng tháng" },
]

interface TourEditScheduleFormProps {
    tourId: string
}

export default function TourEditScheduleForm({ tourId }: TourEditScheduleFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [schedules, setSchedules] = useState<Array<{openDate: string, status: string}>>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [scheduleDates, setScheduleDates] = useState<Date[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    // Lấy lịch trình tour
    const fetchTourSchedule = async (): Promise<void> => {
        try {
            setIsLoading(true)
            const response = await tourApiService.getTourSchedule(tourId)
            if (response.payload && Array.isArray(response.payload.data)) {
                setSchedules(response.payload.data)
                // Parse dates for calendar
                const dates = response.payload.data
                    .filter((schedule: {openDate: string, status: string}) => schedule.status !== 'cancel')
                    .map((schedule: {openDate: string, status: string}) => {
                        try {
                            return parseISO(schedule.openDate)
                        } catch (error) {
                            console.error("Error parsing date:", schedule.openDate, error)
                            return null
                        }
                    })
                    .filter((date: Date | null): date is Date => date !== null)
                setScheduleDates(dates)
            } else {
                console.error("Định dạng phản hồi không mong đợi:", response)
                toast.error("Không thể tải dữ liệu lịch trình")
            }
        } catch (error) {
            console.error("Không thể lấy lịch trình tour:", error)
            toast.error("Không thể tải lịch trình tour")
        } finally {
            setIsLoading(false)
        }
    }

    // Handle calendar day selection
    const handleDaySelect = (date: Date | undefined) => {
        if (!date) return

        // Only allow selection of scheduled dates
        if (!isDateScheduled(date)) {
            return
        }

        // Update selected date and open dialog
        setSelectedDate(date)
        setDeleteDialogOpen(true)
    }

    // Handle dialog close
    const handleDialogClose = (open: boolean) => {
        setDeleteDialogOpen(open)
        if (!open) {
            setSelectedDate(undefined)
        }
    }

    // Check if a date is scheduled
    const isDateScheduled = (date: Date) => {
        return scheduleDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
    }

    // Get the original schedule string for a date
    const getScheduleForDate = (date: Date) => {
        const schedule = schedules.find(schedule => {
            const scheduleDate = parseISO(schedule.openDate)
            return format(scheduleDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        })
        return schedule?.openDate || ''
    }

    // Định dạng ngày để hiển thị
    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy')
        } catch (error) {
            console.error("Lỗi khi định dạng ngày:", dateString, error)
            return dateString
        }
    }

    useEffect(() => {
        fetchTourSchedule()
    }, [tourId])

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Lịch trình Tour</CardTitle>
                        <CardDescription>
                            Quản lý tất cả các ngày của tour
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchTourSchedule} className="flex items-center">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Tải lại
                        </Button>
                        <Button size="sm" variant="core" onClick={() => setAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Thêm lịch trình
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <Tabs defaultValue="calendar" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="calendar" className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                Lịch
                            </TabsTrigger>
                            <TabsTrigger value="list">Danh sách</TabsTrigger>
                        </TabsList>

                        <TabsContent value="calendar" className="mt-0">
                            <div className="flex justify-center mb-4">
                                <div>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDaySelect}
                                        className="rounded-lg border w-full max-w-[400px]"
                                        modifiers={{ booked: scheduleDates }}
                                        modifiersStyles={{
                                            booked: {
                                                fontWeight: 'bold',
                                                backgroundColor: 'var(--primary-50)',
                                                color: 'var(--primary-900)',
                                                cursor: "pointer"
                                            }
                                        }}
                                        classNames={{
                                            months: "w-full",
                                            month: "w-full",
                                            table: "w-full",
                                            head_row: "w-full",
                                            row: "w-full",
                                            cell: "w-10 h-10 text-center p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                            day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all duration-200 ease-in-out hover:scale-105 mx-[4px] my-[4px]",
                                            day_today: "bg-accent text-accent-foreground hover:bg-accent/80",
                                            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                                            day_disabled: "text-muted-foreground opacity-50 hover:bg-transparent hover:scale-100",
                                            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                            day_hidden: "invisible",
                                            nav: "space-x-1 flex items-center",
                                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all duration-200",
                                            nav_button_previous: "absolute left-1",
                                            nav_button_next: "absolute right-1",
                                            caption: "flex justify-center pt-1 relative items-center",
                                            caption_label: "text-sm font-medium",
                                            head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] transition-all duration-200"
                                        }}
                                        disabled={(date) => 
                                            isBefore(date, startOfDay(new Date())) || 
                                            !isDateScheduled(date)
                                        }
                                        footer={
                                            <p className="mt-2 text-sm text-muted-foreground text-center">
                                                Nhấp vào ngày có lịch trình <span className="font-bold text-black">(in đậm)</span> để hủy lịch trình
                                            </p>
                                        }
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="list" className="mt-0">
                            <ScrollArea className="h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {schedules.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                                                    Không tìm thấy lịch trình nào. Nhấp &quot;Thêm lịch trình&quot; để tạo mới.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            schedules.map((schedule, index) => {
                                                const scheduleDate = parseISO(schedule.openDate)
                                                const isPast = isBefore(scheduleDate, startOfDay(new Date()))
                                                
                                                return (
                                                    <TableRow key={`schedule-${index}`}>
                                                        <TableCell className={`font-medium ${isPast ? 'text-muted-foreground line-through' : ''}`}>
                                                            {formatDate(schedule.openDate)}
                                                            {isPast && (
                                                                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                                                                    Đã qua
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-md text-xs ${
                                                                schedule.status === 'cancel' 
                                                                    ? 'bg-red-100 text-red-700' 
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}>
                                                                {schedule.status === 'cancel' ? 'Đã hủy' : 'Sắp tới'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DeleteScheduleDialog
                                                                schedule={schedule.openDate}
                                                                formattedDate={formatDate(schedule.openDate)}
                                                                tourId={tourId}
                                                                onDeleteSuccess={() => {
                                                                    fetchTourSchedule();
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="w-[300px]">
                    <DialogHeader>
                        <DialogTitle>Hủy lịch trình</DialogTitle>
                    </DialogHeader>
                    {selectedDate && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-semibold text-center mb-2">
                                {format(selectedDate, 'dd/MM/yyyy')}
                            </p>
                            <div className="flex justify-center">
                                <DeleteScheduleDialog
                                    schedule={getScheduleForDate(selectedDate)}
                                    formattedDate={format(selectedDate, 'dd/MM/yyyy')}
                                    tourId={tourId}
                                    onDeleteSuccess={() => {
                                        fetchTourSchedule()
                                        handleDialogClose(false)
                                    }}
                                />
                            </div>

                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AddScheduleDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                tourId={tourId}
                frequencyOptions={frequencyOptions}
                onAddSuccess={() => {
                    fetchTourSchedule();
                }}
            />
        </Card>
    )
}