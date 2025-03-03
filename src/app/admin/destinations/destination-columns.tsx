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
import { Destination } from "@/types/destination";

interface AdminDestinationColumnsProps {
  onViewDetail: (destination: Destination) => void;
  onEdit: (destination: Destination) => void;
  onDelete: (destination: Destination) => void;
}

export const adminDestinationColumns = ({
  onViewDetail,
  onEdit,
  onDelete,
}: AdminDestinationColumnsProps): ColumnDef<Destination>[] => [
  // 1) Checkbox column for row selection
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

  // 2) ID column
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },

  // 3) Name column
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },

  // 4) Created By
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created By
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("createdBy")}</div>,
  },

  // 5) Created At
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return <div>{new Date(value).toLocaleString()}</div>;
    },
  },

  // 6) Last Modified
  {
    accessorKey: "lastModified",
    header: "Last Modified",
    cell: ({ row }) => {
      const value = row.getValue("lastModified") as string | undefined;
      return value ? new Date(value).toLocaleString() : "N/A";
    },
  },

  // 7) Is Deleted
  {
    accessorKey: "isDeleted",
    header: "Is Deleted",
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      return isDeleted ? "Yes" : "No";
    },
  },

  // 8) Actions column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const destination = row.original;

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
              onClick={() => navigator.clipboard.writeText(destination.id)}
            >
              Copy Destination ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetail(destination)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(destination)}>
              Edit Destination
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(destination)}
              className="text-red-600 focus:text-red-600"
            >
              Delete Destination
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
