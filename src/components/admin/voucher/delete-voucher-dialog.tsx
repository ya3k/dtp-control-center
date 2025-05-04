import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VoucherResType } from "@/schemaValidations/admin-voucher.schema"
import { voucherApiRequest } from "@/apiRequests/voucher"
import { toast } from "sonner"
import { useState } from "react"

interface DeleteVoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherResType | null
  onDeleteComplete: (deletedId: string) => void
}

export function DeleteVoucherDialog({
  open,
  onOpenChange,
  voucher,
  onDeleteComplete,
}: DeleteVoucherDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!voucher) return
    
    setIsDeleting(true)
    
    try {
      const response = await voucherApiRequest.deleteVoucher(voucher.id)
      
      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete voucher")
      }
      
      toast.success("Xóa voucher thành công")
      onDeleteComplete(voucher.id)
    } catch (error) {
      console.error("Error deleting voucher:", error)
      toast.error("Không thể xóa voucher. Vui lòng thử lại sau.")
    } finally {
      setIsDeleting(false)
      onOpenChange(false)
    }
  }

  if (!voucher) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa voucher</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa voucher <strong>{voucher.code}</strong>? 
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 