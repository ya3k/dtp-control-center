import { apiEndpoint } from "@/configs/routes"
import http from "@/lib/https"
import type { CreateTourBodyType, TourDestinationsFormBodyType, TourInfoFormBodyType, TourInfoFormType, tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { toast } from "sonner"
/**
 * Tour API service for handling tour-related API requests.
 */
const tourApiService = {
 
  getAll: async () => {
    try {
      const response = await http.get<TourResType>("/api/tour")
      return response
    } catch (error) {
      console.error("Failed to fetch tours:", error)
      throw error
    }
  },

  getWithOData: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.tourOdata}${queryParams ? queryParams + `` : "?$count=true"}`
      const response = await http.get<tourOdataResType>(endpoint)
      return response
    } catch (error) {
      console.error("Failed to fetch tours with OData:", error)
      throw error
    }
  },


  getTourInfo: async (tourId: string) => {
    try {
      const response = await http.get<TourInfoFormType>(`${apiEndpoint.tour}/tourinfor/${tourId}`)
      return response
    } catch (error) {
      console.error("Failed to fetch tour info:", error)
      throw error
    }
  },

  create: async (body: CreateTourBodyType) => {
    try {
      const response = await http.post<TourResType>(`${apiEndpoint.tour}`, body)
      return response
    } catch (error) {
      console.error("Failed to create tour:", error)
      throw error
    }
  },
  updateTourInfo: async(id: string, body: TourInfoFormBodyType) => http.put<TourInfoFormBodyType>(`${apiEndpoint.tourInfo}/${id}`,body),

  updateTourDestination: async(id: string, body: TourDestinationsFormBodyType) => http.put<TourDestinationsFormBodyType>(`${apiEndpoint.tourInfo}/${id}`,body),

  delete: async (id: string) => {
    try {
      const response = await http.delete(`${apiEndpoint.tour}/${id}`, {
        errorMessage: "Failed to delete tour",
      })
      toast.success("Tour deleted successfully")
      return response
    } catch (error) {
      console.error("Failed to delete tour:", error)
      throw error
    }
  },

 
  getById: async (id: string) => {
    try {
      const response = await http.get<TourResType>(`${apiEndpoint.tour}/${id}`, {
        errorMessage: "Failed to fetch tour details",
      })
      return response
    } catch (error) {
      console.error("Failed to fetch tour by ID:", error)
      throw error
    }
  },
}

export default tourApiService

