import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { PostUserBodyType, PutUserBodyType, UserResType } from "@/schemaValidations/admin-user.schema";
interface UserOdataResponse {
  value: UserResType[],
  "@odata.count"?: number
}
const userApiRequest = {
  me: (sessionToken?: string) =>
    http.get(
      apiEndpoint.profile,
      sessionToken
        ? {
            headers: { Authorization: `Bearer ${sessionToken}` },
          }
        : {},
    ),
  getWithOdata: async (queryParams?: string) => {
    const finalQuery = queryParams ? `${queryParams}` : "";
   const response = await http.get<UserOdataResponse>(`${apiEndpoint.odataUser}${finalQuery}`);
   return response;
  },
  create: (body: PostUserBodyType) => http.post(apiEndpoint.user, body),
  update: (body: PutUserBodyType) => http.put(apiEndpoint.user, body),
  getById: (id: string) => http.get<UserResType>(`${apiEndpoint.user}/${id}`),
  delete: (id: string) => http.delete(`${apiEndpoint.user}/${id}`)
};

export default userApiRequest;
