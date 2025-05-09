/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { links } from "@/configs/routes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/common/loading/LoadingButton";

import authApiRequest from "@/apiRequests/auth";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/schemaValidations/auth.schema";

export default function ResetPasswordForm() {
const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const confirmationToken = searchParams.get("confirmationToken") || null;

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    if (!confirmationToken) {
      console.error("No confirmation token provided in URL.");
      return;
    }
    try {
      setLoading(true);
      const data = {
        confirmationToken: decodeURIComponent(
          confirmationToken.replace(/ /g, "+"),
        ),
        newPassword: values.password,
      };
      const response = await authApiRequest.resetPassword(data);
      if (response.status !== 200) {
        console.log("Error response:", response);
        toast.error("Không thể đặt lại mật khẩu. Vui lòng thử lại sau.");
      }
      setIsSubmitted(true);
      toast.success("Mật khẩu đã được đặt lại thành công");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(
        error?.payload?.message ||
          "Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-core">
            Đặt lại mật khẩu thành công
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Mật khẩu của bạn đã được đặt lại thành công. Giờ đây bạn có thể đăng
            nhập bằng mật khẩu mới.
          </p>
        </div>
        <div className="grid gap-6">
          <Button variant="core" asChild>
            <Link href={links.login.href}>Đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="relative">
        <form
          noValidate
          className={cn("flex flex-col gap-6")}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold text-core">Đặt mật khẩu mới</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-core">Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ hoa, chữ
                    thường, số và ký tự đặc biệt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-core">Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton pending={isLoading}>Đặt lại mật khẩu</LoadingButton>
            {!isLoading && (
              <Button variant="outline" asChild>
                <Link href={links.login.href}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            )}
          </div>
        </form>
      </div>
    </Form>
  );
}
