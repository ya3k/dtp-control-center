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
import { DestinationSchema, POSTTourDestinationType, POSTTourType } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, FileImage, ChevronDown, ChevronUp, ChevronRight, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';
import destinationApiRequest from '@/apiRequests/destination';
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

const MAX_IMAGES = 5;

export default function TourDestinationForm() {
  const { nextStep, prevStep, formData, pendingImages, setPendingDestinationImages, removePendingDestinationImage, destinations, setDestinations } = useTourStore();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<number[]>([1]); // Default to at least one day
  const [expandedDays, setExpandedDays] = useState<string[]>(["day-1"]);
  const [expandedDestinations, setExpandedDestinations] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<Record<number, string[]>>({});

  const form = useForm<{ destinations: POSTTourDestinationType[] }>({
    resolver: zodResolver(
      z.object({
        destinations: z.array(DestinationSchema).min(1, "Phải có ít nhất một điểm đến")
      })
    ),
    defaultValues: {
      destinations: formData.destinations || []
    }
  });

  // Handle data fetching
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const response = await destinationApiRequest.getAll();
        const data = await response.payload.value;
        setDestinations(data);
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
        toast.error("Failed to load destinations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Calculate the maximum day in the tour based on selected destinations
  useEffect(() => {
    const currentDestinations = form.getValues().destinations || [];
    if (currentDestinations.length === 0) {
      setDays([1]);
      return;
    }
    
    const maxDay = Math.max(...currentDestinations.map(d => 
      typeof d.sortOrderByDate === 'number' ? d.sortOrderByDate : 1
    ));
    
    setDays(Array.from({ length: maxDay }, (_, i) => i + 1));
  }, [form.watch('destinations')]);

  // Initialize all destinations as expanded on first load
  useEffect(() => {
    const currentDestinations = form.getValues().destinations || [];
    if (currentDestinations.length > 0 && expandedDestinations.length === 0) {
      // Only set initial expanded state if we haven't done it before
      const destKeys = [];
      for (let day = 1; day <= days.length; day++) {
        const dayDestinations = currentDestinations.filter(d => d.sortOrderByDate === day);
        for (let idx = 0; idx < dayDestinations.length; idx++) {
          destKeys.push(`day-${day}-dest-${idx}`);
        }
      }
      setExpandedDestinations(destKeys);
    }
  }, [days.length, expandedDestinations.length]);  // Only run on mount and when days change

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
      sortOrderByDate: dayNumber, // Which day this belongs to
      img: [],
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

  const addDay = () => {
    const newDayNumber = days.length + 1;
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
      const pendingImages = useTourStore.getState().pendingImages.destinationImages[destinationIndex] || [];
      
      // Check if adding these files would exceed the limit
      const totalImagesAfterAdd = existingImages.length + pendingImages.length + files.length;
      
      if (totalImagesAfterAdd > MAX_IMAGES) {
        toast.error(`Không thể tải lên hơn ${MAX_IMAGES} hình ảnh cho mỗi điểm đến. Hiện tại: ${existingImages.length + pendingImages.length} / ${MAX_IMAGES}`);
        // Reset the input field
        event.target.value = '';
        return;
      }
      
      setPendingDestinationImages(destinationIndex, files);
    }
  };

  const validateAndNext = () => {
    try {
      const data = form.getValues();
      z.object({
        destinations: z.array(DestinationSchema).min(1, "Phải có ít nhất một điểm đến")
      }).parse(data);
      setError("");
      
      // Sort destinations by day first, then by sortOrder within each day
      const sortedDestinations = [...data.destinations].sort((a, b) => {
        if (a.sortOrderByDate === b.sortOrderByDate) {
          return a.sortOrder - b.sortOrder;
        }
        return a.sortOrderByDate - b.sortOrderByDate;
      });
      
      // Update the formData in the store
      const updatedFormData: Partial<POSTTourType> = {
        destinations: sortedDestinations
      };
      useTourStore.setState((state) => ({
        formData: { ...state.formData, ...updatedFormData }
      }));
      
      nextStep();
    } catch (err: unknown) {
      const error = err as z.ZodError;
      setError(error.errors?.[0]?.message || "Vui lòng điền đầy đủ thông tin điểm đến.");
    }
  };

  // Get destinations for a specific day
  const getDestinationsForDay = (day: number) => {
    return form.watch('destinations')?.filter(
      destination => destination.sortOrderByDate === day
    ) || [];
  };

  // Move destination up in the order within a day
  const moveDestinationUp = (destinationIndex: number) => {
    const destinations = [...form.getValues().destinations];
    const destination = destinations[destinationIndex];
    const day = destination.sortOrderByDate;
    
    // Find destinations for the same day
    const currentSortOrder = destination.sortOrder;
    
    if (currentSortOrder > 0) {
      // Find the destination with the previous sort order
      const previousDestIndex = destinations.findIndex(
        d => d.sortOrderByDate === day && d.sortOrder === currentSortOrder - 1
      );
      
      if (previousDestIndex !== -1) {
        // Swap the sort orders
        destinations[destinationIndex].sortOrder--;
        destinations[previousDestIndex].sortOrder++;
        
        form.setValue('destinations', destinations);
      }
    }
  };

  // Move destination down in the order within a day
  const moveDestinationDown = (destinationIndex: number) => {
    const destinations = [...form.getValues().destinations];
    const destination = destinations[destinationIndex];
    const day = destination.sortOrderByDate;
    
    // Find destinations for the same day
    const dayDestinations = getDestinationsForDay(day);
    const currentSortOrder = destination.sortOrder;
    
    if (currentSortOrder < dayDestinations.length - 1) {
      // Find the destination with the next sort order
      const nextDestIndex = destinations.findIndex(
        d => d.sortOrderByDate === day && d.sortOrder === currentSortOrder + 1
      );
      
      if (nextDestIndex !== -1) {
        // Swap the sort orders
        destinations[destinationIndex].sortOrder++;
        destinations[nextDestIndex].sortOrder--;
        
        form.setValue('destinations', destinations);
      }
    }
  };

  // Reset UI when pending images are cleared on submission
  useEffect(() => {
    // If all pending images are cleared (like after submission), update UI accordingly
    const hasPendingImages = Object.values(pendingImages.destinationImages).some(
      files => files && files.length > 0
    );
    
    if (!hasPendingImages) {
      // This forces a re-render of any destination cards with pending images
      form.setValue('destinations', [...form.getValues().destinations]);
    }
  }, [pendingImages.destinationImages, form]);

  // Add cleanup for preview URLs
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      Object.values(previewUrls).forEach(urls => {
        urls.forEach(url => URL.revokeObjectURL(url));
      });
    };
  }, [previewUrls]);

  // Update preview URLs when pending images change
  useEffect(() => {
    const newPreviewUrls: Record<number, string[]> = {};
    
    Object.entries(pendingImages.destinationImages).forEach(([index, files]) => {
      if (files && files.length > 0) {
        const destIndex = parseInt(index);
        // Cleanup old preview URLs for this destination
        if (previewUrls[destIndex]) {
          previewUrls[destIndex].forEach(url => URL.revokeObjectURL(url));
        }
        // Create new preview URLs
        newPreviewUrls[destIndex] = files.map(file => URL.createObjectURL(file));
      }
    });

    setPreviewUrls(prev => {
      // Cleanup any old URLs that are no longer needed
      Object.entries(prev).forEach(([index, urls]) => {
        const destIndex = parseInt(index);
        if (!newPreviewUrls[destIndex]) {
          urls.forEach(url => URL.revokeObjectURL(url));
        }
      });
      return newPreviewUrls;
    });
  }, [pendingImages.destinationImages]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Lịch trình tour theo ngày</h2>
              <Button
                type="button"
                variant="outline"
                onClick={addDay}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngày mới
              </Button>
            </div>

            {error && (
              <div className="mb-4 text-sm font-medium text-destructive">
                *{error}
              </div>
            )}

            <ScrollArea className="h-[700px] pr-4">
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
                                  <div className="flex gap-2">
                                    {/* <Button
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
                                    </Button> */}
                                    {/* <Button
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
                                    </Button> */}
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
                                          <FormLabel>Thời gian kết thúc <span className='text-red-600'>*</span></FormLabel>
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
                                                onClick={() => {
                                                  const newImgs = [...destination.img];
                                                  newImgs.splice(imgIdx, 1);
                                                  handleDestinationChange('img', newImgs, destinationIndex);
                                                }}
                                              >
                                                ×
                                              </Button>
                                            </div>
                                          ))}
                                          
                                          {pendingImages.destinationImages[destinationIndex]?.map((file, fileIdx) => (
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
                                                onClick={() => {
                                                  if (previewUrls[destinationIndex]?.[fileIdx]) {
                                                    URL.revokeObjectURL(previewUrls[destinationIndex][fileIdx]);
                                                  }
                                                  removePendingDestinationImage(destinationIndex, fileIdx);
                                                }}
                                              >
                                                ×
                                              </Button>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                          <label className={`cursor-pointer flex-1 ${
                                            ((destination.img?.length || 0) + (pendingImages.destinationImages[destinationIndex]?.length || 0) >= MAX_IMAGES) 
                                              ? 'opacity-50 cursor-not-allowed' 
                                              : ''
                                          }`}>
                                            <Input
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              className="hidden"
                                              onChange={(e) => handleFileChange(destinationIndex, e)}
                                              disabled={(destination.img?.length || 0) + (pendingImages.destinationImages[destinationIndex]?.length || 0) >= MAX_IMAGES}
                                            />
                                            <div className="flex items-center gap-2 p-2 border border-dashed rounded hover:bg-muted">
                                              <FileImage className="w-4 h-4" />
                                              <span>Thêm hình ảnh</span>
                                            </div>
                                          </label>
                                          <div className="text-sm text-muted-foreground whitespace-nowrap">
                                            {(destination.img?.length || 0) + (pendingImages.destinationImages[destinationIndex]?.length || 0)}/{MAX_IMAGES}
                                          </div>
                                        </div>
                                        
                                        {((destination.img?.length || 0) + (pendingImages.destinationImages[destinationIndex]?.length || 0) > MAX_IMAGES) && (
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
                                                      <FormLabel>Thời gian kết thúc <span className='text-red-600'>*</span></FormLabel>
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
          </CardContent>
        </Card>

        <div className="flex justify-between space-x-4">
          <Button type="button" variant="outline" onClick={prevStep}>
            Quay lại
          </Button>
          <Button type="button" onClick={validateAndNext}>
            Tiếp theo
          </Button>
        </div>
      </form>
    </Form>
  );
}