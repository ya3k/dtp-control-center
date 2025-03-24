"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, PlusCircle, Upload } from "lucide-react"

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
      <h4 className="font-medium">Destination Activities</h4>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Activity Name</label>
          <Input
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            placeholder="Enter activity name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Start Time</label>
            <Input
              type="time"
              step="1"
              value={activityStartTime.substring(0, 5)}
              onChange={(e) => setActivityStartTime(formatTime(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm font-medium">End Time</label>
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
          Add Activity
        </Button>
      </div>

      {activities.length > 0 && (
        <div className="space-y-2 mt-2">
          <h5 className="text-sm font-medium">Added Activities</h5>
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
  const [sortNewestFirst, setSortNewestFirst] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form setup
  const form = useForm<TourCreateDestinationType & { imageFile?: File }>({
    resolver: zodResolver(DestinationSchema),
    defaultValues: {
      destinationId: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
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
    // Update the activities map
    const newMap = new Map(destinationActivitiesMap)
    newMap.set(destinationIndex, activities)
    setDestinationActivitiesMap(newMap)

    // If this is for an existing destination, update it in the form data
    if (destinationIndex < (data.destinations?.length || 0)) {
      const updatedDestinations = [...(data.destinations || [])]
      updatedDestinations[destinationIndex] = {
        ...updatedDestinations[destinationIndex],
        destinationActivities: activities,
      }
      updateData({ destinations: updatedDestinations })
    }
  }

  const sortDestinations = (destinations: DestinationWithFile[]) => {
    if (sortNewestFirst) {
      return [...destinations].reverse();
    } else {
      return [...destinations].sort((a, b) => a.sortOrder - b.sortOrder);
    }
  };

  const editDestination = (index: number) => {
    const destination = destinationsWithFiles[index];
    
    // Set form values to edit
    form.reset({
      destinationId: destination.destinationId,
      startTime: destination.startTime,
      endTime: destination.endTime,
      sortOrder: destination.sortOrder,
      sortOrderByDate: destination.sortOrderByDate,
      img: destination.img || "",
      destinationActivities: destination.destinationActivities || [],
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
    
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addDestination = (values: TourCreateDestinationType & { imageFile?: File }) => {
    const imageFile = selectedImageFile || values.imageFile;
  
    if (!imageFile && !values.img) {
      form.setError("img", {
        type: "manual",
        message: "Please select an image or provide an image URL"
      });
      return;
    }
  
    // Generate a preview URL if we have an image file
    let imageUrl = values.img || "";
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
  
    // Create the destination data object
    const destinationData: TourCreateDestinationType = {
      destinationId: values.destinationId,
      startTime: values.startTime,
      endTime: values.endTime,
      sortOrder: values.sortOrder,
      sortOrderByDate: values.sortOrderByDate,
      img: imageUrl,
      destinationActivities: [],
    };
  
    const destinationWithFile: DestinationWithFile = {
      ...destinationData,
      imageFile: imageFile,
      imagePreview: imageUrl,
    };
  
    // If we're editing an existing destination
    if (editingIndex !== null) {
      // Update destinationsWithFiles
      const updatedDestinationsWithFiles = [...destinationsWithFiles];
      updatedDestinationsWithFiles[editingIndex] = destinationWithFile;
      setDestinationsWithFiles(updatedDestinationsWithFiles);
      
      // Update parent data
      const updatedDestinations = [...(data.destinations || [])];
      updatedDestinations[editingIndex] = destinationData;
      updateData({ destinations: updatedDestinations });
      
      // If the image file changed, update it
      if (imageFile) {
        addDestinationImageFile(editingIndex, imageFile);
      }
      
      toast.success("Destination updated successfully");
      setEditingIndex(null);
    } else {
      // Add new destination
      // Update state and parent data
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
  
    // Reset form
    form.reset({
      destinationId: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
      sortOrder: (data.destinations?.length || 0) + (editingIndex !== null ? 0 : 1),
      sortOrderByDate: (data.destinations?.length || 0) + (editingIndex !== null ? 0 : 1),
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
      sortOrder: data.destinations?.length || 0,
      sortOrderByDate: data.destinations?.length || 0,
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
        <h2 className="text-2xl font-bold">Destinations</h2>
        <p className="text-muted-foreground">Add destinations for your tour and organize their activities.</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Add Destination Form */}
        <Card className="md:sticky md:top-4 h-fit">
          <CardHeader>
            <CardTitle>{editingIndex !== null ? 'Edit Destination' : 'Add Destination'}</CardTitle>
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
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select a destination</option>
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
                        <FormLabel>Start Time</FormLabel>
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
                        <FormLabel>End Time</FormLabel>
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
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrderByDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order By Date</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                          />
                        </FormControl>
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
                      <FormLabel>Destination Image</FormLabel>
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
                                  Clear
                                </Button>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Please select an image for this destination
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
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Destination
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
                      Cancel Edit
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
                <CardTitle>Added Destinations</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortNewestFirst(!sortNewestFirst)}
                >
                  {sortNewestFirst ? "Sort by Order" : "Sort by Newest"}
                </Button>
              </div>
              <div>
                <p className="text-sm">
                  {destinationsWithFiles.length} destination{destinationsWithFiles.length !== 1 ? "s" : ""} added
                </p>
              </div>
              {destinationsWithFiles.length === 0 && (
                <p className="text-sm text-muted-foreground">No destinations added yet. Start by adding a destination from the form.</p>
              )}
            </CardHeader>
            {destinationsWithFiles.length > 0 && (
              <CardContent className="flex-1 overflow-auto max-h-[70vh]">
                <div className="space-y-6 pr-2">
                  {sortDestinations(destinationsWithFiles).map((destination, sortedIndex) => {
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
                                Sort Order: {destination.sortOrder} | Date Order: {destination.sortOrderByDate}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => editDestination(originalIndex)}
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.33168 11.3754 6.42164 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42157 9.28547L11.5 2.20711L12.7929 3.5L5.71447 10.5784L4.21079 11.1392L3.86082 10.7892L4.42157 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
                              </svg>
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

                        {/* Activities section */}
                        <ActivityForm
                          destinationIndex={originalIndex}
                          activities={destinationActivitiesMap.get(originalIndex) || []}
                          setActivities={setActivities}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Tour Info
        </Button>
        <Button onClick={handleContinue}>Next: Tickets</Button>
      </div>
    </div>
  )
}

