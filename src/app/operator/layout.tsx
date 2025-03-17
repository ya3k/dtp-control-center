'use client'
import SidebarBreadcrumb from "@/components/common/SideBar/SidebarBreadcrumb";
import { SidebarDashboard } from "@/components/common/SideBar/SideBarDashboard";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Home, MapPin, Torus, Users } from "lucide-react";
const operatorItems = [
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
        title: "Nhân Viên",
        url: "",
        icon: Users,
        subItems: [
            { title: "Danh sách nhân viên", url: "/operator/employee", icon: Calendar },

        ],
    }
];
export default function OperatorLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarDashboard items={operatorItems} title="Operator" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="font-bold" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* breadcrumb */}
                        <div className="w-full border-b border-gray-300 pb-2">
                            <SidebarBreadcrumb />
                        </div>
                    </div>
                </header>
                <div className="ml-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}