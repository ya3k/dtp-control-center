import SidebarItem from "@/types/sidebaritems";
import { Banknote, BookCheck, Calendar, History, Home, MapPin, TestTube, Torus, Users, Wallet, Wallet2 } from "lucide-react";
export const operatorItems: SidebarItem[] = [
    {
        title: "Dashboard",
        url: "/operator/dashboard",
        icon: Home,
    },
    {
        title: "Tours",
        url: "",
        icon: Torus,
        subItems: [
            { title: "Danh Sách Tours", url: "/operator/tours", icon: Calendar },
            { title: "Tạo Tours", url: "/operator/tours/create", icon: MapPin },
        ],
    },
    // {
    //     title: "Order",
    //     url: "/operator/order",
    //     icon: BookCheck
    // },
    {
        title: "Ví",
        url: "",
        icon: Wallet2,
        subItems: [
            { title: "Số dư", url: "/operator/wallet", icon: Banknote },
            { title: "Lịch sử giao dịch", url: "/operator/wallet/transaction", icon: History },
        ],
    },

    // {
    //     title: "Nhân Viên",
    //     url: "",
    //     icon: Users,
    //     subItems: [
    //         { title: "Danh sách nhân viên", url: "/operator/employee", icon: Calendar },

    //     ],
    // }
];