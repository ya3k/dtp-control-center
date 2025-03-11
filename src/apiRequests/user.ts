import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";

const userApiRequest = {
  me: () =>
    http.get(apiEndpoint.profile),
};

export default userApiRequest;
