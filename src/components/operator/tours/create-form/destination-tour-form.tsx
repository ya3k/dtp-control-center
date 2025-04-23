// "use client"

// import { useEffect, useRef, useState, useCallback } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Plus, Trash2, PlusCircle, Upload, Pencil } from "lucide-react"
// import Image from "next/image"
// import { toast } from "sonner"
// import type { z } from "zod"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   type CreateTourBodyType,
//   DestinationSchema,
//   type TourCreateDestinationType,
//   type destinationActivities,
// } from "@/schemaValidations/tour-operator.shema"
// import destinationApiRequest from "@/apiRequests/destination"

// // Types
// interface DestinationFormProps {
//   data: Partial<CreateTourBodyType>
//   updateData: (data: Partial<CreateTourBodyType>) => void
//   onNext: () => void
//   onPrevious: () => void
//   addDestinationImageFile: (index: number, file: File) => void
// }

// interface Destination {
//   id: string
//   name: string
// }

// interface DestinationWithFile extends TourCreateDestinationType {
//   imageFile?: File
//   imagePreview?: string
// }

// // Time Formatting Utilities
// const formatTimeForInput = (time: string): string => {
//   if (!time) return ""
//   return /^\d{2}:\d{2}:\d{2}$/.test(time) ? time.substring(0, 5) : time
// }

// const formatTimeForStorage = (time: string): string => {
//   if (!time) return ""
//   if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time
//   if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`
//   return time
// }

// // Validation Functions
// const validateTimes = (startTime: string, endTime: string): boolean => {
//   if (!startTime || !endTime) return true // Allow empty times
//   const start = new Date(`1970-01-01T${startTime}`)
//   const end = new Date(`1970-01-01T${endTime}`)
//   return start < end
// }

// // Activity Form Component
// const ActivityForm: React.FC<{
//   destinationIndex: number
//   activities: z.infer<typeof destinationActivities>[]
//   setActivities: (index: number, activities: z.infer<typeof destinationActivities>[]) => void
//   isParentEditing: boolean
//   destinationStartTime?: string
//   destinationEndTime?: string
// }> = ({ 
//   destinationIndex, 
//   activities, 
//   setActivities, 
//   isParentEditing,
//   destinationStartTime,
//   destinationEndTime 
// }) => {
//   const [activityName, setActivityName] = useState("")
//   const [activityStartTime, setActivityStartTime] = useState("")
//   const [activityEndTime, setActivityEndTime] = useState("")
//   const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null)

//   const validateActivityTime = useCallback((start: string, end: string): boolean => {
//     if (!start || !end) return false
//     if (!destinationStartTime || !destinationEndTime) return true

//     const actStart = new Date(`1970-01-01T${formatTimeForStorage(start)}`)
//     const actEnd = new Date(`1970-01-01T${formatTimeForStorage(end)}`)
//     const destStart = new Date(`1970-01-01T${destinationStartTime}`)
//     const destEnd = new Date(`1970-01-01T${destinationEndTime}`)

//     return actStart >= destStart && actEnd <= destEnd && actStart < actEnd
//   }, [destinationStartTime, destinationEndTime])

//   const addActivity = () => {
//     if (isParentEditing) {
//       toast.error("Hãy hoàn thành chỉnh sửa điểm đến trước")
//       return
//     }

//     if (!activityName.trim()) {
//       toast.error("Tên hoạt động không được để trống")
//       return
//     }

//     if (!validateActivityTime(activityStartTime, activityEndTime)) {
//       toast.error("Thời gian hoạt động không hợp lệ hoặc nằm ngoài thời gian của điểm đến")
//       return
//     }

//     if (editingActivityIndex !== null) {
//       // Update existing activity
//       const updatedActivities = [...activities]
//       updatedActivities[editingActivityIndex] = {
//         ...updatedActivities[editingActivityIndex],
//         name: activityName,
//         startTime: formatTimeForStorage(activityStartTime),
//         endTime: formatTimeForStorage(activityEndTime),
//       }

//       setActivities(destinationIndex, updatedActivities)
//       toast.success("Hoạt động đã được cập nhật")
//       setEditingActivityIndex(null)
//     } else {
//       // Add new activity
//       const newActivity = {
//         name: activityName,
//         startTime: formatTimeForStorage(activityStartTime),
//         endTime: formatTimeForStorage(activityEndTime),
//         sortOrder: activities.length,
//       }

