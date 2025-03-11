"use client"

import { useState } from "react"
import { useUserStore } from "@/store/users/useUserStore"
import type { User } from "@/types/user"
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

interface DeleteEmployeeDialogProps {
    user: User | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteEmployeeDialog({ user, open, onOpenChange }: DeleteEmployeeDialogProps) {
    const { deleteUser } = useUserStore()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!user) return

        setIsDeleting(true)
        try {
            await deleteUser(user.id)
            toast.success(`Employee ${user.email} delete successfully`)
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
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the employee
                        {user ? ` "${user.fullname}"` : ""} and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

