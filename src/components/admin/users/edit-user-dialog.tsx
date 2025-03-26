"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { PutUserBodyType, putUserSchema, Role, UserResType } from "@/schemaValidations/admin-user.schema"
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

interface EditUserDialogProps {
  user: UserResType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditComplete: (updatedUser: UserResType) => void
}

// Extended type to include companyId
interface ExtendedPutUserBodyType extends PutUserBodyType {
  companyId?: string;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onEditComplete
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<{ id: string, name: string }[]>([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const [userCompanyId, setUserCompanyId] = useState<string | undefined>(undefined)

  // Create form with extended type
  const form = useForm<ExtendedPutUserBodyType>({
    resolver: zodResolver(putUserSchema), // Still use original schema for validation
    defaultValues: {
      id: "",
      userName: "",
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      roleName: "",
      companyId: undefined // Add companyId with undefined default
    }
  })

  // Get the selected role to conditionally show company field
  const selectedRole = form.watch("roleName")
  const showCompanyField = selectedRole === Role.Operator

  // Update form when user changes
  useEffect(() => {
    if (user) {
      // We need to fetch the user details to get all the fields
      // as the UserResType doesn't include everything we need
      fetchUserDetails(user.id);
    }
  }, [user]);

  // Fetch user details
  const fetchUserDetails = async (userId: string) => {
    try {
      const userDetails = await userApiRequest.getById(userId);
      
      // Save the form data
      form.reset({
        id: userDetails.id,
        userName: userDetails.userName,
        name: userDetails.name || "",
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber || "",
        address: userDetails.address || "",
        roleName: userDetails.roleName,
        companyId: userDetails.companyId
      });
      
      // Store company ID separately to restore it if needed
      if (userDetails.companyId) {
        setUserCompanyId(userDetails.companyId);
      }
      
      // If operator role, fetch companies
      if (userDetails.roleName === Role.Operator) {
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  // Reset companyId when role changes
  useEffect(() => {
    if (!showCompanyField) {
      form.setValue("companyId", undefined);
    } else if (userCompanyId) {
      // Restore company ID if switching back to Operator role
      form.setValue("companyId", userCompanyId);
    }
  }, [selectedRole, form, userCompanyId, showCompanyField]);

  // Fetch companies when dialog opens for operator role
  useEffect(() => {
    if (open && showCompanyField) {
      fetchCompanies();
    }
  }, [open, showCompanyField]);

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const response = await companyApiRequest.getWithOData();
      setCompanies(response?.payload?.value || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ExtendedPutUserBodyType) => {
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      // Create a copy of the data for submission
      const submitData = { ...data };
      
      // Remove companyId if not needed for this role
      if (data.roleName !== Role.Operator) {
        delete submitData.companyId;
      }

      const updatedUser = await userApiRequest.update(submitData);
      
      // Show success message
      toast.success("Người dùng đã được cập nhật thành công");
      
      // Close dialog and reset form
      onOpenChange(false);
      
      // Notify parent component of the update
      onEditComplete(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Không thể cập nhật người dùng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa người dùng</DialogTitle>
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
                    Đang cập nhật...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}