"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Eye } from "lucide-react"
import { TourOrderType, PaymentStatus } from "@/schemaValidations/oprator-order.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"

interface OrderTableProps {
  orders: TourOrderType[]
  loading: boolean
  resetFilters: () => void
  onViewOrder?: (order: TourOrderType) => void
}

export function OrderTable({
  orders,
  loading,
  resetFilters,
  onViewOrder
}: OrderTableProps) {
  // Define column configuration
  const columns: ColumnDef<TourOrderType>[] = [
    {
      id: "id",
      header: "Id",
      accessorKey: "id",
      cell: (order) => order.id,
      enableHiding: true,
      defaultHidden: true
    },
    {
      id: "code",
      header: "Mã đơn hàng",
      accessorKey: "code",
      cell: (order) => order.code,
      enableHiding: false, // Required column
    },
    {
      id: "refCode",
      header: "Mã tham chiếu",
      accessorKey: "refCode",
      cell: (order) => order.refCode,
      enableHiding: true,
    },
    {
      id: "name",
      header: "Tên khách hàng",
      accessorKey: "name",
      cell: (order) => order.name,
      enableHiding: false, // Required column
    },
    {
      id: "tourName",
      header: "Tên tour",
      accessorKey: "tourName",
      cell: (order) => order.tourName,
      enableHiding: false, // Required column
    },
    {
      id: "tourDate",
      header: "Ngày đi",
      accessorKey: "tourDate",
      cell: (order) => new Date(order.tourDate).toLocaleDateString("vi-VN"),
      enableHiding: true,
    },
    {
      id: "orderDate",
      header: "Ngày đặt",
      accessorKey: "orderDate",
      cell: (order) => new Date(order.orderDate).toLocaleDateString("vi-VN"),
      enableHiding: true,
    },
    {
      id: "grossCost",
      header: "Tổng tiền",
      accessorKey: "grossCost",
      cell: (order) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.grossCost),
      enableHiding: true,
      align: "right",
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (order) => {
        const getStatusVariant = () => {
          switch (order.status) {
            case "Submitted":
              return "submitted"
            case "AwaitingPayment":
              return "secondary"
            case "Completed":
              return "active"
            case "Cancelled":
              return "cancel"
            case "Paid":
              return "active"
            default:
              return "default"
          }
        }

        const getStatusLabel = () => {
          switch (order.status) {
            case "Submitted":
              return "Đã gửi"
            case "AwaitingPayment":
              return "Chờ thanh toán"
            case "Completed":
              return "Hoàn thành"
            case "Cancelled":
              return "Đã hủy"
            case "Paid":
              return "Đã thanh toán"
            default:
              return order.status
          }
        }

        return (
          <Badge variant={getStatusVariant()}>
            {getStatusLabel()}
          </Badge>
        )
      },
      enableHiding: true,
      align: "center",
    },
    {
      id: "paymentStatus",
      header: "Thanh toán",
      accessorKey: "paymentStatus",
      cell: (order) => {
        const getPaymentStatusVariant = () => {
          switch (order.paymentStatus) {
            case PaymentStatus.PENDING:
              return "secondary"
            case PaymentStatus.PROCESSING:
              return "secondary"
            case PaymentStatus.PAID:
              return "active"
            case PaymentStatus.CANCELED:
              return "cancel"
            default:
              return "refund"
          }
        }

        const getPaymentStatusLabel = () => {
          switch (order.paymentStatus) {
            case PaymentStatus.PENDING:
              return "Chờ xử lý"
            case PaymentStatus.PROCESSING:
              return "Đang xử lý"
            case PaymentStatus.PAID:
              return "Hoàn thành"
            case PaymentStatus.CANCELED:
              return "Đã hủy"
            default:
              return order.paymentStatus
          }
        }

        return (
          <Badge variant={getPaymentStatusVariant()}>
            {getPaymentStatusLabel()}
          </Badge>
        )
      },
      enableHiding: true,
      align: "center",
    },
      // {
      //   id: "actions",
      //   header: "Thao tác",
      //   cell: (order) => (
      //     <div className="flex justify-end gap-2">
      //       <Button
      //         variant="ghost"
      //         size="icon"
      //         onClick={() => onViewOrder && onViewOrder(order)}
      //         title="Xem chi tiết"
      //       >
      //         <Eye className="h-4 w-4" />
      //       </Button>
      //     </div>
      //   ),
      //   enableHiding: true,
      //   align: "center",
      // },
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

  if (orders.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy đơn hàng nào</h3>
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${order.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(order)}
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