//       setActivities(destinationIndex, [...activities, newActivity])
//       toast.success("Đã thêm hoạt động mới")
//     }

//     resetForm()
//   }

//   const editActivity = (index: number) => {
//     if (isParentEditing) {
//       toast.error("Hãy hoàn thành chỉnh sửa điểm đến trước")
//       return
//     }

//     const activity = activities[index]
//     setActivityName(activity.name)
//     setActivityStartTime(formatTimeForInput(activity.startTime))
//     setActivityEndTime(formatTimeForInput(activity.endTime))
//     setEditingActivityIndex(index)
//   }

//   const resetForm = () => {
//     setActivityName("")
//     setActivityStartTime("")
//     setActivityEndTime("")
//     setEditingActivityIndex(null)
//   }

//   const cancelActivityEdit = () => {
//     setEditingActivityIndex(null)
//     resetForm()
//     toast.info("Đã hủy chỉnh sửa hoạt động")
//   }

//   const removeActivity = (index: number) => {
//     if (isParentEditing) {
//       toast.error("Hãy hoàn thành chỉnh sửa điểm đến trước")
//       return
//     }

//     const updatedActivities = activities
//       .filter((_, i) => i !== index)
//       .map((act, idx) => ({ ...act, sortOrder: idx }))

//     setActivities(destinationIndex, updatedActivities)

//     if (editingActivityIndex === index) {
//       setEditingActivityIndex(null)
//       resetForm()
//     }

//     toast.success("Đã xóa hoạt động")
//   }

//   return (
//     <div className={`space-y-4 mt-4 p-4 border rounded-md ${isParentEditing ? 'relative' : ''}`}>
//       {isParentEditing && (
//         <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 rounded-md">
//           <div className="text-sm font-medium text-center p-3 rounded-md bg-muted">
//             Hãy hoàn thành chỉnh sửa điểm đến trước khi thao tác với hoạt động
//           </div>
//         </div>
//       )}

//       <h4 className="font-medium">Hoạt động</h4>

//       {editingActivityIndex !== null && (
//         <div className="p-2 mb-3 bg-primary/10 border border-primary rounded-md text-primary text-sm">
//           Đang chỉnh sửa hoạt động. Hoàn thành chỉnh sửa trước khi thực hiện các tác vụ khác.
//         </div>
//       )}

//       <div className="space-y-3">
//         <div>
//           <label className="text-sm font-medium">Tên hoạt động</label>
//           <Input
//             value={activityName}
//             onChange={(e) => setActivityName(e.target.value)}
//             placeholder="Nhập tên hoạt động"
//             disabled={isParentEditing}
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="text-sm font-medium">Thời gian bắt đầu</label>
//             <Input
//               type="time"
//               value={activityStartTime}
//               onChange={(e) => setActivityStartTime(e.target.value)}
//               disabled={isParentEditing}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Thời gian kết thúc</label>
//             <Input
//               type="time"
//               value={activityEndTime}
//               onChange={(e) => setActivityEndTime(e.target.value)}
//               disabled={isParentEditing}
//             />
//           </div>
//         </div>

//         <div className={editingActivityIndex !== null ? "grid grid-cols-2 gap-2" : ""}>
//           <Button
//             type="button"
//             variant={editingActivityIndex !== null ? "default" : "outline"}
//             size="sm"
//             className={`w-full ${editingActivityIndex !== null ? "bg-green-600 hover:bg-green-700" : "hover:bg-blue-50 hover:border-blue-200 text-blue-600"}`}
//             onClick={addActivity}
//             disabled={isParentEditing}
//           >
//             {editingActivityIndex !== null ? (
//               <>Lưu chỉnh sửa hoạt động</>
//             ) : (
//               <>
//                 <PlusCircle className="mr-2 h-4 w-4" />
//                 Thêm hoạt động
//               </>
//             )}
//           </Button>

