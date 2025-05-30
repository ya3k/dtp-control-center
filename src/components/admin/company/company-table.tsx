"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2 } from "lucide-react"
import { CompanyResType } from "@/schemaValidations/company.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"

interface CompanyTableProps {
  companies: CompanyResType[]
  loading: boolean
  resetFilters: () => void
  onEditCompany?: (company: CompanyResType) => void
  onDeleteCompany?: (company: CompanyResType) => void
}

export function CompanyTable({
  companies,
  loading,
  resetFilters,
  onEditCompany,
  onDeleteCompany
}: CompanyTableProps) {
  // Define column configuration
  const columns: ColumnDef<CompanyResType>[] = [
    {
      id: "id",
      header: "Id",
      accessorKey: "id",
      cell: (company) => company.id,
      enableHiding: true, // Required column
      defaultHidden: true
    },
    {
      id: "name",
      header: "Tên công ty",
      accessorKey: "name",
      cell: (company) => company.name,
      enableHiding: false, // Required column
    },
    {
      id: "phone",
      header: "Số điện thoại",
      accessorKey: "phone",
      cell: (company) => company.phone,
      enableHiding: true,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: (company) => company.email,
      enableHiding: true,
    },
    {
      id: "taxCode",
      header: "Mã số thuế",
      accessorKey: "taxCode",
      cell: (company) => company.taxCode,
      enableHiding: true,
    },
    {
      id: "licensed",
      header: "Giấy phép",
      accessorKey: "licensed",
      cell: (company) => (
        <Badge variant={company.licensed ? "active" : "destructive"}>
          {company.licensed ? "Có" : "Không"}
        </Badge>
      ),
      enableHiding: true,
      align: "center",
    },
    {
      id: "staff",
      header: "Nhân viên",
      accessorKey: "staff",
      cell: (company) => company.staff,
      enableHiding: true,
      align: "center",
    },
    {
      id: "tourCount",
      header: "Tổng số tour",
      accessorKey: "tourCount",
      cell: (company) => company.tourCount,
      enableHiding: true,
      align: "center",
    },
    {
      id: "commissionRate",
      header: "Hoa hồng",
      accessorKey: "commissionRate",
      cell: (company) => <p>{company.commissionRate} %</p>,
      enableHiding: true,
      align: "center",
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (company) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditCompany && onEditCompany(company)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDeleteCompany && onDeleteCompany(company)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableHiding: true,
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

  if (companies.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy công ty nào</h3>
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
            {companies.map((company) => (
              <TableRow key={company.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${company.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(company)}
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
