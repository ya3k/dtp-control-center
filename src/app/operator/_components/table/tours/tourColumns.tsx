"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react"

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
import type { TourResType } from "@/schemaValidations/tour-operator.shema"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface OperatorToursColumnsProps {
  onEdit: (tour: TourResType) => void
  onDelete: (tour: TourResType) => void
  onView?: (tour: TourResType) => void
}

export const operatorToursColumns = ({
  onEdit,
  onDelete,
  onView,
}: OperatorToursColumnsProps): ColumnDef<TourResType>[] => [
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
    cell: ({ row }) => <div className="text-xs text-muted-foreground font-mono">{row.getValue("id")}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnailUrl",
    header: "Thumbnail",
    cell: ({ row }) => (
      <div className="relative w-16 h-16 rounded-md overflow-hidden">
        <Image
          src={row.getValue("thumbnailUrl") || "/placeholder.svg?height=64&width=64"}
          alt={row.getValue("title") || "Tour thumbnail"}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium line-clamp-2">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <div className="line-clamp-1">{row.getValue("companyName")}</div>,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] line-clamp-2 text-sm text-muted-foreground">{row.getValue("description")}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "avgStar",
    header: "Rating",
    cell: ({ row }) => {
      const rating = Number.parseFloat(row.getValue("avgStar")) || 0
      const totalRating = Number.parseInt(row.getValue("totalRating")) || 0

      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({totalRating})</span>
        </div>
      )
    },
  },
  {
    accessorKey: "onlyFromCost",
    header: "Price",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("onlyFromCost")) || 0

      return (
        <Badge variant="outline" className="font-medium">
          {formatCurrency(price)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const tour = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tour.id)} className="cursor-pointer">
              Copy Tour ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onView && (
              <DropdownMenuItem onClick={() => onView(tour)} className="cursor-pointer">
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(tour)} className="cursor-pointer">
              Edit Tour
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tour)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              Delete Tour
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

