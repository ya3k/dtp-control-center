import { PUTSystemType, SystemSetting } from "@/schemaValidations/system.schema";
import http from "@/lib/http";
import { apiEndpoint } from "@/configs/routes";

export const systemSettingApiRequest = {
  getSystem: async () => {
    try {
      const response = await http.get<SystemSetting>(apiEndpoint.system);
      return response;
    } catch (error) {
      console.error("Failed to fetch system settings:", error);
      throw error;
    }
  },

  putSystem: async (body: PUTSystemType) =>{
    try {
      const response = await http.put(apiEndpoint.system, body);
      return response;
    } catch (error) {
      console.error("Failed to update system settings:", error);
      throw error;
    }
  }

 
}; 