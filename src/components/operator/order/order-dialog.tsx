"use client"

import { useEffect, useState } from "react"
import { orderApiRequest } from "@/apiRequests/order"
import { toast } from "@/hooks/use-toast"
import { TourOrderType } from "@/schemaValidations/oprator-order.schema"
import { tourByCompanyResType } from "@/schemaValidations/tour-operator.shema"
import { OrderTable } from "./order-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface OrderListToursDialogProps {
    tour: tourByCompanyResType
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderToursHistoryDialog({ tour, open, onOpenChange }: OrderListToursDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [orderHistory, setOrderHistory] = useState<TourOrderType[]>([])
    const [selectedDate, setSelectedDate] = useState<string>("")

    useEffect(() => {
        if (!open) return

        const fetchOrder = async () => {
            try {
                setIsLoading(true)
                let filter = ""
                if (selectedDate) {
                    const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd")
                    filter = `&$filter=tourDate eq ${formattedDate}`
                }
                const response = await orderApiRequest.getTourOrderHistory(tour.id, filter)
                
                // console.log("Order history response:", JSON.stringify(response.payload.value))
                setOrderHistory(response.payload.value || [])
            } catch (error) {
                console.error("Error fetching order history:", error)
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách đơn hàng",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrder()
    }, [tour.id, open, selectedDate])

    const handleViewOrder = (order: TourOrderType) => {
        // Handle viewing order details
        console.log("View order:", order)
    }

    const handleDateChange = (date: string) => {
        setSelectedDate(date)
    }

    const handleResetFilters = () => {
        setSelectedDate("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lịch sử đơn hàng - {tour.title}</DialogTitle>
                </DialogHeader>

                <div className="mb-4">
                    <p>Tìm kiếm theo ngày đi</p>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="border rounded p-2"
                    />
                    
                    {selectedDate && (
                        <Button
                            variant={'destructive'}
                            onClick={handleResetFilters}
                            className="ml-2 text-sm"
                        >
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <OrderTable
                        orders={orderHistory}
                        loading={false}
                        resetFilters={handleResetFilters}
                        onViewOrder={handleViewOrder}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

