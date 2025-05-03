import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { VoucherPOSTType, VoucherPUTType, VoucherResType } from "@/schemaValidations/admin-voucher.schema";

export const voucherApiRequest = {
  getOdata: async (queryParams?: string) => {
    try {
      const endpoint = queryParams 
        ? `${apiEndpoint.odataVoucher}${queryParams}` 
        : `${apiEndpoint.odataVoucher}`;
      
      const response = await http.get<VoucherResType[]>(endpoint);
      return response;
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
      throw error;
    }
  },

  postVoucher: async (body: VoucherPOSTType) => {
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

  updateVoucher: async (voucherId: string, body: VoucherPUTType) => {
    try {
      const response = await http.put(
        `${apiEndpoint.voucher}/${voucherId}`,
        body
      );
      return response;
    } catch (error) {
      console.error("Failed to update voucher:", error);
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
