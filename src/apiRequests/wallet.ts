import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

export const walletApiRequest = {
  get: async () =>{
    try {
      const response = await http.get(`${apiEndpoint.wallet}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      throw error;
    }
  }
     ,
  withdraw: async (amount: number) => {
    try {
      const response = await http.post(`${apiEndpoint.wallet}/withdraw`, { amount });
      console.log("Withdraw response:", JSON.stringify(response));
      return response;
    } catch (error) {
      console.error("Failed to withdraw:", error);
      throw error;
    }
  }
 

};
