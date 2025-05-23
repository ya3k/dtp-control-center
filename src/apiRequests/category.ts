import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { CategoryType } from "@/schemaValidations/category.schema";

const categoryApiRequest = {
  get: () =>
    http.get(apiEndpoint.categoryOdata),
  getWithOData: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.categoryOdata}${queryParams ? queryParams + `` : "?$count=true"}`
      const response = await http.get<CategoryType>(endpoint)
      return response
    } catch (error) {
      console.error("Failed to fetch categories with OData:", error)
      throw error
    }
  },
  create: async (data: { name: string }) => {
    try {
      const response = await http.post(apiEndpoint.category, data)
      return response
    } catch (error) {
      console.error("Failed to create category:", error)
      throw error
    }
  },
  delete: async (id: string) => {
    try {
      const response = await http.delete(`${apiEndpoint.category}/${id}`)
      return response
    } catch (error) {
      console.error("Failed to delete category:", error)
      throw error
    }
  },
  update: async (id: string, data: { name: string }) => {
    try {
      const response = await http.put(`${apiEndpoint.category}/${id}`, data)
      return response
    } catch (error) {
      console.error("Failed to update category:", error)
      throw error
    }
  }


};

export default categoryApiRequest;
