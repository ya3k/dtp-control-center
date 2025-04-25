'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
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
import { Textarea } from "@/components/ui/textarea"
import useTourStore from '@/store/tourStore'
import { BasicTourInfoSchema, POSTBasicTourInfoType } from "@/schemaValidations/crud-tour.schema"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { X, ImageIcon, AlertCircle } from "lucide-react"
import { CategoryType } from "@/schemaValidations/category.schema"
import categoryApiRequest from "@/apiRequests/category"
import { toast } from "sonner"
import CategorySearch from "../categories-search"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { TiptapEditor } from "@/components/common/tiptap-editor"

// Maximum number of images allowed
const MAX_IMAGES = 5;

interface ImagePreview {
  file?: File;
  url: string;
  isPending: boolean;
}

export default function BasicTourInfoForm() {
  const { 
    nextStep, 
    formData, 
    pendingImages,
    setBasicTourInfo, 
    setPendingTourImages, 
    removePendingTourImage,
    isSubmitting 
  } = useTourStore();
  
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<POSTBasicTourInfoType>({
    resolver: zodResolver(BasicTourInfoSchema),
    defaultValues: {
      title: formData.title,
      img: formData.img || [],
      categoryid: formData.categoryid,
      description: formData.description,
    },
  });

  // Load categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoryApiRequest.get()
        const data = await response.payload.value
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast.error("Failed to load categories")
      }
    }
    fetchCategory()
  }, []);

  // Initialize previews from existing URLs and pending files
  useEffect(() => {
    // Clear all previews when both formData.img and pendingImages are empty
    // This ensures previews are cleared after form submission
    if (formData.img.length === 0 && pendingImages.tourImages.length === 0) {
      setImagePreviews([]);
      setImageError(null);
      return;
    }
    
    const existingImages = formData.img.map(url => ({ 
      url, 
      isPending: false 
    }));
    
    const pendingPreviews = pendingImages.tourImages.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isPending: true
    }));
    
    setImagePreviews([...existingImages, ...pendingPreviews]);
    
    // Check if total images exceeds the limit
    const totalImages = existingImages.length + pendingPreviews.length;
    if (totalImages > MAX_IMAGES) {
      setImageError(`Số lượng hình ảnh vượt quá giới hạn cho phép (tối đa ${MAX_IMAGES} hình)`);
    } else {
      setImageError(null);
    }
    
    // Clean up object URLs when component unmounts or when dependencies change
    return () => {
      pendingPreviews.forEach(preview => {
        if (preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [formData.img, pendingImages.tourImages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    const totalImagesAfterAdd = formData.img.length + pendingImages.tourImages.length + fileArray.length;
    
    if (totalImagesAfterAdd > MAX_IMAGES) {
      toast.error(`Không thể tải lên hơn ${MAX_IMAGES} hình ảnh. Hiện tại: ${formData.img.length + pendingImages.tourImages.length} / ${MAX_IMAGES}`);
      // Reset the input field
      e.target.value = '';
      return;
    }
    
    setPendingTourImages(fileArray);
    
    // Reset the input field so the same files can be uploaded again if needed
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const existingImagesCount = formData.img.length;
    
    if (index < existingImagesCount) {
      // It's an already uploaded image - remove from formData
      const newImgArray = [...formData.img];
      newImgArray.splice(index, 1);
      setBasicTourInfo({ img: newImgArray });
    } else {
      // It's a pending image
      removePendingTourImage(index - existingImagesCount);
    }
    
    // Clear any error message since we've removed an image
    setImageError(null);
  };

  function onSubmit(data: POSTBasicTourInfoType) {
    // Check if there are too many images
    if (imagePreviews.length > MAX_IMAGES) {
      setImageError(`Số lượng hình ảnh vượt quá giới hạn cho phép (tối đa ${MAX_IMAGES} hình)`);
      return;
    }
    
    // Make sure form data is updated with the latest values
    setBasicTourInfo(data);
    nextStep();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên tour</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên tour" {...field} />
                  </FormControl>
                  <FormDescription>
                    Đây là tên hiển thị của tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="img"
              render={() => (
                <FormItem>
                  <FormLabel>Hình ảnh tour (tối đa {MAX_IMAGES} hình)</FormLabel>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="cursor-pointer"
                        disabled={isSubmitting || imagePreviews.length >= MAX_IMAGES}
                      />
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {imagePreviews.length}/{MAX_IMAGES}
                      </div>
                    </div>

                    {imageError && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {imageError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border relative">
                              <Image
                                src={preview.url}
                                alt={`Xem trước ${index + 1}`}
                                className="object-cover"
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                unoptimized={preview.url.startsWith('blob:')}
                                priority={index === 0}
                              />
                              {preview.isPending && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 z-10">
                                  Đang chờ tải lên
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {imagePreviews.length === 0 && (
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500">Chưa có hình ảnh nào được chọn</p>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Hình ảnh sẽ được tải lên khi bạn gửi biểu mẫu. Định dạng hỗ trợ: JPG, PNG, WebP. Kích thước tối đa: 5MB mỗi hình.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* category */}
            <FormField
              control={form.control}
              name="categoryid"
              render={({ field }) => (
                <FormItem className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <FormLabel className="font-medium">Loại Tour <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <CategorySearch categories={categories} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm nổi bật</FormLabel>
                  <FormControl>
                    {/* <Textarea
                      placeholder="Nhập các điểm nổi bật của tour"
                      className="min-h-[120px]"
                      {...field}
                    /> */}
                    <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Điểm nổi bật của tour'
                          className="min-h-[200px] p-3 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                        />
                  </FormControl>
                  <FormDescription>
                    Cung cấp các điểm nổi bật của tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={isSubmitting || !!imageError || imagePreviews.length > MAX_IMAGES}
              >
                Bước tiếp theo
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}