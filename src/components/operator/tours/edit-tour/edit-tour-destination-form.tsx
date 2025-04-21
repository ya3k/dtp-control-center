'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, FileImage, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import DestinationSearch from '../destinations-search'
import { Destination } from '@/types/destination'
import tourApiService from '@/apiRequests/tour'
import destinationApiRequest from '@/apiRequests/destination'
import { TourDestinationResType, destinationActivitySchema } from '@/schemaValidations/tour-operator.shema'
import uploadApiRequest from '@/apiRequests/upload'

const MAX_IMAGES = 5;

interface EditTourDestinationFormProps {
  tourId: string
  onSaveSuccess?: () => void
}

// Update the ModifiedTourDestinationType to match API format
type ModifiedTourDestinationType = Omit<TourDestinationResType, 'img'> & {
  img: string | string[]; // Support both string and array for UI flexibility
};

function EditTourDestinationForm({ tourId, onSaveSuccess }: EditTourDestinationFormProps) {
  // State variables
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [days, setDays] = useState<number[]>([1]);
  const [expandedDays, setExpandedDays] = useState<string[]>(["day-1"]);
  const [expandedDestinations, setExpandedDestinations] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<Record<string, File[]>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string[]>>({});

  // Update the form schema to match the API expectations
  const tourDestinationSchema = z.object({
    destinations: z.array(z.object({
      id: z.string().uuid(),
      destinationId: z.string().uuid(),
      destinationName: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      sortOrder: z.number(),
      sortOrderByDate: z.number(),
      img: z.union([z.string(), z.array(z.string())]), // Accept both formats
      destinationActivities: z.array(destinationActivitySchema)
    })).min(1, "Phải có ít nhất một điểm đến")
  });

  // Form setup with correctly typed state
  const form = useForm<{ destinations: ModifiedTourDestinationType[] }>({
    resolver: zodResolver(tourDestinationSchema),
    defaultValues: {
      destinations: []
    }
  });

  // Fetch tour destination data and available destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch available destinations
        const destinationsResponse = await destinationApiRequest.getAll();
        const destinationsData = await destinationsResponse.payload.value;
        setDestinations(destinationsData);
        
        // Fetch tour destinations
        const tourDestinationsResponse = await tourApiService.getTourDestination(tourId);
        const tourDestinationsData = tourDestinationsResponse.payload.data;
        
        // Convert the data to match our form type - keep img as is (string from API)
        const formattedData = tourDestinationsData.map((dest: TourDestinationResType) => ({
          ...dest,
          // img is kept as string from API but our form can handle either string or array
        }));
        
        // Set form data only once to prevent loops
        form.reset({ destinations: formattedData }, { keepDefaultValues: true });
        
        // Calculate days based on destination data
        if (tourDestinationsData.length > 0) {
          const maxDay = Math.max(...tourDestinationsData.map((d: TourDestinationResType) => d.sortOrderByDate));
          setDays(Array.from({ length: maxDay }, (_, i) => i + 1));
          
          // Set expanded states for days and destinations
          setExpandedDays(Array.from({ length: maxDay }, (_, i) => `day-${i + 1}`));
          
          // Create expanded destinations keys
          const destKeys: string[] = [];
          tourDestinationsData.forEach((dest: TourDestinationResType) => {
            const dayDestinations = tourDestinationsData.filter((d: TourDestinationResType) => d.sortOrderByDate === dest.sortOrderByDate);
            const destIndex = dayDestinations.findIndex((d: TourDestinationResType) => d.id === dest.id);
            if (destIndex !== -1) {
              destKeys.push(`day-${dest.sortOrderByDate}-dest-${destIndex}`);
            }
          });
          setExpandedDestinations(destKeys);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải dữ liệu tour. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [tourId]); // Remove form from the dependency array to prevent infinite loops

  // Toggle destination expansion
  const toggleDestination = (destId: string) => {
    setExpandedDestinations(prev => 
      prev.includes(destId) 
        ? prev.filter(id => id !== destId) 
        : [...prev, destId]
    );
  };

  // Get destinations for a specific day
  const getDestinationsForDay = (day: number) => {
    return form.watch('destinations')?.filter(
      destination => destination.sortOrderByDate === day
    ) || [];
  };

  // Fix the handleDestinationChange function typing
  const handleDestinationChange = (
    field: keyof ModifiedTourDestinationType,
    value: unknown,
    destinationIndex: number
  ) => {
    // Type check and cast based on the field
    if (field === 'destinationActivities') {
      // For destination activities array
      form.setValue(`destinations.${destinationIndex}.${field}`, 
        value as { name: string; startTime: string; endTime: string; sortOrder: number }[], 
        { shouldDirty: true, shouldTouch: true }
      );
    } else if (field === 'img') {
      // For img field - could be string or string[]
      form.setValue(`destinations.${destinationIndex}.${field}`, 
        value as string | string[], 
        { shouldDirty: true, shouldTouch: true }
      );
    } else if (field === 'sortOrder' || field === 'sortOrderByDate') {
      // For number fields
      form.setValue(`destinations.${destinationIndex}.${field}`, 
        value as number, 
        { shouldDirty: true, shouldTouch: true }
      );
    } else {
      // For string fields
      form.setValue(`destinations.${destinationIndex}.${field}`, 
        value as string, 
        { shouldDirty: true, shouldTouch: true }
      );
    }
    
    // If destinationId is changed, update destinationName separately
    if (field === 'destinationId') {
      const selectedDestination = destinations.find(d => d.id === value);
      if (selectedDestination) {
        form.setValue(`destinations.${destinationIndex}.destinationName`, selectedDestination.name, {
          shouldDirty: true,
          shouldTouch: true
        });
      }
    }
  };

  // Add a new destination to a specific day
  const addDestination = (dayNumber: number) => {
    // Find the highest sortOrder for this day
    const destinationsForThisDay = form.getValues().destinations?.filter(
      d => d.sortOrderByDate === dayNumber
    ) || [];
    
    const maxSortOrder = destinationsForThisDay.length > 0 
      ? Math.max(...destinationsForThisDay.map(d => d.sortOrder))
      : -1;
    
    const newDestination: ModifiedTourDestinationType = {
      id: crypto.randomUUID(),
      destinationId: "",
      destinationName: "",
      destinationActivities: [],
      startTime: "08:00:00",
      endTime: "17:00:00",
      sortOrder: maxSortOrder + 1,
      sortOrderByDate: dayNumber,
      img: "", // Initialize with empty string as per API schema
    };

    const updatedDestinations = [...(form.getValues().destinations || []), newDestination];
    form.setValue('destinations', updatedDestinations);
    
    // Auto-expand the day when adding a new destination
    if (!expandedDays.includes(`day-${dayNumber}`)) {
      setExpandedDays([...expandedDays, `day-${dayNumber}`]);
    }
    
    // Auto-expand the new destination
    const newDestinationKey = `day-${dayNumber}-dest-${destinationsForThisDay.length}`;
    if (!expandedDestinations.includes(newDestinationKey)) {
      setExpandedDestinations([...expandedDestinations, newDestinationKey]);
    }
  };

  // Add a new day to the tour
  const addDay = () => {
    const newDayNumber = days.length + 1;
    setDays([...days, newDayNumber]);
    // Automatically add a first destination for this day
    addDestination(newDayNumber);
    // Auto-expand the new day
    setExpandedDays([...expandedDays, `day-${newDayNumber}`]);
  };

  // Remove a destination
  const removeDestination = (idx: number) => {
    setError("");
    const currentDestinations = form.getValues().destinations || [];
    const newDestinations = currentDestinations.filter((_, index) => index !== idx);
    form.setValue('destinations', newDestinations);
  };

  // Add an activity to a destination
  const addActivity = (destinationIndex: number) => {
    const destinations = form.getValues().destinations || [];
    const currentActivities = destinations[destinationIndex].destinationActivities || [];
    
    const newActivity = {
      name: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
      sortOrder: currentActivities.length,
    };

    const updatedDestinations = [...destinations];
    updatedDestinations[destinationIndex] = {
      ...updatedDestinations[destinationIndex],
      destinationActivities: [...currentActivities, newActivity],
    };

    form.setValue('destinations', updatedDestinations);
  };

  // Remove an activity from a destination
  const removeActivity = (destinationIndex: number, activityIndex: number) => {
    const destinations = form.getValues().destinations || [];
    const currentActivities = [...(destinations[destinationIndex].destinationActivities || [])];
    currentActivities.splice(activityIndex, 1);

    const updatedDestinations = [...destinations];
    updatedDestinations[destinationIndex] = {
      ...updatedDestinations[destinationIndex],
      destinationActivities: currentActivities,
    };

    form.setValue('destinations', updatedDestinations);
  };

  // Handle file selection for destination images
  const handleFileChange = (destinationId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      // Check file sizes and types
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!validTypes.includes(file.type)) {
          toast.error(`File ${file.name} không đúng định dạng. Chỉ chấp nhận JPG, PNG và WebP.`);
          return false;
        }
        
        if (file.size > maxSize) {
          toast.error(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length === 0) {
        event.target.value = '';
        return;
      }
      
      // Check if adding these files would exceed the limit
      const currentPendingImages = pendingImages[destinationId] || [];
      
      if (currentPendingImages.length + validFiles.length > 1) {
        toast.error("Chỉ được phép tải lên 1 hình ảnh cho mỗi điểm đến theo yêu cầu API.");
        event.target.value = '';
        return;
      }
      
      // Add new files to pending images
      setPendingImages(prev => {
        // For API compatibility, we'll only keep the latest file
        const updatedFiles = [...validFiles];
        return {
          ...prev,
          [destinationId]: updatedFiles
        };
      });
      
      // Generate preview URLs
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({
        ...prev,
        [destinationId]: newPreviews
      }));
    }
    
    // Reset the input field to allow selecting the same file again
    event.target.value = '';
  };

  // Remove a pending image
  const removePendingImage = (destinationId: string, imageIndex: number) => {
    setPendingImages(prev => {
      const destinationImages = [...(prev[destinationId] || [])];
      destinationImages.splice(imageIndex, 1);
      return {
        ...prev,
        [destinationId]: destinationImages
      };
    });
  };

  // Update preview URLs when pending images change
  useEffect(() => {
    const newPreviewUrls: Record<string, string[]> = {};
    
    // First, clean up existing preview URLs to avoid memory leaks
    Object.values(previewUrls).forEach(urls => {
      urls.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore errors on cleanup
        }
      });
    });
    
    // Create new preview URLs for current pending images
    Object.entries(pendingImages).forEach(([destId, files]) => {
      if (files && files.length > 0) {
        newPreviewUrls[destId] = files.map(file => URL.createObjectURL(file));
      }
    });

    // Set the new URLs without merging with previous state
    setPreviewUrls(newPreviewUrls);

    // Cleanup on unmount
    return () => {
      Object.values(newPreviewUrls).forEach(urls => {
        urls.forEach(url => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // Ignore errors on cleanup
          }
        });
      });
    };
  }, [pendingImages]);

  // Move destination up in the order within a day
  const moveDestinationUp = (destinationIndex: number) => {
    const destinations = [...form.getValues().destinations];
    const destination = destinations[destinationIndex];
    const day = destination.sortOrderByDate;
    
    // Find the destination with the previous sort order
    const previousDestIndex = destinations.findIndex(
      d => d.sortOrderByDate === day && d.sortOrder === destination.sortOrder - 1
    );
    
    if (previousDestIndex !== -1) {
      // Swap the sort orders
      destinations[destinationIndex].sortOrder--;
      destinations[previousDestIndex].sortOrder++;
      
      form.setValue('destinations', destinations);
    }
  };

  // Move destination down in the order within a day
  const moveDestinationDown = (destinationIndex: number) => {
    const destinations = [...form.getValues().destinations];
    const destination = destinations[destinationIndex];
    const day = destination.sortOrderByDate;
    
    // Find the destination with the next sort order
    const nextDestIndex = destinations.findIndex(
      d => d.sortOrderByDate === day && d.sortOrder === destination.sortOrder + 1
    );
    
    if (nextDestIndex !== -1) {
      // Swap the sort orders
      destinations[destinationIndex].sortOrder++;
      destinations[nextDestIndex].sortOrder--;
      
      form.setValue('destinations', destinations);
    }
  };

  // Update the onSubmit function to properly format the data for API
  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      
      // Validate the form data
      const formData = form.getValues();
      const validationResult = tourDestinationSchema.safeParse(formData);
      
      if (!validationResult.success) {
        setError(validationResult.error.errors[0]?.message || "Dữ liệu không hợp lệ.");
        return;
      }
      
      // Sort destinations by day first, then by sortOrder within each day
      const sortedDestinations = [...formData.destinations].sort((a, b) => {
        if (a.sortOrderByDate === b.sortOrderByDate) {
          return a.sortOrder - b.sortOrder;
        }
        return a.sortOrderByDate - b.sortOrderByDate;
      });

      // Upload any pending images first
      for (const [destId, files] of Object.entries(pendingImages)) {
        if (files && files.length > 0) {
          try {
            // Find destination index
            const destIndex = sortedDestinations.findIndex(d => d.id === destId);
            if (destIndex !== -1) {
              // Upload the images
              const response = await uploadApiRequest.uploadDestinationImages(files);
              if (response.urls && response.urls.length > 0) {
                // Get current destination img
                const currentImg = sortedDestinations[destIndex].img;
                // Set the first uploaded image as the destination image
                // If currentImg is already a string and there are no other pending images, keep it
                sortedDestinations[destIndex].img = response.urls[0];
              }
            }
          } catch (error) {
            console.error(`Failed to upload images for destination ${destId}:`, error);
            toast.error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
          }
        }
      }
      
      // Create the API request body according to PUTTourDestinationSchema
      const requestBody = {
        tourId,
        destinations: sortedDestinations.map(destination => {
          // Ensure img is a string as required by the API
          let imgValue = '';
          if (typeof destination.img === 'string') {
            imgValue = destination.img;
          } else if (Array.isArray(destination.img) && destination.img.length > 0) {
            imgValue = destination.img[0]; // Use the first image from the array
          }
          
          return {
            destinationId: destination.destinationId,
            destinationActivities: destination.destinationActivities,
            startTime: destination.startTime,
            endTime: destination.endTime,
            sortOrder: destination.sortOrder,
            sortOrderByDate: destination.sortOrderByDate,
            img: imgValue // Use the single image string for API
          };
        })
      };
      
      // Call API to update with the correct structure
      await tourApiService.putTourDesitnation(tourId, requestBody);
      
      // Clear pending images since they're now saved
      setPendingImages({});
      
      // Notify success
      toast.success("Cập nhật thành công");
      
      // Call the onSaveSuccess callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Failed to save tour destinations:", error);
      toast.error("Lưu thay đổi thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      Object.values(previewUrls).forEach(urls => {
        urls.forEach(url => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            // Ignore errors during cleanup
          }
        });
      });
    };
  }, [previewUrls]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Chỉnh sửa lịch trình tour theo ngày</h2>
              <Button type="button" variant="outline" onClick={addDay}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngày mới
              </Button>
            </div>

            {error && <div className="mb-4 text-sm font-medium text-destructive">*{error}</div>}

            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[600px] pr-4">
                  <Accordion 
                    type="multiple" 
                    value={expandedDays} 
                    onValueChange={setExpandedDays}
                    className="space-y-4"
                  >
                    {days.map((day) => {
                      const dayKey = `day-${day}`;
                      const dayDestinations = getDestinationsForDay(day);
                      
                      return (
                        <AccordionItem 
                          key={dayKey} 
                          value={dayKey}
                          className="border border-border rounded-lg overflow-hidden bg-card"
                        >
                          <AccordionTrigger className="px-4 hover:no-underline">
                            <div className="flex justify-between items-center w-full">
                              <h3 className="text-base font-medium">Ngày {day}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {dayDestinations.length} điểm đến
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent accordion from toggling
                                    addDestination(day);
                                  }}
                                  className="ml-2"
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1" />
                                  Thêm điểm đến
                                </Button>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="space-y-4">
                              {dayDestinations.map((destination, idx) => {
                                // Find the actual index in the overall destinations array
                                const destinationIndex = form.getValues().destinations.findIndex(
                                  d => d.id === destination.id
                                );
                                const destKey = `day-${day}-dest-${idx}`;
                                const isExpanded = expandedDestinations.includes(destKey);
                                
                                return (
                                  <Collapsible
                                    key={destKey}
                                    open={isExpanded}
                                    onOpenChange={() => toggleDestination(destKey)}
                                    className="border rounded-lg overflow-hidden"
                                  >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-accent/30 transition-colors">
                                      <div className="flex items-center gap-2">
                                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                        <span className="text-base font-medium">Điểm đến {idx + 1}</span>
                                        {destination.destinationName && 
                                          <span className="text-sm text-muted-foreground">
                                            ({destination.destinationName})
                                          </span>
                                        }
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveDestinationUp(destinationIndex);
                                          }}
                                          disabled={idx === 0}
                                        >
                                          <ChevronUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            moveDestinationDown(destinationIndex);
                                          }}
                                          disabled={idx === dayDestinations.length - 1}
                                        >
                                          <ChevronDown className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeDestination(destinationIndex);
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                      </div>
                                    </CollapsibleTrigger>
                                    
                                    <CollapsibleContent className="p-4 space-y-4">
                                      <FormField
                                        control={form.control}
                                        name={`destinations.${destinationIndex}.destinationId`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Điểm đến</FormLabel>
                                            <FormControl>
                                              <DestinationSearch
                                                destinations={destinations}
                                                value={field.value}
                                                onChange={(value) => {
                                                  // Update form value directly, preventing unnecessary re-renders
                                                  field.onChange(value);
                                                  
                                                  // Only update destination name after selection
                                                  const selectedDestination = destinations.find(d => d.id === value);
                                                  if (selectedDestination) {
                                                    const updatedDestinations = [...form.getValues().destinations];
                                                    updatedDestinations[destinationIndex] = {
                                                      ...updatedDestinations[destinationIndex],
                                                      destinationName: selectedDestination.name
                                                    };
                                                    form.setValue('destinations', updatedDestinations, { shouldDirty: true });
                                                  }
                                                }}
                                                disabled={isLoading}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <div className="grid grid-cols-2 gap-6">
                                        <FormField
                                          control={form.control}
                                          name={`destinations.${destinationIndex}.startTime`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Thời gian bắt đầu</FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="time"
                                                  step="1"
                                                  {...field}
                                                  onChange={(e) => handleDestinationChange('startTime', e.target.value, destinationIndex)}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={form.control}
                                          name={`destinations.${destinationIndex}.endTime`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Thời gian kết thúc</FormLabel>
                                              <FormControl>
                                                <Input
                                                  type="time"
                                                  step="1"
                                                  {...field}
                                                  onChange={(e) => handleDestinationChange('endTime', e.target.value, destinationIndex)}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      {/* Image Upload Section */}
                                      <FormItem>
                                        <FormLabel>Hình ảnh điểm đến (1 hình)</FormLabel>
                                        <FormControl>
                                          <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap gap-2 mb-2">
                                              {/* Current image */}
                                              {destination.img && (
                                                <div className="relative w-24 h-24 rounded overflow-hidden">
                                                  <Image 
                                                    src={typeof destination.img === 'string' ? destination.img : Array.isArray(destination.img) && destination.img.length > 0 ? destination.img[0] : ''} 
                                                    alt={destination.destinationName || `Destination ${idx + 1}`} 
                                                    width={96} 
                                                    height={96} 
                                                    className="object-cover"
                                                  />
                                                  <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-0 right-0 w-6 h-6 p-0"
                                                    onClick={() => {
                                                      // Clear the image
                                                      form.setValue(`destinations.${destinationIndex}.img`, "", {
                                                        shouldDirty: true,
                                                        shouldTouch: true
                                                      });
                                                    }}
                                                  >
                                                    ×
                                                  </Button>
                                                </div>
                                              )}
                                              
                                              {/* Pending images */}
                                              {pendingImages[destination.id]?.map((file, fileIdx) => (
                                                <div key={`pending-${fileIdx}`} className="relative w-24 h-24 rounded overflow-hidden">
                                                  {previewUrls[destination.id]?.[fileIdx] ? (
                                                    <Image
                                                      src={previewUrls[destination.id][fileIdx]}
                                                      alt={`Preview ${fileIdx + 1}`}
                                                      width={96}
                                                      height={96}
                                                      className="object-cover"
                                                    />
                                                  ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted">
                                                      <div className="text-xs text-center p-1 truncate w-full">
                                                        {file.name}
                                                      </div>
                                                    </div>
                                                  )}
                                                  <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-0 right-0 w-6 h-6 p-0"
                                                    onClick={() => {
                                                      // Clear the preview URL
                                                      if (previewUrls[destination.id]?.[fileIdx]) {
                                                        URL.revokeObjectURL(previewUrls[destination.id][fileIdx]);
                                                      }
                                                      // Remove the pending image
                                                      const newPendingImages = { ...pendingImages };
                                                      newPendingImages[destination.id] = newPendingImages[destination.id].filter((_, i) => i !== fileIdx);
                                                      if (newPendingImages[destination.id].length === 0) {
                                                        delete newPendingImages[destination.id];
                                                      }
                                                      setPendingImages(newPendingImages);

                                                      // Remove the preview URL
                                                      const newPreviewUrls = { ...previewUrls };
                                                      if (newPreviewUrls[destination.id]) {
                                                        newPreviewUrls[destination.id] = newPreviewUrls[destination.id].filter((_, i) => i !== fileIdx);
                                                        if (newPreviewUrls[destination.id].length === 0) {
                                                          delete newPreviewUrls[destination.id];
                                                        }
                                                        setPreviewUrls(newPreviewUrls);
                                                      }
                                                    }}
                                                  >
                                                    ×
                                                  </Button>
                                                </div>
                                              ))}
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                              <label className={`cursor-pointer flex-1 ${
                                                (destination.img || (pendingImages[destination.id] && pendingImages[destination.id].length > 0)) 
                                                  ? 'opacity-50 cursor-not-allowed' 
                                                  : ''
                                              }`}>
                                                <Input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={(e) => handleFileChange(destination.id, e)}
                                                  disabled={!!(destination.img || (pendingImages[destination.id] && pendingImages[destination.id].length > 0))}
                                                />
                                                <div className="flex items-center gap-2 p-2 border border-dashed rounded hover:bg-muted">
                                                  <FileImage className="w-4 h-4" />
                                                  <span>{destination.img || (pendingImages[destination.id] && pendingImages[destination.id].length > 0) ? 'Đã có hình ảnh' : 'Thêm hình ảnh'}</span>
                                                </div>
                                              </label>
                                            </div>
                                            
                                            <p className="text-xs text-muted-foreground mt-1">
                                              Theo yêu cầu API, mỗi điểm đến chỉ được phép có 1 hình ảnh.
                                            </p>
                                          </div>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>

                                      {/* Activities Section */}
                                      <div className="space-y-4 mt-6">
                                        <div className="flex items-center justify-between">
                                          <h4 className="text-sm font-medium">Hoạt động trong ngày</h4>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addActivity(destinationIndex)}
                                          >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm hoạt động
                                          </Button>
                                        </div>

                                        <div className="space-y-4">
                                          {destination.destinationActivities?.map((activity, activityIndex) => (
                                            <Card key={activityIndex}>
                                              <CardContent className="pt-4">
                                                <div className="flex items-center justify-between mb-4">
                                                  <h5 className="text-sm font-medium">Hoạt động {activityIndex + 1}</h5>
                                                  <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeActivity(destinationIndex, activityIndex)}
                                                  >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                  </Button>
                                                </div>

                                                <div className="space-y-4">
                                                  <FormField
                                                    control={form.control}
                                                    name={`destinations.${destinationIndex}.destinationActivities.${activityIndex}.name`}
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormLabel>Tên hoạt động</FormLabel>
                                                        <FormControl>
                                                          <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                      </FormItem>
                                                    )}
                                                  />

                                                  <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                      control={form.control}
                                                      name={`destinations.${destinationIndex}.destinationActivities.${activityIndex}.startTime`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>Thời gian bắt đầu</FormLabel>
                                                          <FormControl>
                                                            <Input type="time" step="1" {...field} />
                                                          </FormControl>
                                                          <FormMessage />
                                                        </FormItem>
                                                      )}
                                                    />

                                                    <FormField
                                                      control={form.control}
                                                      name={`destinations.${destinationIndex}.destinationActivities.${activityIndex}.endTime`}
                                                      render={({ field }) => (
                                                        <FormItem>
                                                          <FormLabel>Thời gian kết thúc</FormLabel>
                                                          <FormControl>
                                                            <Input type="time" step="1" {...field} />
                                                          </FormControl>
                                                          <FormMessage />
                                                        </FormItem>
                                                      )}
                                                    />
                                                  </div>
                                                </div>
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                );
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>

                {/* Save button */}
                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    type="button" 
                    onClick={onSubmit} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default EditTourDestinationForm