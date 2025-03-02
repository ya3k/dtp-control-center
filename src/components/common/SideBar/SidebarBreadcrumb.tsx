'use client'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarBreadcrumb() {
    const pathname = usePathname();
    // Generate breadcrumbs based on pathname
    const generateBreadcrumbs = () => {
        const pathParts = pathname.split("/").filter((part) => part);
        const breadcrumbs = pathParts.map((part, index) => {
            const href = `/${pathParts.slice(0, index + 1).join("/")}`;
            return { label: part.charAt(0).toUpperCase() + part.slice(1), href };
        });
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center">
                        <BreadcrumbItem className={`font-medium ${crumb.href === pathname ? 'text-blue-600 font-bold text-lg' : 'text-gray-600'}`}>
                            <BreadcrumbLink asChild>
                                <Link href={crumb.href}>{crumb.label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default SidebarBreadcrumb