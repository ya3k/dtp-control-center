"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import tourApiService from "@/apiRequests/tour"
import { tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"

interface CloseToursDialogProps {
    tour: tourOdataResType
    open: boolean
    onOpenChange: (open: boolean) => void
    onCloseSuccess: (updatedTour: TourResType) => void
}

export function CloseToursDialog({ tour, open, onOpenChange }: CloseToursDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        console.log(tour.id)
        setIsDeleting(true)
        try {
            //fetch api
            const response = await tourApiService.closeTour(tour.id);
            if (response.payload.success === true) {
                toast.success("Đóng tour thành công~!")
            }
            onOpenChange(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete employee")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắc?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn đóng tour <span>{tour.title}</span> này không?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang đóng...
                            </>
                        ) : (
                            "Đóng"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

