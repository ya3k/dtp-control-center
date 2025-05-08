'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { DestinationSchema, POSTTourDestinationType, PUTTourDestinationsType, TourDestinationResType } from '@/schemaValidations/crud-tour.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, FileImage, ChevronRight, AlertCircle, Loader2, RefreshCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';
import destinationApiRequest from '@/apiRequests/destination';
import tourApiService from '@/apiRequests/tour';
import { toast } from 'sonner';
import Image from 'next/image';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import DestinationSearch from '../destinations-search';
import { Destination } from '@/types/destination';

const MAX_IMAGES = 5;

interface EditTourDestinationFormProps {
  tourId: string;
  onSaveSuccess?: () => void;
  onCancel?: () => void;
}

export default function EditTourDestinationForm({ 
  tourId,
  onSaveSuccess,
  onCancel
}: EditTourDestinationFormProps) {
  // States
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [days, setDays] = useState<number[]>([1]);
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [expandedDestinations, setExpandedDestinations] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<{[index: number]: File[]}>({});
  const [previewUrls, setPreviewUrls] = useState<Record<number, string[]>>({});

  // Form setup
  const form = useForm<{ destinations: POSTTourDestinationType[] }>({
    resolver: zodResolver(
      z.object({
        destinations: z.array(DestinationSchema).min(1, "Phải có ít nhất một điểm đến")
      })
    ),
    defaultValues: {
      destinations: []
    }
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch available destinations for dropdown
      const destinationsResponse = await destinationApiRequest.getAll();
      if (!destinationsResponse.payload?.value) {
        throw new Error("No destinations data received");
      }
      setDestinations(destinationsResponse.payload.value);
      
      // Fetch tour destinations
      const tourDestinationsResponse = await tourApiService.getTourDestination(tourId);
      
      // Debug log - Full tour destinations response
      console.log("DEBUG - FULL RESPONSE DATA:", JSON.stringify(tourDestinationsResponse));
      
      if (!tourDestinationsResponse.payload.data) {
        throw new Error("No tour destinations data received");
      }

      // Debug log - Initial destinations data
      console.log("DEBUG - Initial destinations data:", JSON.stringify(tourDestinationsResponse.payload.data.map((dest: TourDestinationResType) => ({
        destinationId: dest.destinationId,
        sortOrderByDate: dest.sortOrderByDate,
        sortOrder: dest.sortOrder
      }))));

      // Transform data for form
      const transformedDestinations = tourDestinationsResponse.payload.data.map((dest: TourDestinationResType) => ({
        destinationId: dest.destinationId,
        destinationActivities: dest.destinationActivities || [],
        startTime: dest.startTime,
        endTime: dest.endTime,
        sortOrder: dest.sortOrder,
        sortOrderByDate: dest.sortOrderByDate,
        img: dest.img || [],
      }));
      
      // Debug log - Transformed destinations
      console.log("DEBUG - Transformed destinations:", JSON.stringify(transformedDestinations.map((dest: POSTTourDestinationType) => ({
        destinationId: dest.destinationId,
        sortOrderByDate: dest.sortOrderByDate,
        sortOrder: dest.sortOrder
      }))));
      
      form.setValue('destinations', transformedDestinations);
      
      // Calculate days from destinations
      if (transformedDestinations.length > 0) {
        const maxDay = Math.max(...transformedDestinations.map((d: POSTTourDestinationType) => d.sortOrderByDate));
        // Debug log - Max day calculation
        console.log("DEBUG - Max day:", maxDay);
        
        setDays(Array.from({ length: maxDay }, (_, i) => i + 1));
        
        // Set all days as expanded by default
        setExpandedDays(Array.from({ length: maxDay }, (_, i) => `day-${i+1}`));
        
        // Set destinations as expanded by default
        const destKeys: string[] = [];
        transformedDestinations.forEach((dest: POSTTourDestinationType, idx: number) => {
          destKeys.push(`day-${dest.sortOrderByDate}-dest-${idx}`);
        });
        setExpandedDestinations(destKeys);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Không thể tải dữ liệu điểm đến");
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch destinations and tour data
  useEffect(() => {
    if (tourId) {
      fetchData();
    }
  }, [tourId, form]);

  // Toggle destination expansion
  const toggleDestination = (destId: string) => {
    setExpandedDestinations(prev => 
      prev.includes(destId) 
        ? prev.filter(id => id !== destId) 
        : [...prev, destId]
    );
  };

  const handleDestinationChange = (
    field: keyof POSTTourDestinationType,
    value: string | number | string[] | POSTTourDestinationType['destinationActivities'],
    destinationIndex: number
  ) => {
    const updatedDestinations = [...(form.getValues().destinations || [])];
    updatedDestinations[destinationIndex] = {
      ...updatedDestinations[destinationIndex],
      [field]: value,
    };
    form.setValue('destinations', updatedDestinations);
  };

  const addDestination = (dayNumber: number = days.length) => {
    // Find the highest sortOrder for this day
    const destinationsForThisDay = form.getValues().destinations?.filter(
      d => d.sortOrderByDate === dayNumber
    ) || [];
    
    const maxSortOrder = destinationsForThisDay.length > 0 
      ? Math.max(...destinationsForThisDay.map(d => d.sortOrder))
      : -1;
    
    const newDestination: POSTTourDestinationType = {
      destinationId: "",
      destinationActivities: [],
      startTime: "08:00:00",
      endTime: "17:00:00",
      sortOrder: maxSortOrder + 1, // Next order within the day
      sortOrderByDate: dayNumber, // Which day this belongs to (1-based)
      img: [],
    };

    // Debug log - New destination
    console.log("DEBUG - Adding new destination:", JSON.stringify({
      dayNumber,
      destinationsInDay: destinationsForThisDay.length,
      newDestination: {
        sortOrderByDate: newDestination.sortOrderByDate,
        sortOrder: newDestination.sortOrder
      }
    }));

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

  const addDay = () => {
    const newDayNumber = days.length + 1;
    
    // Debug log - Adding new day
    console.log("DEBUG - Adding new day:", JSON.stringify({
      currentDays: days,
      newDayNumber
    }));
    
    setDays([...days, newDayNumber]);
    // Automatically add a first destination for this day
    addDestination(newDayNumber);
    // Auto-expand the new day
    setExpandedDays([...expandedDays, `day-${newDayNumber}`]);
  };

  const removeDestination = (idx: number) => {
    setError("");
    const currentDestinations = form.getValues().destinations || [];
    const newDestinations = currentDestinations.filter((_, index) => index !== idx);
    form.setValue('destinations', newDestinations);
  };

  const addActivity = (destinationIndex: number) => {
    const destinations = form.getValues().destinations || [];
    const currentActivities = destinations[destinationIndex].destinationActivities || [];
    
    const newActivity = {
      name: "",
      startTime: "",
      endTime: "",
      sortOrder: currentActivities.length,
    };

    const updatedDestinations = [...destinations];
    updatedDestinations[destinationIndex] = {
      ...updatedDestinations[destinationIndex],
      destinationActivities: [...currentActivities, newActivity],
    };

    form.setValue('destinations', updatedDestinations);
  };

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

  const handleFileChange = (destinationIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      // Get current images for this destination
      const destination = form.getValues().destinations[destinationIndex];
      const existingImages = destination.img || [];
      const currentPendingImages = pendingImages[destinationIndex] || [];
      
      // Check if adding these files would exceed the limit
      const totalImagesAfterAdd = existingImages.length + currentPendingImages.length + files.length;
      
      if (totalImagesAfterAdd > MAX_IMAGES) {
        toast.error(`Không thể tải lên hơn ${MAX_IMAGES} hình ảnh cho mỗi điểm đến. Hiện tại: ${existingImages.length + currentPendingImages.length} / ${MAX_IMAGES}`);
        // Reset the input field
        event.target.value = '';
        return;
      }
      
      // Update pending images
      setPendingImages(prev => ({
        ...prev,
        [destinationIndex]: [...(prev[destinationIndex] || []), ...files]
      }));
      
      // Update preview URLs
      const newUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => ({
        ...prev,
        [destinationIndex]: [...(prev[destinationIndex] || []), ...newUrls]
      }));
    }
  };

  const removePendingImage = (destinationIndex: number, imageIndex: number) => {
    // Remove from pending images
    setPendingImages(prev => {
      const newPendingImages = { ...prev };
      if (newPendingImages[destinationIndex]) {
        newPendingImages[destinationIndex] = newPendingImages[destinationIndex].filter((_, idx) => idx !== imageIndex);
        if (newPendingImages[destinationIndex].length === 0) {
          delete newPendingImages[destinationIndex];
        }
      }
      return newPendingImages;
    });

    // Remove preview URL
    setPreviewUrls(prev => {
      const newPreviewUrls = { ...prev };
      if (newPreviewUrls[destinationIndex]) {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(newPreviewUrls[destinationIndex][imageIndex]);
        newPreviewUrls[destinationIndex] = newPreviewUrls[destinationIndex].filter((_, idx) => idx !== imageIndex);
        if (newPreviewUrls[destinationIndex].length === 0) {
          delete newPreviewUrls[destinationIndex];
        }
      }
      return newPreviewUrls;
    });
  };

  const removeExistingImage = (destinationIndex: number, imageIndex: number) => {
    const destinations = form.getValues().destinations;
    const updatedDestination = { ...destinations[destinationIndex] };
    const updatedImages = [...(updatedDestination.img || [])];
    updatedImages.splice(imageIndex, 1);
    updatedDestination.img = updatedImages;
    
    const updatedDestinations = [...destinations];
    updatedDestinations[destinationIndex] = updatedDestination;
    form.setValue('destinations', updatedDestinations);
  };

  // Get destinations for a specific day
  const getDestinationsForDay = (day: number) => {
    const destinations = form.watch('destinations')?.filter(
      destination => destination.sortOrderByDate === day
    ) || [];
    
    // Debug log - only log occasionally to avoid too many logs
    if (destinations.length > 0 && Math.random() < 0.1) {
      console.log("DEBUG - getDestinationsForDay:", JSON.stringify({
        day,
        count: destinations.length,
        sample: destinations.map(d => ({
          destinationId: d.destinationId,
          sortOrderByDate: d.sortOrderByDate
        }))
      }));
    }
    
    return destinations;
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setError("");
      setIsSaving(true);
      
      // Validate form
      const data = form.getValues();
      try {
        z.object({
          destinations: z.array(DestinationSchema).min(1, "Phải có ít nhất một điểm đến")
        }).parse(data);
      } catch (err: unknown) {
        const error = err as z.ZodError;
        setError(error.errors?.[0]?.message || "Vui lòng điền đầy đủ thông tin điểm đến.");
        setIsSaving(false);
        return;
      }

      // Debug log - Before sorting
      console.log("DEBUG - Before sorting:", JSON.stringify(data.destinations.map(d => ({
        destinationId: d.destinationId,
        sortOrderByDate: d.sortOrderByDate,
        sortOrder: d.sortOrder
      }))));
      
      // Sort destinations by day first, then by sortOrder within each day
      const sortedDestinations = [...data.destinations].sort((a, b) => {
        if (a.sortOrderByDate === b.sortOrderByDate) {
          return a.sortOrder - b.sortOrder;
        }
        return a.sortOrderByDate - b.sortOrderByDate;
      });
      
      // Debug log - After sorting
      console.log("DEBUG - After sorting:", JSON.stringify(sortedDestinations.map(d => ({
        destinationId: d.destinationId,
        sortOrderByDate: d.sortOrderByDate,
        sortOrder: d.sortOrder
      }))));

      // Prepare API request body
      const requestBody: PUTTourDestinationsType = {
        tourId: tourId,
        destinations: sortedDestinations.map(dest => ({
          destinationId: dest.destinationId,
          destinationActivities: dest.destinationActivities || [],
          startTime: dest.startTime,
          endTime: dest.endTime,
          sortOrder: dest.sortOrder,
          sortOrderByDate: dest.sortOrderByDate,
          img: dest.img || [],
        }))
      };
      
      // Debug log - Full request body
      console.log("DEBUG - FULL REQUEST BODY:", JSON.stringify(requestBody));
      
      // Call API to update destinations
      const response = await tourApiService.putTourDesitnation(tourId, requestBody);
      
      // Debug log - Full API response
      console.log("DEBUG - FULL API RESPONSE:", JSON.stringify(response));
      
      toast.success("Cập nhật điểm đến thành công");
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Failed to update tour destinations:", error);
      toast.error("Không thể cập nhật điểm đến");
    } finally {
      setIsSaving(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(urls => {
        urls.forEach(url => URL.revokeObjectURL(url));
      });
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Đang tải dữ liệu điểm đến...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Chỉnh sửa lịch trình tour</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchData}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Tải lại
                </Button>
                <Button
                  type="button"
                  variant="core"
                  onClick={addDay}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm ngày mới
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-4 text-sm font-medium text-destructive">
                *{error}
              </div>
            )}

            <ScrollArea className="h-[520px] pr-4">
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
                              variant="core"
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
                              d => d === destination
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
                                    {destination.destinationId && 
                                      <span className="text-sm text-muted-foreground">
                                        ({destinations.find(d => d.id === destination.destinationId)?.name || ''})
                                      </span>
                                    }
                                  </div>
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
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="p-4 space-y-4">
                                  <FormField
                                    control={form.control}
                                    name={`destinations.${destinationIndex}.destinationId`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Điểm đến <span className='text-red-600'>*</span></FormLabel>
                                        <DestinationSearch
                                          destinations={destinations}
                                          value={field.value}
                                          onChange={(value) => handleDestinationChange('destinationId', value, destinationIndex)}
                                          disabled={isLoading}
                                        />
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
                                          <FormLabel>Thời gian bắt đầu <span className='text-red-600'>*</span></FormLabel>
                                          <FormControl>
                                            <Input
                                              type="time"
                                              step="1"
                                              value={field.value.substring(0, 5)}
                                              onChange={(e) => handleDestinationChange(
                                                'startTime', 
                                                `${e.target.value}:00`, 
                                                destinationIndex
                                              )}
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
                                          <FormLabel>Thời gian kết thúc <span className='text-red-600'>*</span></FormLabel>
                                          <FormControl>
                                            <Input
                                              type="time"
                                              step="1"
                                              value={field.value.substring(0, 5)}
                                              onChange={(e) => handleDestinationChange(
                                                'endTime', 
                                                `${e.target.value}:00`, 
                                                destinationIndex
                                              )}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  {/* Image Upload Section */}
                                  <FormItem>
                                    <FormLabel>Hình ảnh điểm đến (tối đa {MAX_IMAGES} hình)</FormLabel>
                                    <FormControl>
                                      <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {destination.img?.map((imgUrl, imgIdx) => (
                                            <div key={`img-${imgIdx}`} className="relative w-24 h-24 rounded overflow-hidden">
                                              <Image 
                                                src={imgUrl} 
                                                alt={`Destination image ${imgIdx + 1}`} 
                                                width={96} 
                                                height={96} 
                                                className="object-cover" 
                                              />
                                              <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-0 right-0 w-6 h-6 p-0"
                                                onClick={() => removeExistingImage(destinationIndex, imgIdx)}
                                              >
                                                ×
                                              </Button>
                                            </div>
                                          ))}
                                          
                                          {pendingImages[destinationIndex]?.map((file, fileIdx) => (
                                            <div key={`pending-${fileIdx}`} className="relative w-24 h-24 rounded overflow-hidden">
                                              {previewUrls[destinationIndex]?.[fileIdx] ? (
                                                <Image
                                                  src={previewUrls[destinationIndex][fileIdx]}
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
                                                onClick={() => removePendingImage(destinationIndex, fileIdx)}
                                              >
                                                ×
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                          <label className={`cursor-pointer flex-1 ${
                                            ((destination.img?.length || 0) + (pendingImages[destinationIndex]?.length || 0) >= MAX_IMAGES) 
                                              ? 'opacity-50 cursor-not-allowed' 
                                              : ''
                                          }`}>
                                            <Input
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              className="hidden"
                                              onChange={(e) => handleFileChange(destinationIndex, e)}
                                              disabled={(destination.img?.length || 0) + (pendingImages[destinationIndex]?.length || 0) >= MAX_IMAGES}
                                            />
                                            <div className="flex items-center gap-2 p-2 border border-dashed rounded hover:bg-muted">
                                              <FileImage className="w-4 h-4" />
                                              <span>Thêm hình ảnh</span>
                                            </div>
                                          </label>
                                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                                            {(destination.img?.length || 0) + (pendingImages[destinationIndex]?.length || 0)}/{MAX_IMAGES}
                                          </div>
                                        </div>
                                        
                                        {((destination.img?.length || 0) + (pendingImages[destinationIndex]?.length || 0) > MAX_IMAGES) && (
                                          <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                              Số lượng hình ảnh vượt quá giới hạn cho phép (tối đa {MAX_IMAGES} hình)
                                            </AlertDescription>
                                          </Alert>
                                        )}
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>

                                  {/* Activities Section */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium">Hoạt động trong ngày</h4>
                                      <Button
                                        type="button"
                                        variant="core"
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
                                                    <FormLabel>Tên hoạt động <span className='text-red-600'>*</span></FormLabel>
                                                    <FormControl>
                                                      <Input {...field} placeholder='Nhập tên hoạt động' />
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
                                                      <FormLabel>Thời gian bắt đầu <span className='text-red-600'>*</span></FormLabel>
                                                      <FormControl>
                                                        <Input 
                                                          type="time" 
                                                          value={field.value.substring(0, 5)} 
                                                          onChange={(e) => {
                                                            const newTime = `${e.target.value}:00`;
                                                            const currentDestinations = [...form.getValues().destinations];
                                                            const currentActivities = [...currentDestinations[destinationIndex].destinationActivities];
                                                            currentActivities[activityIndex] = {
                                                              ...currentActivities[activityIndex],
                                                              startTime: newTime
                                                            };
                                                            currentDestinations[destinationIndex] = {
                                                              ...currentDestinations[destinationIndex],
                                                              destinationActivities: currentActivities
                                                            };
                                                            form.setValue('destinations', currentDestinations);
                                                          }}
                                                        />
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
                                                      <FormLabel>Thời gian kết thúc <span className='text-red-600'>*</span></FormLabel>
                                                      <FormControl>
                                                        <Input 
                                                          type="time" 
                                                          value={field.value.substring(0, 5)} 
                                                          onChange={(e) => {
                                                            const newTime = `${e.target.value}:00`;
                                                            const currentDestinations = [...form.getValues().destinations];
                                                            const currentActivities = [...currentDestinations[destinationIndex].destinationActivities];
                                                            currentActivities[activityIndex] = {
                                                              ...currentActivities[activityIndex],
                                                              endTime: newTime
                                                            };
                                                            currentDestinations[destinationIndex] = {
                                                              ...currentDestinations[destinationIndex],
                                                              destinationActivities: currentActivities
                                                            };
                                                            form.setValue('destinations', currentDestinations);
                                                          }}
                                                        />
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
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Hủy bỏ
            </Button>
          )}
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}