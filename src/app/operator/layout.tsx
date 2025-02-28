'use client'
import SidebarBreadcrumb from "@/components/common/SideBar/SidebarBreadcrumb";
import { SidebarDashboard } from "@/components/common/SideBar/SideBarDashboard";

import { Separator } from "@/components/ui/separator";
import {  SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Home, MapPin, Torus } from "lucide-react";
const operatorItems = [
    {
        title: "Home",
        url: "/operator/dashboard",
        icon: Home,
    },
    {
        title: "Tours",
        url: "/operator/dashboard/tours",
        icon: Torus,
        subItems: [
            { title: "All Tours", url: "/operator/dashboard/tours", icon: Calendar },
            { title: "Locations", url: "/operator/dashboard/tours/locations", icon: MapPin },
        ],
    },
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
                        <SidebarBreadcrumb />
                    </div>
                </header>
                <div className="ml-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}