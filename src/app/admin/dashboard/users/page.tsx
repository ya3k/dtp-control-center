"use client";

import DataTable from "./data-table";
import { columns } from "./columns";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
    const { users, loading, error } = useUsers();

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User List</h1>
            <DataTable columns={columns} data={users} />
        </div>
    );
}