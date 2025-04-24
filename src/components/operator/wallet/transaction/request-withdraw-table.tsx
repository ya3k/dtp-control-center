"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, Check, CheckCircle, XCircle } from "lucide-react"
import { AdminExternalTransactionType } from "@/schemaValidations/wallet.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface RequestWithdrawTableProps {
  withdrawRequests: AdminExternalTransactionType[]
  loading: boolean
  resetFilters: () => void
  onApprove?: (requestId: string) => void
  onReject?: (requestId: string) => void
}

export function RequestWithdrawTable({
  withdrawRequests,
  loading,
  resetFilters,
  onApprove,
  onReject
}: RequestWithdrawTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(text)
      toast.success(`Đã sao chép ${label}`)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error(`Không thể sao chép ${label}`)
    }
  }

  // Define column configuration
  const columns: ColumnDef<AdminExternalTransactionType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (request) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{request.id.substring(0, 8)}...</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopy(request.id, "ID")}
          >
            {copiedId === request.id ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
      enableHiding: true,
      defaultHidden: false
    },
    {
      id: "createdAt",
      header: "Ngày yêu cầu",
      accessorKey: "createAt",
      cell: (request) => new Date(request.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      enableHiding: false, // Required column
    },
    {
      id: "companyName",
      header: "Công ty",
      accessorKey: "companyName",
      cell: (request) => request.companyName || "—",
      enableHiding: true,
    },
    {
      id: "externalTransactionCode",
      header: "Mã yêu cầu",
      accessorKey: "externalTransactionCode",
      cell: (request) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{request.externalTransactionCode}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopy(request.externalTransactionCode, "Mã giao dịch")}
          >
            {copiedId === request.externalTransactionCode ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
      enableHiding: true,
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorKey: "status",
      cell: (request) => {
        const status = request.status;
        type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "pending" | "success";
        let badgeVariant: BadgeVariant = "default";
        let label = "Không xác định";

        switch (status) {
          case "Pending":
            badgeVariant = "pending";
            label = "Chờ xử lý";
            break;
          case "Rejected":
            badgeVariant = "destructive";
            label = "Từ chối";
            break;

          default:
            badgeVariant = "default";
            label = "Hoàn thành";
        }

        return (
          <Badge variant={badgeVariant}>
            {label}
          </Badge>
        );
      },
      enableHiding: false,
      align: "center",
    },
    {
      id: "amount",
      header: "Số tiền",
      accessorKey: "amount",
      cell: (request) => {
        const amount = request.amount;
        return (
          <span className="font-semibold text-lg text-destructive">
            - {formatPrice(Math.abs(amount))}
          </span>
        );
      },
      enableHiding: false,
      align: "right",
    },
    {
      id: "description",
      header: "Mô tả",
      accessorKey: "description",
      cell: (request) => request.description || "—",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (request) => (
        <div className="flex justify-end gap-2">
          {request.status === "Pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove && onApprove(request.id)}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Duyệt</span>
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => onReject && onReject(request.id)}
                className="flex items-center gap-1"
              >
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Từ chối</span>
              </Button> */}
            </>
          )}
          {(request.status === "Approved" || request.status === "Processing") && (
            <Badge variant="secondary">Đang xử lý</Badge>
          )}
          {request.status === "Completed" && (
            <Badge variant="success">Đã hoàn thành</Badge>
          )}
          {request.status === "Rejected" && (
            <Badge variant="destructive">Đã từ chối</Badge>
          )}
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

  if (withdrawRequests.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy yêu cầu rút tiền nào</h3>
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
            {withdrawRequests.map((request) => (
              <TableRow key={request.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${request.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(request)}
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
