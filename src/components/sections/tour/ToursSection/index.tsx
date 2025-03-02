"use client";
import React, { useEffect, useMemo, useState } from "react";

import TourCategory from "./TourCategory";
import TourList from "./TourList";
import { tourData, Tour } from "@/lib/data";
import { useScroll } from "@/hooks/use-scroll";
import TourMap from "@/components/sections/tour/ToursSection/TourMap";

export default function ToursSection() {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { scrolled, scrollY } = useScroll(100);

  // Filter tours based on selected filter and category
  const filteredTours = useMemo(() => {
    return tourData.filter((tour) => {
      // First, apply category filter
      if (selectedCategory !== "all" && tour.category !== selectedCategory) {
        return false;
      }

      // Then, apply other filters
      switch (selectedFilter) {
        case "free-cancel":
          return tour.freeCancel;
        case "top-rated":
          return tour.rating >= 4.5;
        default:
          return true;
      }
    });
  }, [selectedFilter, selectedCategory]);

  // Handler for selecting a tour either from the map or list
  const handleSelectTour = (tourId: string) => {
    setSelectedTourId(tourId);
  };

  // Handler for filter selection
  const handleSelectFilter = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  // Handler for category selection
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // When filters or categories change, reset selected tour
  useEffect(() => {
    setSelectedTourId(null);
  }, [selectedFilter, selectedCategory]);

  return (
    <>
      <section className="mx-auto mb-16 hidden px-4 max-w-2xl flex-col gap-6 sm:pb-6 lg:max-w-6xl lg:px-8 md:flex">
        <h1 className="text-3xl font-bold">Tất cả hoạt động ở Quy Nhơn</h1>
  
  
        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row">
            {/*Left section*/}
            <div className="w-full lg:basis-[30%]">
              <div className="h-[calc(100vh - 1rem)] sticky top-0 px-12 sm:px-0 overflow-hidden transition-all duration-300 ease-in-out">
                {/*Tour Category*/}
                <TourMap/>
                <TourCategory
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            </div>
  
            {/*Right section*/}
            <div className="lg:basis-[70%]">
              <TourList
                tours={filteredTours}
                selectedTourId={selectedTourId}
                onSelectTour={handleSelectTour}
                selectedFilter={selectedFilter}
                onSelectFilter={handleSelectFilter}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
