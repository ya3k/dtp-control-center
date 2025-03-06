"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { Tour } from "@/types/schema/TourSchema"

// Define the Categories enum for display
enum Categories {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly"
}

// Predefined categories with their UUIDs
const categoriesList = [
  {
    id: "eed52b33-866d-4eaa-bc49-ec5fc264830b",
    name: Categories.Daily
  },
  {
    id: "eed52b33-866d-4eaa-bc49-ec5fc264830c",
    name: Categories.Weekly
  },
  {
    id: "eed52b33-866d-4eaa-bc49-ec5fc264830d",
    name: Categories.Monthly
  }
]

// Create a subset schema for the tour info step
const tourInfoSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    category: z.string().uuid("Please select a valid category"),
    openDay: z.string(),
    closeDay: z.string(),
    description: z.string().min(10, "Description must be at least 10 characters"),
  });

type TourInfoFormValues = z.infer<typeof tourInfoSchema>

interface TourInfoFormProps {
  data: Partial<Tour>
  updateData: (data: Partial<Tour>) => void
  onNext: () => void
}

export function TourInfoForm({ data, updateData, onNext }: TourInfoFormProps) {
  const form = useForm<TourInfoFormValues>({
    resolver: zodResolver(tourInfoSchema),
    defaultValues: {
      title: data.title || "",
      category: data.category || categoriesList[0].id,
      openDay: data.openDay || "",
      closeDay: data.closeDay || "",
      description: data.description || "",

    },
  })

  const onSubmit = (values: TourInfoFormValues) => {
    console.log(`form: ${values}`)
    updateData(values)
    console.log(`form: ${values}`)

    onNext();
  }

  // Helper function to get category name by UUID
  const getCategoryName = (uuid: string) => {
    const category = categoriesList.find(cat => cat.id === uuid)
    return category ? category.name : "Unknown Category"
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(
            (values) => {
              console.log("Form validation passed:", values);
              onSubmit(values);
            },
            (errors) => {
              console.error("Form validation failed:", errors);
            }
          )} className="space-y-6">
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
            {/* category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category">
                          {getCategoryName(field.value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesList.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
            {/* close Day */}
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
            {/* des */}
            <FormField
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
            />

            <div className="flex justify-end">
              <Button type="submit" onClick={() => console.log("Button clicked")}>Next: Destinations</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Export the Categories enum and categoriesList for use in other parts of the application
export { Categories, categoriesList }