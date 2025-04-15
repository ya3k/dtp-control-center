import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export type RefreshTokenRequestType = {
  refreshToken: string;
};
const convertToDate = (maxAge: number) =>
  new Date(Date.now() + maxAge * 1000).toUTCString();

export async function POST() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("_auth");
  const refreshToken = cookieStore.get("cont_auth");

  if (!sessionToken || !refreshToken) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
        error: ["Unauthorized"],
      },
      { status: 401 },
    );
  }
  try {
    const body: RefreshTokenRequestType = {
      refreshToken: refreshToken?.value || "",
    };
    const response = await authApiRequest.refreshFromNextServerToServer(
      body,
      sessionToken?.value || "",
    );
    const newSessionToken = response?.payload?.data?.accessToken as string;
    const newRefreshToken = response?.payload?.data?.refreshToken as string;
    const role = response?.payload?.data?.role as string;
    const newMaxAge = response?.payload?.data?.expiresIn;

    console.log("res", response);

    const cookies = [
      `_auth=${newSessionToken}; Max-Age=${newMaxAge}; Expires=${convertToDate(newMaxAge)}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      `cont_auth=${newRefreshToken}; Max-Age=${60 * 60 * 24 * 7 /*7 days*/}; Expires=${convertToDate(60 * 60 * 24 * 7 /*7 days*/)}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      `role=${role}; Max-Age=${newMaxAge}; Expires=${convertToDate(newMaxAge)}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    ];

    return Response.json(response?.payload, {
      status: 200,
      headers: {
        "Set-Cookie": cookies.join(", "),
      },
    });
  } catch (error) {
    console.error("Error in refresh token", error);
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "lỗi không xác định",
        },
        { status: 500 },
      );
    }
  }
}
