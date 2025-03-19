import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export type RefreshTokenRequestType = {
  refreshToken: string;
};

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken");
  const sessionToken = cookieStore.get("sessionToken");
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
      refreshToken: refreshToken.value,
    };
    const response = await authApiRequest.refreshFromNextServerToServer(
      body,
      sessionToken.value,
    );
    const newSessionToken = response?.payload?.data?.accessToken as string;
    const newRefreshToken = response?.payload?.data?.refreshToken as string;
    const role = response?.payload?.data?.role as string;
    const maxAge = response?.payload?.data?.expiresIn as string;
    console.log("res", response);
    return Response.json(response?.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${newSessionToken}; Max-Age=${maxAge}; Path=/; HttpOnly, role=${role}; Max-Age=${maxAge}; Path=/; HttpOnly, refreshToken=${newRefreshToken}; Max-Age=${maxAge}; Path=/; HttpOnly`,
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
