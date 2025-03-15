"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Loader2 } from "lucide-react"
import { tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { TourEditInfoForm } from "./edit-tour-info-form"

interface UpdateTourDialogProps {
    tour: tourOdataResType
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateSuccess: (updatedTour: TourResType) => void
}


export function UpdateTourDialog({ tour: initialTour, open, onOpenChange, onUpdateSuccess }: UpdateTourDialogProps) {
    const [activeTab, setActiveTab] = useState("info")
    const [tour, setTour] = useState<tourOdataResType>(initialTour)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset to first tab when dialog is closed
    useEffect(() => {
        if (!open) {
            setActiveTab("info")
        }
    }, [open])

    const handleUpdateSuccess = (updatedTour: TourResType) => {
        onUpdateSuccess(updatedTour)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin Tour</DialogTitle>
                    <DialogDescription>Chọn thông tin bạn muốn chỉnh sửa</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin mr-2" />
                        <p>Loading tour data...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="flex flex-auto mb-4">
                            <TabsTrigger value="info">Tour Info</TabsTrigger>
                            <TabsTrigger value="destinations">Destinations</TabsTrigger>
                            <TabsTrigger value="schedule">Schedules</TabsTrigger>
                            <TabsTrigger value="tickets">Tickets</TabsTrigger>

                        </TabsList>

                        <TabsContent value="info" className="space-y-4">
                            <TourEditInfoForm tourId={tour.id} onUpdateSuccess={handleUpdateSuccess} />
                        </TabsContent>

                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}

