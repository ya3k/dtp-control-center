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
import { tourByCompanyResType, TourResType } from "@/schemaValidations/tour-operator.shema"

interface CloseToursDialogProps {
    tour: tourByCompanyResType
    open: boolean
    onOpenChange: (open: boolean) => void
    onCloseSuccess: (updatedTour: TourResType) => void
}

export function CloseToursDialog({ tour, open, onOpenChange, onCloseSuccess }: CloseToursDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [remarkBody, setRemarkBody] = useState("")

    const handleDelete = async () => {
        console.log(tour.id)
        setIsDeleting(true)
        try {

            // Call API with both ID and body
            const response = await tourApiService.closeTour(tour.id, remarkBody);

            if (response.payload.success === true) {
                toast.success("Đóng tour thành công~!")
                if (onCloseSuccess) {
                    onCloseSuccess(response.payload)
                }
            }
            onOpenChange(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Đóng tour thất bại")
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
                        Bạn có chắc chắn muốn đóng tour <span className="font-semibold">{tour.title}</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <textarea
                    className="w-full h-24 p-2 border rounded"
                    placeholder="Nhập lý do đóng tour"
                    value={remarkBody}
                    onChange={(e) => setRemarkBody(e.target.value)}
                />
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

