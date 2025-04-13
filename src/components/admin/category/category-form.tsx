"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

// Create a schema for category form
const CategoryFormSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
})

type CategoryFormType = z.infer<typeof CategoryFormSchema>

interface CategoryFormProps {
  initialData?: {
    name: string
  }
  onSubmit: (data: CategoryFormType) => Promise<void>
  isSubmitting: boolean
  onCancel: () => void
}

export function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<CategoryFormType>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  })

  return (
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
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Cập nhật" : "Tạo danh mục"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
} 