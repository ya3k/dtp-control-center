import { LucideIcon } from "lucide-react";
export default interface SidebarItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    subItems?: SidebarItem[]; // Optional sub-items for nested navigation
}