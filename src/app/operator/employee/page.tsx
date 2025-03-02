"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/users/useUserStore"
import OperatorUsersDataTable from "../_components/table/employee/employee-data-table"
import type { User } from "@/types/user"
import { Toaster } from "@/components/ui/sonner"
import { operatorUsersColumns } from "../_components/table/employee/employeeColumn"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import CreateEmployeeDialog from "@/components/common/operator/employee/create-employee-dialog"
import EditEmployeeDialog from "@/components/common/operator/employee/edit-employee-dialog"
import { DeleteEmployeeDialog } from "@/components/common/operator/employee/delete-employee-dialog"

export default function OperatorUsersPage() {
  const { users, loading, error, fetchUsers } = useUserStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Initial data fetch
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers()
    }
  }, [fetchUsers, users.length])

  // Function to manually refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchUsers()
    setIsRefreshing(false)
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  // Create columns with handlers
  const columns = operatorUsersColumns({
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
  })

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách nhân viên</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading || isRefreshing ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Refreshing...</span>
              </>
            ) : (
              <span>Refresh</span>
            )}
          </button>
          <CreateEmployeeDialog />
        </div>
      </div>

      {/* Error message with retry option */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-500 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </p>
          <button onClick={fetchUsers} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
            Thử lại
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
          <OperatorUsersDataTable columns={columns} data={users} />
        </div>
      )}

      {/* Edit Dialog */}
      <EditEmployeeDialog user={selectedUser} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      {/* Delete Dialog */}
      <DeleteEmployeeDialog user={selectedUser} open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />

      <Toaster />
    </div>
  )
}

