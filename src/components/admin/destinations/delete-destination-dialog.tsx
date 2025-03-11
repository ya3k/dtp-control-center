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
import { Destination } from "@/types/destination"
import { useDestinationStore } from "@/store/destination/useDestinationStore"

interface DeleteDestinationDialogProps {
    destination: Destination | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteDestinationDialog({ destination, open, onOpenChange }: DeleteDestinationDialogProps) {
    const { deleteDestination } = useDestinationStore()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!destination) return

        setIsDeleting(true)
        try {
            await deleteDestination(destination.id)
            toast.success(`Destination ${destination.id} ${destination.name} delete successfully`)
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
                        This action cannot be undone. This will permanently delete the destination
                        {destination ? (
                            <> <strong>"{destination.name}"</strong> </>
                        ) : (
                            ""
                        )} and remove their data from our servers.
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

