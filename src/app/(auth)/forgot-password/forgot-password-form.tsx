/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import LoadingButton from "@/components/common/loading/LoadingButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { links } from "@/configs/routes";
import { ArrowLeft, CheckCircle } from "lucide-react";

import envConfig from "@/configs/envConfig";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { forgotPasswordSchema, ForgotPasswordSchemaType } from "@/schemaValidations/auth.schema";

export default function ForgotPasswordForm() {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    try {
      const data = {
        email: values.email,
        confirmUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.resetPassword.href}`,
      };
      const response = await authApiRequest.forgotPassword(data);
      if (response.status !== 200) {
        console.log("Error response:", response);
      }
      setUserEmail(values.email);
      setIsSubmitted(true);
      toast.success("Email đặt lại mật khẩu đã được gửi");
    } catch (error: any) {
      if (error instanceof HttpError) {
        console.error("Error requesting password reset:", error);
        toast.error(
          error?.payload?.message || "Không thể gửi email đặt lại mật khẩu",
        );
      } else {
        toast.error("Có lỗi xảy ra trong quá trình gửi email đặt lại mật khẩu");
      }
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
            Kiểm tra email của bạn
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Chúng tôi đã gửi email đến <strong>{userEmail}</strong> với liên kết
            để đặt lại mật khẩu của bạn.
          </p>
        </div>
        <div className="grid gap-6">
          <p className="text-center text-sm text-muted-foreground">
            Nếu không nhận được email, vui lòng kiểm tra thư mục spam hoặc thử
            lại.
          </p>
          <Button variant="core" onClick={() => setIsSubmitted(false)}>
            Thử lại
          </Button>
          <Button variant="outline" asChild>
            <Link href={links.login.href}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Link>
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
            <h1 className="text-2xl font-bold text-core">Đặt lại mật khẩu</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật
              khẩu
            </p>
          </div>
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-core">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton pending={isLoading}>
              Gửi liên kết đặt lại
            </LoadingButton>
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
