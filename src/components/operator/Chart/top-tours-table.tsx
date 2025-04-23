"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TopTour } from "@/schemaValidations/operator-analys-schema"

interface TopToursTableProps {
  data: TopTour[]
}

export function TopToursTable({ data }: TopToursTableProps) {
  // Sắp xếp tour theo số lượng vé bán giảm dần
  const sortedTours = [...data].sort((a, b) => b.ticketsSold - a.ticketsSold)

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
            <TableHead>Tên Tour</TableHead>
            <TableHead className="text-right">Vé Đã Bán</TableHead>
            <TableHead className="text-right">Xếp Hạng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTours.map((tour, index) => (
            <TableRow key={tour.tourId}>
              <TableCell className="font-medium" title={tour.tourTitle}>
                {truncateTitle(tour.tourTitle)}
              </TableCell>
              <TableCell className="text-right">{tour.ticketsSold}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={index < 3 ? "default" : "outline"}
                  className={index === 0 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                >
                  #{index + 1}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
