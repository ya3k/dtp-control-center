"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PutUserBodyType, putUserSchema, UserResType } from "@/schemaValidations/admin-user.schema";
import userApiRequest from "@/apiRequests/user";

interface EditUserDialogProps {
  user: UserResType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditComplete: () => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onEditComplete,
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserResType | null>(null);

  // Create form with updated schema
  const form = useForm<PutUserBodyType>({
    resolver: zodResolver(putUserSchema),
    defaultValues: {
      id: "",
      userName: "",
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      roleName: "",
    },
  });

  // Fetch user details when dialog opens
  useEffect(() => {
    async function fetchUserDetails() {
      if (open && user?.id) {
        setIsLoading(true);
        try {
          const response = await userApiRequest.getById(user.id);
          if (response.status === 200 && response.payload.success) {
            const userData = response.payload.data;
            setUserDetails(userData);
            // Update form with fetched data
            form.reset({
              id: userData.id,
              userName: userData.userName,
              name: userData.name,
              email: userData.email,
              phoneNumber: userData.phoneNumber,
              address: userData.address,
              roleName: userData.roleName,
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Không thể tải thông tin người dùng");
          onOpenChange(false); // Close dialog on error
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchUserDetails();
  }, [open, user?.id, form, onOpenChange]);

  // Handle form submission
  const onSubmit = async (data: PutUserBodyType) => {
    if (!userDetails?.id) return;

    setIsSubmitting(true);
    try {
      const response = await userApiRequest.update(data);
      if (response.status === 200) {
        toast.success("Cập nhật người dùng thành công");
        onOpenChange(false);
        onEditComplete();
      }
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
      setUserDetails(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Đang tải thông tin...</span>
          </div>
        ) : (
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@email.com" {...field} />
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

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}