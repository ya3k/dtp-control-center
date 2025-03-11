"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TourInfoFormData, TourRes, UpdateTourInfoRequest } from "@/types/schema/TourSchema"
import { toast } from "sonner"


// Zod schema for form validation
const tourInfoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    companyId: z.string().min(1, "Company ID is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
})
const categoriesList = [
    { id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", name: "Adventure" },
    { id: "a4ce6ec7-070a-4428-8290-c3af692a7783", name: "Cultural" }
]
interface TourInfoFormProps {
    tour: TourRes
    onUpdateSuccess: (updatedTour: TourRes) => void
}

export function TourInfoForm({ tour, onUpdateSuccess }: TourInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true)
            try {
                setCategories(categoriesList);

            } catch (error) {
                console.error("Failed to fetch categories:", error)
            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [])

    // Tour Info form
    const form = useForm<z.infer<typeof tourInfoSchema>>({
        resolver: zodResolver(tourInfoSchema),
        defaultValues: {
            title: tour.title,
            companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            category: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            description: tour.description,
            // openDay: tour.openDay,
            // closeDay: tour.closeDay,
            // scheduleFrequency: tour.scheduleFrequency,
        },
    })

    const onSubmit = async (data: TourInfoFormData) => {
        setIsSubmitting(true)
        try {
            const updateData: UpdateTourInfoRequest = {
                tourId: tour.id,
                ...data,
            }

            const response = await fetch("https://localhost:7171/api/tour/updatetourinfor", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            })

            if (!response.ok) {
                throw new Error("Failed to update tour information")
            }

            const updatedTour = await response.json()
            onUpdateSuccess({
                ...tour,
                ...updatedTour,
            })

            toast.success(`Tour information ${tour.id} updated successfully`)
        } catch (error) {
            console.error("Error updating tour info:", error)
            toast.error("Failed to update tour!")

        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="min-h-[100px]" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting || isLoadingCategories} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Tour Information
                </Button>
            </form>
        </Form>
    )
}

