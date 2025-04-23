"use client"

import { useEffect, useState } from "react"
import { orderApiRequest } from "@/apiRequests/order"
import { toast } from "@/hooks/use-toast"
import { TourOrderType } from "@/schemaValidations/oprator-order.schema"
import { tourByCompanyResType } from "@/schemaValidations/tour-operator.shema"
import { OrderTable } from "./order-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface OrderListToursDialogProps {
    tour: tourByCompanyResType
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function OrderToursHistoryDialog({ tour, open, onOpenChange }: OrderListToursDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [orderHistory, setOrderHistory] = useState<TourOrderType[]>([])

    useEffect(() => {
        if (!open) return
        
        const fetchOrder = async () => {
            try {
                setIsLoading(true)
                const response = await orderApiRequest.getTourOrderHistory(tour.id)
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
    }, [tour.id, open])

    const handleViewOrder = (order: TourOrderType) => {
        // Handle viewing order details
        console.log("View order:", order)
    }

    const handleEditOrder = (order: TourOrderType) => {
        // Handle editing order
        console.log("Edit order:", order)
    }

    const handleResetFilters = () => {
        // Reset any filters applied to the table
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lịch sử đơn hàng - {tour.title}</DialogTitle>
                </DialogHeader>
                
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
                        onEditOrder={handleEditOrder}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

