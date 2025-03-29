"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import {
  type CreateTourBodyType,
  type CreateTourInfoType,
  tourInfoPostSchema,
} from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"
import type { CategoryType } from "@/schemaValidations/category.schema"
import CategorySearch from "../categories-search"
import { toast } from "sonner"
import { TiptapEditor } from "@/components/common/tiptap-editor"

// Define the Frequency enum for display
enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

const frequencyList = [
  { id: Frequency.Daily, name: "Daily" },
  { id: Frequency.Weekly, name: "Weekly" },
  { id: Frequency.Monthly, name: "Monthly" },
]

interface TourInfoFormProps {
  data: Partial<CreateTourBodyType>
  updateData: (data: Partial<CreateTourBodyType>) => void
  onNext: () => void
  setTourImageFile: (file: File | null) => void
}

export function TourInfoForm({ data, updateData, onNext, setTourImageFile }: TourInfoFormProps) {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(data.img || null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CreateTourInfoType>({
    resolver: zodResolver(tourInfoPostSchema),
    defaultValues: {
      title: data.title || "",
      img: data.img || "",
      categoryid: data.categoryid || "",
      scheduleFrequency: (data.scheduleFrequency as Frequency) || Frequency.Daily,
      openDay: data.openDay || "",
      closeDay: data.closeDay || "",
      duration: data.duration || 1,
      description: data.description || "",
    },
  })

  const fetchCategory = async () => {
    try {
      const response = await categoryApiRequest.get()
      const data = await response.payload.value
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      toast.error("Failed to load categories")
    }
  }

  useEffect(() => {
    fetchCategory()
  }, [])

  const onSubmit = (values: CreateTourInfoType) => {
    // Ensure all values match the schema
    const formattedValues: CreateTourInfoType = {
      title: values.title,
      img: values.img || "",
      categoryid: values.categoryid,
      description: values.description,
      openDay: values.openDay,
      closeDay: values.closeDay,
      duration: values.duration,
      scheduleFrequency: values.scheduleFrequency,
    }

    updateData(formattedValues)
    onNext()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tour title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* img */}
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Thumbnail Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {previewImage && (
                        <div className="relative w-full h-40 overflow-hidden rounded-md">
                          <img
                            src={previewImage || "/placeholder.svg"}
                            alt="Tour thumbnail preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Store the file for later upload
                              setTourImageFile(file)

                              // Create a preview URL
                              const previewUrl = URL.createObjectURL(file)
                              setPreviewImage(previewUrl)

                              // Clear any existing URL input
                              field.onChange("")
                            }
                          }}
                          className="flex-1"
                        />
                        {previewImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewImage(null)
                              setTourImageFile(null)
                              field.onChange("")

                              // Reset the file input
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            Clear
                          </Button>
                        )}
                      </div>

                      {/* <div className="flex items-center gap-2">
                        <Input
                          placeholder="Or enter image URL directly"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            if (e.target.value) {
                              setPreviewImage(e.target.value)
                              setTourImageFile(null)
                              setHasLocalFile(false) // Reset file selection state

                              // Clear the file input
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            } else {
                              setPreviewImage(null)
                            }
                          }}
                          disabled={hasLocalFile} // Disable when a local file is selected
                          className={hasLocalFile ? "opacity-50 cursor-not-allowed" : ""}
                        />
                        {field.value && !hasLocalFile && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewImage(null)
                              field.onChange("")
                            }}
                          >
                            Clear URL
                          </Button>
                        )}
                      </div>

                      {hasLocalFile && (
                        <p className="text-sm text-muted-foreground">
                          URL input is disabled while using a local file. Clear the file selection to use a URL.
                        </p>
                      )} */}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* category */}
            <FormField
              control={form.control}
              name="categoryid"
              render={({ field }) => (
                <FormItem className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <FormLabel className="font-medium">Category</FormLabel>
                  <FormControl>
                    <CategorySearch categories={categories} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Schedule Frequency */}
            <FormField
              control={form.control}
              name="scheduleFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a frequency">
                          {frequencyList.find((freq) => freq.id === field.value)?.name || "Select a frequency"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyList.map((freq) => (
                        <SelectItem key={freq.id} value={freq.id}>
                          {freq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Open Day */}
            <FormField
              control={form.control}
              name="openDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Open Day</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Close Day */}
            <FormField
              control={form.control}
              name="closeDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Close Day</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter tour description" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter tour description with rich formatting..."
                      className="min-h-[250px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Next: Destinations</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Export the Frequency enum and frequencyList for use in other parts of the application
export { Frequency, frequencyList }

