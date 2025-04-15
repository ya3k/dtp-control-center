"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import SidebarItem from "@/types/sidebaritems";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { NavUser } from "./side-bar-user";

interface SideBarDashboardProps {
  items: SidebarItem[],
  title?: string
}

export function SidebarDashboard({ items, title = 'Dashboard' }: SideBarDashboardProps) {
  const pathname = usePathname();

  return (
    <Sidebar className="w-64 bg-gray-50 border-r border-gray-300" style={{ boxShadow: "5px 0 15px rgba(0,0,0,0.1)" }}>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-gray-800 px-2 py-2">
            {title}
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2 space-y-1">
            {items.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={item.subItems && item.subItems.some(sub => pathname.startsWith(sub.url))}
                className="group/collapsible"
              >
                {/* Use div instead of SidebarMenuItem (li) for the parent */}
                <div className="relative">
                  <CollapsibleTrigger asChild>
                    <div>
                      <SidebarMenuButton
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          "text-gray-600 hover:bg-blue-100 hover:text-gray-800",
                          pathname === item.url && "bg-blue-700 text-white"
                        )}
                      >
                        {item.url !== '' ?
                          <Link href={item.url} className="flex items-center gap-3 flex-1">
                            {item.icon && <item.icon className="h-5 w-5" />}
                            <span className="text-sm font-medium">{item.title}</span>
                          </Link>
                          :
                          <> {item.icon && <item.icon className="h-5 w-5" />}
                            <span className="text-sm font-medium">{item.title}</span>
                          </>}
                        {item.subItems && (
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleTrigger>

                  {item.subItems && (
                    <CollapsibleContent>
                      {/* Use a separate UL for the sub-items */}
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <Link href={subItem.url} passHref>
                              <SidebarMenuButton
                                className={cn(
                                  "flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                  "text-gray-600 hover:bg-blue-100 hover:text-gray-800",
                                  pathname === subItem.url && "bg-blue-700 text-white"
                                )}
                              >
                                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                <span className="text-sm">{subItem.title}</span>
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuItem>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  )}
                </div>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  );
}