import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import {  POSTTourType } from "@/schemaValidations/crud-tour.schema";
import type {
  CreateTourBodyType,
  DELETETourScheduleBodyType,
  POSTTourScheduleBodyType,
  PUTTourDestinationType,
  PUTTourInfoBodyType,
  TicketScheduleResType,
  tourByCompanyResType,
  TourDestinationResType,
  TourInfoResType,
  tourOdataResType,
  TourResType,
} from "@/schemaValidations/tour-operator.shema";
/**
 * Tour API service for handling tour-related API requests.
 */
const tourApiService = {
  getAll: async () => {
    try {
      const response = await http.get<TourResType>("/api/tour");
      return response;
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      throw error;
    }
  },

  getWithODataByCompany: async (queryParams?: string) => {
    try {
      const endpoint = `${apiEndpoint.tourByCompany}${queryParams ? queryParams + `` : "?$count=true"}`;
      const response = await http.get<tourByCompanyResType>(endpoint);
      return response;
    } catch (error) {
      console.error("Failed to fetch tours with OData:", error);
      throw error;
    }
  },

  getTourInfo: async (tourId: string) => {
    try {
      const response = await http.get<TourInfoResType>(
        `${apiEndpoint.tours}/tourinfor/${tourId}`,
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch tour info:", error);
      throw error;
    }
  },

  getTourDestination: async (tourId: string) => {
    const response = await http.get<TourDestinationResType>(`${apiEndpoint.tourDestination}/${tourId}`)
    return response
  },
  putTourDesitnation: async (tourId: string, body: PUTTourDestinationType) => {
    const response = await http.put(`${apiEndpoint.tourDestination}/${tourId}`, body)
    return response
  }
  ,
  getTourSchedule: async (tourId: string) => {
    const response = await http.get<TourInfoResType>(`${apiEndpoint.tourSchedule}/${tourId}`)
    return response
  },
  postTourSchedule: async (tourId: string, body: POSTTourScheduleBodyType) => {
    const response = await http.post(`${apiEndpoint.postTourSchedule}/${tourId}`, body)
    return response
  },

  deleteTourSchedule: async (tourId: string, body: DELETETourScheduleBodyType) => {
    const response = await http.delete(`${apiEndpoint.delTourSchedule}/${tourId}`, body)
    return response
  },

  getTourScheduleTicket: async (tourId: string) => {
    const response = await http.get<TicketScheduleResType>(`${apiEndpoint.tourScheduleTicket}/${tourId}`)
    return response
  },

  updateTourTickets: async (tourId: string, body: {
    startDate: string;
    endDate: string;
    ticketKindUpdates: Array<{
      ticketKind: number;
      newNetCost: number;
      newAvailableTicket: number;
    }>;
  }) => {
    const response = await http.put(`${apiEndpoint.tourScheduleTicket}/${tourId}`, body);
    return response;
  },

  postTour: async (body: POSTTourType) => {
    try {
      const response = await http.post<TourResType>(
        `${apiEndpoint.tours}`,
        body,
      );
      return response;
    } catch (error) {
      console.error("Failed to create tour:", error);
      throw error;
    }
  },
  create: async (body: CreateTourBodyType) => {
    try {
      const response = await http.post<TourResType>(
        `${apiEndpoint.tours}`,
        body,
      );
      return response;
    } catch (error) {
      console.error("Failed to create tour:", error);
      throw error;
    }
  },
  updateTourInfo: async (id: string, body: PUTTourInfoBodyType) =>
    http.put<PUTTourInfoBodyType>(`${apiEndpoint.tourInfo}/${id}`, body),

  delete: async (id: string) => {
    try {
      const response = await http.delete(`${apiEndpoint.tours}/${id}`, {
        errorMessage: "Failed to delete tour",
      });
      return response;
    } catch (error) {
      console.error("Failed to delete tour:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await http.get<TourResType>(
        `${apiEndpoint.tours}/${id}`,
        {
          errorMessage: "Failed to fetch tour details",
        },
      );
      return response;
    } catch (error) {
      console.error("Failed to fetch tour by ID:", error);
      throw error;
    }
  },

  closeTour: async (id: string, body: string) => {
    try {
      const response = await http.put(`${apiEndpoint.closeTour}/${id}`, body);
      return response;
    } catch (error) {
      console.error("Đóng tour thất bại:", error);
      throw error;
    }
  },



};

export const tourApiRequest = {
  getAll: () => http.get(apiEndpoint.tours),
  getById: (id: string) => http.get(`${apiEndpoint.tours}/${id}`),
  getTourScheduleByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourSchedule}/${id}`),
  getScheduleTicketByTourId: (id: string) =>
    http.get(`${apiEndpoint.tourScheduleTicket}/${id}`),
};

export default tourApiService;
