import SidebarItem from "@/types/sidebaritems";
import { Calendar, MapPin, Torus } from "lucide-react";

export const managerItems: SidebarItem[] = [
    {
        title: "Tours",
        url: "",
        icon: Torus,
        subItems: [
            { title: "Danh Sách Tour", url: "/operator/tours", icon: Calendar },
            { title: "Tạo Tour", url: "/operator/tours/create", icon: MapPin },
        ],
    },
  
];