"use client";

import { useEffect, useState } from "react";
import { adminUserscolumns} from "./columns";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import { useUserStore } from "@/store/users/useUserStore";
import AdminUsersDataTable from "./data-table";

export default function UsersPage() {
  const { users, loading, error, fetchUsers } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial data fetch
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  // Function to manually refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User List</h1>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {(loading || isRefreshing) ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Refreshing...</span>
            </>
          ) : (
            <span>Refresh</span>
          )}
        </button>
      </div>

      {/* Error message with retry option */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
          <button
            onClick={fetchUsers}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Main content with loading state */}
      {loading && users.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <AdminUsersDataTable columns={adminUserscolumns} data={users} />
        </div>
      )}
    </div>
  );
}