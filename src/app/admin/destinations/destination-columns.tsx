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
import { Badge } from "@/components/ui/badge";

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
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <div className="w-[250px]">{row.getValue("id")} </div>;
      },
    },
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
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: ({ row }) => <div>{row.getValue("latitude")}</div>,
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: ({ row }) => <div>{row.getValue("longitude")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const value = row.getValue("createdAt") as string;
        return <div>{new Date(value).toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ row }) => <div>{row.getValue("createdBy") || "N/A"}</div>,
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
      cell: ({ row }) => {
        const value = row.getValue("lastModified") as string | null;
        return value ? new Date(value).toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "isDeleted",
      header: "Is Deleted",
      cell: ({ row }) => {
        const isDeleted = row.getValue("isDeleted") as boolean;
        return isDeleted ? (
          <Badge variant="destructive">Deleted</Badge>
        ) : (
          <Badge variant="active">Active</Badge>
        );
      },
    },
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
