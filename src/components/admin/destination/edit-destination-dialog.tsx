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
  UpdateDestinationBodySchema,
  UpdateDestinationBodyType,
  DestinationType
} from "@/schemaValidations/admin-destination.schema"

interface EditDestinationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destination: DestinationType | null
  onEditComplete: (updatedDestination: DestinationType) => void
}

export function EditDestinationDialog({
  open,
  onOpenChange,
  destination,
  onEditComplete,
}: EditDestinationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateDestinationBodyType>({
    resolver: zodResolver(UpdateDestinationBodySchema),
    defaultValues: {
      name: destination?.name || "",
      latitude: destination?.latitude || "",
      longitude: destination?.longitude || "",
    },
    values: {
      name: destination?.name || "",
      latitude: destination?.latitude || "",
      longitude: destination?.longitude || "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: UpdateDestinationBodyType) => {
    if (!destination?.id) return
    
    setIsSubmitting(true)
    
    try {
      // Call API to update destination
      const response = await destinationApiRequest.update(destination.id, data)
      // console.log(JSON.stringify(destination.id))
      // console.log(JSON.stringify(data))
      // console.log(JSON.stringify(response))
      if (response.status !== 400) {
        // Update UI
        onEditComplete(destination)
        toast.success("Cập nhật điểm đến thành công")
        onOpenChange(false)
      }
    } catch (error: any) {
      // console.error("Error updating destination:", error)
      toast.error(error.message || "lỗi khi cập nhật điểm đến")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa điểm đến</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho điểm đến. Nhấn lưu khi hoàn tất.
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
              <Button variant={"core"} type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}