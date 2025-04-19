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
import { X, ImageIcon } from "lucide-react"
import { CategoryType } from "@/schemaValidations/category.schema"
import categoryApiRequest from "@/apiRequests/category"
import { toast } from "sonner"
import CategorySearch from "../categories-search"

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
  };

  function onSubmit(data: POSTBasicTourInfoType) {
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
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tour title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your tour&apos;s display title.
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
                  <FormLabel>Tour Images</FormLabel>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="cursor-pointer"
                        disabled={isSubmitting}
                      />
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                              <img
                                src={preview.url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {preview.isPending && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                                  Pending upload
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
                        <p className="text-sm text-gray-500">No images selected yet</p>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Images will be uploaded when you submit the final form. Supported formats: JPG, PNG, WebP. Maximum size: 5MB per image.
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tour description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isSubmitting}>
                Next Step
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}