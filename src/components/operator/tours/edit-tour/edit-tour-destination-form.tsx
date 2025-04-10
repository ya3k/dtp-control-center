"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Loader2, Plus, Trash2, GripVertical, Upload, X } from "lucide-react"
import { toast } from "sonner"
import tourApiService from "@/apiRequests/tour"
import destinationApiRequest from "@/apiRequests/destination"
import Image from "next/image"
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import TimePickerInput from "@/components/ui/time-picker"

// Types based on API response
interface DestinationActivity {
    name: string
    startTime: string
    endTime: string
    sortOrder: number
}

interface DestinationType {
    id: string
    name: string
    imgUrl?: string
    description?: string
    address?: string
}

interface TourDestination {
    id?: string
    destinationId: string
    destinationName?: string
    startTime: string
    endTime: string
    sortOrder: number
    sortOrderByDate: number
    img?: string
    destinationActivities: DestinationActivity[]
}

interface TourDestinationFormProps {
    tourId: string
    onUpdateSuccess: () => void
}

// Schema for form validation
const destinationActivitySchema = z.object({
    name: z.string().min(1, "Activity name is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    sortOrder: z.number()
})

const tourDestinationSchema = z.object({
    destinationId: z.string().min(1, "Destination ID is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    sortOrder: z.number(),
    sortOrderByDate: z.number(),
    destinationActivities: z.array(destinationActivitySchema)
})

const formSchema = z.object({
    tourId: z.string(),
    destinations: z.array(tourDestinationSchema)
})

// Sortable destination component
function SortableDestination({ destination, index, onRemove, onUpdate, availableDestinations }: {
    destination: TourDestination
    index: number
    onRemove: () => void
    onUpdate: (updated: TourDestination) => void
    availableDestinations: { id: string, name: string, img: string }[]
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: destination.destinationId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    const [activities, setActivities] = useState([...destination.destinationActivities])
    const [customImageUrl, setCustomImageUrl] = useState('')
    const [showImageInput, setShowImageInput] = useState(false)

    const addActivity = () => {
        const newActivities = [...activities, {
            name: "",
            startTime: "09:00:00",
            endTime: "10:00:00",
            sortOrder: activities.length
        }]
        setActivities(newActivities)
        onUpdate({ ...destination, destinationActivities: newActivities })
    }

    const removeActivity = (index: number) => {
        const newActivities = activities.filter((_, i) => i !== index)
        setActivities(newActivities)
        onUpdate({ ...destination, destinationActivities: newActivities })
    }

    const updateActivity = (index: number, field: keyof DestinationActivity, value: string | number) => {
        const newActivities = [...activities]
        newActivities[index] = { ...newActivities[index], [field]: value }
        setActivities(newActivities)
        onUpdate({ ...destination, destinationActivities: newActivities })
    }

    const handleDestinationChange = (destinationId: string) => {
        const selected = availableDestinations.find(d => d.id === destinationId)
        if (selected) {
            onUpdate({
                ...destination,
                destinationId,
                destinationName: selected.name,
                img: selected.img
            })
        }
    }

    const handleCustomImageChange = () => {
        if (customImageUrl.trim()) {
            onUpdate({
                ...destination,
                img: customImageUrl
            })
            setShowImageInput(false)
            setCustomImageUrl('')
        }
    }

    return (
        <Card className="mb-4" ref={setNodeRef} style={style}>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg flex-1">Destination {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={onRemove}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <Select
                                value={destination.destinationId}
                                onValueChange={handleDestinationChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableDestinations.map((dest) => (
                                        <SelectItem key={dest.id} value={dest.id}>
                                            {dest.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>

                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <TimePickerInput
                                    value={destination.startTime}
                                    onChange={(value) => onUpdate({ ...destination, startTime: value })}
                                />
                            </FormItem>
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <TimePickerInput
                                    value={destination.endTime}
                                    onChange={(value) => onUpdate({ ...destination, endTime: value })}
                                />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        {showImageInput ? (
                            <div className="w-full space-y-2">
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={customImageUrl}
                                            onChange={(e) => setCustomImageUrl(e.target.value)}
                                            placeholder="Enter image URL"
                                        />
                                        <Button size="sm" onClick={handleCustomImageChange} className="shrink-0">
                                            <Upload className="h-4 w-4 mr-1" />
                                            Apply
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setShowImageInput(false)} className="shrink-0">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </FormItem>
                            </div>
                        ) : (
                            <>
                                {destination.img ? (
                                    <div className="relative w-full h-32 rounded-md overflow-hidden group">
                                        <Image
                                            src={destination.img}
                                            alt={destination.destinationName || "Destination"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 300px"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="secondary" size="sm" onClick={() => setShowImageInput(true)}>
                                                Change Image
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-muted flex flex-col items-center justify-center rounded-md">
                                        <p className="text-sm text-muted-foreground mb-2">No image available</p>
                                        <Button size="sm" variant="outline" onClick={() => setShowImageInput(true)}>
                                            <Upload className="h-4 w-4 mr-1" />
                                            Add Image
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <FormLabel>Activities</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={addActivity}>
                            <Plus className="h-4 w-4 mr-1" /> Add Activity
                        </Button>
                    </div>

                    <div className="max-h-60 overflow-y-auto pr-2">
                        {activities.map((activity, idx) => (
                            <Card key={idx} className={cn("p-3 mb-2")}>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                    <div className="md:col-span-2">
                                        <FormItem>
                                            <FormLabel className="text-xs">Activity Name</FormLabel>
                                            <Input
                                                value={activity.name}
                                                onChange={(e) => updateActivity(idx, "name", e.target.value)}
                                                placeholder="Enter activity name"
                                            />
                                        </FormItem>
                                    </div>
                                    <div>
                                        <FormItem>
                                            <FormLabel className="text-xs">Start Time</FormLabel>
                                            <TimePickerInput
                                                value={activity.startTime}
                                                onChange={(value) => updateActivity(idx, "startTime", value)}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="flex items-end">
                                        <div className="flex-1">
                                            <FormItem>
                                                <FormLabel className="text-xs">End Time</FormLabel>
                                                <TimePickerInput
                                                    value={activity.endTime}
                                                    onChange={(value) => updateActivity(idx, "endTime", value)}
                                                />
                                            </FormItem>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="ml-1 mb-1"
                                            onClick={() => removeActivity(idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function TourEditDestinationForm({ tourId, onUpdateSuccess }: TourDestinationFormProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [destinations, setDestinations] = useState<TourDestination[]>([])
    const [availableDestinations, setAvailableDestinations] = useState<{ id: string, name: string, img: string }[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tourId,
            destinations: []
        }
    })

    // Fetch destinations data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                // Fetch tour destinations
                const tourDestinationResponse = await tourApiService.getTourDestination(tourId)
                if (tourDestinationResponse.payload.data) {
                    setDestinations(tourDestinationResponse.payload.data)
                    form.setValue('destinations', tourDestinationResponse.payload.data)
                }

                // Fetch available destinations from API
                const availableDestinationsResponse = await destinationApiRequest.getAll("?$count=true")
                if (availableDestinationsResponse?.payload?.value) {
                    const mappedDestinations = availableDestinationsResponse.payload.value.map((dest: DestinationType) => ({
                        id: dest.id,
                        name: dest.name,
                        img: dest.imgUrl || ""
                    }))
                    setAvailableDestinations(mappedDestinations)
                }
            } catch (error) {
                console.error("Error fetching destinations:", error)
                toast.error("Failed to load destination data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [tourId, form])

    const onSubmit = async () => {
        try {
            setIsSaving(true)
            // Format the data for the API
            const payload = {
                tourId,
                destinations: destinations.map(dest => ({
                    destinationId: dest.destinationId,
                    destinationActivities: dest.destinationActivities,
                    startTime: dest.startTime,
                    endTime: dest.endTime,
                    sortOrder: dest.sortOrder,
                    sortOrderByDate: dest.sortOrderByDate,
                    img: dest.img || ""
                }))
            }

            await tourApiService.putTourDesitnation(tourId, payload)
            toast.success("Tour destinations updated successfully")
            onUpdateSuccess()
        } catch (error) {
            console.error("Error updating destinations:", error)
            toast.error("Failed to update destinations")
        } finally {
            setIsSaving(false)
        }
    }

    const addDestination = () => {
        if (availableDestinations.length === 0) {
            toast.error("No available destinations to add")
            return
        }

        const newDestination: TourDestination = {
            destinationId: availableDestinations[0].id,
            destinationName: availableDestinations[0].name,
            img: availableDestinations[0].img,
            startTime: "09:00:00",
            endTime: "10:00:00",
            sortOrder: destinations.length,
            sortOrderByDate: destinations.length,
            destinationActivities: []
        }

        setDestinations([...destinations, newDestination])
    }

    const removeDestination = (index: number) => {
        const newDestinations = destinations.filter((_, i) => i !== index)
        setDestinations(newDestinations)
    }

    const updateDestination = (index: number, updated: TourDestination) => {
        const newDestinations = [...destinations]
        newDestinations[index] = updated
        setDestinations(newDestinations)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            setDestinations(items => {
                const oldIndex = items.findIndex(item => item.destinationId === active.id)
                const newIndex = items.findIndex(item => item.destinationId === over?.id)

                const newItems = [...items]
                const [removed] = newItems.splice(oldIndex, 1)
                newItems.splice(newIndex, 0, removed)

                // Update sort orders
                return newItems.map((item, index) => ({
                    ...item,
                    sortOrder: index,
                    sortOrderByDate: index
                }))
            })
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading destinations...</p>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Tour Destinations</h3>
                    <Button type="button" variant="outline" onClick={addDestination}>
                        <Plus className="h-4 w-4 mr-1" /> Add Destination
                    </Button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={destinations.map(d => d.destinationId)} strategy={verticalListSortingStrategy}>
                            {destinations.map((destination, index) => (
                                <SortableDestination
                                    key={destination.destinationId}
                                    destination={destination}
                                    index={index}
                                    onRemove={() => removeDestination(index)}
                                    onUpdate={(updated) => updateDestination(index, updated)}
                                    availableDestinations={availableDestinations}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {destinations.length === 0 && (
                        <div className="text-center py-8 border border-dashed rounded-md">
                            <p className="text-muted-foreground">No destinations added yet. Add one to get started.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Destinations
                    </Button>
                </div>
            </form>
        </Form>
    )
} 