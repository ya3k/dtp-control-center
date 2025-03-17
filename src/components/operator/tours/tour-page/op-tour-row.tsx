"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { tourOdataResType } from "@/schemaValidations/tour-operator.shema"
import { OpTourStarRating } from "./op-tour-star-rating"

interface TourRowProps {
  tour: tourOdataResType
  truncateDescription: (text: string, maxLength?: number) => string
}

export function OpTourRow({ tour, truncateDescription }: TourRowProps) {
  return (
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
    </TableRow>
  )
}