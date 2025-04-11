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
import { CategoryType } from "@/schemaValidations/category.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"

interface CategoryTableProps {
  categories: CategoryType[]
  loading: boolean
  onEditCategory: (category: CategoryType) => void
  onDeleteCategory: (category: CategoryType) => void
  resetFilters: () => void
}

export function CategoryTable({
  categories,
  loading,
  onEditCategory,
  onDeleteCategory,
  resetFilters,
}: CategoryTableProps) {
  // Define column configuration with all needed properties
  const columns: ColumnDef<CategoryType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (category) => <span className="font-medium truncate max-w-[120px]">{category.id.split('-')[0]}...</span>,
      enableHiding: true,
      className: "w-[120px]",
      defaultHidden: true, // Ẩn mặc định
    },
    {
      id: "name",
      header: "Tên danh mục",
      accessorKey: "name",
      cell: (category) => category.name,
      enableHiding: false, // Cột bắt buộc, không thể ẩn
    },
    {
      id: "createdBy",
      header: "Người tạo",
      accessorKey: "createdBy",
      cell: (category) => category.createdBy || "N/A",
      enableHiding: true,
    },
    {
      id: "createdAt",
      header: "Ngày tạo",
      accessorKey: "createdAt",
      cell: (category) => category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A",
      enableHiding: true,
    },
    {
      id: "lastModified",
      header: "Ngày cập nhật",
      accessorKey: "lastModified",
      cell: (category) => category.lastModified ? new Date(category.lastModified).toLocaleDateString() : "N/A",
      enableHiding: true,
      defaultHidden: true,
    },
    {
      id: "lastModifiedBy",
      header: "Người cập nhật",
      accessorKey: "lastModifiedBy",
      cell: (category) => category.lastModifiedBy || "N/A",
      enableHiding: true,
      defaultHidden: true,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (category) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditCategory(category)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDeleteCategory(category)}
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
      <div className="flex flex-col justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="mt-2">Đang tải</div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy danh mục nào</h3>
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
            {categories.map((category) => (
              <TableRow key={category.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell 
                    key={`${category.id}-${column.id}`}
                    className={column.align === "right" ? "text-right" : undefined}
                  >
                    {column.cell(category)}
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