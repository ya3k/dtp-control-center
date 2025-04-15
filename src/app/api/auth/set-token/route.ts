import { getExpirationDateFromToken, getMaxAgeFromToken } from "@/lib/utils";

export type SetTokenResponseType = {
  success: boolean;
  message: string;
  error?: string[];
  sessionToken?: string;
  role?: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  const sessionToken = body?.payload?.data.accessToken as string;
  const refreshToken = body?.payload?.data.refreshToken as string;
  const role = body?.payload?.data.role as string;

  if (!sessionToken) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
        error: ["Unauthorized"],
      },
      { status: 401 },
    );
  }
  const exprirationDate = getExpirationDateFromToken(sessionToken);
  const maxAge = getMaxAgeFromToken(sessionToken);

  const cookies = [
    `_auth=${sessionToken}; Max-Age=${maxAge}; Expires=${exprirationDate}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    `cont_auth=${refreshToken}; Max-Age=${maxAge}; Expires=${exprirationDate}; Path=/; HttpOnly; SameSite=Lax; Secure`,
    `role=${role}; Max-Age=${maxAge}; Expires=${exprirationDate}; Path=/; HttpOnly; SameSite=Lax; Secure`,
  ];

  return Response.json(
    {
      success: true,
      message: "Session token sets successfully",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookies.join(", "),
      },
    },
  );
}
