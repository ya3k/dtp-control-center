"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Loader2, Trash2, UserCheck, UserX } from "lucide-react"
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown"
import { UserResType } from "@/schemaValidations/admin-user.schema"

interface UserTableProps {
  users: UserResType[]
  loading: boolean
  onEditUser: (user: UserResType) => void
  onDeleteUser: (user: UserResType) => void
  onToggleUserStatus: (user: UserResType) => void
  resetFilters: () => void
}

export function UserTable({
  users,
  loading,
  onEditUser,
  onDeleteUser,
  onToggleUserStatus,
  resetFilters,
}: UserTableProps) {
  // Define column configuration with all needed properties
  const columns: ColumnDef<UserResType>[] = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: (user) => <span className="font-medium truncate max-w-[120px]">{user.id.split('-')[0]}...</span>,
      enableHiding: true,
      className: "w-[120px]",
      defaultHidden: true, // Ẩn mặc định
    },
    {
      id: "userName",
      header: "Tên người dùng",
      accessorKey: "userName",
      cell: (user) => user.userName,
      enableHiding: false, // Cột bắt buộc, không thể ẩn
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: (user) => user.email,
      enableHiding: false, // Cột bắt buộc, không thể ẩn
    },
    {
      id: "companyName",
      header: "Công ty",
      accessorKey: "companyName",
      cell: (user) => user.companyName,
      enableHiding: true,
    },
    {
      id: "roleName",
      header: "Vai trò",
      accessorKey: "roleName",
      cell: (user) => user.roleName,
      enableHiding: true,
    },
    {
      id: "isActive",
      header: "Trạng thái",
      accessorKey: "isActive",
      cell: (user) => (
        <div className="flex justify-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-center ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
          </span>
        </div>
      ),
      enableHiding: false,
      align: "center", // Add center alignment
      className: "text-center", // Add text-center class
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditUser(user)}
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleUserStatus(user)}
            title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
            className={user.isActive ?
              "text-amber-500 hover:text-amber-600 hover:bg-amber-100" :
              "text-green-500 hover:text-green-600 hover:bg-green-100"}
          >
            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
            onClick={() => onDeleteUser(user)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableHiding: true,
      align: "center",
    },
  ]

  // Track visible columns, respecting defaultHidden property
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, column) => ({
      ...acc,
      [column.id]: column.defaultHidden === true ? false : true,
    }), {})
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Không tìm thấy người dùng nào</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Thử thay đổi bộ lọc hoặc tìm kiếm để xem nhiều kết quả hơn.
        </p>
        <Button variant="destructive" onClick={resetFilters} className="mt-2">
          Xóa bộ lọc
        </Button>
      </div>
    )
  }

  // Get filtered columns that should be visible
  const visibleColumnDefs = columns.filter(column => visibleColumns[column.id])

  return (
    <div>
      {/* Column visibility dropdown */}
      <div className="flex justify-end my-2 px-4">
        <ColumnToggleDropdown
          columns={columns}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
        />
      </div>

      {/* Table */}
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnDefs.map((column) => (
                <TableHead
                  key={column.id}
                  className={`text-gray-800 font-bold text-sm
                    ${column.className ||
                    (column.align === "right" ? "text-right" :
                      (column.align === "center" ? "text-center" : undefined))}                   
                    `
                  }
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {visibleColumnDefs.map((column) => (
                  <TableCell
                    key={`${user.id}-${column.id}`}
                    className={
                      column.align === "right" ? "text-right" :
                        (column.align === "center" ? "text-center" : undefined)
                    }
                  >
                    {column.cell(user)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}