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
import { CompanyResType } from "@/schemaValidations/company.schema"
import companyApiRequest from "@/apiRequests/company"

interface DeleteCompanyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    company: CompanyResType | null
    onDeleteComplete: (deletedId: string) => void
}

export function DeleteCompanyDialog({
    open,
    onOpenChange,
    company,
    onDeleteComplete,
}: DeleteCompanyDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    if (!company) {
        return null
    }

    const handleDelete = async () => {
        if (!company.id) return

        setIsDeleting(true)

        try {
            // Call API to delete company
            const res = await companyApiRequest.delete(company.id)
            //  console.log(JSON.stringify(res))
            // Update UI
            toast.success("Vô hiệu hóa công ty thành công")
            onDeleteComplete(company.id)
            onOpenChange(false)
        } catch (error) {
            // console.error("Error deleting company:", error)
            toast.error("Không thể vô hiệu hóa công ty")
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
                        Xác nhận vô hiệu hóa công ty
                    </DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn vô hiệu hóa công ty <span className="font-semibold">{company.name}</span>?
                        <br />
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 p-3 rounded-md mt-2 text-sm">
                    <p><span className="font-medium">ID:</span> {company.id.substring(0, 8)}...</p>
                    <p><span className="font-medium">Tên:</span> {company.name}</p>
                    <p><span className="font-medium">Email:</span> {company.email}</p>
                    <p><span className="font-medium">Mã số thuế:</span> {company.taxCode}</p>
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
                                Đang vô hiệu hóa...
                            </>
                        ) : (
                            'Vô hiệu hóa'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}