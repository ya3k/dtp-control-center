import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";
import { CompanyResType } from "@/schemaValidations/company.schema";

const companyApiRequest = {
    getWithOData: async (queryParams?: string) => {
        try {
            const endpoint = `${apiEndpoint.companyOdata}${queryParams ? queryParams + `` : "?$count=true"}`
            const response = await http.get<CompanyResType>(endpoint)
            return response
        } catch (error) {
            console.error("Failed to fetch company with OData:", error)
            throw error
        }
    },
};

export default companyApiRequest;
