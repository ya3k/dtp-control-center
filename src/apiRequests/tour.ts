import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/https";

const tourApiRequest = {
    getAll: () => http.get(apiEndpoint.tours),
    getById: (id:string) => http.get(`${apiEndpoint.tours}/${id}`),
    getTourScheduleByTourId: (id:string) => http.get(`${apiEndpoint.tourSchedule}/${id}`),
    getScheduleTicketByTourId: (id:string) => http.get(`${apiEndpoint.tourScheduleTicket}/${id}`),
}

export default tourApiRequest;