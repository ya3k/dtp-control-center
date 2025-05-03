import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { voucherApiRequest } from "@/apiRequests/voucher"
import { voucherPOSTSchema, VoucherPOSTType } from "@/schemaValidations/admin-voucher.schema"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import React from "react"

interface CreateVoucherDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreateComplete: () => void
}

export function CreateVoucherDialog({
    open,
    onOpenChange,
    onCreateComplete,
}: CreateVoucherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    
    const form = useForm<VoucherPOSTType>({
        resolver: zodResolver(voucherPOSTSchema),
        defaultValues: {
            maxDiscountAmount: 0,
            percent: 0,
            expiryDate: "",
            quantity: 1,
            description: "",
        },
    })
    
    // When dialog opens/closes, reset the form and selected date
    React.useEffect(() => {
        if (!open) {
            // Reset form when dialog closes
            form.reset({
                maxDiscountAmount: 0,
                percent: 0,
                expiryDate: "",
                quantity: 1,
                description: "",
            })
            setSelectedDate(undefined)
        }
    }, [open, form])
    
    const onSubmit = async (data: VoucherPOSTType) => {
        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày hết hạn")
            return
        }
        
        setIsSubmitting(true)
        
        try {
            // Create a copy of the data with formatted date
            const voucherData: VoucherPOSTType = {
                ...data,
                // Format date to ISO string format
                expiryDate: format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss"),
            }
            
            const response = await voucherApiRequest.postVoucher(voucherData)
            
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed to create voucher")
            }
            
            toast.success("Tạo voucher thành công")
            onOpenChange(false)
            onCreateComplete()
        } catch (error: unknown) {
            console.error("Error creating voucher:", error)
            const errorMessage = error instanceof Error ? error.message : "Không thể tạo voucher. Vui lòng thử lại sau."
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo Voucher Mới</DialogTitle>
                    <DialogDescription>
                        Điền thông tin để tạo mã giảm giá mới cho người dùng.
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
                                                min="1"
                                                max="100"
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
                                                min="1"
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
                                                min="1"
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
                                                    disabled={(date) => date < new Date()}
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
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Đang tạo..." : "Tạo voucher"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 