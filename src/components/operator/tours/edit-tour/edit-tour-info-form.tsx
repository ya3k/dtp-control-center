"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { TourInfoFormType, tourInfoSchema, tourOdataResType, TourResType, UpdateTourInfoRequest } from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"



interface TourInfoFormProps {
    tour: tourOdataResType
    onUpdateSuccess: (updatedTour: TourResType) => void
}

export function TourEditInfoForm({ tour, onUpdateSuccess }: TourInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true)
            try {
                const response = await categoryApiRequest.get();
                const data = await response.payload.value;
                setCategories(data);
                console.log(data)
            } catch (error) {
                console.log(error)

            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [])

    // Tour Info form
    const form = useForm<TourInfoFormType>({
        resolver: zodResolver(tourInfoSchema),
        defaultValues: {
            tourId: tour.id,
            title: tour.title,
            category: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            description: tour.description,
            img: tour.thumbnailUrl
        },
    })

    const onSubmit = async (data: TourInfoFormType) => {
        setIsSubmitting(true)
        try {
            const updateData: UpdateTourInfoRequest = {
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

