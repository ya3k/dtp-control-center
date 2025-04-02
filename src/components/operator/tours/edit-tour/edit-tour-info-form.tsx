"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { PUTTourInfoBodyType, TourInfoResType, tourInfoSchema } from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"
import tourApiService from "@/apiRequests/tour"
import uploadApiRequest from "@/apiRequests/upload"
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
    const [tourData, setTourData] = useState<TourInfoResType | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [tourImageFile, setTourImageFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<PUTTourInfoBodyType>({
        resolver: zodResolver(tourInfoSchema),
        defaultValues: {
            tourId: tourId,
            title: "",
            category: "",
            description: "",
            img: ""
        },
    });

    useEffect(() => {
        const fetchTourInfo = async () => {
            try {
                setIsLoading(true);
                const resTourInfo = await tourApiService.getTourInfo(tourId);
                const editableInfo = resTourInfo.payload.data;
                setTourData(editableInfo);
                setPreviewImage(editableInfo.img || null);
                
                form.reset({
                    tourId: tourId,
                    title: editableInfo.title || '',
                    category: editableInfo.category || '',
                    description: editableInfo.description || '',
                    img: editableInfo.img || '',
                });
            } catch (error) {
                console.error("Failed to fetch tour info:", error);
                toast.error("Failed to load tour information.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTourInfo();
    }, [tourId, form]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await categoryApiRequest.get();
                const transformedCategories = categoriesData.payload.value.map(item => ({
                    id: item.categoryId || item.id,
                    name: item.categoryName || item.name
                }));
                setCategories(transformedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (values: PUTTourInfoBodyType) => {
        try {
            setIsSubmitting(true);
            
            // Create a copy of the values for updating and ensure tourId is included
            const updatedFormData = { 
                ...values,
                tourId: tourId
            };

            // Handle image upload if a file is selected
            if (tourImageFile) {
                try {
                    const response = await uploadApiRequest.uploadTourImage(tourImageFile);
                    if (response.urls && response.urls.length > 0) {
                        updatedFormData.img = response.urls[0];
                    } else {
                        throw new Error("No URL returned from tour image upload");
                    }
                } catch (error) {
                    console.error("Error uploading tour image:", error);
                    toast.error("Failed to upload tour image");
                    setIsSubmitting(false);
                    return;
                }
            }

            // Call API to update tour info with possibly new image URL
            const response = await tourApiService.updateTourInfo(tourId, updatedFormData);
            console.log(JSON.stringify(response))
            toast.success("Cập nhật tour thành công");
            onUpdateSuccess(); // Notify parent component
        } catch (error) {
            console.error("Failed to update tour:", error);
            toast.error("Failed to update tour information");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mx-4">
                    {/* Hidden tourId field */}
                    <FormField
                        control={form.control}
                        name="tourId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type="hidden" 
                                        {...field} 
                                        value={tourId}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="mx-2">
                                <FormLabel>Nội dung</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        disabled={isLoading || isSubmitting}
                                        className="mx-auto" 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="space-y-2 animate-slide-up mx-2" style={{ animationDelay: "100ms" }}>
                                <FormLabel className="font-medium">Loại tour</FormLabel>
                                <FormControl>
                                    <CategorySearch
                                        categories={categories || []}
                                        value={field.value || ""}
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
                            <FormItem className="mx-2">
                                <FormLabel>Điểm nổi bật</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        {...field} 
                                        className="min-h-[100px]" 
                                        disabled={isLoading || isSubmitting} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Image */}
                    <FormField
                        control={form.control}
                        name="img"
                        render={({ field }) => (
                            <FormItem className="mx-2">
                                <FormLabel>Ảnh thumbnail</FormLabel>
                                <div className="space-y-4">
                                    {/* Image Preview */}
                                    {(previewImage || field.value) && (
                                        <div className="relative w-full max-w-[300px] h-[180px] overflow-hidden rounded-md border border-gray-200 mb-4 mx-auto">
                                            <Image
                                                src={previewImage || field.value}
                                                alt="Tour Image Preview"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://placehold.co/300x180?text=Invalid+Image";
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* File Input for New Image */}
                                    <div className="flex flex-col space-y-2">
                                        <FormLabel className="text-sm font-normal">Chọn ảnh mới: </FormLabel>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setTourImageFile(file);
                                                        setPreviewImage(URL.createObjectURL(file));
                                                    }
                                                }}
                                                className="flex-1"
                                                disabled={isLoading || isSubmitting}
                                            />
                                            {tourImageFile && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setTourImageFile(null);
                                                        setPreviewImage(field.value);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = '';
                                                        }
                                                    }}
                                                    disabled={isLoading || isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                        
                                        {/* Hidden input for storing the image URL */}
                                        <FormControl>
                                            <Input 
                                                type="hidden" 
                                                {...field} 
                                                disabled={isLoading || isSubmitting}
                                            />
                                        </FormControl>
                                        
                                        {/* Info text */}
                                        <p className="text-xs text-muted-foreground">
                                            {tourImageFile 
                                                ? "Ảnh mới sẽ được lưu khi bạn nhấn nút cập nhật." 
                                                : "Giữ ảnh cũ hoặc chọn một ảnh mới."}
                                        </p>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="mx-2 pt-2">
                        <Button 
                            type="submit" 
                            disabled={isLoading || isSubmitting} 
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cập nhật...
                                </>
                            ) : (
                                "Cập nhật thông tin tour."
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </ScrollArea>
    )
}