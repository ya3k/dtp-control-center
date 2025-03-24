"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import destinationApiRequest from "@/apiRequests/destination"
import { DestinationType } from "@/schemaValidations/admin-destination.schema"

interface DeleteDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destination: DestinationType | null
  onDeleteComplete: (deletedId: string) => void
}

export function DeleteDestinationDialog({
  open,
  onOpenChange,
  destination,
  onDeleteComplete,
}: DeleteDestinationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!destination) {
    return null
  }

  const handleDelete = async () => {
    if (!destination.id) return
    
    setIsDeleting(true)
    
    try {
      // Call API to delete destination
      await destinationApiRequest.delete(destination.id)
      
      // Update UI
      toast.success("Xóa điểm đến thành công")
      onDeleteComplete(destination.id)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error deleting destination:", error)
      toast.error(error.message || "Không thể xóa điểm đến")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Xác nhận xóa điểm đến
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa điểm đến <span className="font-semibold">{destination.name}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 p-3 rounded-md mt-2 text-sm">
          <p><span className="font-medium">ID:</span> {destination.id.substring(0, 8)}...</p>
          <p><span className="font-medium">Tên:</span> {destination.name}</p>
          <p><span className="font-medium">Vị trí:</span> {destination.latitude}, {destination.longitude}</p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa điểm đến'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}