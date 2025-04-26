"use client"

import { useState } from "react"
import { z } from "zod"

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
import { AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import tourApiService from "@/apiRequests/tour"
import { tourByCompanyResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Zod schema for tour closing
const closeTourSchema = z.object({
    remarkBody: z.string()
        .min(10, { message: "Lý do đóng tour phải có ít nhất 10 ký tự" })
        .max(500, { message: "Lý do đóng tour không được vượt quá 500 ký tự" })
});

interface CloseToursDialogProps {
    tour: tourByCompanyResType
    open: boolean
    onOpenChange: (open: boolean) => void
    onCloseSuccess: (updatedTour: TourResType) => void
}

export function CloseToursDialog({ tour, open, onOpenChange, onCloseSuccess }: CloseToursDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [remarkBody, setRemarkBody] = useState("")
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleRemarkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRemarkBody(e.target.value);
        if (validationError) setValidationError(null);
    }

    const validateInput = (): boolean => {
        try {
            closeTourSchema.parse({ remarkBody });
            setValidationError(null);
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.errors[0]?.message || "Vui lòng kiểm tra lại thông tin";
                setValidationError(errorMessage);
            } else {
                setValidationError("Đã xảy ra lỗi khi xác thực dữ liệu");
            }
            return false;
        }
    }

    const handleDelete = async () => {
        if (!validateInput()) return;
        
        console.log(tour.id)
        setIsDeleting(true)
        try {
            // Call API with both ID and body
            const response = await tourApiService.closeTour(tour.id, remarkBody);

            if (response.payload.success === true) {
                toast.success("Đóng tour thành công!")
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
                
                <div className="space-y-2">
                    <label htmlFor="remarkBody" className="text-sm font-medium">
                        Lý do đóng tour <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="remarkBody"
                        className={`w-full h-24 p-2 border rounded ${validationError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary'}`}
                        placeholder="Nhập lý do đóng tour (ít nhất 10 ký tự)"
                        value={remarkBody}
                        onChange={handleRemarkChange}
                    />
                    {validationError && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{validationError}</AlertDescription>
                        </Alert>
                    )}
                    <p className="text-xs text-gray-500">
                        {remarkBody.length}/500 ký tự
                    </p>
                </div>
                
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting || remarkBody.length < 10}
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

