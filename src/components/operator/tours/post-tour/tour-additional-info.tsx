'use client'

import { Button } from '@/components/ui/button';
import { AdditionalInfoSchema, POSTTourAdditionalInfoType } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { TiptapEditor } from '@/components/common/tiptap-editor';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function TourAdditionalInfo() {
  const { prevStep, nextStep, formData, setTourAdditionalInfo } = useTourStore();
  const [openSections, setOpenSections] = useState({
    about: true,
    include: false,
    pickup: false,
  });

  const form = useForm<POSTTourAdditionalInfoType>({
    resolver: zodResolver(AdditionalInfoSchema),
    defaultValues: {
      about: formData.about,
      include: formData.include,
      pickinfor: formData.pickinfor,
    },
  });

  function onSubmitForm(data: POSTTourAdditionalInfoType) {
    setTourAdditionalInfo(data);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 pb-12">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Collapsible
              open={openSections.about}
              onOpenChange={(isOpen) => setOpenSections({ ...openSections, about: isOpen })}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-medium transition-colors hover:bg-muted/50">
                <h4 className="text-sm font-semibold">
                  Giới thiệu về tour <span className="text-red-600">*</span>
                </h4>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.about ? 'transform rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Giới thiệu về tour'
                          className="min-h-[200px] p-3 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả chi tiết về tour, những điểm đặc sắc và trải nghiệm du khách sẽ có.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSections.include}
              onOpenChange={(isOpen) => setOpenSections({ ...openSections, include: isOpen })}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-medium transition-colors hover:bg-muted/50">
              <h4 className="text-sm font-semibold">
              Các dịch vụ bao gồm của tour
              <span className="text-red-600">*</span>
                </h4>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.include ? 'transform rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <FormField
                  control={form.control}
                  name="include"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Các dịch vụ bao gồm của tour'
                          className="min-h-[200px] p-3 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                        />
                      </FormControl>
                      <FormDescription>
                        Liệt kê các dịch vụ, tiện ích được bao gồm trong tour.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible
              open={openSections.pickup}
              onOpenChange={(isOpen) => setOpenSections({ ...openSections, pickup: isOpen })}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-medium transition-colors hover:bg-muted/50">
              <h4 className="text-sm font-semibold">
              Chi tiết thông tin đón / trả khách.
              <span className="text-red-600">*</span>
                </h4>
                <ChevronDown className={`h-4 w-4 transition-transform ${openSections.pickup ? 'transform rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <FormField
                  control={form.control}
                  name="pickinfor"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                     
                      <FormControl>
                        <TiptapEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder='Thông tin đón và trả khách'
                          className="min-h-[200px] p-3 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                        />
                      </FormControl>
                      <FormDescription>
                        Cung cấp thông tin chi tiết về địa điểm, thời gian và cách thức đón/trả khách.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        <div className="flex justify-between space-x-4">
          <Button type="button" variant="outline" onClick={prevStep}>
            Quay lại
          </Button>
          <Button variant={"core"} type="submit">
            Tiếp theo
          </Button>
        </div>
      </form>
    </Form>
  )
}
