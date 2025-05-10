import { AdminExternalTransactionType, BankInfoType, WithDrawType } from './../schemaValidations/wallet.schema';
import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { DetailedTransactionType, TransactionType } from "@/schemaValidations/wallet.schema";

export const walletApiRequest = {
  get: async () => {
    try {
      const response = await http.get(`${apiEndpoint.wallet}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch wallet:", error);
      throw error;
    }
  },

  getOtp: async () => {
    try {
      const response = await http.get(`${apiEndpoint.otp}`);
      return response;
    } catch (error) {
      console.error("Failed to fetch otp:", error);
      throw error;
    }
  }
  ,
  withdrawWithOTP: async (data : WithDrawType, otp: string) => {
    try {
      const response = await http.post(
        `${apiEndpoint.wallet}/withdraw`, data,
        { otp: otp },
      );
      return response;
    } catch (error) {
      console.error("Failed to withdraw:", error);
      throw error;
    }
  },

  //op
  getTransactionWithOData: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.transactionOdata}${queryParams ? queryParams + `` : "?$count=true"}`
      const response = await http.get<TransactionType>(endpoint)
      return response
    } catch (error) {
      console.error("Failed to fetch transaction with OData:", error)
      throw error
    }
  },
  transactionDetail: async (transactionId: string) => {
    try {
      const response = await http.get<DetailedTransactionType>(`${apiEndpoint.transaction}/${transactionId}`);

      return response;
    } catch (error) {
      console.error("Failed to fetch transaction detail:", error);
      throw error;
    }
  },

  deposit: async (amount: number) => {
    try {
      const response = await http.post(`${apiEndpoint.wallet}/deposit`, { amount });
      return response;
    } catch (error) {
      console.error("Failed to deposit:", error);
      throw error;
    }
  },

  getAdminTransactionWithOData: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.transactionOdata}${`/externaltransaction()`}${queryParams ? queryParams + `` : "?$count=true"}`
      const response = await http.get<AdminExternalTransactionType>(endpoint)
      return response
    } catch (error) {
      console.error("Failed to fetch transaction with OData:", error)
      throw error
    }
  },
  acceptWithdraw: async (trancId: string) => {
    try {
      const response = await http.post(`${apiEndpoint.wallet}/external-transaction/${trancId}/accept`);
      return response;
    } catch (error) {
      console.error("fail to accept withdraw:", error);
      throw error;
    }
  },
  rejectWithdraw: async (trancId: string, remark: string) => {
    try {
      const response = await http.post(`${apiEndpoint.wallet}/external-transaction/${trancId}/reject`, {remark: remark});
      return response;
    } catch (error) {
      console.error("fail to reject withdraw:", error);
      throw error;
    }
  },
  getBankList: async () => {
    try {
      const response = await fetch(`https://api.banklookup.net/api/bank/list`);
      return response.json();
    } catch (error) {
      console.error("Failed to fetch bank list:", error);
      throw error;
    }
  }
};
