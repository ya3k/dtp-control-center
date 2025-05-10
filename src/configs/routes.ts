
export const links = {
    login: { href: "/login", label: "Đăng nhập" },
    home: { href: "/", label: "Trang chủ" },
    companyConfirm: { href: "/confirm-account", label: "Xác thực tài khoản công ty" },
    forgotPassword: {href:"/forgot-password", label:"Quên mật khẩu"},
    resetPassword: {href:"/reset-password", label:"Đặt lại mật khẩu"},

}

export const adminLinks = {
    admin: { href: "/admin", label: "Admin" },
    dashboard: { href: "/admin/dashboard", label: "Dashboard" },
    user: { href: "/admin/users", label: "Người dùng" },
    voucher: { href: "/admin/voucher", label: "Voucher" },
    category: { href: "/admin/category", label: "Danh mục" },
    company: { href: "/admin/company", label: "Company" },
    destination: { href: "/admin/destination", label: "destination" },

}

export const operatorLinks = {
    operator: { href: "/operator", label: "Operator" },
    dashboard: { href: "/operator/dashboard", label: "Dashboard" },
    employee: { href: "/operator/employee", label: "Nhân viên" },
    tour: { href: "/operator/tours", label: "Tour" },
    createTour: { href: "/operator/tours/create", label: "Tạo tour" },
    wallet: { href: "/operator/wallet", label: "ví" },
    transaction: { href: "/operator/wallet/transaction", label: "Giao dịch" },
    opt: { href: "/operator/wallet/otp-setup", label: "Giao dịch" },

}
export const managerLinks = {
    dashboard: { href: "/manager/dashboard", label: "Dashboard" },

    tour: { href: "/manager/tours", label: "Tour" },
    createTour: { href: "/manager/tours/create", label: "Tạo tour" },

}
export const nextServer = {
    setToken: "/api/auth/set-token",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh-token",
    confirmation: "/api/auth/confirmation",
}

export const apiEndpoint = {
    //authentication
    login: "/api/authentication/login",
    register: "/api/authentication/register",
    logout: "api/authentication/logout",
    refresh: "/api/authentication/refresh",
    confirmation: "/api/authentication/confirmation",
    storeToken: "/api/authentication/store-token",
    forgotPassword: "/api/authentication/forget-password",
    resetPassword: "/api/authentication/reset-password",
    //user
    user: `/api/user`,
    profile: "/api/user/me",
    odataUser: `/odata/user`,
    //tour
    tours: "/api/tour",
    getTourCount: "/odata/tour/$count",
    odataTour: "/odata/tour",
    tourScheduleTicket: "/api/tour/scheduleticket",
    tourByCompany: `/odata/Company/Tour()`,
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

    //company
    companyOdata: `odata/company`,
    company: `/api/company`,
    grant: `/api/company/grant`,

    //media
    upload: `/api/media`,

    //voucher
    voucher: `/api/voucher`,
    odataVoucher: `/odata/Voucher/Own()`,

    wallet: `/api/wallet`,
    otp: `/api/wallet/otp`,
    transaction: `/api/wallet/transaction`,
    transactionOdata: `/odata/wallet`,

    //order
    orderOdata: `/odata/order`,

    // analys
    opAnalys: `/api/tour/operator/analys`,
    adAnalys: `/api/tour/admin/analys`,

    //system setting
    system: `/api/system`
}




