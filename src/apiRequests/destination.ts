import { apiEndpoint } from "@/configs/routes"
import http from "@/lib/http"
import type {
  CreateDestinationBodyType,
  DestinationType,
  UpdateDestinationBodyType,
} from "@/schemaValidations/admin-destination.schema"

interface DestinationResponse {
  value: DestinationType[],
  "@odata.count"?: number
}

const destinationApiRequest = {
  getAll: (queryParams?: string) => {
    const finalQuery = queryParams ? `${queryParams}` : "";
    return http.get<DestinationResponse>(`${apiEndpoint.destinationOdata}${finalQuery}`);
  },
  create: async (data: CreateDestinationBodyType) =>
    http.post<CreateDestinationBodyType>(apiEndpoint.destination, data),

  update: (id: string, data: UpdateDestinationBodyType) =>
    http.put<DestinationType>(`${apiEndpoint.destination}/${id}`, data),

  delete: (id: string) => http.delete(`${apiEndpoint.destination}/${id}`),
}

export default destinationApiRequest

