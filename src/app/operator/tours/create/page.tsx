"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { toast } from "sonner"
import { FormStepper } from "@/components/operator/tours/create-form/tour-create-step-form"
import { TourInfoForm } from "@/components/operator/tours/create-form/tour-info-form"
import { DestinationForm } from "@/components/operator/tours/create-form/destination-tour-form"
import { TicketForm } from "@/components/operator/tours/create-form/ticket-tour-form"
import { type CreateTourBodyType, TourSchema } from "@/schemaValidations/tour-operator.shema"
import tourApiService from "@/apiRequests/tour"
import uploadApiRequest from "@/apiRequests/upload"

export default function CreateTourPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tourImageFile, setTourImageFile] = useState<File | null>(null)
  const [destinationImageFiles, setDestinationImageFiles] = useState<Map<number, File>>(new Map())

  // Initialize form data with default values
  const [formData, setFormData] = useState<Partial<CreateTourBodyType>>({
    title: "",
    img: "",
    categoryid: "",
    description: "",
    destinations: [],
    tickets: [],
    openDay: "",
    closeDay: "",
    duration: 1,
    scheduleFrequency: "",
  })

  const updateFormData = (data: Partial<CreateTourBodyType>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const addDestinationImageFile = (index: number, file: File) => {
    console.log(`Adding destination image file for index ${index}:`, file.name)
    setDestinationImageFiles((prev) => {
      const newMap = new Map(prev)
      newMap.set(index, file)
      return newMap
    })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Create a copy of the form data to update with image URLs
      let updatedFormData = { ...formData }

      // Upload the tour image if exists
      if (tourImageFile) {
        try {
          const response = await uploadApiRequest.uploadTourImage(tourImageFile)
          if (response.urls && response.urls.length > 0) {
            updatedFormData.img = response.urls[0]
          } else {
            throw new Error("No URL returned from tour image upload")
          }
        } catch (error) {
          console.error("Error uploading tour image:", error)
          toast.error("Failed to upload tour image")
          setIsSubmitting(false)
          return
        }
      }

      // Debug destination image files
      console.log(
        "Destination image files before upload:",
        Array.from(destinationImageFiles.entries()).map(([idx, file]) => ({
          index: idx,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        })),
      )
      console.log("Destinations before image upload:", updatedFormData.destinations)

      // Upload destination images if they exist
      if (destinationImageFiles.size > 0) {
        const updatedDestinations = [...(updatedFormData.destinations || [])]

        // Create an array of promises for all uploads
        const uploadPromises = Array.from(destinationImageFiles.entries()).map(async ([index, file]) => {
          if (index >= updatedDestinations.length) {
            console.warn(
              `Destination index ${index} is out of bounds (total destinations: ${updatedDestinations.length})`,
            )
            return
          }

          try {
            console.log(`Starting upload for destination ${index}, file: ${file.name}`)
            const response = await uploadApiRequest.uploadDestinationImage(file)
            console.log(`Upload response for destination ${index}:`, response)

            if (response.urls && response.urls.length > 0) {
              console.log(`Setting image URL for destination ${index} to:`, response.urls[0])
              return { index, url: response.urls[0] }
            } else {
              console.warn(`No URLs returned for destination image ${index}`)
              return { index, url: null }
            }
          } catch (error) {
            console.error(`Error uploading destination image ${index}:`, error)
            return { index, url: null, error }
          }
        })

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises)

        // Process results and update destinations
        for (const result of results) {
          if (!result) continue

          const { index, url, error } = result
          if (url) {
            updatedDestinations[index].img = url
          } else if (error) {
            toast.error(`Failed to upload image for destination ${index + 1}: ${error}`)
          }
        }

        console.log("Destinations after image upload:", updatedDestinations)
        updatedFormData.destinations = updatedDestinations
      } else {
        console.warn("No destination image files to upload")
      }

      // Format dates to ISO string if they aren't already
      updatedFormData = {
        ...updatedFormData,
        openDay: updatedFormData.openDay ? new Date(updatedFormData.openDay).toISOString() : "",
        closeDay: updatedFormData.closeDay ? new Date(updatedFormData.closeDay).toISOString() : "",
      }

      // Ensure all required fields are present and properly formatted
      const finalFormData: CreateTourBodyType = {
        title: updatedFormData.title || "",
        img: updatedFormData.img || "",
        categoryid: updatedFormData.categoryid || "",
        description: updatedFormData.description || "",
        destinations: updatedFormData.destinations || [],
        tickets: updatedFormData.tickets || [],
        openDay: updatedFormData.openDay || "",
        closeDay: updatedFormData.closeDay || "",
        duration: updatedFormData.duration || 1,
        scheduleFrequency: updatedFormData.scheduleFrequency || "",
      }

      // Ensure destinations have all required fields including activities
      finalFormData.destinations = finalFormData.destinations.map((dest) => ({
        destinationId: dest.destinationId,
        startTime: dest.startTime,
        endTime: dest.endTime,
        sortOrder: dest.sortOrder,
        sortOrderByDate: dest.sortOrderByDate,
        img: dest.img || "",
        destinationActivities: dest.destinationActivities || [],
      }))

      // Ensure tickets have all required fields
      finalFormData.tickets = finalFormData.tickets.map((ticket) => ({
        defaultNetCost: ticket.defaultNetCost,
        minimumPurchaseQuantity: ticket.minimumPurchaseQuantity,
        ticketKind: ticket.ticketKind,
      }))

      // Final check for image URLs
      finalFormData.destinations.forEach((dest, index) => {
        if (!dest.img || dest.img.trim() === "") {
          console.warn(`Destination ${index} has no image URL:`, dest)
        }
      })

      console.log("Final form data for submission:", JSON.stringify(finalFormData, null, 2))

      // Validate the complete form data
      const validatedData = TourSchema.parse(finalFormData)

      // Send data to the backend
      const response = await tourApiService.create(validatedData)

      if (!response.payload) {
        throw new Error("Failed to create tour")
      }

      toast.success(`Tour ${validatedData.title} created successfully`)
      router.push("/operator/tours")
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
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Tour</h1>

      <FormStepper currentStep={step} />

      <div className="mt-8 bg-card rounded-lg border p-6">
        {step === 1 && (
          <TourInfoForm
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            setTourImageFile={setTourImageFile}
          />
        )}

        {step === 2 && (
          <DestinationForm
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            addDestinationImageFile={addDestinationImageFile}
          />
        )}

        {step === 3 && (
          <TicketForm
            data={formData}
            updateData={updateFormData}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}

