"use client";

import DataTable from "./data-table";
import { columns } from "./columns";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useEffect } from "react";
import { useUserStore } from "@/store/users/useUserStore";

export default function UsersPage() {
    const { users, loading, error, fetchUsers } = useUserStore();
    
    useEffect(() => {
        fetchUsers(); // Fetch dữ liệu chỉ khi cần
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <h1 className="text-2xl font-bold mb-2">User List</h1>
            <DataTable columns={columns} data={users} />
        </div>
    );
}