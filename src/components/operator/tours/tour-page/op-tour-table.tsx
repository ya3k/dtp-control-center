import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tourOdataResType } from "@/schemaValidations/tour-operator.shema"
import { OpTourTableSkeleton } from "./op-tour-table-skeleton"
import { OpTourEmptyState } from "./op-tour-empty-state"
import { OpTourStarRating } from "./op-tour-star-rating"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Pencil, ImageIcon } from "lucide-react"
import { useState } from "react"

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
  // Track images that failed to load
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Handle image load error
  const handleImageError = (tourId: string) => {
    setFailedImages(prev => ({
      ...prev,
      [tourId]: true
    }));
  };

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
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <OpTourTableSkeleton count={pageSize} />
        ) : tours.length > 0 ? (
          tours.map((tour) => (
            <TableRow key={tour.id}>
              <TableCell>
                <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
                  {!failedImages[tour.id] && tour.thumbnailUrl ? (
                    <Image
                      src={tour.thumbnailUrl}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100px, 96px"
                      className="object-cover"
                      onError={() => handleImageError(tour.id)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Image 
                        src={`/images/binhdinhtour.png`} 
                        alt="Default tour image" 
                        width={96}
                        height={64}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{tour.title}</div>
                  <div className="text-sm text-muted-foreground">{truncateDescription(tour.description)}</div>
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