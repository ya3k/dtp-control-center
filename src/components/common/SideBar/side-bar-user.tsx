"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/providers/AuthProvider";
import authApiRequest from "@/apiRequests/auth";
import { toast } from "sonner";
import { links } from "@/configs/routes";
import { handleErrorApi } from "@/lib/utils";
import { AUTH_SYNC_KEY } from "@/components/common/UserInitializer";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, setUser } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    router.refresh();
  }, [setUser]);

  async function handleLogout() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any =
        await authApiRequest.logoutFromNextClientToNextServer();
      if (!response.payload.success) {
        console.error(response.payload.message);
        return;
      }
      setUser(null);
      toast.success(response.payload.message);
      localStorage.removeItem(AUTH_SYNC_KEY);
      location.href = links.login.href;
    } catch (error) {
      console.error("Logout error:", error);
      handleErrorApi(error);
      // If the error is due to an expired session token, redirect to login
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        setUser(null);
        localStorage.removeItem(AUTH_SYNC_KEY);
        setTimeout(() => {
          window.location.replace(
            `${links.login.href}?redirectFrom=${pathname}`,
          );
        }, 2000);
      });
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-border data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={"/images/default-profile.jpg"} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={"/images/default-profile.jpg"} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="group transition-colors hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
