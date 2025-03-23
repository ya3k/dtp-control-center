import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { CompanyResType, TCompanyGrantBodyType, TCompanyPUTBodyType, TCompanyQuestBodyType } from "@/schemaValidations/company.schema";

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

    create: async (body: TCompanyQuestBodyType) => {
        try {
          const response = await http.post<TCompanyQuestBodyType>(`${apiEndpoint.company}`, body)
          return response
        } catch (error) {
          console.error("Thất bại trong việc gửi đơn đăng ký :", error)
          throw error
        }
      }, 

      update: async (body: TCompanyPUTBodyType) => {
        try {
          const response = await http.put<TCompanyPUTBodyType>(`${apiEndpoint.company}`, body)
          return response
        } catch (error) {
          console.error("Cập nhật công ty thất bại :", error)
          throw error
        }
      },
    approve:async (body: TCompanyGrantBodyType) => {
      try {
        const response = await http.put<TCompanyGrantBodyType>(`${apiEndpoint.grant}`, body)
        return response
      } catch (error) {
        console.error("duyệt không thành công:", error)
        throw error
      }
    }, 
};

export default companyApiRequest;
