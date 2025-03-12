import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";
import { TourInfoFormData, TourResType } from "@/schemaValidations/tour-operator.shema";

const tourApiRequest = {
    getAll: () => http.get("/api/tour"),
    opGetAll: (queryParams?: string) =>
        http.get<TourResType>(`${apiEndpoint.tour}${queryParams ? queryParams + `&$count=true` : "?$count=true"}`),
    opGetTourInfo: () => http.get<TourInfoFormData>(`${apiEndpoint.tour}/tourInfo`),
    
}

export default tourApiRequest;