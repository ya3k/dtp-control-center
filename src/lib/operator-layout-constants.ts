import SidebarItem from "@/types/sidebaritems";
import { Calendar, Home, MapPin, Torus, Users, Wallet, Wallet2 } from "lucide-react";
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
    {
        title: "Wallet",
        url: "",
        icon: Wallet2,
        subItems: [
            { title: "Ví", url: "/operator/wallet", icon: Wallet },
           
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