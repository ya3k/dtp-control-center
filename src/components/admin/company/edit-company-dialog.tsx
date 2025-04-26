"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { CompanyPUTSchema, TCompanyPUTBodyType, type CompanyResType } from "@/schemaValidations/company.schema"
import companyApiRequest from "@/apiRequests/company"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface EditCompanyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    company: CompanyResType | null
    onEditComplete: (updatedCompany: CompanyResType) => void
}

export function EditCompanyDialog({ open, onOpenChange, company, onEditComplete }: EditCompanyDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<TCompanyPUTBodyType>({
        resolver: zodResolver(CompanyPUTSchema),
        defaultValues: {
            id: company?.id || "",
            name: company?.name || "",
            email: company?.email || "",
            phone: company?.phone || "",
            address: company?.address || "",
            taxCode: company?.taxCode || "",
            commissionRate: company?.commissionRate || 0,
        },
    })

    useEffect(() => {
        if (company) {
            form.reset({
                id: company.id || "",
                name: company.name || "",
                email: company.email || "",
                phone: company.phone || "",
                address: company.address || "",
                taxCode: company.taxCode || "",
                commissionRate: company.commissionRate || 0,
            })
        }
    }, [company, form])

    async function onSubmit(data: TCompanyPUTBodyType) {
        setIsSubmitting(true)
        try {
            // console.log(JSON.stringify(data))

            await companyApiRequest.update(data)
            console.log(JSON.stringify(data))
            const updatedCompany: CompanyResType = {
                ...company!,
                ...data,
            }
            toast.success(`Đã cập nhật thông tin công ty ${data.name}`)

            onOpenChange(false)
            onEditComplete(updatedCompany)
        } catch (error) {
            // console.error("Error updating company:", error)
            toast.error("Không thể cập nhật thông tin công ty")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Chỉnh sửa thông tin công ty</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên công ty</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên công ty" {...field} />
                                    </FormControl>
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
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="Số điện thoại" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Địa chỉ" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="Mã số thuế" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="commissionRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phần trăm hoa hồng</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Phần trăm hoa hồng"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
