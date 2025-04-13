import SidebarItem from "@/types/sidebaritems";
import { Building2, LayoutDashboard, Library, Map, User } from "lucide-react";

export const adminItems: SidebarItem[] = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Quản lý người dùng",
        url: "/admin/users",
        icon: User,

    },
    {
        title: "Quản lí loại tour",
        url: "/admin/category",
        icon: Library

    },
    {
        title: "Quản lý địa điểm",
        url: "/admin/destinations",
        icon: Map

    },
    {
        title: "Quản lý công ty",
        url: "/admin/company",
        icon: Building2,
    },
];