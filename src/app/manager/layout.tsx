'use client'

import { SidebarDashboard } from "@/components/common/SideBar/SideBarDashboard";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { managerItems } from "@/lib/manger-layout-constants";
export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <SidebarDashboard items={managerItems} title="Manager" />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="font-bold" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* breadcrumb */}
                        {/* <div className="w-full border-b border-gray-300 pb-2">
                            <SidebarBreadcrumb />
                        </div> */}
                    </div>
                </header>
                <div className="ml-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}