'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { DestinationSchema, POSTTourDestinationType, POSTTourType } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { z } from 'zod';

// Mock data for destinations - Replace with actual API call
const MOCK_DESTINATIONS = [
  { id: "550e8400-e29b-41d4-a716-446655440000", name: "Phú Quốc" },
  { id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8", name: "Đà Lạt" },
  { id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9", name: "Nha Trang" },
];

export default function TourDestinationForm() {
  const { nextStep, prevStep, formData, setTourDestination } = useTourStore();
  const [error, setError] = useState<string>("");

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

  const addDestination = () => {
    const newDestination: POSTTourDestinationType = {
      destinationId: "",
      destinationActivities: [],
      startTime: "08:00:00",
      endTime: "17:00:00",
      sortOrder: form.getValues().destinations?.length || 0,
      sortOrderByDate: (form.getValues().destinations?.length || 0) + 1,
      img: [],
    };

    form.setValue('destinations', [...(form.getValues().destinations || []), newDestination]);
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

  const validateAndNext = () => {
    try {
      const data = form.getValues();
      z.object({
        destinations: z.array(DestinationSchema).min(1, "Phải có ít nhất một điểm đến")
      }).parse(data);
      setError("");
      const sortedDestinations = [...data.destinations].sort((a, b) => a.sortOrderByDate - b.sortOrderByDate);
      sortedDestinations.forEach((destination, index) => {
        destination.sortOrder = index;
      });
      
      // Update the formData in the store
      const updatedFormData: Partial<POSTTourType> = {
        destinations: sortedDestinations
      };
      useTourStore.setState((state) => ({
        formData: { ...state.formData, ...updatedFormData }
      }));
      console.log(formData)
      nextStep();
    } catch (err: unknown) {
      const error = err as z.ZodError;
      setError(error.errors?.[0]?.message || "Vui lòng điền đầy đủ thông tin điểm đến.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Điểm đến trong tour</h2>
              <Button
                type="button"
                variant="outline"
                onClick={addDestination}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm điểm đến
              </Button>
            </div>

            {error && (
              <div className="mb-4 text-sm font-medium text-destructive">
                *{error}
              </div>
            )}

            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {form.watch('destinations')?.map((destination, destinationIndex) => (
                  <Card key={destinationIndex}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium">Điểm đến {destinationIndex + 1}</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDestination(destinationIndex)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name={`destinations.${destinationIndex}.destinationId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Điểm đến</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={(value) => handleDestinationChange('destinationId', value, destinationIndex)}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn điểm đến" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MOCK_DESTINATIONS.map((dest) => (
                                    <SelectItem key={dest.id} value={dest.id}>
                                      {dest.name}
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
                          name={`destinations.${destinationIndex}.sortOrderByDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày thứ</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={1}
                                  {...field}
                                  onChange={(e) => handleDestinationChange('sortOrderByDate', parseInt(e.target.value), destinationIndex)}
                                />
                              </FormControl>
                              <FormDescription>
                                Thứ tự ngày trong tour
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                    </CardContent>
                  </Card>
                ))}
              </div>
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
