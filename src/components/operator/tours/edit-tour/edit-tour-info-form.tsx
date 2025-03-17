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
import { TourInfoFormBodyType, TourInfoFormType, tourInfoSchema } from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"
import tourApiService from "@/apiRequests/tour"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import CategorySearch from "../categories-search"

interface TourInfoFormProps {
    tourId: string;
    onUpdateSuccess: () => void;
}

export function TourEditInfoForm({ tourId, onUpdateSuccess }: TourInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
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
            setIsLoading(true);
            try {
                // Get categories first
                const categoryResponse = await categoryApiRequest.get();
                const categoryData = categoryResponse.payload.value;

                if (!categoryData) throw new Error("Failed to fetch categories");
                setCategories(categoryData);

                // Then get tour data
                const tourResponse = await tourApiService.getTourInfo(tourId);
                const tourDetails = tourResponse.payload.data;

                if (!tourDetails) throw new Error("Failed to fetch tour");
                setTourData(tourDetails);

                // Set form values after both are loaded
                form.reset({
                    ...tourDetails,
                    category: tourDetails.category,
                });

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load tour information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [tourId]);

    // Ensure category updates when categories are available
    useEffect(() => {
        if (categories.length > 0 && tourData) {
            // Force a re-render of the form with the updated category
            form.setValue("category", tourData.category);

            // This line is important to trigger re-render
            form.trigger("category");
        }
    }, [categories, tourData, form]);
    const onSubmit = async (data: TourInfoFormBodyType) => {
        setIsSubmitting(true);
        try {
            const response = await tourApiService.updateTourInfo(tourId, data);
            if (!response.payload) throw new Error("Failed to update tour information");

            const updatedTour = response.payload.data;
            onUpdateSuccess();
            toast.success("Tour information updated successfully");
        } catch (error) {
            console.error("Error updating tour info:", error);
            toast.error("Failed to update tour!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input {...field} disabled={isLoading || isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category */}
                    {/* <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value || ""}
                                    disabled={isLoading || isSubmitting}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category">
                                                {field.value && categories.length > 0
                                                    ? (categories.find((cat) => cat.name === field.value)?.name)
                                                    : "Select a category"}
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
                    /> */}
                    {/* Category */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                                <FormLabel className="font-medium">Category</FormLabel>
                                <FormControl>
                                    <CategorySearch
                                        categories={categories}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={isLoading || isSubmitting}
                                    />
                                </FormControl>
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
                                <FormControl><Textarea {...field} className="min-h-[100px]" disabled={isLoading || isSubmitting} /></FormControl>
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
                                    <Input type="text" placeholder="Enter image URL" {...field} disabled={isLoading || isSubmitting} />
                                </FormControl>
                                <FormMessage />
                                {field.value && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Image Preview:</p>
                                        <div className="relative w-full max-w-[200px] h-[120px] mt-2 overflow-hidden rounded-md border border-gray-200">
                                            <Image
                                                src={field.value}
                                                alt="Tour Image"
                                                className="w-full h-full object-cover"
                                                width={100}
                                                height={100}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://placehold.co/200x120?text=Invalid+Image";
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit" disabled={isLoading || isSubmitting} className="w-full">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Update Tour Information"
                        )}
                    </Button>
                </form>
            </Form>
        </ScrollArea>
    );
};