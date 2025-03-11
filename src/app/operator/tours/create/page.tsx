"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { toast } from "sonner"
import { FormStepper } from "@/components/operator/tours/create-form/tour-create-step-form"
import { TourInfoForm } from "@/components/operator/tours/create-form/tour-info-form"
import { DestinationForm } from "@/components/operator/tours/create-form/destination-tour-form"
import { TicketForm } from "@/components/operator/tours/create-form/ticket-tour-form"
import { TourSchema, TourType } from "@/schemaValidations/tour-operator.shema"


export default function CreateTourPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)


  // Initialize form data with default values
  const [formData, setFormData] = useState<Partial<TourType>>({
    title: "",
    companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    category: "",
    description: "",
    destinations: [],
    tickets: [],
    openDay: "",
    closeDay: "",
    scheduleFrequency: ""
  })

  const updateFormData = (data: Partial<TourType>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      console.log(JSON.stringify(formData))
      // Validate the complete form data
      const validatedData = TourSchema.parse(formData)
      // Send data to the backend
      const response = await fetch("https://localhost:7171/api/tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create tour")
      }

      toast.success(`Tour ${validatedData.title} created successfully`)
      router.push("/operator/tours")
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Validation error: Please check all fields")
        console.error(error.errors)
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
        {step === 1 && <TourInfoForm data={formData} updateData={updateFormData} onNext={handleNext} />}

        {step === 2 && (
          <DestinationForm
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
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

