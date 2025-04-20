'use client'

import { Button } from '@/components/ui/button';
import { POSTTourScheduleInfoType, ScheduleInfoSchema } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from 'date-fns/locale'
import { CalendarIcon } from "lucide-react"

const scheduleOptions = [
  { value: "Daily", label: "Hàng ngày" },
  { value: "Weekly", label: "Hàng tuần" },
  { value: "Monthly", label: "Hàng tháng" },
]

export default function TourScheduleInfoForm() {
  const { nextStep, prevStep, formData, setTourScheDuleInfo } = useTourStore();

  const form = useForm<POSTTourScheduleInfoType>({
    resolver: zodResolver(ScheduleInfoSchema),
    defaultValues: {
      openDay: formData.openDay,
      closeDay: formData.closeDay,
      scheduleFrequency: formData.scheduleFrequency,
    },
  });

  function onSubmit(data: POSTTourScheduleInfoType) {
    setTourScheDuleInfo(data);
    nextStep();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* openDay */}
              <FormField
                control={form.control}
                name="openDay"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu</FormLabel>
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
                              format(field.value, "EEEE, dd MMMM yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
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
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Chọn ngày tour bắt đầu hoạt động
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* closeDay */}
              <FormField
                control={form.control}
                name="closeDay"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày ngừng khai thác tour</FormLabel>
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
                              format(field.value, "EEEE, dd MMMM yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
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
                          disabled={(date) =>
                            date <= (form.getValues().openDay || new Date())
                          }
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Chọn ngày ngừng khai thác tour
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scheduleFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tần suất lịch trình</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tần suất tour" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scheduleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Tour này diễn ra thường xuyên như thế nào?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between space-x-4">
              <Button type="button" variant="outline" onClick={prevStep}>
                Quay lại
              </Button>
              <Button type="submit">
                Tiếp tục
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
