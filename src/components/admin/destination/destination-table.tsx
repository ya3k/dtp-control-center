"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2 } from "lucide-react"
import { DestinationType } from "@/schemaValidations/admin-destination.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"

interface DestinationTableProps {
  destinations: DestinationType[]
  loading: boolean
  onEditDestination: (destination: DestinationType) => void
  onDeleteDestination: (destination: DestinationType) => void
  resetFilters: () => void
}

export function DestinationTable({
  destinations,
  loading,
  onEditDestination,
  onDeleteDestination,
  resetFilters,
}: DestinationTableProps) {
  // Define column configuration with all needed properties
  const columns: ColumnDef<DestinationType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (destination) => <span className="font-medium truncate max-w-[120px]">{destination.id.split('-')[0]}...</span>,
      enableHiding: true,
      className: "w-[120px]",
      defaultHidden: true, // Ẩn mặc định
    },
    {
      id: "name",
      header: "Tên điểm đến",
      accessorKey: "name",
      cell: (destination) => destination.name,
      enableHiding: false, // Cột bắt buộc, không thể ẩn
    },
    {
      id: "latitude",
      header: "Vĩ độ",
      accessorKey: "latitude",
      cell: (destination) => destination.latitude,
      enableHiding: true,
    },
    {
      id: "longitude",
      header: "Kinh độ",
      accessorKey: "longitude",
      cell: (destination) => destination.longitude,
      enableHiding: true,
    },
    {
      id: "createdBy",
      header: "Người tạo",
      accessorKey: "createdBy",
      cell: (destination) => destination.createdBy,
      enableHiding: true,
      defaultHidden: true, // Ẩn mặc định
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: (destination) => new Date(destination.createdAt).toLocaleDateString(),
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (destination) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditDestination(destination)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDeleteDestination(destination)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableHiding: true,
      align: "right",
    },
  ]

  // Track visible columns, respecting defaultHidden property
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, column) => ({
      ...acc,
      [column.id]: column.defaultHidden === true ? false : true,
    }), {})
  )

  if (loading) {
    return (
      <div className="flex flex-col justify-center  items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-2">Đang tải</div>
      </div>
    )
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy điểm đến nào</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Thử thay đổi bộ lọc hoặc tìm kiếm để xem nhiều kết quả hơn.
        </p>
        <Button variant="link" onClick={resetFilters} className="mt-2">
          Reset filters
        </Button>
      </div>
    )
  }

  // Get filtered columns that should be visible
  const visibleColumnDefs = columns.filter(column => visibleColumns[column.id])

  return (
    <div>
      {/* Column visibility dropdown */}
      <div className="flex justify-end my-2 px-4">
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
                  className={column.className || (column.align === "right" ? "text-right" : undefined)}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinations.map((destination) => (
              <TableRow key={destination.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell 
                    key={`${destination.id}-${column.id}`}
                    className={column.align === "right" ? "text-right" : undefined}
                  >
                    {column.cell(destination)}
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