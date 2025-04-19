import { create } from "zustand"
import { type CreateTourBodyType } from "@/schemaValidations/tour-operator.shema"
import { toast } from "sonner"
import { z } from "zod"
import { TourSchema } from "@/schemaValidations/tour-operator.shema"
import tourApiService from "@/apiRequests/tour"
import uploadApiRequest from "@/apiRequests/upload"

interface UploadResponse {
  urls?: string[]
  payload?: unknown
}

interface TourCreateStore {
  // Current step
  step: number
  setStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void

  // Form data
  formData: Partial<CreateTourBodyType>
  updateFormData: (data: Partial<CreateTourBodyType>) => void

  // Image files
  tourImageFiles: File[]
  addTourImageFile: (file: File) => void
  removeTourImageFile: (index: number) => void
  clearTourImageFiles: () => void
  
  // Destination image files - Map<destinationIndex, File[]>
  destinationImageFiles: Map<number, File[]>
  addDestinationImageFile: (destinationIndex: number, file: File) => void
  removeDestinationImageFile: (destinationIndex: number, fileIndex: number) => void
  clearDestinationImages: (destinationIndex: number) => void

  // Submission state
  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  handleSubmit: () => Promise<void>

  // Reset store
  reset: () => void
}

const initialFormData: Partial<CreateTourBodyType> = {
  title: "",
  img: [],
  categoryid: "",
  description: "",
  destinations: [],
  tickets: [],
  openDay: new Date(),
  closeDay: new Date(),
  scheduleFrequency: "",
  about: "",
  include: "",
  pickinfor: ""
}

export const useTourCreateStore = create<TourCreateStore>((set, get) => ({
  // Step management
  step: 1,
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  // Form data management
  formData: initialFormData,
  updateFormData: (data) => 
    set((state) => ({ 
      formData: { ...state.formData, ...data } 
    })),

  // Tour image files management
  tourImageFiles: [],
  addTourImageFile: (file) =>
    set((state) => ({
      tourImageFiles: [...state.tourImageFiles, file]
    })),
  removeTourImageFile: (index) =>
    set((state) => ({
      tourImageFiles: state.tourImageFiles.filter((_, i) => i !== index)
    })),
  clearTourImageFiles: () =>
    set({ tourImageFiles: [] }),

  // Destination image files management
  destinationImageFiles: new Map(),
  addDestinationImageFile: (destinationIndex, file) =>
    set((state) => {
      const newMap = new Map(state.destinationImageFiles)
      const existingFiles = newMap.get(destinationIndex) || []
      newMap.set(destinationIndex, [...existingFiles, file])
      return { destinationImageFiles: newMap }
    }),
  removeDestinationImageFile: (destinationIndex, fileIndex) =>
    set((state) => {
      const newMap = new Map(state.destinationImageFiles)
      const existingFiles = newMap.get(destinationIndex) || []
      newMap.set(
        destinationIndex,
        existingFiles.filter((_, i) => i !== fileIndex)
      )
      return { destinationImageFiles: newMap }
    }),
  clearDestinationImages: (destinationIndex) =>
    set((state) => {
      const newMap = new Map(state.destinationImageFiles)
      newMap.delete(destinationIndex)
      return { destinationImageFiles: newMap }
    }),

  // Submission state
  isSubmitting: false,
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  handleSubmit: async () => {
    const state = get()
    try {
      set({ isSubmitting: true })

      // Create a copy of the form data to update with image URLs
      let updatedFormData = { ...state.formData }

      // Upload tour images if they exist
      if (state.tourImageFiles.length > 0) {
        try {
          const uploadPromises = state.tourImageFiles.map((file: File) => 
            uploadApiRequest.uploadTourImage(file)
          )
          const responses = await Promise.all(uploadPromises)
          const imageUrls = responses.flatMap((response: UploadResponse) => 
            response.urls || []
          )
          updatedFormData.img = imageUrls
        } catch (error) {
          console.error("Error uploading tour images:", error)
          toast.error("Failed to upload tour images")
          set({ isSubmitting: false })
          return
        }
      }

      // Upload destination images if they exist
      if (state.destinationImageFiles.size > 0) {
        const updatedDestinations = [...(updatedFormData.destinations || [])]

        // Create an array of promises for all uploads
        const uploadPromises = Array.from(state.destinationImageFiles.entries()).map(async ([index, files]) => {
          if (index >= updatedDestinations.length) {
            console.warn(
              `Destination index ${index} is out of bounds (total destinations: ${updatedDestinations.length})`,
            )
            return
          }

          try {
            const fileUploadPromises = files.map((file: File) => 
              uploadApiRequest.uploadDestinationImage(file)
            )
            const responses = await Promise.all(fileUploadPromises)
            const imageUrls = responses.flatMap((response: UploadResponse) => 
              response.urls || []
            )
            return { index, urls: imageUrls }
          } catch (error) {
            console.error(`Error uploading destination images ${index}:`, error)
            return { index, urls: [], error }
          }
        })

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises)

        // Process results and update destinations
        for (const result of results) {
          if (!result) continue

          const { index, urls, error } = result
          if (urls.length > 0) {
            updatedDestinations[index].img = urls
          } else if (error) {
            toast.error(`Failed to upload images for destination ${index + 1}: ${error}`)
          }
        }

        updatedFormData.destinations = updatedDestinations
      }

      // Format dates
      updatedFormData = {
        ...updatedFormData,
        openDay: updatedFormData.openDay instanceof Date
          ? updatedFormData.openDay
          : new Date(updatedFormData.openDay || new Date()),
        closeDay: updatedFormData.closeDay instanceof Date
          ? updatedFormData.closeDay
          : new Date(updatedFormData.closeDay || new Date()),
      }

      // Prepare final form data
      const finalFormData: CreateTourBodyType = {
        title: updatedFormData.title || "",
        img: updatedFormData.img || [],
        categoryid: updatedFormData.categoryid || "",
        description: updatedFormData.description || "",
        destinations: updatedFormData.destinations || [],
        tickets: updatedFormData.tickets || [],
        openDay: updatedFormData.openDay || new Date(),
        closeDay: updatedFormData.closeDay || new Date(),
        scheduleFrequency: updatedFormData.scheduleFrequency || "",
        about: updatedFormData.about || "",
        include: updatedFormData.include || "",
        pickinfor: updatedFormData.pickinfor || "",
      }

      // Validate the complete form data
      const validatedData = TourSchema.parse(finalFormData)

      // Send data to the backend
      const response = await tourApiService.create(validatedData)

      if (!response.payload) {
        throw new Error("Failed to create tour")
      }

      toast.success(`Tour ${validatedData.title} created successfully`)
      window.location.href = "/operator/tours"
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation error: Please check all fields")
        console.error("Validation errors:", error.errors)
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      set({ isSubmitting: false })
    }
  },

  // Reset function
  reset: () => set({
    step: 1,
    formData: initialFormData,
    tourImageFiles: [],
    destinationImageFiles: new Map(),
    isSubmitting: false
  })
})) 