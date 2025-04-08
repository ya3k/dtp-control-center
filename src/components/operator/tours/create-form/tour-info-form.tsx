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

// Define the Frequency enum for display
enum Frequency {
  Daily = "Hằng ngày",
  Weekly = "Hằng tuần",
  Monthly = "Hằng tháng",
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
      openDay: data.openDay || "",
      closeDay: data.closeDay || "",
      description: data.description || "",
      about: data.about || "",
      include: data.include || '',
      peekInfor: data.peekInfor || "",
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
      include: data.include || '',
      peekInfor: data.peekInfor || "",

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
                  <FormItem>
                    <FormLabel>Chu kỳ Tour <span className="text-red-600">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Open Day and Close Day */}

              {/* Open Day */}
              <FormField
                control={form.control}
                name="openDay"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Ngày mở Tour <span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                  <FormItem className="flex-1">
                    <FormLabel>Ngày đóng Tour <span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                  
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm nổi bật <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập điểm nổi bật" className="min-h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm nổi bật</FormLabel>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập một số điểm nổi bật của tour..."
                      className="min-h-[250px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            {/* about */}
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Về dịch vụ này <span className="text-red-600">*</span></FormLabel>
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

            {/* what's inclue */}
            <FormField
              control={form.control}
              name="include"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bao gồm những gì <span className="text-red-600">*</span></FormLabel>
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

<FormField
              control={form.control}
              name="peekInfor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thông tin đón và gặp gỡ khách <span className="text-red-600">*</span></FormLabel>
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

