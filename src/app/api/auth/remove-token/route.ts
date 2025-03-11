import { cookies } from "next/headers";

export type RemoveTokenResponseType = {
  success: boolean;
  message: string;
};

export async function DELETE() {
  const cookieStore = cookies();
  // console.log("res", res);
  const sessionToken = cookieStore.get("sessionToken");

  if (!sessionToken?.value) {
    return Response.json({
      success: false,
      message: "No session token found",
    });
  }

  return Response.json(
    {
      success: true,
      message: "Session token has been removed",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly`,
      },
    },
  );
}
