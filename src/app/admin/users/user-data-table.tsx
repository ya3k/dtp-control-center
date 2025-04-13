"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import { UserResType } from "@/schemaValidations/admin-user.schema"
import { UserTable } from "@/components/admin/users/user-table"
import { UserTableFilterCard } from "@/components/admin/users/user-table-filter"
import userApiRequest from "@/apiRequests/user"
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog"
import { DeleteUsersDialog } from "@/components/admin/users/delete-user-dialog"
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog"
import { toast } from "sonner"

export default function UserDataTable() {
  // Data state
  const [users, setUsers] = useState<UserResType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")

  // Edit state
  const [selectedUser, setSelectedUser] = useState<UserResType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, roleFilter, companyFilter])

  // Fetching users
  const fetchUsers = async () => {
    setLoading(true)

    try {
      // Calculate skip for pagination
      const skip = (currentPage - 1) * pageSize

      // Build OData query parameters
      const params = new URLSearchParams()
      // Pagination
      params.append("$top", pageSize.toString())
      params.append("$skip", skip.toString())
      params.append("$count", "true")

      // Filtering
      const filterConditions: string[] = []

      // Search term (userName or email contains)
      if (debouncedSearchTerm) {
        filterConditions.push(`(contains(userName, '${debouncedSearchTerm}') or contains(email, '${debouncedSearchTerm}'))`)
      }

      // Role filter
      if (roleFilter && roleFilter !== "all") {
        filterConditions.push(`roleName eq '${roleFilter}'`)
      }

      // Company filter
      if (companyFilter && companyFilter !== "all") {
        filterConditions.push(`companyName eq '${companyFilter}'`)
      }

      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" and "))
      }

      // Ordering
      params.append("$orderby", "userName asc")

      // Construct the OData query string
      const queryString = `?${params.toString()}`
      console.log(queryString)

      // Use userApiRequest instead of userApi
      const response = await userApiRequest.getWithOdata()
      console.log(JSON.stringify(response))
      setUsers(response.payload?.data)
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data with OData parameters
  useEffect(() => {
    fetchUsers()
  }, [currentPage, pageSize, debouncedSearchTerm, roleFilter, companyFilter])

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchUsers()
    setIsRefreshing(false)
  }

  // Handle create
  const handleCreateUser = () => {
    setIsCreateDialogOpen(true)
  }

  // Handle update
  const handleEditUser = (user: UserResType) => {
    setSelectedUser(user) // Just set the basic user info
    setIsEditDialogOpen(true) // Open dialog immediately
  }

  const handleEditComplete = () => {
    setSelectedUser(null)
    setIsEditDialogOpen(false)
    fetchUsers() // Refresh the list after edit
  }

  const handleCreateComplete = () => {
    fetchUsers()
  }

  // Handle delete
  const handleDeleteUser = (user: UserResType) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteComplete = (deletedId: string) => {
    // Remove the deleted user from the local state
    setUsers(prevUsers =>
      prevUsers.filter(user => user.id !== deletedId)
    )

    // Update total count
    setTotalCount(prevCount => prevCount - 1)
  }

  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setRoleFilter("all")
    setCompanyFilter("all")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Quản lý người dùng</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="default"
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>Đang làm mới...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    <span>Làm mới</span>
                  </>
                )}
              </Button>

              <Button
                variant="core"
                size="default"
                className="gap-2"
                disabled={loading || isRefreshing}
                onClick={handleCreateUser}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Thêm người dùng</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Search and Filters */}
        <UserTableFilterCard
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          pageSize={pageSize}
          setPageSize={setPageSize}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          onClearFilters={resetFilters}
        />

        {/* Table */}
        <div className="rounded-md border px-3">
          <UserTable
            users={users}
            loading={loading}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            resetFilters={resetFilters}
          />
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          loading={loading}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </Card>

      {/* Create Dialog */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateComplete={handleCreateComplete}
      />

      {/* Edit Dialog */}
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUser}
        onEditComplete={handleEditComplete}
      />

      {/* Delete Dialog */}
      <DeleteUsersDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onDeleteComplete={handleDeleteComplete}
      />
    </div>
  )
}