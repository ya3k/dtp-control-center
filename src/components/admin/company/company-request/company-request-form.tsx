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
import Link from "next/link"

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
      // console.log(JSON.stringify(data))

      const response = await companyApiRequest.create(data);
      // console.log(response)
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
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-t-core">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center">Đăng ký công ty</CardTitle>
        <CardDescription className="text-center text-muted-foreground">Nhập thông tin công ty để đăng ký.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Tên công ty</FormLabel>
                    <FormControl>
                      <Input placeholder="Công ty TNHH ABC" className="focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Tên đăng ký chính thức của công ty.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="lienhe@congty.com" className="focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Email liên hệ chính của công ty.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0912345678" className="focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Số điện thoại liên hệ chính.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" className="focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">Mã số thuế của công ty.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Địa chỉ công ty</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Số 1, ...." className="focus-visible:ring-primary" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Địa chỉ đăng ký kinh doanh của công ty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Phần trăm hoa hồng</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="10"
                        className="pr-8 focus-visible:ring-primary"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : 0;
                          field.onChange(value);
                        }}
                        min={0}
                        max={100}
                        step={0.1}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">Phần trăm hoa hồng mong muốn chia cho nền tảng (0-100%).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant={'core'}
              type="submit"
              className="w-full mt-6 font-semibold py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Gửi đơn đăng ký"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between text-sm text-muted-foreground border-t pt-4">
        <p className="mb-2 sm:mb-0">⚠️ Không được để trống bất kỳ trường nào</p>
        <p>📋 Thông tin công ty sẽ được xem xét và duyệt</p>

      </CardFooter>
      <div className="ml-4 mb-4">
        <Link href={'/'} className="underline">Trở lại đăng nhập</Link>

      </div>
    </Card>
  )
}
