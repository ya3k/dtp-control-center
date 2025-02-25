'use client';

import Sidebar from "@/components/common/admin/LeftSideBar";
import TopNavBar from "@/components/common/admin/TopNavBar";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-0 md:ml-20 lg:ml-64 transition-all duration-300 flex flex-col">
                {/* Top Navigation Bar - Fixed */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center pl-16 md:pl-4 fixed top-0 right-0 left-0 md:left-20 lg:left-64 z-30 transition-all duration-300">
                    <TopNavBar />
                </header>
                
                {/* Main Content - With padding top to account for fixed header */}
                <main className="p-4 md:p-6 mt-16">
                    <Suspense fallback={<div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>}>
                        {children}
                    </Suspense>
                </main>
            </div>
        </div>
    );
}