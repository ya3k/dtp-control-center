"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PostUserBodyType, postUserSchema, Role } from "@/schemaValidations/admin-user.schema"
import userApiRequest from "@/apiRequests/user"
import companyApiRequest from "@/apiRequests/company"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateComplete: () => void
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onCreateComplete
}: CreateUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<{ id: string, name: string }[]>([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const form = useForm<PostUserBodyType>({
    resolver: zodResolver(postUserSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      address: "",
      roleName: Role.Tourist,
      phoneNumber: "",
      companyId: undefined, // Make it undefined by default since it's optional
    }
  })
  // Get the selected role to conditionally show company field
  const selectedRole = form?.watch?.("roleName")
  const showCompanyField = selectedRole === Role.Operator

  // Create form


  // Fetch companies when dialog opens
  useEffect(() => {
    if (open && showCompanyField) {
      fetchCompanies()
    }
  }, [open, showCompanyField])

  // Reset companyId when role changes
  useEffect(() => {
    if (!showCompanyField) {
      form.setValue("companyId", undefined)
    }
  }, [selectedRole, form])

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    setIsLoadingCompanies(true)
    try {
      const response = await companyApiRequest.getWithOData()
      setCompanies(response?.payload?.value || [])
    } catch (error) {
      console.error("Error fetching companies:", error)
      toast.error("Failed to load companies")
    } finally {
      setIsLoadingCompanies(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: PostUserBodyType) => {
    setIsSubmitting(true)

    // If companyId is not required for this role, remove it from submission
    const submitData = { ...data }
    if (!showCompanyField) {
      delete submitData.companyId
    }

    try {
      await userApiRequest.create(submitData)

      // Show success message
      toast.success("Người dùng đã được tạo thành công")

      // Close dialog and reset form
      onOpenChange(false)
      form.reset()

      // Notify parent component to refresh data
      onCreateComplete()
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Không thể tạo người dùng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tạo người dùng mới</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đăng nhập" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Role */}
              <FormField
                control={form.control}
                name="roleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Role).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company - Only shown for Operator role */}
              {showCompanyField && (
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Công ty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingCompanies}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn công ty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Bắt buộc cho người dùng có vai trò Operator
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  'Tạo người dùng'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}