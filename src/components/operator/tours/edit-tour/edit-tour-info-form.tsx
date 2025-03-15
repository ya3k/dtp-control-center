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
import { TourInfoFormBodyType, TourInfoFormType, tourInfoSchema, TourResType } from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"
import tourApiService from "@/apiRequests/tour"

interface TourInfoFormProps {
    tourId: string;
    onUpdateSuccess: (updatedTour: TourResType) => void;
}

export function TourEditInfoForm({ tourId, onUpdateSuccess }: TourInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [tourData, setTourData] = useState<TourInfoFormType | null>(null)

    const form = useForm<TourInfoFormBodyType>({
        resolver: zodResolver(tourInfoSchema),
        defaultValues: {
            tourId: tourId,
            title: "",
            category: "",
            description: "",
            img: ""
        },
    });

    // Fetch categories and tour data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingCategories(true)
            try {
                // Fetch both categories and tour data in parallel
                const [categoryResponse, tourResponse] = await Promise.all([
                    categoryApiRequest.get(),
                    tourApiService.getTourInfo(tourId),
                ]);

                const categoryData = categoryResponse.payload.value;
                const tourDetails = tourResponse.payload.data;

                if (!categoryData || !tourDetails) throw new Error("Failed to fetch data");

                setCategories(categoryData);
                setTourData(tourDetails);

                // Ensure the form resets only when categories are available
                form.reset({
                    ...tourDetails,
                    category: tourDetails.category, // Ensure category is set correctly
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load tour information");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchData();
    }, [tourId]);

    // Ensure category updates when categories are available
    useEffect(() => {
        if (categories.length > 0 && tourData) {
            form.setValue("category", tourData.category);
        }
    }, [categories, tourData]);

    const onSubmit = async (data: TourInfoFormBodyType) => {
        setIsSubmitting(true);
        try {
            const response = await tourApiService.updateTourInfo(tourId, data);
            if (!response.payload) throw new Error("Failed to update tour information");

            const updatedTour = response.payload.data;
            onUpdateSuccess(updatedTour);
            toast.success("Tour information updated successfully");
        } catch (error) {
            console.error("Error updating tour info:", error);
            toast.error("Failed to update tour!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Title */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Category */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""} disabled={isLoadingCategories}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category">
                                            {categories.find((cat) => cat.id === field.value)?.name ?? "Select a category"}
                                        </SelectValue>
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

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} className="min-h-[100px]" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Image */}
                <FormField
                    control={form.control}
                    name="img"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tour Image</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter image URL" {...field} />
                            </FormControl>
                            <FormMessage />
                            {field.value && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Current Image Preview:</p>
                                    <img src={field.value} alt="Tour Image" className="w-full max-w-md rounded-md mt-2 shadow-md" />
                                </div>
                            )}
                        </FormItem>
                    )}
                />

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting || isLoadingCategories} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Tour Information
                </Button>
            </form>
        </Form>
    );
};
