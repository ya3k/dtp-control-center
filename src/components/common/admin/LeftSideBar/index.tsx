'use client';

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    LogOut,
    ChevronDown,
    Menu,
    X,
    LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Định nghĩa kiểu cho các navigation item con
interface NavSubItem {
    name: string;
    href: string;
}

// Định nghĩa kiểu cho navigation item chính, có thể có subItems
interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    subItems?: NavSubItem[];
}

// Mảng các navigation items, bao gồm các mục có hoặc không có subItems
const navItems: NavItem[] = [
    { 
        name: "Dashboard", 
        href: "/admin/dashboard", 
        icon: LayoutDashboard,
    },
    { 
        name: "Users", 
        href: "/admin/dashboard/users", 
        icon: Users,
        subItems: [
            { name: "All Users", href: "/admin/dashboard/users" },
            { name: "Admins", href: "/admin/dashboard/users1" },
        ],
    },
    { 
        name: "Settings", 
        href: "/admin/dashboard/users1", 
        icon: Settings,
        subItems: [
            { name: "Profile", href: "/dashboard/settings/profile" },
            { name: "Account", href: "/dashboard/settings/account" },
        ],
    },
];

export default function Sidebar() {
    // Lấy pathname hiện tại từ Next.js Navigation hook
    const pathname = usePathname();
    // Quản lý trạng thái mở/đóng của các accordion (cho các mục có subItems)
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    // Quản lý trạng thái mở/đóng của sidebar (cho mobile view)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // Quản lý trạng thái "hover" (để mở rộng sidebar trên một số kích thước màn hình)
    const [isHovered, setIsHovered] = useState(false);
    // Tham chiếu đến sidebar để xử lý click bên ngoài
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Hàm đóng sidebar khi người dùng di chuyển đến trang khác trên mobile
    const closeSidebar = () => {
        if (window.innerWidth < 768) { // md breakpoint (768px) trở xuống
            setSidebarOpen(false);
        }
    };

    // useEffect để thiết lập các accordion mở dựa trên pathname hiện tại
    useEffect(() => {
        const activeItems: Record<string, boolean> = {};
        navItems.forEach(item => {
            if (item.subItems) {
                // Kiểm tra xem có subItem nào đang active dựa trên pathname không
                const isActiveParent = item.subItems.some(subItem => 
                    pathname === subItem.href || pathname.startsWith(subItem.href + '/')
                );
                if (isActiveParent) {
                    activeItems[item.name] = true;
                }
            }
        });
        setOpenItems(activeItems);
    }, [pathname]);

    // useEffect xử lý click bên ngoài sidebar để tắt trạng thái hover khi đang ở md breakpoint
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsHovered(false);
            }
        }
        
        // Hàm kiểm tra kích thước màn hình và thêm hoặc xoá sự kiện click bên ngoài
        const checkScreenSize = () => {
            // Áp dụng cho màn hình có kích thước từ md (768px) đến lg (1024px)
            if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                document.addEventListener("mousedown", handleClickOutside);
            } else {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
        
        // Kiểm tra ngay khi mount component
        checkScreenSize();
        // Lắng nghe sự thay đổi kích thước màn hình
        window.addEventListener("resize", checkScreenSize);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    // Hàm toggle mở/đóng accordion cho item có subItems
    const toggleItem = (name: string) => {
        setOpenItems((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <>
            {/* Nút hiển thị sidebar cho mobile */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg"
                aria-label="Toggle menu"
            >
                {sidebarOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </button>

            {/* Overlay mờ cho mobile khi sidebar mở */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                ref={sidebarRef}
                className={cn(
                    // Vị trí cố định bên trái, full chiều cao, có hiệu ứng chuyển động khi mở/đóng
                    "fixed inset-y-0 left-0 z-40 bg-gray-100 transform transition-all duration-300 ease-in-out",
                    "flex flex-col",
                    // Trạng thái mở/đóng: dịch chuyển theo trục X
                    sidebarOpen ? "translate-x-0 shadow-[5px_0_15px_rgba(0,0,0,0.1)]" : "-translate-x-full md:translate-x-0",
                    // Chiều rộng: mặc định là 64 (16rem) ở lg, và 16 (4rem) ở md để chỉ hiển thị icon
                    "w-64 md:w-16 lg:w-64",
                    // Khi hover (trên md breakpoint) mở rộng sidebar thành full width (64)
                    isHovered ? "md:w-64" : "",
                    // Áp dụng shadow cho md trở lên
                    "md:shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
                )}
                // Xử lý sự kiện mouse enter/leave cho responsive (chỉ áp dụng cho md, 768px đến 1024px)
                onMouseEnter={() => {
                    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                        setIsHovered(true);
                    }
                }}
                onMouseLeave={() => {
                    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                        setIsHovered(false);
                    }
                }}
            >
                {/* Logo */}
                <div className="p-4 flex items-center justify-center md:justify-center lg:justify-start mb-2">
                    <h1 className="text-2xl font-bold md:text-center lg:text-left">
                        {/* Hiển thị logo theo điều kiện: nếu hover hoặc màn hình lg, hiển thị đầy đủ, còn không thì ẩn */}
                        <span className={cn(
                            "lg:inline",
                            isHovered ? "md:inline" : "md:hidden"
                        )}>DTP</span>
                        <span className={cn(
                            "hidden",
                            isHovered ? "md:hidden" : "md:inline lg:hidden"
                        )}>DTP</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
                    {navItems.map((item) => (
                        <div key={item.name} className="mb-2">
                            {/* Nếu item có subItems và không ở trạng thái hover trên md, hiển thị phiên bản chỉ icon */}
                            {item.subItems && !isHovered && window.innerWidth >= 768 && window.innerWidth < 1024 ? (
                                <div className="block md:block lg:hidden">
                                    <Link href={item.href} onClick={closeSidebar}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full flex justify-center py-2",
                                                // So sánh pathname để đánh dấu mục active
                                                pathname === item.href && "bg-blue-700 text-white hover:bg-blue-800 font-medium"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : null}

                            {/* Khối hiển thị đầy đủ (bao gồm cả tên và subItems nếu có) */}
                            <div className={cn(
                                // Điều chỉnh hiển thị dựa trên có subItems hay không, và trạng thái hover hoặc kích thước màn hình
                                item.subItems ? (
                                    isHovered || window.innerWidth >= 1024 
                                        ? "block" 
                                        : "block md:hidden lg:block"
                                ) : "block"
                            )}>
                                {item.subItems ? (
                                    // Nếu có subItems, sử dụng Collapsible để ẩn/hiện danh sách con
                                    <Collapsible
                                        open={openItems[item.name]}
                                        onOpenChange={() => toggleItem(item.name)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full text-left flex items-center",
                                                    "hover:bg-blue-200 py-3 rounded-lg",
                                                    // Nếu hover hoặc màn hình lg, căn chỉnh giữa theo cách khác so với md (icon chỉ)
                                                    (isHovered || window.innerWidth >= 1024) 
                                                        ? "md:justify-between" 
                                                        : "md:justify-center lg:justify-between",
                                                    // So sánh pathname để đánh dấu active
                                                    pathname === item.href && "bg-blue-700 text-white hover:bg-blue-800 font-medium"
                                                )}
                                            >
                                                <span className="flex items-center">
                                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                                    {/* Hiển thị tên item dựa trên trạng thái hover hoặc kích thước màn hình */}
                                                    <span className={cn(
                                                        "ml-3 font-medium",
                                                        (isHovered || window.innerWidth >= 1024) 
                                                            ? "md:inline" 
                                                            : "md:hidden lg:inline"
                                                    )}>
                                                        {item.name}
                                                    </span>
                                                </span>
                                                {/* Icon xoay cho accordion */}
                                                <ChevronDown
                                                    className={cn(
                                                        "h-4 w-4 transition-transform duration-200",
                                                        (isHovered || window.innerWidth >= 1024) 
                                                            ? "md:inline" 
                                                            : "md:hidden lg:inline",
                                                        openItems[item.name] && "rotate-180"
                                                    )}
                                                />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <div className={cn(
                                                "mt-1 space-y-1",
                                                // Điều chỉnh khoảng cách lề dựa trên trạng thái hover/kích thước
                                                (isHovered || window.innerWidth >= 1024) 
                                                    ? "ml-5" 
                                                    : "ml-0 md:ml-0 lg:ml-6"
                                            )}>
                                                {item.subItems.map((subItem) => (
                                                    <Link key={subItem.href} href={subItem.href} onClick={closeSidebar}>
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                "w-[90%] text-sm hover:bg-blue-200 py-3 rounded-lg ml-1",
                                                                // Căn chỉnh nội dung dựa theo responsive
                                                                (isHovered || window.innerWidth >= 1024) 
                                                                    ? "justify-start" 
                                                                    : "justify-center md:justify-center lg:justify-start",
                                                                // Đánh dấu active nếu pathname trùng với href của subItem
                                                                pathname === subItem.href && "bg-blue-600 text-white hover:bg-blue-800 font-medium"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                (isHovered || window.innerWidth >= 1024) 
                                                                    ? "md:inline" 
                                                                    : "md:hidden lg:inline"
                                                            )}>
                                                                {subItem.name}
                                                            </span>
                                                            {/* Hiển thị chữ viết tắt nếu không mở rộng */}
                                                            <span className={cn(
                                                                "hidden",
                                                                (isHovered || window.innerWidth >= 1024) 
                                                                    ? "md:hidden" 
                                                                    : "md:inline lg:hidden"
                                                            )}>
                                                                {subItem.name.charAt(0)}
                                                            </span>
                                                        </Button>
                                                    </Link>
                                                ))}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    // Nếu item không có subItems, hiển thị dưới dạng Link thông thường
                                    <Link href={item.href} onClick={closeSidebar}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full text-left flex items-center",
                                                "hover:bg-blue-200 py-3 rounded-lg",
                                                (isHovered || window.innerWidth >= 1024) 
                                                    ? "md:justify-start" 
                                                    : "md:justify-center lg:justify-start",
                                                pathname === item.href && "bg-blue-700 text-white hover:bg-blue-800 font-medium"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5 flex-shrink-0" />
                                            <span className={cn(
                                                "ml-1 font-medium",
                                                (isHovered || window.innerWidth >= 1024) 
                                                    ? "md:inline" 
                                                    : "md:hidden lg:inline"
                                            )}>
                                                {item.name}
                                            </span>
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Phần Footer của Sidebar */}
                <div className="p-3 border-t border-gray-200 mt-auto">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full text-left flex items-center",
                            "text-red-500 hover:bg-red-100 hover:text-red-700 py-3 rounded-lg",
                            (isHovered || window.innerWidth >= 1024) 
                                ? "md:justify-start" 
                                : "md:justify-center lg:justify-start"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        <span className={cn(
                            "ml-3 font-medium",
                            (isHovered || window.innerWidth >= 1024) 
                                ? "md:inline" 
                                : "md:hidden lg:inline"
                        )}>Logout</span>
                    </Button>
                </div>
            </aside>
        </>
    );
}
