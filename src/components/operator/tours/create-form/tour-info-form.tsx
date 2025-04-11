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
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

// Define the Frequency enum for display
enum Frequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
}

const frequencyList = [
  { id: Frequency.Daily, name: "Hằng ngày" },
  { id: Frequency.Weekly, name: "Hằng tuần" },
  { id: Frequency.Monthly, name: "Hằng tháng" },
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
      openDay: data.openDay ? new Date(data.openDay) : undefined,
      closeDay: data.closeDay ? new Date(data.closeDay) : undefined,
      description: data.description || "",
      about: data.about || "",
      include: data.include || '',
      pickinfor: data.pickinfor || "",
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
      scheduleFrequency: values.scheduleFrequency,
      about: values.about || "",
      include: values.include || '',
      pickinfor: values.pickinfor || "",

    }

    updateData(formattedValues)
    onNext()
  }

  return (
    <Card>
      <CardContent className="pt-6 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề..." {...field} />
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
                  <FormLabel>Ảnh Thumnail cho Tour <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <div className="flex items-start gap-4">
                      {/* Left: Image Preview */}
                      {previewImage && (
                        <div className="relative w-2/5 h-40 overflow-hidden rounded-md">
                          <Image
                            width={500}
                            height={500}
                            src={previewImage || "/placeholder.svg"}
                            alt="Tour thumbnail preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      {/* Right: Input Field */}
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Store the file for later upload
                              setTourImageFile(file);

                              // Create a preview URL
                              const previewUrl = URL.createObjectURL(file);
                              setPreviewImage(previewUrl);

                              // Clear any existing URL input
                              field.onChange("");
                            }
                          }}
                          className="w-full"
                        />
                        {previewImage && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewImage(null);
                              setTourImageFile(null);
                              field.onChange("");

                              // Reset the file input
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                          >
                            Xóa ảnh
                          </Button>
                        )}
                      </div>
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
                  <FormLabel className="font-medium">Loại Tour <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <CategorySearch categories={categories} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Tour schedule */}
            <div className="flex gap-6">
              {/* Schedule Frequency */}
              <FormField
                control={form.control}
                name="scheduleFrequency"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Chu kỳ Tour <span className="text-red-600">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn chu kỳ Tour">
                            {frequencyList.find((freq) => freq.id === field.value)?.name || "Chọn chu kỳ Tour"}
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
                  <FormItem className="flex-1">
                    <FormLabel>Ngày mở Tour <span className="text-red-600">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày mở tour</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Close Day */}
              <FormField
                control={form.control}
                name="closeDay"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ngày đóng Tour <span className="text-red-600">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày đóng tour</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const openDay = form.getValues("openDay");
                            // Disable dates before today and before openDay
                            return date < new Date() || (openDay && date < openDay);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Description */}
            <Collapsible className="w-full space-y-2">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                  <h4 className="text-sm font-semibold">
                    Điểm nổi bật <span className="text-red-600">*</span>
                  </h4>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Nhập điểm nổi bật" className="min-h-32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* about */}
            <Collapsible className="w-full space-y-2">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                  <h4 className="text-sm font-semibold">
                    Về dịch vụ này <span className="text-red-600">*</span>
                  </h4>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Thông tin thêm về dịch vụ này..."
                          className="min-h-[250px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            {/* what's include */}
            <Collapsible className="w-full space-y-2">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                  <h4 className="text-sm font-semibold">
                    Bao gồm những gì <span className="text-red-600">*</span>
                  </h4>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="include"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Những thứ kèm với tour..."
                          className="min-h-[250px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible className="w-full space-y-2">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between space-x-4 px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                  <h4 className="text-sm font-semibold">
                    Thông tin đón và gặp gỡ khách <span className="text-red-600">*</span>
                  </h4>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <FormField
                  control={form.control}
                  name="pickinfor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Thông tin đón và gặp gỡ khách..."
                          className="min-h-[250px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
            <div className="flex justify-end">
              <Button type="submit">Tiếp theo: Lịch trình</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

// Export the Frequency enum and frequencyList for use in other parts of the application
export { Frequency, frequencyList }

