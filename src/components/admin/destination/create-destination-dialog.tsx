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
import destinationApiRequest from "@/apiRequests/destination"
import { 
  CreateDestinationBodySchema,
  CreateDestinationBodyType
} from "@/schemaValidations/admin-destination.schema"

interface CreateDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateComplete: () => void
}

export function CreateDestinationDialog({
  open,
  onOpenChange,
  onCreateComplete,
}: CreateDestinationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateDestinationBodyType>({
    resolver: zodResolver(CreateDestinationBodySchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: CreateDestinationBodyType) => {
    setIsSubmitting(true)
    
    try {
      // Call API to create destination
      const response = await destinationApiRequest.create(data)
     console.log(JSON.stringify(response))
      if (response.status === 201) {
        // Update UI
        onCreateComplete()
        toast.success("Tạo điểm đến mới thành công")
        onOpenChange(false)
        form.reset()
      }
    } catch (error: any) {
      console.error("Error creating destination:", error)
      toast.error(error.message || "Failed to create destination")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm điểm đến mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin cho điểm đến mới. Nhấn tạo khi hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên điểm đến</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vĩ độ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh độ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                Tạo điểm đến
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}