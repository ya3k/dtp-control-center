'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useTourStore from '@/store/tourStore'
import { BasicTourInfoSchema, POSTBasicTourInfoType } from "@/schemaValidations/crud-tour.schema"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { X, Plus } from "lucide-react"

export default function BasicTourInfoForm() {
  const { nextStep, formData, setBasicTourInfo } = useTourStore();
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<POSTBasicTourInfoType>({
    resolver: zodResolver(BasicTourInfoSchema),
    defaultValues: {
      title: formData.title,
      img: formData.img || [],
      categoryid: formData.categoryid,
      description: formData.description,
    },
  });

  function onSubmit(data: POSTBasicTourInfoType) {
    setBasicTourInfo(data)
    nextStep()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tour title" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your tour&apos;s display title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Images</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (newImageUrl) {
                            field.onChange([...field.value || [], newImageUrl]);
                            setNewImageUrl("");
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {field.value?.map((url, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={url} readOnly />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              const newUrls = field.value.filter((_, i) => i !== index);
                              field.onChange(newUrls);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormDescription>
                    Add image URLs for your tour. At least one image is required.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Select tour category" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the category this tour belongs to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tour description"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the tour.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />



            <div className="flex justify-end space-x-4">
              <Button type="submit">
                Next Step
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
