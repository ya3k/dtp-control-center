"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2 } from "lucide-react"
import { VoucherResType } from "@/schemaValidations/admin-voucher.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils"

interface VoucherTableProps {
  vouchers: VoucherResType[]
  loading: boolean
  resetFilters: () => void
  onEditVoucher?: (voucher: VoucherResType) => void
  onDeleteVoucher?: (voucher: VoucherResType) => void
}

export function VoucherTable({
  vouchers,
  loading,
  resetFilters,
  onEditVoucher,
  onDeleteVoucher
}: VoucherTableProps) {
  // Define column configuration
  const columns: ColumnDef<VoucherResType>[] = [
    {
      id: "id",
      header: "Id",
      accessorKey: "id",
      cell: (voucher) => voucher.id,
      enableHiding: true, // Required column
      defaultHidden: true
    },
    {
      id: "code",
      header: "Mã Voucher",
      accessorKey: "code",
      cell: (voucher) => <span className="font-medium">{voucher.code}</span>,
      enableHiding: false, // Required column
    },
    {
      id: "percent",
      header: "Giảm giá",
      accessorKey: "percent",
      cell: (voucher) => <span>{(voucher.percent * 100).toFixed(0)}%</span>,
      enableHiding: true,
      align: "center",
    },
    {
      id: "maxDiscountAmount",
      header: "Giảm tối đa",
      accessorKey: "maxDiscountAmount",
      cell: (voucher) => formatPrice(voucher.maxDiscountAmount),
      enableHiding: true,
      align: "right",
    },
    {
      id: "quantity",
      header: "Số lượng",
      accessorKey: "quantity",
      cell: (voucher) => voucher.quantity,
      enableHiding: true,
      align: "center",
    },
    {
      id: "availableVoucher",
      header: "Còn lại",
      accessorKey: "availableVoucher",
      cell: (voucher) => voucher.availableVoucher,
      enableHiding: true,
      align: "center",
    },
    {
      id: "expiryDate",
      header: "Ngày hết hạn",
      accessorKey: "expiryDate",
      cell: (voucher) => format(new Date(voucher.expiryDate), 'dd/MM/yyyy'),
      enableHiding: true,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (voucher) => {
        const now = new Date();
        const expiryDate = new Date(voucher.expiryDate);
        
        if (expiryDate < now) {
          return <Badge variant="destructive">Hết hạn</Badge>;
        } else if (voucher.availableVoucher === 0) {
          return <Badge variant="outline" className="text-orange-500 border-orange-500">Hết lượt</Badge>;
        } else {
          return <Badge variant="active" className="text-white">Còn hiệu lực</Badge>;
        }
      },
      enableHiding: true,
      align: "center",
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (voucher) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditVoucher && onEditVoucher(voucher)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDeleteVoucher && onDeleteVoucher(voucher)}
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

  if (vouchers.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy voucher nào</h3>
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
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${voucher.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(voucher)}
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