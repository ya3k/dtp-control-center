import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

const userApiRequest = {
  meServer: (sessionToken: string) =>
    http.get(apiEndpoint.profile, { headers: { Authorization: `Bearer ${sessionToken}` } }),
  me: () =>
    http.get(apiEndpoint.profile),
};

export default userApiRequest;