//           {editingActivityIndex !== null && (
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               className="w-full hover:bg-red-50 hover:border-red-200 text-red-600"
//               onClick={cancelActivityEdit}
//               disabled={isParentEditing}
//             >
//               Hủy chỉnh sửa
//             </Button>
//           )}
//         </div>
//       </div>

//       {activities.length > 0 && (
//         <div className="space-y-2 mt-2">
//           <h5 className="text-sm font-medium">Hoạt động đã thêm</h5>
//           {activities.map((activity, index) => (
//             <div
//               key={index}
//               className={`flex items-center justify-between p-2 rounded-md ${editingActivityIndex === index
//                 ? 'bg-primary/10 border border-primary'
//                 : 'bg-muted'
//                 }`}
//             >
//               <div>
//                 <p className="text-sm font-medium">{activity.name}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {formatTimeForInput(activity.startTime)} - {formatTimeForInput(activity.endTime)}
//                 </p>
//                 {editingActivityIndex === index && (
//                   <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
//                     Đang chỉnh sửa
//                   </span>
//                 )}
//               </div>
//               <div className="flex gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => editActivity(index)}
//                   disabled={isParentEditing || editingActivityIndex !== null && editingActivityIndex !== index}
//                   className="hover:bg-blue-50"
//                 >
//                   <Pencil className="h-3 w-3 text-blue-500" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => removeActivity(index)}
//                   disabled={isParentEditing || editingActivityIndex !== null && editingActivityIndex !== index}
//                   className="hover:bg-red-50"
//                 >
//                   <Trash2 className="h-3 w-3 text-red-500" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // Main Component
// export function DestinationForm({
//   data,
//   updateData,
//   onNext,
//   onPrevious,
//   addDestinationImageFile,
// }: DestinationFormProps) {
//   // State Management
//   const [destinations, setDestinations] = useState<Destination[]>([])
//   const [destinationsWithFiles, setDestinationsWithFiles] = useState<DestinationWithFile[]>(
//     (data.destinations || []).map((dest) => ({ ...dest }))
//   )
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
//   const [destinationActivitiesMap, setDestinationActivitiesMap] = useState<
//     Map<number, z.infer<typeof destinationActivities>[]>
//   >(new Map())
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const [editingIndex, setEditingIndex] = useState<number | null>(null)

//   // Form setup with better validation
//   const form = useForm<TourCreateDestinationType & { imageFile?: File }>({
//     resolver: zodResolver(DestinationSchema),
//     defaultValues: {
//       destinationId: "",
//       startTime: "",
//       endTime: "",
//       sortOrder: 0,
//       sortOrderByDate: 0,
//       img: "",
//       destinationActivities: [],
//     },
//   })

//   // Memoized helper functions
//   const getDestinationName = useCallback((id: string) => {
//     const destination = destinations.find((d) => d.id === id)
//     return destination ? destination.name : "Unknown Destination"
//   }, [destinations])

//   const getNextSortOrderForDate = useCallback((sortOrderByDate: number): number => {
//     const destinationsForDate = destinationsWithFiles.filter(
//       dest => dest.sortOrderByDate === sortOrderByDate
//     )
//     return destinationsForDate.length
//   }, [destinationsWithFiles])

//   // Data Fetching with better error handling
//   useEffect(() => {
//     const fetchDestinations = async () => {
//       try {
//         const response = await destinationApiRequest.getAll()
//         if (!response.payload?.value) {
//           throw new Error("No destinations data received")
//         }
//         setDestinations(response.payload.value)
//       } catch (error) {
//         console.error("Failed to fetch destinations:", error)
//         toast.error("Không thể tải danh sách điểm đến")
//       }
//     }

//     fetchDestinations()

//     // Initialize activities map from existing data
//     if (data.destinations?.length) {
//       const activitiesMap = new Map<number, z.infer<typeof destinationActivities>[]>()
//       data.destinations.forEach((dest, index) => {
//         activitiesMap.set(index, dest.destinationActivities || [])
//       })
//       setDestinationActivitiesMap(activitiesMap)
//     }
//   }, [data.destinations])

//   // Event Handlers with validation
//   const handleImageChange = useCallback((
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: { onChange: (value: string) => void }
//   ) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     // Validate file type and size
//     const validTypes = ['image/jpeg', 'image/png', 'image/webp']
//     if (!validTypes.includes(file.type)) {
//       toast.error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP")
//       return
//     }

