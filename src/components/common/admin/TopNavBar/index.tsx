'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function TopNavBar() {
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
    const currentPage = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : { label: 'Dashboard', href: '/' };
    
    return (
        <>
            {/* Mobile view - only current page name */}
            <div className="md:hidden">
                <h1 className="text-lg font-bold text-blue-600">
                    {currentPage.label}
                </h1>
            </div>
            
            {/* Desktop view - full breadcrumb trail */}
            <div className="hidden md:block">
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={crumb.href} className="flex items-center ml-2">
                                <BreadcrumbItem className={`font-medium ${crumb.href === pathname ? 'text-blue-600 font-bold text-lg' : 'text-gray-800'}`}>
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.href}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
            </Button>
        </>
    )
}

export default TopNavBar;