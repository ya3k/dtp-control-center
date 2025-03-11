import http from "@/lib/https";

const tourApiRequest = {
    getAll: () => http.get("/api/tour"),
}

export default tourApiRequest;