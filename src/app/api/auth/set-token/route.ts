export type SetTokenResponseType = {
  success: boolean;
  message: string;
  error?: string[];
  sessionToken?: string;
  role?: string;
};

export async function POST(request: Request) {
  const body = await request.json();
  console.log("res", body);
  const sessionToken = body?.payload?.data.accessToken as string;
  const refreshToken = body?.payload?.data.refreshToken as string;
  const role = body?.payload?.data.role as string;
  const maxAge = body?.payload?.data.expiresIn as string;

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

  return Response.json(
    {
      success: true,
      message: "Session token sets successfully",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Max-Age=${maxAge}; Path=/; HttpOnly, role=${role}; Max-Age=${maxAge}; Path=/; HttpOnly, refreshToken=${refreshToken}; Max-Age=${maxAge}; Path=/; HttpOnly`,
      },
    },
  );
}
