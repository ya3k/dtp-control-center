/* eslint-disable @typescript-eslint/no-explicit-any */
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const clearCookies = () => {
  return ["_auth", "cont_auth"]
    .map(
      (name) =>
        `${name}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`,
    )
    .join(", ");
};

export async function POST(req: Request) {
  const res = await req.json();
  const force = res.force as boolean | undefined;
  if (force) {
    return NextResponse.json(
      {
        success: true,
        message: "Buộc đăng xuất thành công",
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": clearCookies(),
        },
      },
    );
  }
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("_auth");

  if (!sessionToken) {
    return NextResponse.json(
      {
        success: false,
        message: "Session token not found",
      },
      { status: 401 },
    );
  }
  try {
    const response: any = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value,
    );
    console.log("logout response: ", response);
    if (response.payload.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Đăng xuất thành công",
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": clearCookies(),
          },
        },
      );
    } else {
      return Response.json(
        {
          success: false,
        },
        {
          status: 401,
          headers: {
            "Set-Cookie": clearCookies(),
          },
        },
      );
    }
  } catch (error) {
    console.error("Error in logout:", error);
    if (error instanceof HttpError) {
      return NextResponse.json(error.payload, {
        status: error.status,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Có lỗi xảy ra trong quá trình đăng xuất",
        },
        { status: 500 },
      );
    }
  }
}
