"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { sessionToken as clientSessionToken } from "@/lib/http";
import authApiRequest from "@/apiRequests/auth";
import { links } from "@/configs/routes";

export default function LogoutPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");
  const [isLoading, setIsLoading] = useState(true);
  console.log("sessionToken", sessionToken);

  useLayoutEffect(() => {
    if (sessionToken === clientSessionToken.value) {
      setIsLoading(true);
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        setIsLoading(false);
        setTimeout(() => {
          window.location.replace(
            `${links.login.href}?redirectFrom=${pathname}`,
          );
        }, 2000);
      });
    }
  }, [sessionToken, pathname]);
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/binhdinhtour3.png"
            alt="Logo"
            width={120}
            height={80}
            className="h-auto"
            priority
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-core" />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Đang đăng xuất...
            </h2>
            <p className="mt-2 text-gray-500">Vui lòng đợi trong giây lát.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              Đăng xuất thành công
            </h2>
            <p className="mt-2 text-gray-500">
              Bạn sẽ được chuyển hướng đến trang đăng nhập.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
