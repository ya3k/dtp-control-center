"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import destinationApiRequest from "@/apiRequests/destination"
import { CategoryType } from "@/schemaValidations/category.schema"
import categoryApiRequest from "@/apiRequests/category"

interface DeleteCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: CategoryType | null
    onDeleteComplete: (deletedId: string) => void
}

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    category,
    onDeleteComplete,
}: DeleteCategoryDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    if (!category) {
        return null
    }

    const handleDelete = async () => {
        if (!category.id) return

        setIsDeleting(true)

        try {
            // Call API to delete destination
            const res = await categoryApiRequest.delete(category.id)
            // console.log(JSON.stringify(res))
            // Update UI
            toast.success("Xóa danh mục thành công")
            onDeleteComplete(category.id)
            onOpenChange(false)
        } catch (error: any) {
            // console.error("Error deleting category:", error)
            toast.error(error.message || "Không thể xóa danh mục")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Xác nhận xóa danh mục
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa danh mục <span className="font-semibold">{category.name}</span>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 p-3 rounded-md mt-2 text-sm">
                    <p><span className="font-medium">ID:</span> {category.id.substring(0, 8)}...</p>
                    <p><span className="font-medium">Tên:</span> {category.name}</p>

                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            'Xóa danh mục'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}