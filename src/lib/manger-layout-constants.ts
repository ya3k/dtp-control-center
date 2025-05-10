import SidebarItem from "@/types/sidebaritems";
import { Calendar, Home, MapPin, NotebookPen, Torus } from "lucide-react";

export const managerItems: SidebarItem[] = [
    {
        title: "Dashboard",
        url: "/manager/dashboard",
        icon: Home,
    },
    {
        title: "Tours",
        url: "",
        icon: Torus,
        subItems: [
            { title: "Danh Sách Tour", url: "/manager/tours", icon: Calendar },
            { title: "Tạo Tour", url: "/manager/tours/create", icon: MapPin },
            { title: "FeedBack", url: "/manager/tours/feedback", icon: NotebookPen },
        ],
    },
  
];