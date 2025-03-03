"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
interface AdminUsersColumnsProps {
    onViewDetail: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (user: User) => void
}

export const adminUserscolumns = ({ onViewDetail, onEdit, onDelete }: AdminUsersColumnsProps): ColumnDef<User>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
        accessorKey: "fullname",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Full Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("fullname")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
        accessorKey: "createAt",
        header: "Created At",
        cell: ({ row }) => (
            <div>{new Date(row.getValue("createAt")).toLocaleString()}</div>
        ),
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
            <div>
                {row.getValue("updatedAt")
                    ? new Date(row.getValue("updatedAt")).toLocaleString()
                    : "N/A"}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                            Copy User ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onViewDetail(user)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(user)}>Edit User</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(user)} className="text-red-600 focus:text-red-600">
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];