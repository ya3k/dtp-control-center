'use client'

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import tourApiService from "@/apiRequests/tour"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Define the form schema for adding a schedule
const addScheduleSchema = z.object({
    openDay: z.date({
        required_error: "Start date is required",
    }),
    closeDay: z.date({
        required_error: "End date is required",
    }).refine(date => date > new Date(), {
        message: "End date must be in the future",
    }),
    scheduleFrequency: z.string({
        required_error: "Frequency is required",
    }),
})

// Define the frequency options
const frequencyOptions = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
]

interface TourEditScheduleFormProps {
    tourId: string
    onUpdateSuccess: () => void
}

export default function TourEditScheduleForm({ tourId, onUpdateSuccess }: TourEditScheduleFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [schedules, setSchedules] = useState<string[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const [selectedSchedule, setSelectedSchedule] = useState<{ startDay: string, endDay: string } | null>(null)

    // Form setup for adding schedules
    const form = useForm<z.infer<typeof addScheduleSchema>>({
        resolver: zodResolver(addScheduleSchema),
        defaultValues: {
            openDay: new Date(),
            closeDay: new Date(new Date().setDate(new Date().getDate() + 7)),
            scheduleFrequency: "Daily",
        }
    })

    // Fetch tour schedules
    const fetchTourSchedule = async () => {
        try {
            setIsLoading(true)
            const response = await tourApiService.getTourSchedule(tourId)
            if (response.payload && Array.isArray(response.payload.data)) {
                setSchedules(response.payload.data)
            } else {
                console.error("Unexpected response format:", response)
                toast.error("Failed to load schedule data")
            }
        } catch (error) {
            console.error("Failed to fetch tour schedules:", error)
            toast.error("Failed to load tour schedules")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTourSchedule()
    }, [tourId])

    // Handle adding a new schedule
    const onSubmit = async (values: z.infer<typeof addScheduleSchema>) => {
        try {
            setIsSubmitting(true)

            const scheduleData = {
                tourId: tourId,
                openDay: values.openDay.toISOString(),
                closeDay: values.closeDay.toISOString(),
                scheduleFrequency: values.scheduleFrequency,
            }

            const response = await tourApiService.postTourSchedule(tourId, scheduleData)
            console.log(JSON.stringify(response.payload))

            if (!response.payload) {
                throw new Error('Failed to add schedule')
            }

            toast.success("Schedule added successfully")
            form.reset()
            fetchTourSchedule() // Refresh schedule list
            onUpdateSuccess()
        } catch (error) {
            console.error("Error adding schedule:", error)
            toast.error("Failed to add schedule")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle deleting a schedule
    const handleDelete = async (startDay: string) => {
        // For this example, we'll use the same date for both start and end
        const deleteData = {
            tourId: tourId,
            startDay: startDay,
            endDay: startDay,
        }

        try {
            setIsSubmitting(true)
            const response = await tourApiService.deleteTourSchedule(tourId, deleteData)

            console.log(JSON.stringify(response.payload))
            if (!response.payload) {
                throw new Error('Failed to delete schedule')
            }

            toast.success("Schedule deleted successfully")
            fetchTourSchedule() // Refresh schedule list
            onUpdateSuccess()
        } catch (error) {
            console.error("Error deleting schedule:", error)
            toast.error("Failed to delete schedule")
        } finally {
            setIsSubmitting(false)
            setDeleteDialogOpen(false)
            setSelectedSchedule(null)
        }
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy')
        } catch {
            return dateString
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Tour Schedules</span>
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="default">
                                <Plus className="h-4 w-4 mr-2" /> Add Schedule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Add New Schedule</DialogTitle>
                                <DialogDescription>
                                    Create a new schedule for this tour.
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="openDay"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="closeDay"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < form.getValues("openDay")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="scheduleFrequency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a frequency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {frequencyOptions.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    How often the tour will run during this period
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setAddDialogOpen(false)}
                                        >
                                            Done
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                "Create Schedule"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
                <CardDescription>
                    Manage your tour's available dates
                </CardDescription>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <ScrollArea className="h-[400px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                                            No schedules found. Click "Add Schedule" to create one.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    schedules.map((schedule, index) => (
                                        <TableRow key={`schedule-${index}`}>
                                            <TableCell className="font-medium">
                                                {formatDate(schedule)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete the schedule for {formatDate(schedule)}?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(schedule)}
                                                                className="bg-red-500 hover:bg-red-700"
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Deleting...
                                                                    </>
                                                                ) : (
                                                                    "Delete"
                                                                )}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}