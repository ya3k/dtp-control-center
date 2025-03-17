export type SetTokenResponseType = {
  success: boolean;
  message: string;
  error?: string[];
  sessionToken?: string;
  role?: string;
};

export async function POST(request: Request) {
  const res = await request.json();
  console.log("res", res);
  const sessionToken = res?.sessionToken as string;
  const role = res?.role;

  if (!sessionToken) {
    return Response.json(
      {
        success: false,
        message: "Error",
        error: ["Something went wrong. Please try again."],
      },
      { status: 400 },
    );
  }

  return Response.json(
    {
      success: true,
      message: "Session token sets successfully",
      sessionToken: sessionToken,
      role: role,
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly, role=${role}; Path=/; HttpOnly`,
      },
    },
  );
}
