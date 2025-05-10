import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { voucherApiRequest } from "@/apiRequests/voucher"
import { voucherPOSTSchema, VoucherPUTType, VoucherResType } from "@/schemaValidations/admin-voucher.schema"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define interface for component props
interface EditVoucherDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  voucher: VoucherResType | null
  onEditComplete: () => void
}

export function EditVoucherDialog({
  open,
  onOpenChange,
  voucher,
  onEditComplete,
}: EditVoucherDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  
  const form = useForm<VoucherPUTType>({
    resolver: zodResolver(voucherPOSTSchema),
    defaultValues: {
      maxDiscountAmount: 0,
      percent: 0,
      quantity: 1,
      description: "",
      expiryDate: "",
    },
  })
  
  // Update form when voucher changes
  useEffect(() => {
    if (voucher && open) {
      form.reset({
        maxDiscountAmount: voucher.maxDiscountAmount,
        percent: voucher.percent * 100, // Convert from decimal to percentage
        quantity: voucher.quantity,
        description: voucher.description, // Using code as description
        expiryDate: voucher.expiryDate,
      })
      
      // Set the selected date for the date picker
      try {
        setSelectedDate(parseISO(voucher.expiryDate))
      } catch (error) {
        console.error("Error parsing date:", error)
      }
    }
  }, [voucher, open, form])
  
  const onSubmit = async (data: VoucherPUTType) => {
    if (!voucher) return
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày hết hạn")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare data for API
      const updatedVoucherData: VoucherPUTType = {
        ...data,
        // Format date to ISO string format
        expiryDate: format(selectedDate, "yyyy-MM-dd"),
      }
      // console.log(`vourcher id`, voucher.id)
      // console.log(JSON.stringify(updatedVoucherData))
      // Call API to update voucher
      const response = await voucherApiRequest.updateVoucher(voucher.id, updatedVoucherData)
      
      if (response.status !== 204) {
        throw new Error("Failed to update voucher")
      }
      
 
      
      toast.success("Cập nhật voucher thành công")
      onEditComplete();
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Error updating voucher:", error)
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật voucher. Vui lòng thử lại sau."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!voucher) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Voucher</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho voucher <strong>{voucher.code}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phần trăm giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxDiscountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm tối đa (VNĐ)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày hết hạn</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "dd/MM/yyyy")
                            ) : (
                              "Chọn ngày"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date)
                            // Store ISO string in form
                            if (date) {
                              field.onChange(format(date, "yyyy-MM-dd"))
                            } else {
                              field.onChange("")
                            }
                          }}
                          disabled={{ before: new Date() }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button variant={"core"} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 