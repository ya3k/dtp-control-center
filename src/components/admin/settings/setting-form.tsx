import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SystemSetting, putSystemSettingSchema } from "@/schemaValidations/system.schema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = putSystemSettingSchema
type FormValues = z.infer<typeof formSchema>

interface SettingFormProps {
  initialData?: SystemSetting
  onSubmit: (data: FormValues) => Promise<void>
  isSubmitting: boolean
  onCancel: () => void
}

export function SettingForm({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}: SettingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          settingValue: initialData.settingValue,
        }
      : {
          id: "",
          settingValue: 0,
        },
  })

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
  }

  const getUnit = (settingKey: string) => {
    if (settingKey.toLowerCase().includes('date')) {
      return 'ngày'
    } else if (settingKey.toLowerCase().includes('phần trăm')) {
      return '%'
    }
    return ''
  }

  const getStep = (settingKey: string) => {
    if (settingKey.toLowerCase().includes('phần trăm')) {
      return 5
    }
    return 1
  }

  const unit = initialData ? getUnit(initialData.settingKey) : ''
  const step = initialData ? getStep(initialData.settingKey) : 1

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Setting Code</div>
          <div className="text-sm text-muted-foreground">{initialData?.settingCode}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Setting Key</div>
          <div className="text-sm text-muted-foreground">{initialData?.settingKey}</div>
        </div>

        <FormField
          control={form.control}
          name="settingValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setting Value</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="number" 
                    placeholder="Enter setting value" 
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                    }}
                    step={step}
                  />
                  {unit && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground mr-5">
                      {unit}
                    </span>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 