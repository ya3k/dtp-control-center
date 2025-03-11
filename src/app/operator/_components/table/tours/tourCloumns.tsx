"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TourRes } from "@/types/schema/TourSchema"

interface OperatorToursColumnsProps {
    onEdit: (tour: TourRes) => void
    onDelete: (tour: TourRes) => void
}

export const operatorToursColumns = ({ onEdit, onDelete }: OperatorToursColumnsProps): ColumnDef<TourRes>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        accessorKey: "thumbnailUrl",
        header: "Thumbnail",
        cell: ({ row }) => <img src={row.getValue("thumbnailUrl")} alt="Thumbnail" className="w-16 h-16 object-cover" />,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
        accessorKey: "companyName",
        header: "Company Name",
        cell: ({ row }) => <div>{row.getValue("companyName")}</div>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
        accessorKey: "avgStar",
        header: "Avg Star",
        cell: ({ row }) => <div>{row.getValue("avgStar")}</div>,
    },
    {
        accessorKey: "totalRating",
        header: "Total Rating",
        cell: ({ row }) => <div>{row.getValue("totalRating")}</div>,
    },
    {
        accessorKey: "onlyFromCost",
        header: "Only From Cost",
        cell: ({ row }) => <div>{row.getValue("onlyFromCost")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const tour = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tour.id)}>Copy Tour ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(tour)}>Edit Tour</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(tour)} className="text-red-600 focus:text-red-600">
                            Delete Tour
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
