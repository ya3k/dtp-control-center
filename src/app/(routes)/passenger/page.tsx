
// import { cookies } from "next/headers";
// import Profile from "./Profile"
// import userApiRequest from "@/apiRequests/user";

// async function getProfile() {
//   const cookieStore = cookies();
//   const sessionToken = cookieStore.get("sessionToken");
//   if(!sessionToken) {
//     return null;
//   }
//   const result = await userApiRequest.meServer(sessionToken?.value);
//   return result;
// }

export default async function PassengerPage() {
  // const data = await getProfile();
  return (
    <div>
      {/* <p>{data.payload.data.name}</p> */}
      {/* <Profile /> */}
    </div>
  );
}
