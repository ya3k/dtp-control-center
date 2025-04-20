
export const links = {
    login: { href: "/login", label: "Đăng nhập" },
}

export const adminLinks = {
    admin: { href: "/admin", label: "Admin" },
    dashboard: { href: "/admin/dashboard", label: "Dashboard" },
    user: { href: "/admin/user", label: "Người dùng" },
}

export const operatorLinks = {
    operator: { href: "/operator", label: "Operator" },
    dashboard: { href: "/operator/dashboard", label: "Dashboard" },
    employee: { href: "/operator/employee", label: "Nhân viên" },
    tour: { href: "/operator/tours", label: "Tour" },
    createTour: { href: "/operator/tours/locations", label: "Tạo tour" },

}

export const nextServer = {
    setToken: "/api/auth/set-token",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh-token",
}

export const apiEndpoint = {
    //authentication
    login: "/api/authentication/login",
    register: "/api/authentication/register",
    logout: "api/authentication/logout",
    refresh: "/api/authentication/refresh",
    //user
    user: `/api/user`,
    profile: "/api/user/me",
    odataUser: `/odata/user`,
    //tour
    tours: "/api/tour",
    getTourCount: "/odata/tour/$count",
    odataTour: "/odata/tour",
    tourScheduleTicket: "/api/tour/scheduleticket",
    tourByCompany: `/api/tour/get`,
    closeTour: `/api/tour/closetour`,

    //tour schedule
    tourSchedule: "/api/tour/schedule",
    postTourSchedule: `/api/tour/addschedule`,
    delTourSchedule: `/api/tour/tourschedule`,
    tourDestination: `/api/tour/tourdestination`,

    //
    basket: "/api/basket",
    order: "/api/order",
    //category
    categoryOdata: `/odata/category`,
    category: `/api/category`,

    //tour info
    tourInfo: `/api/tour/tourinfor`,

    //destination
    destinationOdata: `/odata/destination`,
    destination: `/api/destination`,

    //companh
    companyOdata: `odata/company`,
    company: `/api/company`,
    grant: `/api/company/grant`,

    //media
    upload: `/api/media`,

    wallet: `/api/wallet`,
    otp: `/api/wallet/otp`,
    transaction: `/api/wallet/transaction`,
    transactionOdata: `/odata/wallet`,

    // analys
    opAnalys: `/api/tour/operator/analys`,
    adAnalys: `/api/tour/admin/analys`,
}




