import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { OpAnalysData } from "@/schemaValidations/operator-analys-schema";

export const analysApiRequest = {
    getForOp: async () => {
        try {
            const response = await http.get<OpAnalysData>(`${apiEndpoint.opAnalys}`);
            return response;
        } catch (error) {
            console.error("Failed to fetch analys:", error);
            throw error;
        }
    },
    getForAd: async () => {
        try {
            const response = await http.get<OpAnalysData>(`${apiEndpoint.adAnalys}`);
            return response;
        } catch (error) {
            console.error("Failed to fetch analys:", error);
            throw error;
        }
    },

};
