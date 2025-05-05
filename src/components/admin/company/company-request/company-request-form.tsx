"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { CompanyRequestSchema, TCompanyQuestBodyType } from "@/schemaValidations/company.schema"
import companyApiRequest from "@/apiRequests/company"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function CompanyRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Khởi tạo biểu mẫu với hook useForm
  const form = useForm<TCompanyQuestBodyType>({
    resolver: zodResolver(CompanyRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      taxCode: "",
      commissionRate: 0
    },
  })

  // Xử lý khi người dùng gửi biểu mẫu
  async function onSubmit(data: TCompanyQuestBodyType) {
    setIsSubmitting(true)
    
    try {
      // console.log(`Request body: `, JSON.stringify(data));
      console.log(JSON.stringify(data))

      const response = await companyApiRequest.create(data);
      console.log(response)
      if (response.payload.success == true) {
        toast.success(`Đơn đăng ký đã được gửi!`)
        form.reset()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo cong ty")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng ký công ty</CardTitle>
        <CardDescription>Nhập thông tin công ty để đăng ký.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên công ty</FormLabel>
                  <FormControl>
                    <Input placeholder="Công ty TNHH ABC" {...field} />
                  </FormControl>
                  <FormDescription>Tên đăng ký chính thức của công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="lienhe@congty.com" {...field} />
                  </FormControl>
                  <FormDescription>Email liên hệ chính của công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="+84 123 456 789" {...field} />
                  </FormControl>
                  <FormDescription>Số điện thoại liên hệ chính.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ công ty</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Số 1, ...." {...field} />
                  </FormControl>
                  <FormDescription>Địa chỉ công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số thuế</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormDescription>Mã số thuế của công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phần trăm hoa hồng mong muốn chia cho nền tảng</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="10" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : 0;
                        field.onChange(value);
                      }}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </FormControl>
                  <FormDescription>Phần trăm hoa hồng mong muốn chia cho nền tảng(0-100%).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Gửi đơn đăng ký"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>Không được để trống bất kỳ trường nào</p>
        <p>Thông tin công ty sẽ được xem xét và duyệt</p>
      </CardFooter>
    </Card>
  )
}