//     if (file.size > 5 * 1024 * 1024) { // 5MB limit
//       toast.error("Kích thước ảnh không được vượt quá 5MB")
//       return
//     }

//     const previewUrl = URL.createObjectURL(file)
//     setImagePreview(previewUrl)
//     setSelectedImageFile(file)
//     form.setValue("imageFile", file)
//     field.onChange(previewUrl)
//   }, [form])

//   const clearImage = useCallback((field: { onChange: (value: string) => void }) => {
//     if (imagePreview) {
//       URL.revokeObjectURL(imagePreview)
//     }
//     setImagePreview(null)
//     setSelectedImageFile(null)
//     form.setValue("imageFile", undefined)
//     field.onChange("")
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""
//     }
//   }, [imagePreview, form])

//   const setActivities = useCallback((destinationIndex: number, activities: z.infer<typeof destinationActivities>[]) => {
//     setDestinationActivitiesMap(prev => {
//       const newMap = new Map(prev)
//       newMap.set(destinationIndex, activities)
//       return newMap
//     })

//     if (destinationIndex >= 0 && destinationIndex < (data.destinations?.length || 0)) {
//       const updatedDestinations = [...(data.destinations || [])]
//       updatedDestinations[destinationIndex] = {
//         ...updatedDestinations[destinationIndex],
//         destinationActivities: activities,
//       }
//       updateData({ destinations: updatedDestinations })
//     }
//   }, [data.destinations, updateData])

//   const editDestination = (index: number) => {
//     if (index < 0 || index >= destinationsWithFiles.length) {
//       toast.error("Error editing destination")
//       return
//     }

//     const destination = destinationsWithFiles[index]

//     // Format times for form input - handle possible empty values
//     const formattedStartTime = destination.startTime ? formatTimeForInput(destination.startTime) : ""
//     const formattedEndTime = destination.endTime ? formatTimeForInput(destination.endTime) : ""

//     // No need to validate times here, as they can be empty

//     form.reset({
//       destinationId: destination.destinationId,
//       startTime: formattedStartTime,
//       endTime: formattedEndTime,
//       sortOrder: destination.sortOrder,
//       sortOrderByDate: destination.sortOrderByDate,
//       img: destination.img || "",
//       destinationActivities: destination.destinationActivities || [],
//     })

//     setEditingIndex(index)
//     setImagePreview(destination.imagePreview || destination.img || null)

//     if (destination.imageFile) {
//       setSelectedImageFile(destination.imageFile)
//       form.setValue("imageFile", destination.imageFile)
//     } else {
//       setSelectedImageFile(null)
//     }

//     window.scrollTo({ top: 0, behavior: 'smooth' })
//   }

//   const addOrUpdateDestination = (values: TourCreateDestinationType & { imageFile?: File }) => {
//     const imageFile = selectedImageFile || values.imageFile

//     // Format times - handle empty values
//     const startTime = values.startTime ? formatTimeForStorage(values.startTime) : ""
//     const endTime = values.endTime ? formatTimeForStorage(values.endTime) : ""

//     // Validate time formats - only if they're provided
//     if ((startTime && !/^\d{2}:\d{2}:\d{2}$/.test(startTime)) ||
//       (endTime && !/^\d{2}:\d{2}:\d{2}$/.test(endTime))) {
//       toast.error("Thời gian phải có định dạng HH:MM")
//       return
//     }

//     // Get the next sortOrder for this date
//     const sortOrder = editingIndex !== null 
//       ? values.sortOrder 
//       : getNextSortOrderForDate(values.sortOrderByDate)

//     // Create destination data
//     const destinationData: TourCreateDestinationType = {
//       destinationId: values.destinationId,
//       startTime,
//       endTime,
//       sortOrder,
//       sortOrderByDate: values.sortOrderByDate,
//       img: values.img,
//       destinationActivities: values.destinationActivities,
//     }

//     const destinationWithFile: DestinationWithFile = {
//       ...destinationData,
//       imageFile,
//       imagePreview: values.img,
//     }

