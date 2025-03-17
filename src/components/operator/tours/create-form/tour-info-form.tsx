"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { CreateTourBodyType, CreateTourInfoType, tourInfoPostSchema } from "@/schemaValidations/tour-operator.shema"
import categoryApiRequest from "@/apiRequests/category"
import { useEffect, useState } from "react"
import { CategoryType } from "@/schemaValidations/category.schema"
import CategorySearch from "../categories-search"
// Define the Categories enum for display
enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly"
}



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
  const [categories, setCategories] = useState<CategoryType[]>([])
  const form = useForm<CreateTourInfoType>({
    resolver: zodResolver(tourInfoPostSchema),
    defaultValues: {
      title: data.title || "",
      img: data.img || "",
      categoryid: data.categoryid || "",
      scheduleFrequency: data.scheduleFrequency as Frequency || Frequency.Daily,
      openDay: data.openDay || "",
      closeDay: data.closeDay || "",
      duration: data.duration || 1,
      description: data.description || "",
    },
  })

  const fetchCategory = async () => {
    try {
      const response = await categoryApiRequest.get();
      const data = await response.payload.value;
      setCategories(data);
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCategory();
  }, [])

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
                <FormItem className="space-y-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <FormLabel className="font-medium">Category</FormLabel>
                  <FormControl>
                    <CategorySearch
                      categories={categories}
                      value={field.value}
                      onChange={field.onChange}

                    />
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
