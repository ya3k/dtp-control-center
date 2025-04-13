"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import categoryApiRequest from "@/apiRequests/category"
import { CategoryType } from "@/schemaValidations/category.schema"
import { CategoryForm } from "./category-form"

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryType | null
  onEditComplete: (updatedCategory: CategoryType) => void
}

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onEditComplete,
}: EditCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: { name: string }) => {
    if (!category?.id) return

    setIsSubmitting(true)
    try {
      const response = await categoryApiRequest.update(category.id, data)
      console.log(JSON.stringify(response.payload))
      
      if (response.status === 204) {
        const updatedCategory = { ...category, ...data }
        onEditComplete(updatedCategory)
        toast.success("Cập nhật danh mục thành công")
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error)
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật danh mục")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho danh mục. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          initialData={category || undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
} 