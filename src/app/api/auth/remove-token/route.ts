
export type RemoveTokenResponseType = {
  success: boolean;
  message: string;
};

export async function DELETE() {

  return Response.json(
    {
      success: true,
      message: "Session token has been removed",
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Max-Age=0; path=/, role=; Max-Age=0; path=/`,
      },
    },
  );
}
