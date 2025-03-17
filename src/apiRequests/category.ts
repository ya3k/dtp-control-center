import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";

const categoryApiRequest = {
  get: () =>
    http.get(apiEndpoint.categoryOdata),
};

export default categoryApiRequest;
