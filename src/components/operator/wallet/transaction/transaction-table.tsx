"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, Copy, Check } from "lucide-react"
import { TransactionType } from "@/schemaValidations/wallet.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

interface TransactionTableProps {
  transactions: TransactionType[]
  loading: boolean
  resetFilters: () => void
  onViewDetails?: (transaction: TransactionType) => void
}

export function TransactionTable({
  transactions,
  loading,
  resetFilters,
  onViewDetails
}: TransactionTableProps) {
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
  const columns: ColumnDef<TransactionType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (transaction) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{transaction.id.substring(0, 8)}...</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleCopy(transaction.id, "ID")}
          >
            {copiedId === transaction.id ? (
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
      header: "Ngày giao dịch",
      accessorKey: "createdAt",
      cell: (transaction) => new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      enableHiding: false, // Required column
    },
    {
      id: "type",
      header: "Loại giao dịch",
      accessorKey: "type",
      cell: (transaction) => {
        const type = transaction.type;
        type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "refund" | "active" | "transfer";
        let badgeVariant: BadgeVariant = "default";
        let label = "Không xác định";

        switch (type) {
          case "Withdraw":
            badgeVariant = "destructive";
            label = "Rút tiền";
            break;
          case "Deposit":
            badgeVariant = "secondary";
            label = "Nạp tiền";
            break;
          case "Transfer":
            badgeVariant = "transfer";
            label = "Chuyển tiền";
            break;
          case "ThirdPartyPayment":
            badgeVariant = "outline";
            label = "Thanh toán bên thứ ba";
            break;
          case "Payment":
            badgeVariant = "secondary";
            label = "Thanh toán";
            break;
          case "Receive":
            badgeVariant = "active";
            label = "Nhận tiền";
            break;
          case "Refund":
            badgeVariant = "refund";
            label = "Hoàn tiền";
            break;
          default:
            badgeVariant = "default";
            label = "Không xác định";
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
      cell: (transaction) => {
        const amount = transaction.amount;
        const isNegative = transaction.type === "Withdraw";
        const isRefund = transaction.type === "Refund";
        const isTransfer = transaction.type === "Transfer";

        return (
          <span className={`font-semibold text-lg ${isNegative ? "text-destructive" : isRefund ? "text-yellow-600" : isTransfer ? "text-blue-600" : "text-green-600"}`}>
            {isNegative ? "- " : isRefund ? "" : isTransfer ? "" : "+ "}{formatPrice(Math.abs(amount))}
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
      cell: (transaction) => (
        <div className="max-w-[350px] truncate">
          {transaction.description || "—"}
        </div>
      ),
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (transaction) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails && onViewDetails(transaction)}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
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

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy giao dịch nào</h3>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${transaction.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(transaction)}
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