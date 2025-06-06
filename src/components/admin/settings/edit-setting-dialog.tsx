import { useState } from "react"
import { z } from "zod"
import { SystemSetting, putSystemSettingSchema } from "@/schemaValidations/system.schema"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SettingForm } from "./setting-form"
import { systemSettingApiRequest } from "@/apiRequests/system-setting"

const formSchema = putSystemSettingSchema
type FormValues = z.infer<typeof formSchema>

interface EditSettingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  setting: SystemSetting | null
  onEditComplete: (updatedSetting: SystemSetting) => void
}

export function EditSettingDialog({
  open,
  onOpenChange,
  setting,
  onEditComplete,
}: EditSettingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormValues) => {
    if (!setting?.id) return

    setIsSubmitting(true)
    try {
      const response = await systemSettingApiRequest.putSystem({
        id: setting.id,
        settingValue: data.settingValue
      })
      
      const updatedSetting: SystemSetting = {
        ...setting,
        settingValue: data.settingValue
      }
      
      toast.success("Cập nhật thành công")
      onOpenChange(false)
      onEditComplete(updatedSetting)
    } catch (error) {
      console.error("Error updating setting:", error)
      toast.error("Cập nhật thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông số hủy tour</DialogTitle>
          <DialogDescription>
           
          </DialogDescription>
        </DialogHeader>

        {setting && (
          <SettingForm
            initialData={setting}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
} 