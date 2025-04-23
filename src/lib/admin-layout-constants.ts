import SidebarItem from "@/types/sidebaritems";
import { Banknote, Building2, History, LayoutDashboard, Library, Map, User, Wallet2 } from "lucide-react";

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
    {
        title: "Ví",
        url: "",
        icon: Wallet2,
        subItems: [
            { title: "Số dư", url: "/admin/wallet", icon: Banknote },
            { title: "Lịch sử giao dịch", url: "/admin/wallet/transaction", icon: History },
        ],
    },
];