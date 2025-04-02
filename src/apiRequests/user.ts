import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { PostUserBodyType, PutUserBodyType, UserResType } from "@/schemaValidations/admin-user.schema";
interface UserOdataResponse {
  value: UserResType[],
  "@odata.count"?: number
}
const userApiRequest = {
  meServer: (sessionToken: string) =>
    http.get(apiEndpoint.profile, { headers: { Authorization: `Bearer ${sessionToken}` } }),
  me: () =>
    http.get(apiEndpoint.profile),
  getWithOdata: (queryParams?: string) => {
    const finalQuery = queryParams ? `${queryParams}` : "";
    return http.get<UserOdataResponse>(`${apiEndpoint.odataUser}${finalQuery}`);
  },
  create: (body: PostUserBodyType) => http.post(apiEndpoint.user, body),
  update: (body: PutUserBodyType) => http.put(apiEndpoint.user, body),
  getById: (id: string) => http.get<UserResType>(`${apiEndpoint.user}/${id}`)
};

export default userApiRequest;
