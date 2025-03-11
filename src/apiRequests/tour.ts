import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";

const tourApiRequest = {
    getAll: () => http.get(apiEndpoint.tour),
    getById: (id:string) => http.get(`${apiEndpoint.tour}/${id}`),
}

export default tourApiRequest;