//     if (editingIndex !== null) {
//       // Update existing destination
//       const updatedDestinationsWithFiles = [...destinationsWithFiles]
//       updatedDestinationsWithFiles[editingIndex] = destinationWithFile
//       setDestinationsWithFiles(updatedDestinationsWithFiles)

//       const updatedDestinations = [...(data.destinations || [])]
//       updatedDestinations[editingIndex] = destinationData
//       updateData({ destinations: updatedDestinations })

//       if (imageFile) {
//         addDestinationImageFile(editingIndex, imageFile)
//       }

//       toast.success("Destination updated successfully")
//       setEditingIndex(null)
//     } else {
//       // Add new destination
//       setDestinationsWithFiles([...destinationsWithFiles, destinationWithFile])

//       const updatedDestinations = [...(data.destinations || []), destinationData]
//       updateData({ destinations: updatedDestinations })

//       const newActivitiesMap = new Map(destinationActivitiesMap)
//       newActivitiesMap.set(updatedDestinations.length - 1, [])
//       setDestinationActivitiesMap(newActivitiesMap)

//       if (imageFile) {
//         addDestinationImageFile(updatedDestinations.length - 1, imageFile)
//       }

//       toast.success("Destination added successfully")
//     }

//     // Reset form
//     resetFormAndImageState()
//   }

//   const cancelEdit = () => {
//     setEditingIndex(null)
//     resetFormAndImageState()
//   }

//   const resetFormAndImageState = () => {
//     form.reset({
//       destinationId: "",
//       startTime: "",
//       endTime: "",
//       sortOrder: 0,
//       sortOrderByDate: 0,
//       img: "",
//       destinationActivities: [],
//     })

//     setImagePreview(null)
//     setSelectedImageFile(null)
//     if (fileInputRef.current) fileInputRef.current.value = ""
//   }

//   const removeDestination = (index: number) => {
//     // Remove from arrays
//     const updatedDestinationsWithFiles = destinationsWithFiles.filter((_, i) => i !== index)
//     setDestinationsWithFiles(updatedDestinationsWithFiles)

//     const updatedDestinations = (data.destinations || [])
//       .filter((_, i) => i !== index)
//       .map((dest, idx) => ({
//         ...dest,
//         sortOrder: idx,
//         sortOrderByDate: dest.sortOrderByDate, // Keep original date grouping
//       }))

//     // Rebuild activities map
//     const newActivitiesMap = new Map<number, z.infer<typeof destinationActivities>[]>()
//     updatedDestinations.forEach((_, idx) => {
//       const activities = destinationActivitiesMap.get(idx < index ? idx : idx + 1) || []
//       newActivitiesMap.set(idx, activities)
//     })

//     setDestinationActivitiesMap(newActivitiesMap)
//     updateData({ destinations: updatedDestinations })
//     toast.info("Destination removed")

//     if (editingIndex === index) {
//       cancelEdit()
//     }
//   }

//   const handleContinue = () => {
//     if (!(data.destinations?.length)) {
//       toast.error("Add at least one destination before continuing")
//       return
//     }

//     // Ensure all destinations have their activities before continuing
//     const updatedDestinations = (data.destinations || []).map((dest, index) => ({
//       ...dest,
//       destinationActivities: destinationActivitiesMap.get(index) || [],
//     }))

//     updateData({ destinations: updatedDestinations })
//     onNext()
//   }

//   return (
//     <div className="space-y-6">
//       {/* Title */}
//       <div>
//         <h2 className="text-2xl font-bold">Điểm đến</h2>
//         <p className="text-muted-foreground">Thêm điểm đến và các hoạt động cho tour.</p>
//       </div>

//       {/* Two-column layout */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left column - Add Destination Form */}
//         <Card className="md:sticky md:top-4 h-fit">
//           <CardHeader>
//             <CardTitle>
//               {editingIndex !== null
//                 ? `Chỉnh sửa điểm đến: ${getDestinationName(destinationsWithFiles[editingIndex]?.destinationId)}`
//                 : 'Thêm điểm đến'}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(addOrUpdateDestination)} className="space-y-4">
//                 {/* Destination Selection */}
//                 <FormField
//                   control={form.control}
//                   name="destinationId"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Điểm đến</FormLabel>
//                       <FormControl>
//                         <select
//                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                           {...field}
//                         >
//                           <option value="">Chọn địa điểm</option>
//                           {destinations.map((destination) => (
//                             <option key={destination.id} value={destination.id}>
//                               {destination.name}
//                             </option>
//                           ))}
//                         </select>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Time inputs */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="startTime"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Thời gian đến</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="time"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="endTime"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Thời gian đi</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="time"
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Sort order inputs */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="sortOrderByDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Ngày</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             min="0"
//                             {...field}
//                             onChange={(e) => {
//                               const newSortOrderByDate = parseInt(e.target.value)
//                               field.onChange(newSortOrderByDate)
                              
