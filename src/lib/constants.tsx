import {
    LayoutDashboard,
    User,
  } from "lucide-react";
  
  export const navLinks = [
    {
      url: "/admin/dashboard",
      icon: <LayoutDashboard />,
      label: "Dashboard",
    },
    {
      url: "/admin/dashboard/users",
      icon: <User />,
      label: "Users",
    }  
  ];