import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SystemSetting, SystemSettingSchema } from "@/schemaValidations/system.schema"
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

const formSchema = SystemSettingSchema.omit({ id: true })
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
          settingCode: initialData.settingCode,
          settingKey: initialData.settingKey,
          settingValue: initialData.settingValue,
        }
      : {
          settingCode: "",
          settingKey: "",
          settingValue: 0,
        },
  })

  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="settingCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setting Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter setting code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settingKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setting Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter setting key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settingValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setting Value</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter setting value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 