//                               // Auto update sort order based on existing destinations for this date
//                               const nextSortOrder = getNextSortOrderForDate(newSortOrderByDate)
//                               form.setValue("sortOrder", nextSortOrder)
//                             }}
//                           />
//                         </FormControl>
//                         <p className="text-xs text-muted-foreground">
//                           Ngày của lịch trình tour (0 = ngày đầu tiên)
//                         </p>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

               
//                 </div>

//                 {/* Image upload */}
//                 <FormField
//                   control={form.control}
//                   name="img"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Ảnh điểm đến (Không bắt buộc)</FormLabel>
//                       <FormControl>
//                         <div className="space-y-2">
//                           {/* Preview area */}
//                           {imagePreview && (
//                             <div className="relative w-full h-40 overflow-hidden rounded-md">
//                               <Image
//                                 src={imagePreview}
//                                 alt="Destination preview"
//                                 fill
//                                 sizes="(max-width: 768px) 100vw, 50vw"
//                                 style={{ objectFit: "cover" }}
//                                 priority
//                                 unoptimized={imagePreview.startsWith('blob:')}
//                               />
//                             </div>
//                           )}

//                           {/* File input */}
//                           <div className="flex flex-col gap-2">
//                             <div className="flex items-center gap-2">
//                               <Input
//                                 type="file"
//                                 ref={fileInputRef}
//                                 accept="image/*"
//                                 onChange={(e) => handleImageChange(e, field)}
//                                 className="flex-1"
//                               />
//                               {imagePreview && (
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => clearImage(field)}
//                                 >
//                                   Xóa ảnh
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 {/* Submit buttons */}
//                 <div className={editingIndex !== null ? "grid grid-cols-2 gap-2" : ""}>
//                   <Button
//                     type="submit"
//                     className={`w-full ${editingIndex !== null ? "bg-green-600 hover:bg-green-700" : "hover:bg-blue-600"}`}
//                   >
//                     {editingIndex !== null ? (
//                       <>Lưu chỉnh sửa</>
//                     ) : (
//                       <>
//                         <Plus className="mr-2 h-4 w-4" />
//                         Thêm điểm đến
//                       </>
//                     )}
//                   </Button>

//                   {editingIndex !== null && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full hover:bg-red-50 hover:border-red-200 text-red-600"
//                       onClick={cancelEdit}
//                     >
//                       Hủy chỉnh sửa
//                     </Button>
//                   )}
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>

//         {/* Right column - Added Destinations */}
//         <div className="space-y-4 h-full flex flex-col">
//           <Card className="flex-1 flex flex-col">
//             <CardHeader className="pb-2">
//               <div className="flex items-center justify-between">
//                 <CardTitle>Danh sách điểm đến đã thêm</CardTitle>
//               </div>
//               <div>
//                 <p className="text-sm">
//                   {destinationsWithFiles.length} điểm đến đã thêm
//                 </p>
//               </div>
//               {editingIndex !== null && (
//                 <div className="mt-2 p-2 bg-primary/10 border border-primary rounded-md text-primary text-sm font-medium">
//                   Điểm đến đang được chỉnh sửa. Các chức năng khác bị tạm khóa cho đến khi hoàn thành chỉnh sửa.
//                 </div>
//               )}
//               {destinationsWithFiles.length === 0 && (
//                 <p className="text-sm text-muted-foreground">Chưa có điểm đến nào. Vui lòng thêm điểm đến cho tour.</p>
//               )}
//             </CardHeader>
//             {destinationsWithFiles.length > 0 && (
//               <CardContent className="flex-1 overflow-auto max-h-[70vh]">
//                 <div className="space-y-6 pr-2">
//                   {/* Group destinations by date */}
//                   {Array.from(new Set(destinationsWithFiles.map(d => d.sortOrderByDate)))
//                     .sort((a, b) => a - b)
//                     .map(dateOrder => (
//                       <div key={`day-${dateOrder}`} className="mb-6">
//                         <h3 className="text-lg font-medium mb-3 bg-muted px-3 py-2 rounded-md">
//                           Ngày {dateOrder + 1}
//                         </h3>
//                         <div className="space-y-4 pl-3">
//                           {destinationsWithFiles
//                             .filter(d => d.sortOrderByDate === dateOrder)
//                             .sort((a, b) => a.sortOrder - b.sortOrder)
//                             .map(destination => {
//                               // Find actual index in original array
//                               const index = destinationsWithFiles.findIndex(
//                                 d => d.destinationId === destination.destinationId &&
//                                   d.sortOrder === destination.sortOrder &&
//                                   d.sortOrderByDate === destination.sortOrderByDate
//                               );

