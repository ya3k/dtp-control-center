import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

export const walletApiRequest = {
  get: () =>
    http.get(apiEndpoint.wallet),
 

};
