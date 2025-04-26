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
import { UserResType } from "@/schemaValidations/admin-user.schema"
import userApiRequest from "@/apiRequests/user"

interface DeleteEmployeeDialogProps {
    user: UserResType | null
    open: boolean
    onOpenChange: (open: boolean) => void,
    onDeleteComplete: (deleteId: string) => void
}

export function DeleteUsersDialog({ user, open, onOpenChange, onDeleteComplete }: DeleteEmployeeDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!user) return

        setIsDeleting(true)
        try {
            const response = await userApiRequest.delete(user.id)
            if (response.payload.success === true) {
                toast.success(`Người dùng ${user.email} đã được vô hiệu hóa`)
                onDeleteComplete(user.id)
                onOpenChange(false);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Lỗi khi vô hiệu hóa user")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Chắc chắn vô hiệu hóa người dùng này?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Người dùng
                        {user ? ` "${user.email}"` : ""} sẽ bị vô hiệu hóa.
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
                                Đang vô hiệu hóa...
                            </>
                        ) : (
                            "Vô hiệu hóa"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

