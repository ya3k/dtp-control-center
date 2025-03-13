"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DestinationType } from "@/schemaValidations/admin-destination.schema";

interface AdminDestinationColumnsProps {
  onViewDetail: (destination: DestinationType) => void;
  onEdit: (destination: DestinationType) => void;
  onDelete: (destination: DestinationType) => void;
}

export const adminDestinationColumns = ({
  onViewDetail,
  onEdit,
  onDelete,
}: AdminDestinationColumnsProps): ColumnDef<DestinationType>[] => [
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
          Tên địa điểm
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "latitude",
      header: "Vĩ độ",
      cell: ({ row }) => <div>{row.getValue("latitude")}</div>,
    },
    {
      accessorKey: "longitude",
      header: "Kinh độ",
      cell: ({ row }) => <div>{row.getValue("longitude")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Tạo lúc",
      cell: ({ row }) => {
        const value = row.getValue("createdAt") as string;
        return <div>{new Date(value).toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "createdBy",
      header: "Tạo bởi",
      cell: ({ row }) => <div>{row.getValue("createdBy") || "N/A"}</div>,
    },
    {
      accessorKey: "lastModified",
      header: "Sửa lúc",
      cell: ({ row }) => {
        const value = row.getValue("lastModified") as string | null;
        return value ? new Date(value).toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "isDeleted",
      header: "Trạng Thái",
      cell: ({ row }) => {
        const isDeleted = row.getValue("isDeleted") as boolean;
        return isDeleted ? (
          <Badge variant="destructive">Xóa</Badge>
        ) : (
          <Badge variant="active">Hoạt Động</Badge>
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
              <DropdownMenuLabel>Tùy Chọn</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(destination.id)}
              >
                Sao chép ID địa điểm
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewDetail(destination)}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(destination)}>
               Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(destination)}
                className="text-red-600 focus:text-red-600"
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
