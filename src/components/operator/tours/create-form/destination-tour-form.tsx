"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, PlusCircle, Upload, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type CreateTourBodyType,
  DestinationSchema,
  type TourCreateDestinationType,
  type destinationActivities,
} from "@/schemaValidations/tour-operator.shema"
import destinationApiRequest from "@/apiRequests/destination"
import { toast } from "sonner"
import type { z } from "zod"
import Image from "next/image"

// Types
interface DestinationFormProps {
  data: Partial<CreateTourBodyType>
  updateData: (data: Partial<CreateTourBodyType>) => void
  onNext: () => void
  onPrevious: () => void
  addDestinationImageFile: (index: number, file: File) => void
}

interface Destination {
  id: string
  name: string
}

interface DestinationWithFile extends TourCreateDestinationType {
  imageFile?: File
  imagePreview?: string
}

// Activity Form Component
const ActivityForm = ({
  destinationIndex,
  activities,
  setActivities,
}: {
  destinationIndex: number
  activities: z.infer<typeof destinationActivities>[]
  setActivities: (index: number, activities: z.infer<typeof destinationActivities>[]) => void
}) => {
  const [activityName, setActivityName] = useState("")
  const [activityStartTime, setActivityStartTime] = useState("09:00:00")
  const [activityEndTime, setActivityEndTime] = useState("10:00:00")

  const formatTime = (time: string): string => {
    return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time
  }

  const addActivity = () => {
    if (!activityName.trim()) {
      toast.error("Activity name is required")
      return
    }

    const newActivity = {
      name: activityName,
      startTime: activityStartTime,
      endTime: activityEndTime,
      sortOrder: activities.length,
    }

    setActivities(destinationIndex, [...activities, newActivity])

    // Reset form
    setActivityName("")
    setActivityStartTime("09:00:00")
    setActivityEndTime("10:00:00")
  }

  const removeActivity = (index: number) => {
    const updatedActivities = [...activities]
    updatedActivities.splice(index, 1)

    // Update sort orders
    const reorderedActivities = updatedActivities.map((act, idx) => ({
      ...act,
      sortOrder: idx,
    }))

    setActivities(destinationIndex, reorderedActivities)
  }

  return (
    <div className="space-y-4 mt-4 p-4 border rounded-md">
      <h4 className="font-medium">Hoạt động</h4>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Tên hoạt động</label>
          <Input
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="Nhập tên hoạt động"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Thời gian bắt đầu</label>
            <Input
              type="time"
              step="1"
              value={activityStartTime.substring(0, 5)}
              onChange={(e) => setActivityStartTime(formatTime(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Thời gian kết thúc</label>
            <Input
              type="time"
              step="1"
              value={activityEndTime.substring(0, 5)}
              onChange={(e) => setActivityEndTime(formatTime(e.target.value))}
            />
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" className="w-full" onClick={addActivity}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm hoạt động
        </Button>
      </div>

      {activities.length > 0 && (
        <div className="space-y-2 mt-2">
          <h5 className="text-sm font-medium">Hoạt động đã thêm</h5>
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div>
                <p className="text-sm font-medium">{activity.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.startTime} - {activity.endTime}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeActivity(index)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Component
export function DestinationForm({
  data,
  updateData,
  onNext,
  onPrevious,
  addDestinationImageFile,
}: DestinationFormProps) {
  // State Management
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [destinationsWithFiles, setDestinationsWithFiles] = useState<DestinationWithFile[]>(
    (data.destinations || []).map((dest) => ({ ...dest }))
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [destinationActivitiesMap, setDestinationActivitiesMap] = useState<
    Map<number, z.infer<typeof destinationActivities>[]>
  >(new Map())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form setup
  const form = useForm<TourCreateDestinationType & { imageFile?: File }>({
    resolver: zodResolver(DestinationSchema),
    defaultValues: {
      destinationId: "",
      startTime: "",
      endTime: "",
      sortOrder: data.destinations?.length || 0,
      sortOrderByDate: data.destinations?.length || 0,
      img: "",
      destinationActivities: [],
    },
  })

  // Helper Functions
  const formatTime = (time: string): string => {
    return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time
  }

  const getDestinationName = (id: string) => {
    const destination = destinations.find((d) => d.id === id)
    return destination ? destination.name : "Unknown Destination"
  }

  // Helper function to determine the next sortOrder for a given sortOrderByDate
  const getNextSortOrderForDate = (sortOrderByDate: number): number => {
    // Filter destinations with the same sortOrderByDate
    const destinationsForDate = (data.destinations || []).filter(
      dest => dest.sortOrderByDate === sortOrderByDate
    );

    // Return the next available sortOrder (0 if none exist yet)
    return destinationsForDate.length;
  };

  // Data Fetching
  const fetchDestinations = async () => {
    try {
      const response = await destinationApiRequest.getAll()
      setDestinations(response.payload?.value || [])
    } catch (error) {
      console.error("Failed to fetch destinations:", error)
      toast.error("Failed to load destinations")
    }
  }

  // Initialize data
  // Initialize data
  useEffect(() => {
    fetchDestinations()

    // Initialize activities map from existing data
    if (data.destinations && data.destinations.length > 0) {
      const activitiesMap = new Map<number, z.infer<typeof destinationActivities>[]>()
      data.destinations.forEach((dest, index) => {
        activitiesMap.set(index, dest.destinationActivities || [])
      })
      setDestinationActivitiesMap(activitiesMap)
    }
  }, [data.destinations])

  // Event Handlers
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: { onChange: (value: string) => void }
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Selected image file:", file.name, file.size)

      // Create a preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // Store the file
      setSelectedImageFile(file)
      form.setValue("imageFile", file)

      // Set the img field for display
      field.onChange(previewUrl)
    }
  }

  const clearImage = (field: { onChange: (value: string) => void }) => {
    setImagePreview(null)
    setSelectedImageFile(null)
    form.setValue("imageFile", undefined)
    field.onChange("")
  }

  const setActivities = (destinationIndex: number, activities: z.infer<typeof destinationActivities>[]) => {
    console.log("Setting activities for destination", destinationIndex, activities);

    // Update the activities map
    const newMap = new Map(destinationActivitiesMap);
    newMap.set(destinationIndex, activities);
    setDestinationActivitiesMap(newMap);

    // If this is for an existing destination, update it in the data
    if (destinationIndex >= 0 && destinationIndex < (data.destinations?.length || 0)) {
      const updatedDestinations = [...(data.destinations || [])];
      updatedDestinations[destinationIndex] = {
        ...updatedDestinations[destinationIndex],
        destinationActivities: activities,
      };
      updateData({ destinations: updatedDestinations });
      console.log("Updated activities in main data for destination", destinationIndex);
    }
  };

  const editDestination = (index: number) => {
    console.log("Editing destination at index:", index);

    if (index >= 0 && index < destinationsWithFiles.length) {
      const destination = destinationsWithFiles[index];

      // Set form values to edit
      form.reset({
        destinationId: destination.destinationId,
        startTime: destination.startTime,
        endTime: destination.endTime,
        sortOrder: destination.sortOrder,
        sortOrderByDate: destination.sortOrderByDate,
        img: destination.img || "",
      });

      // Set editing state
      setEditingIndex(index);

      // Set preview image if exists
      if (destination.imagePreview || destination.img) {
        setImagePreview(destination.imagePreview || destination.img || null);
      }

      // Set selected file if exists
      if (destination.imageFile) {
        setSelectedImageFile(destination.imageFile);
        form.setValue("imageFile", destination.imageFile);
      }

      console.log("Editing destination:", destination);
      console.log("Activities for this destination:", destinationActivitiesMap.get(index));

      // Scroll to the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.error("Invalid destination index:", index);
      toast.error("Error editing destination");
    }
  };

  const addDestination = (values: TourCreateDestinationType & { imageFile?: File }) => {
    const imageFile = selectedImageFile || values.imageFile;

    // // Different validation logic for new vs. editing
    // if (editingIndex === null && !imageFile && !values.img) {
    //   // Only require image for new destinations
    //   form.setError("img", {
    //     type: "manual",
    //     message: "Please select an image or provide an image URL"
    //   });
    //   return;
    // }

    // For editing, use existing image if no new one is provided
    let imageUrl = values.img || "";
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    } else if (editingIndex !== null && destinationsWithFiles[editingIndex]) {
      // When editing, keep the existing image if no new one is provided
      imageUrl = destinationsWithFiles[editingIndex].img || "";
    }

    // Ensure sortOrder is appropriate for the sortOrderByDate
    const sortOrderByDate = values.sortOrderByDate;
    const sortOrder = values.sortOrder;

    // Get the existing activities for this destination
    let existingActivities: z.infer<typeof destinationActivities>[] = [];

    if (editingIndex !== null) {
      // When editing, preserve activities from the activities map
      existingActivities = destinationActivitiesMap.get(editingIndex) || [];
      console.log("Preserving activities for destination", editingIndex, existingActivities);
    }

    // Create the destination data object
    const destinationData: TourCreateDestinationType = {
      destinationId: values.destinationId,
      startTime: values.startTime,
      endTime: values.endTime,
      sortOrder: sortOrder,
      sortOrderByDate: sortOrderByDate,
      img: imageUrl,
      destinationActivities: existingActivities,
    };

    const destinationWithFile: DestinationWithFile = {
      ...destinationData,
      imageFile: imageFile,
      imagePreview: imageUrl,
    };

    // If we're editing an existing destination
    if (editingIndex !== null) {
      // Update destinationsWithFiles array
      const updatedDestinationsWithFiles = [...destinationsWithFiles];
      updatedDestinationsWithFiles[editingIndex] = destinationWithFile;
      setDestinationsWithFiles(updatedDestinationsWithFiles);

      // Update the main destinations data
      const updatedDestinations = [...(data.destinations || [])];
      updatedDestinations[editingIndex] = {
        ...destinationData,
        // Make sure activities are explicitly preserved here
        destinationActivities: existingActivities,
      };

      // Update parent data
      updateData({ destinations: updatedDestinations });

      // If the image file changed, update it in parent
      if (imageFile) {
        addDestinationImageFile(editingIndex, imageFile);
      }

      console.log("Updated destination at index", editingIndex, updatedDestinations[editingIndex]);
      toast.success("Destination updated successfully");
      setEditingIndex(null);
    } else {
      // Add new destination logic
      // ...existing code for adding new destination
      setDestinationsWithFiles([...destinationsWithFiles, destinationWithFile]);
      const updatedDestinations = [...(data.destinations || []), destinationData];
      updateData({ destinations: updatedDestinations });

      // Initialize empty activities for this destination
      const newActivitiesMap = new Map(destinationActivitiesMap);
      newActivitiesMap.set(updatedDestinations.length - 1, []);
      setDestinationActivitiesMap(newActivitiesMap);

      // If we have an image file, add it
      if (imageFile) {
        const destinationIndex = updatedDestinations.length - 1;
        addDestinationImageFile(destinationIndex, imageFile);
      }

      toast.success("Destination added successfully");
    }

    // Reset form with appropriate default values
    form.reset({
      destinationId: "",
      startTime: "",
      endTime: "",
      sortOrder: 0,
      sortOrderByDate: data.destinations?.length ? Math.max(...data.destinations.map(d => d.sortOrderByDate)) : 0,
      img: "",
      destinationActivities: [],
    });

    // Clear image state
    setImagePreview(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    form.reset({
      destinationId: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
      sortOrder: 0,
      sortOrderByDate: data.destinations?.length ? Math.max(...data.destinations.map(d => d.sortOrderByDate)) : 0,
      img: "",
      destinationActivities: [],
    });
    setImagePreview(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeDestination = (index: number) => {
    // Remove from both arrays
    const updatedDestinationsWithFiles = [...destinationsWithFiles]
    updatedDestinationsWithFiles.splice(index, 1)
    setDestinationsWithFiles(updatedDestinationsWithFiles)

    const updatedDestinations = [...(data.destinations || [])]
    updatedDestinations.splice(index, 1)

    // Update sort orders
    const reorderedDestinations = updatedDestinations.map((dest, idx) => ({
      ...dest,
      sortOrder: idx,
      sortOrderByDate: idx,
    }))

    // Rebuild activities map
    const newActivitiesMap = new Map<number, z.infer<typeof destinationActivities>[]>()
    reorderedDestinations.forEach((_, idx) => {
      const activities = destinationActivitiesMap.get(idx < index ? idx : idx + 1) || []
      newActivitiesMap.set(idx, activities)
    })
    setDestinationActivitiesMap(newActivitiesMap)

    updateData({ destinations: reorderedDestinations })
    toast.info("Destination removed")
  }

  const handleContinue = () => {
    if ((data.destinations || []).length === 0) {
      form.setError("destinationId", {
        type: "manual",
        message: "Add at least one destination before continuing",
      })
      return
    }

    // Update all destinations with their activities before continuing
    const updatedDestinations = (data.destinations || []).map((dest, index) => ({
      ...dest,
      destinationActivities: destinationActivitiesMap.get(index) || [],
    }))

    updateData({ destinations: updatedDestinations })
    onNext()
  }

  // Debug function
  // const debugImageState = () => {
  //   console.log("Selected image file state:", selectedImageFile?.name)
  //   console.log("Current image file in form:", form.getValues("imageFile"))
  //   console.log("Current img value in form:", form.getValues("img"))
  //   console.log("Image preview state:", imagePreview)
  // }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold">Điểm đến</h2>
        <p className="text-muted-foreground">Thêm điểm đến cho tour và các hoạt động của bạn.</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Add Destination Form */}
        <Card className="md:sticky md:top-4 h-fit">
          <CardHeader>
            <CardTitle>{editingIndex !== null ? 'Chỉn sửa điểm đến' : 'Thêm điểm đến'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addDestination)} className="space-y-4">
                {/* Destination Selection */}
                <FormField
                  control={form.control}
                  name="destinationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điểm đến</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Chọn địa điểm</option>
                          {destinations.map((destination) => (
                            <option key={destination.id} value={destination.id}>
                              {destination.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian đến</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            step="1"
                            {...field}
                            onChange={(e) => field.onChange(formatTime(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian rời đi</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            step="1"
                            {...field}
                            onChange={(e) => field.onChange(formatTime(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sort order inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sortOrderByDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              const newSortOrderByDate = Number.parseInt(e.target.value);
                              field.onChange(newSortOrderByDate);

                              // Automatically update sortOrder when sortOrderByDate changes
                              const nextSortOrder = getNextSortOrderForDate(newSortOrderByDate);
                              form.setValue("sortOrder", nextSortOrder);
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Điểm đến sẽ hiển thị theo lịch trình.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự điểm đến</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          Thứ tự của điểm đến.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image upload */}
                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh điểm đến (Không bắt buộc)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {/* Preview area */}
                          {imagePreview && (
                            <div className="relative w-full h-40 overflow-hidden rounded-md">
                              <Image
                                src={imagePreview}
                                alt="Destination image preview"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: "cover" }}
                                priority
                                unoptimized={imagePreview.startsWith('blob:')}
                              />
                            </div>
                          )}

                          {/* File input */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, field)}
                                className="flex-1"
                              />
                              {imagePreview && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => clearImage(field)}
                                >
                                  Xóa ảnh
                                </Button>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Hãy chọn ảnh cho điểm đến (nếu có).
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <div className={editingIndex !== null ? "grid grid-cols-2 gap-2" : ""}>
                  <Button type="submit" className="w-full">
                    {editingIndex !== null ? (
                      <>
                        Lưu chỉnh sửa
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm điểm đến
                      </>
                    )}
                  </Button>

                  {editingIndex !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={cancelEdit}
                    >
                      Trở lại, dừng chỉnh sửa.
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right column - Added Destinations */}
        <div className="space-y-4 h-full flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách điểm đến đã thêm.</CardTitle>
              </div>
              <div>
                <p className="text-sm">
                  {destinationsWithFiles.length} điểm đến đã thêm
                </p>
              </div>
              {destinationsWithFiles.length === 0 && (
                <p className="text-sm text-muted-foreground">Không có điểm đến nào được thêm. Hãy thêm điểm đến cho tour.</p>
              )}
            </CardHeader>
            {destinationsWithFiles.length > 0 && (
              <CardContent className="flex-1 overflow-auto max-h-[70vh]">
                <div className="space-y-6 pr-2">
                  {/* Group destinations by sortOrderByDate */}
                  {Array.from(new Set(destinationsWithFiles.map(d => d.sortOrderByDate)))
                    .sort((a, b) => a - b)
                    .map(dateOrder => (
                      <div key={`day-${dateOrder}`} className="mb-6">
                        <h3 className="text-lg font-medium mb-3 bg-muted px-3 py-2 rounded-md">
                          Ngày {dateOrder + 1}
                        </h3>
                        <div className="space-y-4 pl-3">
                          {destinationsWithFiles
                            .filter(d => d.sortOrderByDate === dateOrder)
                            .map((destination, sortedIndex) => {
                              // Find the actual index in the original array
                              const originalIndex = destinationsWithFiles.findIndex(
                                d => d.destinationId === destination.destinationId &&
                                  d.sortOrder === destination.sortOrder &&
                                  d.sortOrderByDate === destination.sortOrderByDate
                              );

                              return (
                                <div key={originalIndex} className="p-4 border rounded-md">
                                  {/* Destination header */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                      {/* Destination image */}
                                      {destination.imagePreview || destination.img ? (
                                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative">
                                          <Image
                                            src={destination.imagePreview || destination.img || "/placeholder.svg"}
                                            alt={getDestinationName(destination.destinationId)}
                                            fill
                                            sizes="48px"
                                            style={{ objectFit: "cover" }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                                          <Upload className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      )}

                                      {/* Destination info */}
                                      <div>
                                        <p className="font-medium">{getDestinationName(destination.destinationId)}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {destination.startTime} - {destination.endTime}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          Thứ tự: {destination.sortOrder + 1}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Action buttons remain the same */}
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => editDestination(originalIndex)}
                                      >
                                        <Pencil />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeDestination(originalIndex)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Activities section remains the same */}
                                  <ActivityForm
                                    destinationIndex={originalIndex}
                                    activities={destinationActivitiesMap.get(originalIndex) || []}
                                    setActivities={setActivities}
                                  />
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Trước: Thông tin tour
        </Button>
        <Button onClick={handleContinue}>Tiếp theo: Vé</Button>
      </div>
    </div>
  )
}

