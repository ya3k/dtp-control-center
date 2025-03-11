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

interface Company {
  Id: string;
  Name: string;
  Phone: string;
  Email: string;
  TaxCode: string;
  Licensed: boolean;
  StaffCount: number;
  TourCount: number;
}

interface AdminCompanyColumnsProps {
  onViewDetail: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export const adminCompanyColumns = ({
  onViewDetail,
  onEdit,
  onDelete,
}: AdminCompanyColumnsProps): ColumnDef<Company>[] => [
  {
    accessorKey: "Id",
    header: "ID",
    cell: ({ row }) => <div className="w-[250px]">{row.getValue("Id")}</div>,
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("Name")}</div>,
  },
  {
    accessorKey: "Phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("Phone")}</div>,
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("Email")}</div>,
  },
  {
    accessorKey: "TaxCode",
    header: "Tax Code",
    cell: ({ row }) => <div>{row.getValue("TaxCode")}</div>,
  },
  {
    accessorKey: "Licensed",
    header: "Licensed",
    cell: ({ row }) => {
      const licensed = row.getValue("Licensed") as boolean;
      return licensed ? <Badge variant="active">Yes</Badge> : <Badge variant="destructive">No</Badge>;
    },
  },
  {
    accessorKey: "StaffCount",
    header: "Staff Count",
    cell: ({ row }) => <div>{row.getValue("StaffCount")}</div>,
  },
  {
    accessorKey: "TourCount",
    header: "Tour Count",
    cell: ({ row }) => <div>{row.getValue("TourCount")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const company = row.original;

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
              onClick={() => navigator.clipboard.writeText(company.Id)}
            >
              Copy Company ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetail(company)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(company)}>
              Edit Company
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(company)}
              className="text-red-600 focus:text-red-600"
            >
              Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
