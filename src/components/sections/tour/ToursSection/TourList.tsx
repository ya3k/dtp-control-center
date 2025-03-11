"use client";
import React, { useRef } from "react";

import TourFilter from "./TourFilter";
import TourCard from "@/components/cards/TourCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { TourList as Tours } from "@/types/tours";

interface TourListProps {
  tours: Tours;
  selectedFilter: string;
  onSelectFilter?: (filterId: string) => void;
  isLoading?: boolean;
}

export default function TourList({
  tours,
  selectedFilter,
  isLoading,
}: TourListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={listRef} className="w-full">
      <TourFilter
        selectedFilter={selectedFilter}
        // onSelectFilter={onSelectFilter}
        tourCount={tours.length}
      />

      <div className="grid grid-cols-1 gap-4 px-12 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
        {isLoading
          ? // Show skeletons based on desired number of skeleton items
            Array.from({ length: 12 }, (_, index) => (
              <Skeleton key={index} className="h-40" /> // Adjust height if necessary
            ))
          : tours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
      </div>

      <div className="flex justify-center py-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
