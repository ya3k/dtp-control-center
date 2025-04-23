import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { TourOrderType } from "@/schemaValidations/oprator-order.schema";

export const orderApiRequest = {
    getTourOrderHistory: async (tourId: string, query?: string) => {
        try {
            const response = await http.get<TourOrderType>(`${apiEndpoint.orderOdata}?tourId=${tourId} ${query}`);
            //log url
            console.log(`${apiEndpoint.orderOdata}?$count=true&tourId=${tourId} ${query ? query : ""}`);
            return response;
        } catch (error) {
            console.error("Failed to fetch order of tour:", error);
            throw error;
        }
    },
};
