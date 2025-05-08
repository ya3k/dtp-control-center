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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import tourApiService from "@/apiRequests/tour"
import { Textarea } from "@/components/ui/textarea"

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
    const [remark, setRemark] = useState("")

    // Handle deleting a schedule
    const handleDelete = async () => {
        if (!remark.trim()) {
            toast.error("Vui lòng nhập lý do hủy lịch trình");
            return;
        }

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
                remark: remark.trim()
            }

            // console.log("Delete request data:", JSON.stringify(deleteData));
console.log(JSON.stringify(deleteData))
            const response = await tourApiService.deleteTourSchedule(tourId, deleteData);

            if (!response.payload) {
                throw new Error('Failed to delete schedule');
            }

            toast.success("Xóa lịch trình thành công");
            onDeleteSuccess();
            setOpen(false); // Close the dialog after successful deletion
        } catch (error) {
            console.error("Error deleting schedule:", error);
            toast.error("Không thể xóa lịch trình");
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
            if (!newOpen) {
                setRemark(""); // Reset remark when dialog closes
            }
            setOpen(newOpen);
        }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    Hủy lịch trình
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận hủy lịch trình</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn hủy lịch trình ngày  <span className="text-red-600 font-bold">{formattedDate}</span> không?
                        Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="remark" className="text-right">
                        Lý do hủy lịch trình
                    </Label>
                    <Textarea
                        id="remark"
                        cols={3}
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Nhập lý do hủy lịch trình..."
                        className="mt-2"
                    />
                </div>
                <DialogFooter className="flex justify-between gap-2">
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
                        Hủy
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
                                Đang xóa...
                            </>
                        ) : (
                            "Xóa"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}