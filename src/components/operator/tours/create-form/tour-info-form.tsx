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
import { CreateTourBodyType, CreateTourInfoType, tourInfoPostSchema } from "@/schemaValidations/tour-operator.shema"

// Define the Categories enum for display
enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly"
}

// Predefined categories with their UUIDs
const categoriesList = [
  { id: "0736d4f7-832a-4613-8d1a-c3e793a93549", name: "Adventure" },
  { id: "19c4e172-e089-450c-891d-2d8a756b992c", name: "Cultural" }
]

const frequencyList = [
  { id: Frequency.Daily, name: "Daily" },
  { id: Frequency.Weekly, name: "Weekly" },
  { id: Frequency.Monthly, name: "Monthly" }
]

interface TourInfoFormProps {
  data: Partial<CreateTourBodyType>
  updateData: (data: Partial<CreateTourBodyType>) => void
  onNext: () => void
}

export function TourInfoForm({ data, updateData, onNext }: TourInfoFormProps) {
  const form = useForm<CreateTourInfoType>({
    resolver: zodResolver(tourInfoPostSchema),
    defaultValues: {
      title: data.title || "",
      img: data.img || "",
      categoryid: data.categoryid || categoriesList[0].id,
      scheduleFrequency: data.scheduleFrequency as Frequency || Frequency.Daily,
      openDay: data.openDay || "",
      closeDay: data.closeDay || "",
      duration: data.duration || 1,
      description: data.description || "",
    },
  })

  const onSubmit = (values: CreateTourInfoType) => {
    updateData(values)
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
                  <FormLabel>Ảnh Thumnail cho Tour</FormLabel>
                  <FormControl>
                    <Input placeholder="link ảnh" {...field} />
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
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category">
                          {categoriesList.find(cat => cat.id === field.value)?.name || "Select a category"}
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
                          {frequencyList.find(freq => freq.id === field.value)?.name || "Select a frequency"}
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

            {/* Description */}
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
              <Button type="submit">Next: Destinations</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Export the Categories enum and frequencyList for use in other parts of the application
export { Frequency, frequencyList }
