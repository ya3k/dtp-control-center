/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { cn, handleErrorApi } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { adminLinks, managerLinks, operatorLinks } from "@/configs/routes";
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
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "@/firebase";
import envConfig from "@/configs/envConfig";
import userApiRequest from "@/apiRequests/user";
import { useAuthContext } from "@/providers/AuthProvider";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const password = form.watch("password");

  // Function to get FCM token
  const getFcmToken = async () => {
    try {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        const messaging = getMessaging(firebaseApp);

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: envConfig.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (currentToken) {
            // console.log(currentToken);
            return currentToken;
          } else {
            console.log(
              "No registration token available. Request permission to generate one.",
            );
            return null;
          }
        }
      }
      return null;
    } catch (error) {
      console.log("Error retrieving FCM token:", error);
      return null;
    }
  };

  const onSubmit = async (values: LoginSchemaType) => {
    try {
      setLoading(true);
      const response: any = await authApiRequest.login({
        userName: values.userName,
        password: values.password,
      });

      // Check if user's role is Tourist before setting tokens
      if (
        response.payload &&
        response.payload.data.role === UserRoleEnum.Tourist
      ) {
        toast.error(
          "Tài khoản của bạn không được phép đăng nhập vào hệ thống này",
        );
        return;
      }
      // Only set token if not a Tourist
      const responseFromNextServer: any =
        await authApiRequest.setToken(response);

      if (responseFromNextServer.payload.success) {
        window.notifyAuthChange?.();
        try {
          const res = await userApiRequest.me(
            response.payload.data.accessToken,
          );
          if (res.status === 200) {
            setUser(res.payload.data);
          }
        } catch (error) {
          console.log("Get user info error", error);
        }

        // Get and store FCM token after successful login
        try {
          const fcmToken = await getFcmToken();
          if (fcmToken) {
            await authApiRequest.storeToken(fcmToken);
            console.log("FCM token stored successfully");
          }
        } catch (error) {
          console.error("Failed to store FCM token:", error);
          // Don't block the login process if storing FCM token fails
        }

        // Instead of router.refresh(), use router.push() to explicitly navigate
        if (response.payload.data.role === UserRoleEnum.Admin) {
          router.push(adminLinks.dashboard.href);
        } else if (response.payload.data.role === UserRoleEnum.Operator) {
          router.push(operatorLinks.dashboard.href);
        } else if (response.payload.data.role === UserRoleEnum.Manager) {
          router.push(managerLinks.dashboard.href);
        } else {
          router.push("/");
        }
      }
      toast.success("Đăng nhập thành công");
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
                <FormLabel className="text-core">
                  Tên người dùng hoặc email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Nhập tên người dùng hoặc email"
                  />
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
                <FormLabel className="flex justify-between items-center text-sm font-medium text-gray-700 mb-1">
                  <span className="text-core">Mật khẩu</span>
                  <Link
                    href="/forgot-password"
                    className="text-sm hover:underline"
                  >
                   Quên mật khẩu
                  </Link>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                    />

                    {password && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton pending={loading}>Đăng nhập</LoadingButton>

          <div className="text-end text-sm underline">
            <Link href={`/partner`}>Đăng ký công ty</Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
