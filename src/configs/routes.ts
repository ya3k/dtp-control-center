
export const links = {
    login: { href: "/login", label: "Đăng nhập" },
    register: { href: "/register", label: "Đăng ký" },
    home: { href: "/", label: "Trang chủ" },
    tour: { href: "/tour", label: "Tour Quy Nhơn" },
    blog: { href: "/blog", label: "Cẩm nang du lịch" },
    about: { href: "/about", label: "Về chúng tôi" },
    passenger: { href: "/passenger", label: "Khách hàng" },
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
    removeToken: "/api/auth/remove-token"
}

export const apiEndpoint = {
    login: "/api/authentication/login",
    register: "/api/authentication/register",
    logout: "api/authentication/logout",
    profile: "/api/user",
}




