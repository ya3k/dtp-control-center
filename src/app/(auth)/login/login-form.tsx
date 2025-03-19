/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { cn, handleErrorApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { links } from "@/configs/routes";
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
      console.log("response", response);
      const responseFromNextServer: any =
        await authApiRequest.setToken(response);

      if (responseFromNextServer.payload.success) {
        toast.success("Đăng nhập thành công");
        router.push(links.home.href);
        router.refresh();
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
            Điền username và mật khẩu để đăng nhập
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-core">Username</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Link
                    href="#"
                    className="ml-auto text-sm font-light text-[#0A0A0A] underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu ?
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input {...field} type={"password"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton pending={loading}>Đăng nhập</LoadingButton>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Hoặc tiếp tục với
            </span>
          </div>
          <Button variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Đăng nhập bằng Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link
            href={links.register.href}
            className="underline underline-offset-4"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </Form>
  );
}
