"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SlidersHorizontal } from "lucide-react"

// Define a generic column definition
export interface ColumnDef<T> {
  id: string
  header: React.ReactNode
  accessorKey?: keyof T | string
  cell: (item: T) => React.ReactNode
  enableHiding?: boolean
  defaultHidden?: boolean // Thuộc tính xác định cột ẩn mặc định
  className?: string
  align?: "left" | "center" | "right"
}

interface ColumnToggleDropdownProps<T> {
  columns: ColumnDef<T>[]
  visibleColumns: Record<string, boolean>
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  label?: string
  triggerTitle?: string
}

export function ColumnToggleDropdown<T>({
  columns,
  visibleColumns,
  setVisibleColumns,
  label = "Chọn cột hiển thị",
  triggerTitle = "Hiển thị cột",
}: ColumnToggleDropdownProps<T>) {
  // Toggle a specific column's visibility
  const toggleColumn = (columnId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }

  // Show all columns
  const showAllColumns = () => {
    const updatedColumns = { ...visibleColumns }
    columns.forEach((column) => {
      updatedColumns[column.id] = true
    })
    setVisibleColumns(updatedColumns)
  }

  // Reset to default column visibility (based on defaultHidden property)
  const resetToDefault = () => {
    const updatedColumns = { ...visibleColumns }
    columns.forEach((column) => {
      updatedColumns[column.id] = column.defaultHidden === true ? false : true
    })
    setVisibleColumns(updatedColumns)
  }

  // Hide non-essential columns (keep any that can't be hidden)
  const hideNonEssentialColumns = () => {
    const updatedColumns = { ...visibleColumns }
    columns.forEach((column) => {
      if (column.enableHiding !== false) {
        // Sử dụng thuộc tính defaultHidden nếu có
        // Nếu cột được đánh dấu là defaultHidden, giữ trạng thái đó
        // Nếu không, ẩn đi
        updatedColumns[column.id] = false
      } else {
        // Không bao giờ ẩn các cột bắt buộc
        updatedColumns[column.id] = true
      }
    })
    setVisibleColumns(updatedColumns)
  }

  // Đếm số lượng cột đang hiển thị
  const visibleColumnsCount = Object.values(visibleColumns).filter(Boolean).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-1 items-center">
          <SlidersHorizontal className="h-4 w-4" />
          <span>{triggerTitle}</span>
          <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {visibleColumnsCount}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={visibleColumns[column.id]}
            onCheckedChange={() => toggleColumn(column.id)}
            disabled={column.enableHiding === false}
          >
            {typeof column.header === "string" ? column.header : column.id}
            {column.defaultHidden && (
              <span className="ml-2 text-xs text-muted-foreground">(Ẩn mặc định)</span>
            )}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="p-1 flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="flex-1" onClick={hideNonEssentialColumns}>
            Thu gọn
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={showAllColumns}>
            Hiển thị tất cả
          </Button>
          <Button variant="outline" size="sm" className="w-full mt-1" onClick={resetToDefault}>
            Về mặc định
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}