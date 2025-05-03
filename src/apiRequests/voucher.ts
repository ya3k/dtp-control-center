import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { VoucherPOSTType } from "@/schemaValidations/admin-voucher.schema";


export const voucherApiRequest = {
  getOdata: async () => {
    try {
      const response = await http.get(`${apiEndpoint.voucher}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch voucher:", error);
      throw error;
    }
  },

  postVoucher: async (body : VoucherPOSTType) => {
    try {
      const response = await http.post(
        `${apiEndpoint.voucher}`,
       body
      );
      return response;
    } catch (error) {
      console.error("Failed to create voucher:", error);
      throw error;
    }
  },

  deleteVoucher: async (voucherId: string) => {
    try {
      const response = await http.delete(`${apiEndpoint.voucher}/${voucherId}`);
      return response;
    } catch (error) {
      console.error("Failed to delete voucher:", error);
      throw error;
    }
  },
};
