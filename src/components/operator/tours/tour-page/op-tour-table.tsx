import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tourOdataResType } from "@/schemaValidations/tour-operator.shema"
import { OpTourTableSkeleton } from "./op-tour-table-skeleton"
import { OpTourEmptyState } from "./op-tour-empty-state"
import { OpTourStarRating } from "./op-tour-star-rating"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface TourTableProps {
  tours: tourOdataResType[]
  totalCount: number
  loading: boolean
  pageSize: number
  resetFilters: () => void
  truncateDescription: (text: string, maxLength?: number) => string
  onEditTour?: (tour: tourOdataResType) => void
}

export function OpTourTable({
  tours,
  totalCount,
  loading,
  pageSize,
  resetFilters,
  truncateDescription,
  onEditTour
}: TourTableProps) {
  return (
    <Table>
      <TableCaption>
        Showing {tours.length} of {totalCount} available tours
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="min-w-[200px]">Tour Details</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <OpTourTableSkeleton count={pageSize} />
        ) : tours.length > 0 ? (
          tours.map((tour) => (
            <TableRow key={tour.id}>
              <TableCell>
                <div className="relative h-16 w-24 overflow-hidden rounded-md">
                  <Image
                    src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTptCT4UOfGuWsfMsqfUG87MJb5JKMa7AAOHQ&s"}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{tour.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {truncateDescription(tour.description)}
                  </div>
                </div>
              </TableCell>
              <TableCell><OpTourStarRating rating={tour.avgStar} /></TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="font-medium">
                  ${tour.onlyFromCost}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTour && onEditTour(tour)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>

          ))
        ) : (
          <OpTourEmptyState resetFilters={resetFilters} />
        )}
      </TableBody>
    </Table>

  )
}