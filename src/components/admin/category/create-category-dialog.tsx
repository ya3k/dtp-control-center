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
import { CategoryForm } from "./category-form"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateComplete: () => void
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreateComplete,
}: CreateCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: { name: string }) => {
    setIsSubmitting(true)
    try {
      const response = await categoryApiRequest.create(data)
      if (response.status === 201) {
        onCreateComplete()
        toast.success("Tạo danh mục mới thành công")
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error)
      toast.error(error instanceof Error ? error.message : "Không thể tạo danh mục mới")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cho danh mục mới. Nhấn tạo khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}