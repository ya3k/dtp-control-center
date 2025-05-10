"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarCheck, History, Loader2, Pencil, X } from "lucide-react"
import { tourByCompanyResType } from "@/schemaValidations/tour-operator.shema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { cn } from "@/lib/utils"

interface TourTableProps {
  tours: tourByCompanyResType[]
  totalCount: number
  loading: boolean
  resetFilters: () => void
  truncateDescription: (text: string, maxLength?: number) => string
  onEditTour?: (tour: tourByCompanyResType) => void
  onCloseTour?: (tour: tourByCompanyResType) => void
  onViewTour?: (tour: tourByCompanyResType) => void
  onViewBooking?: (tour: tourByCompanyResType) => void
}

export function OpTourTable({
  tours,
  totalCount,
  loading,
  resetFilters,
  truncateDescription,
  onEditTour,
  onCloseTour,
  onViewTour,
  onViewBooking
}: TourTableProps) {
  // Define column configuration
  const columns: ColumnDef<tourByCompanyResType>[] = [
    {
      id: "id",
      header: "Id",
      accessorKey: "id",
      cell: (info) => info.id,
      enableHiding: true,
      defaultHidden: true
    },
    {
      id: "title",
      header: "Tên tour",
      accessorKey: "title",
      cell: (info) => (
        <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap" title={info.title}>
          {truncateDescription(info.title, 20)}
        </div>
      ),
      enableHiding: false, // Required column
    },
    {
      id: "description",
      header: "Điểm nổi bật",
      accessorKey: "description",
      cell: (info) => (
        <div
          className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap"
          title={info.description}
          dangerouslySetInnerHTML={{ __html: truncateDescription(info.description, 50) }}
        />
      ),
      enableHiding: true,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "isDeleted",
      cell: (info) => (
        <Badge variant={info.isDeleted ? "destructive" : "active"} className="font-medium">
          {info.isDeleted ? "Đã đóng" : "Hoạt động"}
        </Badge>
      ),
      enableHiding: true,
      align: "center",
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (info) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewBooking && onViewBooking(info)}
            title="Xem lịch sử order"
          >
            <History className="h-3 w-3 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditTour && onEditTour(info)}
            title="Chỉnh sửa tour"
            disabled={info.isDeleted}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              info.isDeleted
                ? "text-green-600 hover:text-green-500 hover:bg-green-50"
                : "text-red-600 hover:text-red-500 hover:bg-red-50"
            )}
            onClick={() => onCloseTour && onCloseTour(info)}
            title={info.isDeleted ? "Mở lại tour" : "Đóng tour"}
          >
            {info.isDeleted ? (
              <CalendarCheck className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
          </Button>
        </div>

      ),
      enableHiding: false,
      align: "center",
    },
  ]

  // Track visible columns
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, column) => ({
      ...acc,
      [column.id]: column.defaultHidden === true ? false : true,
    }), {})
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (tours.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy tour nào</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Thử thay đổi bộ lọc hoặc tìm kiếm để xem nhiều kết quả hơn.
        </p>
        <Button variant="destructive" onClick={resetFilters} className="mt-2">
          Xóa bộ lọc
        </Button>
      </div>
    )
  }

  // Get filtered columns that should be visible
  const visibleColumnDefs = columns.filter(column => visibleColumns[column.id])

  return (
    <div>
      {/* Column visibility dropdown */}
      <div className="flex justify-between my-2 px-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {tours.length} trong tổng số {totalCount} tour
        </div>
        <ColumnToggleDropdown
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
      </div>

      {/* Table */}
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnDefs.map((column) => (
                <TableHead
                  key={column.id}
                  className={`text-gray-800 font-bold text-sm
                    ${column.className ||
                    (column.align === "right" ? "text-right" :
                      (column.align === "center" ? "text-center" : undefined))}                   
                    `
                  }
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${tour.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(tour)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}