//                               return (
//                                 <div
//                                   key={index}
//                                   className={`p-4 border rounded-md ${editingIndex === index ? 'border-2 border-primary bg-primary/5' : ''}`}
//                                 >
//                                   {/* Destination header */}
//                                   <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center gap-4">
//                                       {/* Destination image */}
//                                       {destination.imagePreview || destination.img ? (
//                                         <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative">
//                                           <Image
//                                             src={destination.imagePreview || destination.img || "/placeholder.svg"}
//                                             alt={getDestinationName(destination.destinationId)}
//                                             fill
//                                             sizes="48px"
//                                             style={{ objectFit: "cover" }}
//                                           />
//                                         </div>
//                                       ) : (
//                                         <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
//                                           <Upload className="h-4 w-4 text-muted-foreground" />
//                                         </div>
//                                       )}

//                                       {/* Destination info */}
//                                       <div>
//                                         <p className="font-medium">{getDestinationName(destination.destinationId)}</p>
//                                         <p className="text-sm text-muted-foreground">
//                                           {formatTimeForInput(destination.startTime)} - {formatTimeForInput(destination.endTime)}
//                                         </p>
//                                         <p className="text-sm text-muted-foreground">
//                                           Thứ tự: {destination.sortOrder + 1}
//                                         </p>
//                                         {editingIndex === index && (
//                                           <span className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
//                                             Đang chỉnh sửa
//                                           </span>
//                                         )}
//                                       </div>
//                                     </div>

//                                     {/* Action buttons */}
//                                     <div className="flex gap-1">
//                                       <Button
//                                         variant="outline"
//                                         size="icon"
//                                         onClick={() => editDestination(index)}
//                                         disabled={editingIndex !== null && editingIndex !== index}
//                                         className="hover:bg-blue-50 hover:border-blue-200"
//                                       >
//                                         <Pencil className="h-4 w-4 text-blue-500" />
//                                       </Button>
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => removeDestination(index)}
//                                         disabled={editingIndex !== null && editingIndex !== index}
//                                         className="hover:bg-red-50"
//                                       >
//                                         <Trash2 className="h-4 w-4 text-red-500" />
//                                       </Button>
//                                     </div>
//                                   </div>

//                                   {/* Activities section */}
//                                   <ActivityForm
//                                     destinationIndex={index}
//                                     activities={destinationActivitiesMap.get(index) || []}
//                                     setActivities={setActivities}
//                                     isParentEditing={editingIndex !== null}
//                                     destinationStartTime={destinationsWithFiles[index]?.startTime}
//                                     destinationEndTime={destinationsWithFiles[index]?.endTime}
//                                   />
//                                 </div>
//                               );
//                             })}
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             )}
//           </Card>
//         </div>
//       </div>

//       {/* Navigation buttons */}
//       <div className="flex justify-between mt-8">
//         <Button
//           variant="outline"
//           onClick={onPrevious}
//           className="hover:bg-gray-100"
//         >
//           Trước: Thông tin tour
//         </Button>
//         <Button
//           onClick={handleContinue}
//         >
//           Tiếp theo: Vé
//         </Button>
//       </div>
//     </div>
//   )
// }