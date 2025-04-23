/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn, handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { adminLinks, links, operatorLinks } from "@/configs/routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginSchemaType } from "@/schemaValidations/auth.schema";
import LoadingButton from "@/components/common/loading/LoadingButton";
import { useState } from "react";
import authApiRequest from "@/apiRequests/auth";
import { UserRoleEnum } from "@/types/user";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      setLoading(true);
      const response: any = await authApiRequest.login({
        userName: values.userName,
        password: values.password,
      });

      // Check if user's role is Tourist before setting tokens
      if (response.payload && response.payload.data.role === UserRoleEnum.Tourist) {
        toast.error("Tài khoản của bạn không được phép đăng nhập vào hệ thống này");
        return;
      }
      // Only set token if not a Tourist
      const responseFromNextServer: any =
        await authApiRequest.setToken(response);

      if (responseFromNextServer.payload.success) {
        window.notifyAuthChange?.();
        toast.success("Đăng nhập thành công");
        // Instead of router.refresh(), use router.push() to explicitly navigate
        if (response.payload.role === UserRoleEnum.Admin) {
          router.push(adminLinks.dashboard.href);
        } else if (response.payload.role === UserRoleEnum.Operator) {
          router.push(operatorLinks.dashboard.href);
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      handleErrorApi(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-core">Đăng nhập</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Điền tên người dùng hoặc email và mật khẩu để đăng nhập
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-core">Tên người dùng hoặc email</FormLabel>
                <FormControl >
                  <Input {...field} placeholder="Nhập tên người dùng"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <span className="text-core"> Mật khẩu </span>
                 
                </FormLabel>
                <FormControl>
                  <Input {...field} type={"password"} placeholder="Nhập mật khẩu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton pending={loading}>Đăng nhập</LoadingButton>

          <div  className="text-end text-sm underline">
            <Link href={`/partner`} >
              Đăng ký công ty
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}