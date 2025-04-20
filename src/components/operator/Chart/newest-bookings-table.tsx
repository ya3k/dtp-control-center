"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {  formatPrice } from "@/lib/utils"
import { NewestBooking } from "@/schemaValidations/operator-analys-schema"

interface NewestBookingsTableProps {
    data: NewestBooking[]
}

export function NewestBookingsTable({ data }: NewestBookingsTableProps) {
    // Sắp xếp đặt tour theo ngày tạo giảm dần
    const sortedBookings = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Định dạng ngày để hiển thị
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("vi", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Hàm cắt ngắn tiêu đề tour dài
    const truncateTitle = (title: string, maxLength = 30) => {
        if (title.length <= maxLength) return title
        return `${title.substring(0, maxLength)}...`
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mã Đơn Hàng</TableHead>
                        <TableHead>Tour</TableHead>
                        <TableHead>Ngày</TableHead>
                        <TableHead className="text-right">Số Tiền</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedBookings.map((booking) => (
                        <TableRow key={booking.bookingId}>
                            <TableCell className="font-medium">{booking.bookingCode}</TableCell>
                            <TableCell title={booking.tourTitle}>{truncateTitle(booking.tourTitle)}</TableCell>
                            <TableCell>{formatDate(booking.createdAt)}</TableCell>
                            <TableCell className="text-right">{formatPrice(booking.totalCost)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
