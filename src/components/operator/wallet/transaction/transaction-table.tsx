"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { TransactionType } from "@/schemaValidations/wallet.schema"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { formatCurrency } from "@/lib/utils"

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
  // Define column configuration
  const columns: ColumnDef<TransactionType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (transaction) => <span className="font-mono text-xs">{transaction.id.substring(0, 8)}...</span>,
      enableHiding: true,
      defaultHidden: true
    },
    {
      id: "transactionId",
      header: "Mã giao dịch",
      accessorKey: "transactionId",
      cell: (transaction) => <span className="font-mono text-xs">{transaction.transactionId.substring(0, 8)}...</span>,
      enableHiding: true,
      defaultHidden: true
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
        let badgeVariant = "default";
        let label = "Không xác định";


        switch (type) {
          case "Withdraw":
            badgeVariant = "destructive";
            label = "Rút tiền";
            break;
          case "Deposit":
            badgeVariant = "success";
            label = "Nạp tiền";
            break;
          case "Transfer":
            badgeVariant = "warning";
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
            badgeVariant = "success";
            label = "Nhận tiền";
            break;
          case "Refund":
            badgeVariant = "default";
            label = "Hoàn tiền";
            break;
          default:
            badgeVariant = "default";
            label = "Không xác định";
        }

        return (
          <Badge variant={badgeVariant as any}>
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

        return (
          <span className={isNegative ? "text-destructive" : "text-green-600"}>
            {isNegative ? "-" : "+"}{formatCurrency(Math.abs(amount))}
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
      cell: (transaction) => transaction.description || "—",
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