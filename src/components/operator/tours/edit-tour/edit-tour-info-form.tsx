"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, Loader2, X } from "lucide-react"
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { TiptapEditor } from "@/components/common/tiptap-editor"

interface TourInfoFormProps {
    tourId: string;
    onUpdateSuccess: () => void;
}

// Define the type for a category item
interface Category {
    categoryId?: string;
    id?: string;
    categoryName?: string;
    name?: string;
}

export function TourEditInfoForm({ tourId, onUpdateSuccess }: TourInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [tourData, setTourData] = useState<TourInfoResType | null>(null)
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
    const [tourImageFiles, setTourImageFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<PUTTourInfoBodyType>({
        resolver: zodResolver(tourInfoSchema),
        defaultValues: {
            tourId: tourId,
            title: "",
            category: "",
            description: "",
            about: "",
            include: "",
            pickinfor: "",
            img: []
        },
    });

    useEffect(() => {
        const fetchTourInfo = async () => {
            console.log(tourId)
            
            try {
                setIsLoading(true);
                const resTourInfo = await tourApiService.getTourInfo(tourId);
                const editableInfo = resTourInfo.payload.data;
                setTourData(editableInfo);
                
                // Initialize with the current image(s) if they exist
                if (editableInfo.img && Array.isArray(editableInfo.img) && editableInfo.img.length > 0) {
                    setPreviewImages(editableInfo.img);
                }

                form.reset({
                    tourId: tourId,
                    title: editableInfo.title || '',
                    category: editableInfo.category || '',
                    description: editableInfo.description || '',
                    about: editableInfo.about || '',
                    include: editableInfo.include || '',
                    pickinfor: editableInfo.pickinfor || '',
                    img: Array.isArray(editableInfo.img) ? editableInfo.img : []
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
                const transformedCategories = categoriesData.payload.value.map((item: Category) => ({
                    id: item.categoryId || item.id,
                    name: item.categoryName || item.name,
                }));
                setCategories(transformedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            const newPreviewImages = files.map(file => URL.createObjectURL(file));
            
            setTourImageFiles(files);
            setPreviewImages(newPreviewImages);
            setSelectedImageIndex(0); // Select the first image by default
        }
    };

    const removeSelectedImage = () => {
        if (tourImageFiles.length === 0) {
            // Remove only the selected image from existing images
            const newPreviews = [...previewImages];
            newPreviews.splice(selectedImageIndex, 1);
            setPreviewImages(newPreviews);
            
            // Update form value to match the new previews
            form.setValue("img", newPreviews);
            
            // Adjust selected index as needed
            if (selectedImageIndex >= newPreviews.length && newPreviews.length > 0) {
                setSelectedImageIndex(newPreviews.length - 1);
            } else if (newPreviews.length === 0) {
                setSelectedImageIndex(-1);
            }
            return;
        }
        
        // ...existing code for handling newly uploaded files...
        const newFiles = tourImageFiles.filter((_, i) => i !== selectedImageIndex);
        const newPreviews = previewImages.filter((_, i) => i !== selectedImageIndex);
        
        setTourImageFiles(newFiles);
        setPreviewImages(newPreviews);
        
        // Adjust selected index to avoid out of bounds
        if (selectedImageIndex >= newPreviews.length && newPreviews.length > 0) {
            setSelectedImageIndex(newPreviews.length - 1);
        } else if (newPreviews.length === 0) {
            setSelectedImageIndex(-1);
        }

        // Clear file input to allow selecting the same files again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (values: PUTTourInfoBodyType) => {
        try {
            setIsSubmitting(true);

            // Create a copy of the values for updating and ensure tourId is included
            const updatedFormData = {
                ...values,
                tourId: tourId
            };

            // Handle image upload if files are selected
            if (tourImageFiles.length > 0) {
                try {
                    setUploadProgress(0);
                    // Upload all selected images
                    const response = await uploadApiRequest.uploadTourImages(tourImageFiles);
                    
                    if (response.urls && response.urls.length > 0) {
                        // Use all uploaded images with the selected one first as the thumbnail
                        const allUrls = [...response.urls];
                        
                        if (selectedImageIndex > 0) {
                            // Move the selected image to the front of the array
                            const selectedUrl = allUrls.splice(selectedImageIndex, 1)[0];
                            allUrls.unshift(selectedUrl);
                        }
                        
                        updatedFormData.img = allUrls;
                        toast.success(`${response.urls.length} images uploaded successfully`);
                    } else {
                        throw new Error("No URLs returned from tour image upload");
                    }
                    setUploadProgress(100);
                } catch (error) {
                    console.error("Error uploading tour images:", error);
                    toast.error("Failed to upload tour images");
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
            setUploadProgress(0);
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
                    <Collapsible className="w-full space-y-2">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                                <h4 className="text-sm font-semibold">
                                    Điểm nổi bật <span className="text-red-600">*</span>
                                </h4>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Nhập điểm nổi bật" className="min-h-32" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CollapsibleContent>
                    </Collapsible>
                    {/* about */}
                    <Collapsible className="w-full space-y-2">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                                <h4 className="text-sm font-semibold">
                                    Về dịch vụ này <span className="text-red-600">*</span>
                                </h4>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                            <FormField
                                control={form.control}
                                name="about"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Thông tin thêm về dịch vụ này..."
                                                className="min-h-[250px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* what's include */}
                    <Collapsible className="w-full space-y-2">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                                <h4 className="text-sm font-semibold">
                                    Bao gồm những gì <span className="text-red-600">*</span>
                                </h4>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                            <FormField
                                control={form.control}
                                name="include"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Những thứ kèm với tour..."
                                                className="min-h-[250px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    <Collapsible className="w-full space-y-2">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                                <h4 className="text-sm font-semibold">
                                    Thông tin đón và gặp gỡ khách <span className="text-red-600">*</span>
                                </h4>
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                            <FormField
                                control={form.control}
                                name="pickinfor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TiptapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Thông tin đón và gặp gỡ khách..."
                                                className="min-h-[250px]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Image */}
                    <FormField
                        control={form.control}
                        name="img"
                        render={({ field }) => (
                            <FormItem className="mx-2">
                                <FormLabel>Ảnh thumbnail</FormLabel>
                                <div className="space-y-4">
                                    {/* Image Preview Section */}
                                    {previewImages.length > 0 && (
                                        <>
                                            <div className="relative w-full max-w-[300px] h-[180px] overflow-hidden rounded-md border border-gray-200 mb-2 mx-auto">
                                                <Image
                                                    src={previewImages[selectedImageIndex] || "https://placehold.co/300x180?text=Select+Image"}
                                                    alt="Tour Image Preview"
                                                    fill
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://placehold.co/300x180?text=Invalid+Image";
                                                    }}
                                                />
                                                <Button 
                                                    type="button"
                                                    variant="destructive" 
                                                    size="icon" 
                                                    className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                                                    onClick={removeSelectedImage}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            
                                            {/* Image selection thumbnails */}
                                            {previewImages.length > 1 && (
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {previewImages.map((img, i) => (
                                                        <div 
                                                            key={i}
                                                            className={`relative w-16 h-16 cursor-pointer ${selectedImageIndex === i ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'}`}
                                                            onClick={() => setSelectedImageIndex(i)}
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt={`Thumbnail ${i+1}`}
                                                                fill
                                                                className="object-cover rounded-sm"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {previewImages.length > 1 && (
                                                <p className="text-center text-sm text-muted-foreground">
                                                    {`Image ${selectedImageIndex + 1} of ${previewImages.length} selected as thumbnail`}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {/* File Input for New Images */}
                                    <div className="flex flex-col space-y-2">
                                        <FormLabel className="text-sm font-normal">Chọn ảnh mới: </FormLabel>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                className="flex-1"
                                                disabled={isLoading || isSubmitting}
                                            />
                                            {tourImageFiles.length > 0 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setTourImageFiles([]);
                                                        // If there were original images, restore them
                                                        if (field.value && Array.isArray(field.value) && field.value.length > 0 && tourData?.img) {
                                                            setPreviewImages(tourData.img);
                                                            setSelectedImageIndex(0);
                                                        } else {
                                                            setPreviewImages([]);
                                                            setSelectedImageIndex(-1);
                                                        }
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
                                                disabled={isLoading || isSubmitting}
                                            />
                                        </FormControl>

                                        {/* Info text */}
                                        <p className="text-xs text-muted-foreground">
                                            {tourImageFiles.length > 0
                                                ? `${tourImageFiles.length} ảnh mới sẽ được lưu khi bạn nhấn nút cập nhật. Ảnh được chọn làm thumbnail.`
                                                : "Giữ ảnh cũ hoặc chọn một hoặc nhiều ảnh mới."}
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
                                    {uploadProgress > 0 && uploadProgress < 100 
                                        ? `Đang tải ảnh lên... ${uploadProgress}%` 
                                        : "Đang cập nhật..."}
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