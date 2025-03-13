import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";
import { CreateTourBodyType, TourInfoFormType, TourResType } from "@/schemaValidations/tour-operator.shema";

const tourApiRequest = {
    getAll: () => http.get("/api/tour"),
    opGetAll: (queryParams?: string) =>
        http.get<TourResType>(`${apiEndpoint.tourOdata}${queryParams ? queryParams + `&$count=true` : "?$count=true"}`),
    opGetTourInfo: () => http.get<TourInfoFormType>(`${apiEndpoint.tour}/tourInfo`),

    create: async(body: CreateTourBodyType) => http.post<CreateTourBodyType>(`${apiEndpoint.tour}`, body)

}

export default tourApiRequest;