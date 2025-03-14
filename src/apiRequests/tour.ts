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


  getTourInfo: async () => {
    try {
      const response = await http.get<TourInfoFormType>(`${apiEndpoint.tour}/tourInfo`)
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
  updateTourInfo: async(body: TourInfoFormBodyType) => http.post<TourInfoFormBodyType>(apiEndpoint.tourInfo,body),

  updateTourDestination: async(body: TourDestinationsFormBodyType) => http.put<TourDestinationsFormBodyType>(apiEndpoint.tourInfo,body),

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

  /**
   * Get a single tour by ID.
   *
   * @param id - Tour ID to get
   * @returns A promise that resolves to the tour data
   */
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

