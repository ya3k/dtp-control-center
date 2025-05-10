import { useState } from "react"
import { SystemSetting } from "@/schemaValidations/system.schema"
import { toast } from "sonner"
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

interface DeleteSettingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setting: SystemSetting | null
  onDeleteComplete: () => void
}

export function DeleteSettingDialog({
  open,
  onOpenChange,
  setting,
  onDeleteComplete,
}: DeleteSettingDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!setting) return
    
    setIsDeleting(true)
    try {
      // This will be replaced with actual API call when ready
      console.log("Deleting setting:", setting.id)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success("Setting deleted successfully")
      onOpenChange(false)
      onDeleteComplete()
    } catch (error) {
      console.error("Error deleting setting:", error)
      toast.error("Failed to delete setting")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this setting?
            {setting && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                <div><strong>Code:</strong> {setting.settingCode}</div>
                <div><strong>Key:</strong> {setting.settingKey}</div>
              </div>
            )}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 