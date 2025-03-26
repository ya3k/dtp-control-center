
export const links = {
    login: { href: "/login", label: "Đăng nhập" },
    register: { href: "/register", label: "Đăng ký" },
    home: { href: "/", label: "Trang chủ" },
    tour: { href: "/tour", label: "Tour Quy Nhơn" },
    allTour: { href: "/tour/all", label: "Tất cả tour" },
    blog: { href: "/blog", label: "Cẩm nang du lịch" },
    about: { href: "/about", label: "Về chúng tôi" },
    passenger: { href: "/passenger", label: "Khách hàng" },
    shoppingCart: { href: "/shoppingcart", label: "Giỏ hàng" },
    checkout: { href: "payment/checkout", label: "Thanh toán" },

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
    tourSchedule: "/api/tour/schedule",
    basket: "/api/basket",
    order: "/api/order",
    //category
    categoryOdata: `/odata/category`,


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
    upload: `/api/media`
}




