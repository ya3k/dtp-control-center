import { apiEndpoint } from "@/configs/routes"
import http from "@/lib/https"
import type {
  CreateDestinationBodyType,
  DestinationType,
  UpdateDestinationBodyType,
} from "@/schemaValidations/admin-destination.schema"

interface DestinationResponse {
  value: DestinationType[]
  "@odata.count"?: number
}

const destinationApiRequest = {
  getAll: (queryParams?: string) =>
    http.get<DestinationResponse>(`${apiEndpoint.destination}${queryParams ? queryParams+ `&$count=true` : "?$count=true"}`),

  getById: (id: string) => http.get<DestinationType>(`${apiEndpoint.destination}/${id}`),

  create: async (data: CreateDestinationBodyType) => {
    const response = await http.post<CreateDestinationBodyType>(apiEndpoint.destination, data)
    return response
  },

  update: (id: string, data: UpdateDestinationBodyType) =>
    http.put<DestinationType>(`${apiEndpoint.destination}/${id}`, data),

  delete: (id: string) => http.delete(`${apiEndpoint.destination}/${id}`),
}

export default destinationApiRequest

