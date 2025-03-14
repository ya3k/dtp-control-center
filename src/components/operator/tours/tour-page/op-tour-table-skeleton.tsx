"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface TourTableSkeletonProps {
  count: number
}

export function OpTourTableSkeleton({ count }: TourTableSkeletonProps) {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton className="h-16 w-24 rounded-md" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[200px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[60px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-6 w-[60px] ml-auto" />
        </TableCell>
      </TableRow>
    ))
}