"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { 
  DetailedTransactionType, 
  TransactionType 
} from "@/schemaValidations/wallet.schema"
import { formatCurrency } from "@/lib/utils"
import { walletApiRequest } from "@/apiRequests/wallet"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TransactionDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: TransactionType
  detailedTransaction?: DetailedTransactionType | null
  isLoading?: boolean
}

export function TransactionDetailsDialog({
  open,
  onOpenChange,
  transaction,
  detailedTransaction: initialDetailedTransaction,
  isLoading: initialIsLoading = false,
}: TransactionDetailsDialogProps) {
  const [detailedTransaction, setDetailedTransaction] = useState<DetailedTransactionType | null>(
    initialDetailedTransaction || null
  )
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading)
  const [error, setError] = useState<string | null>(null)

  // Fetch transaction details if not provided
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (open && !initialDetailedTransaction && !initialIsLoading) {
        setIsLoading(true)
        setError(null)
        try {
          const response = await walletApiRequest.transactionDetail(transaction.transactionId)
          if (response.status === 200) {
            setDetailedTransaction(response.payload)
          } else {
            setError("Không thể tải thông tin chi tiết giao dịch.")
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error)
          setError("Đã xảy ra lỗi khi tải thông tin chi tiết giao dịch.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTransactionDetails()
  }, [open, transaction.transactionId, initialDetailedTransaction, initialIsLoading])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      if (!initialDetailedTransaction) {
        setDetailedTransaction(null)
      }
      setError(null)
    }
  }, [open, initialDetailedTransaction])

  // Update state when props change
  useEffect(() => {
    setDetailedTransaction(initialDetailedTransaction || null)
    setIsLoading(initialIsLoading)
  }, [initialDetailedTransaction, initialIsLoading])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Get transaction type label based on numeric type code
  const getTransactionTypeLabel = (type: number) => {
    switch (type) {
      case 0: return { label: "Nạp tiền", variant: "success" } // Deposit
      case 1: return { label: "Rút tiền", variant: "destructive" } // Withdraw
      case 2: return { label: "Chuyển tiền", variant: "warning" } // Transfer
      case 3: return { label: "Thanh toán bên thứ ba", variant: "outline" } // ThirdPartyPayment
      case 4: return { label: "Thanh toán", variant: "secondary" } // Payment
      case 5: return { label: "Nhận tiền", variant: "success" } // Receive
      case 6: return { label: "Hoàn tiền", variant: "default" } // Refund
      default: return { label: "Không xác định", variant: "default" }
    }
  }

  // Map string transaction type to the same styling as numeric types (for consistency)
  const getStringTransactionTypeStyle = (typeString: string) => {
    switch (typeString) {
      case "Deposit": return { label: "Nạp tiền", variant: "success" }
      case "Withdraw": return { label: "Rút tiền", variant: "destructive" } 
      case "Transfer": return { label: "Chuyển tiền", variant: "warning" }
      case "ThirdPartyPayment": return { label: "Thanh toán bên thứ ba", variant: "outline" }
      case "Payment": return { label: "Thanh toán", variant: "secondary" } 
      case "Receive": return { label: "Nhận tiền", variant: "success" }
      case "Refund": return { label: "Hoàn tiền", variant: "default" } 
      default: return { label: "Không xác định", variant: "default" }
    }
  }

  // Get transaction status label
  const getTransactionStatusLabel = (status: number) => {
    switch (status) {
      case 0: return { label: "Đang xử lý", variant: "warning" as const }
      case 1: return { label: "Thành công", variant: "success" as const }
      case 2: return { label: "Thất bại", variant: "destructive" as const }
      case 3: return { label: "Đã hủy", variant: "secondary" as const }
      default: return { label: "Không xác định", variant: "default" as const }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Chi tiết giao dịch</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về giao dịch
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="p-4 space-y-6">
            <div className="flex justify-center items-center pb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải thông tin chi tiết giao dịch...</span>
            </div>
            
            {/* Show basic transaction info while loading */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Mã giao dịch</p>
                <p className="font-medium break-all">{transaction.transactionId.substring(0, 8)}...</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Thời gian giao dịch</p>
                <p>{formatDate(transaction.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Loại giao dịch</p>
                <div>
                  <Badge variant={getStringTransactionTypeStyle(transaction.type).variant as any}>
                    {getStringTransactionTypeStyle(transaction.type).label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số tiền</p>
                <p className={`font-bold ${transaction.type === "Withdraw" ? "text-destructive" : "text-green-600"}`}>
                  {transaction.type === "Withdraw" ? "-" : "+"}{formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 space-y-4">
            <div className="text-center text-destructive">
              <p>{error}</p>
            </div>
            
            {/* Show basic transaction info when there's an error */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Mã giao dịch</p>
                <p className="font-medium break-all">{transaction.transactionId.substring(0, 8)}...</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Thời gian giao dịch</p>
                <p>{formatDate(transaction.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Loại giao dịch</p>
                <div>
                  <Badge variant={getStringTransactionTypeStyle(transaction.type).variant as any}>
                    {getStringTransactionTypeStyle(transaction.type).label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số tiền</p>
                <p className={`font-bold ${transaction.type === "Withdraw" ? "text-destructive" : "text-green-600"}`}>
                  {transaction.type === "Withdraw" ? "-" : "+"}{formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
              
              {transaction.description && (
                <div className="space-y-1 col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
                  <p className="text-sm">{transaction.description || "Không có mô tả"}</p>
                </div>
              )}
            </div>
          </div>
        ) : detailedTransaction ? (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Mã giao dịch</p>
                <p className="font-medium break-all">{detailedTransaction.transactionCode}</p>
              </div>

              {detailedTransaction.refTransactionCode && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Mã giao dịch tham chiếu</p>
                  <p className="font-medium break-all">{detailedTransaction.refTransactionCode}</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Thời gian giao dịch</p>
                <p>{formatDate(detailedTransaction.createdAt)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Loại giao dịch</p>
                <div>
                  <Badge variant={getTransactionTypeLabel(detailedTransaction.type).variant as any}>
                    {getTransactionTypeLabel(detailedTransaction.type).label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số tiền</p>
                <p className={`font-bold ${detailedTransaction.type === 1 ? "text-destructive" : "text-green-600"}`}>
                  {detailedTransaction.type === 1 ? "-" : "+"}{formatCurrency(Math.abs(detailedTransaction.amount))}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số dư sau giao dịch</p>
                <p className="font-medium">{formatCurrency(detailedTransaction.afterTransactionBalance)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <div>
                  <Badge variant={getTransactionStatusLabel(detailedTransaction.status).variant}>
                    {getTransactionStatusLabel(detailedTransaction.status).label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
              <p className="text-sm">{detailedTransaction.description || "Không có mô tả"}</p>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Không tìm thấy thông tin chi tiết giao dịch.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}