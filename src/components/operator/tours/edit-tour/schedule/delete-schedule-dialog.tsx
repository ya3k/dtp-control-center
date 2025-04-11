'use client'

import { useState } from "react"
import { format } from "date-fns"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import tourApiService from "@/apiRequests/tour"

interface DeleteScheduleDialogProps {
    schedule: string
    formattedDate: string
    tourId: string
    onDeleteSuccess: () => void
}

export default function DeleteScheduleDialog({
    schedule,
    formattedDate,
    tourId,
    onDeleteSuccess
}: DeleteScheduleDialogProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Handle deleting a schedule
    const handleDelete = async () => {
        try {
            setIsSubmitting(true)

            // Parse the date string into a proper format for the API
            let formattedDate = schedule;

            // Handle different date formats
            if (schedule.includes('.') || schedule.includes(' ')) {
                // Extract just the date part (YYYY-MM-DD)
                formattedDate = schedule.split(' ')[0];
            } else if (schedule.includes('T')) {
                const date = new Date(schedule);
                formattedDate = format(date, 'yyyy-MM-dd');
            } else if (!schedule.match(/^\d{4}-\d{2}-\d{2}$/)) {
                try {
                    const date = new Date(schedule);
                    formattedDate = format(date, 'yyyy-MM-dd');
                } catch (parseError) {
                    console.error("Error parsing date:", parseError);
                }
            }

            const deleteData = {
                tourId: tourId,
                startDay: formattedDate,
                endDay: formattedDate,
            }

            console.log("Delete request data:", JSON.stringify(deleteData));

            const response = await tourApiService.deleteTourSchedule(tourId, deleteData);

            if (!response.payload) {
                throw new Error('Failed to delete schedule');
            }

            toast.success("Schedule deleted successfully");
            onDeleteSuccess();
            setOpen(false); // Close the dialog after successful deletion
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error("Failed to delete schedule");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Only allow dialog to close when not submitting
            if (isSubmitting && newOpen === false) {
                return;
            }
            setOpen(newOpen);
        }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Xóa lịch trình
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the schedule for {formattedDate}?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between gap-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            if (!isSubmitting) {
                                setOpen(false);
                            }
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        className="bg-red-500 hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}