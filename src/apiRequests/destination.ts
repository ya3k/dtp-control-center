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
  getAll: (queryParams?: string) =>
    http.get<DestinationResponse>(`${apiEndpoint.destinationOdata}${queryParams ? queryParams + `&$count=true` : "?$count=true"}`),

  getById: (id: string) => http.get<DestinationType>(`${apiEndpoint.destination}/${id}`),

  create: async (data: CreateDestinationBodyType) =>
    http.post<CreateDestinationBodyType>(apiEndpoint.destination, data),

  update: (id: string, data: UpdateDestinationBodyType) =>
    http.put<DestinationType>(`${apiEndpoint.destination}/${id}`, data),

  delete: (id: string) => http.delete(`${apiEndpoint.destination}/${id}`),
}

export default destinationApiRequest

