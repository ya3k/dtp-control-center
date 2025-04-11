"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import categoryApiRequest from "@/apiRequests/category"
import { z } from "zod"

// Create a schema for category creation
const CreateCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
})

type CreateCategoryFormType = z.infer<typeof CreateCategorySchema>

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

  const form = useForm<CreateCategoryFormType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: CreateCategoryFormType) => {
    setIsSubmitting(true)
    
    try {
      // Call API to create category
      const response = await categoryApiRequest.create(data)
      
      if (response.status === 201) {
        // Update UI
        onCreateComplete()
        toast.success("Tạo danh mục mới thành công")
        onOpenChange(false)
        form.reset()
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo danh mục
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}