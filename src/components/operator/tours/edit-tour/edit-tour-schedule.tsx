'use client'

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    onUpdateSuccess: () => void
}

export default function TourEditScheduleForm({ tourId, onUpdateSuccess }: TourEditScheduleFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [schedules, setSchedules] = useState<string[]>([])
    const [addDialogOpen, setAddDialogOpen] = useState(false)

    // Lấy lịch trình tour
    const fetchTourSchedule = async () => {
        try {
            setIsLoading(true)
            const response = await tourApiService.getTourSchedule(tourId)
            if (response.payload && Array.isArray(response.payload.data)) {
                setSchedules(response.payload.data)
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

    useEffect(() => {
        fetchTourSchedule()
    }, [tourId])

    // Định dạng ngày để hiển thị
    const formatDate = (dateString: string) => {
        try {
            // Thử phân tích ngày trong các định dạng khác nhau
            let date;

            // Kiểm tra nếu ngày bao gồm định dạng microseconds (2025-04-13 00:00:00.000000)
            if (dateString.includes('.') || (dateString.includes(' ') && dateString.split(' ')[0].match(/^\d{4}-\d{2}-\d{2}$/))) {
                // Tách theo khoảng trắng để lấy phần ngày
                const datePart = dateString.split(' ')[0];
                date = parseISO(datePart);
            }
            // Kiểm tra nếu nó bao gồm thành phần thời gian với T
            else if (dateString.includes('T')) {
                date = parseISO(dateString);
            }
            // Thử phân tích trực tiếp cho định dạng ngày ISO không có thời gian
            else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                date = parseISO(dateString);
            }
            // Sử dụng đến constructor Date nếu các cách trên đều không khớp
            else {
                date = new Date(dateString);
            }

            // Định dạng để hiển thị
            return format(date, 'dd/MM/yyyy');
        } catch (error) {
            console.error("Lỗi khi định dạng ngày:", dateString, error);
            return dateString; // Trả về nguyên bản nếu phân tích thất bại
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Lịch trình Tour</span>
                    <Button size="sm" variant="default" onClick={() => setAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Thêm lịch trình
                    </Button>
                </CardTitle>
                <CardDescription>
                    Quản lý các ngày khả dụng của tour
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Ngày</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                                            Không tìm thấy lịch trình nào. Nhấp "Thêm lịch trình" để tạo mới.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    schedules.map((schedule, index) => (
                                        <TableRow key={`schedule-${index}`}>
                                            <TableCell className="font-medium">
                                                {formatDate(schedule)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DeleteScheduleDialog 
                                                    schedule={schedule}
                                                    formattedDate={formatDate(schedule)}
                                                    tourId={tourId}
                                                    onDeleteSuccess={() => {
                                                        fetchTourSchedule();
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>

            {/* Dialog thêm lịch trình tách biệt */}
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