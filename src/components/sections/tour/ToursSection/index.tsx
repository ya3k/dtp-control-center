"use client";
import React, {  useState } from "react";
import { useRouter } from "next/navigation";

import TourCategory from "./TourCategory";
import TourList from "./TourList";
import TourMap from "./TourMap";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TourCard from "@/components/cards/TourCard";
import { Button } from "@/components/ui/button";
import { TourList as Tours } from "@/types/tours";
import {links} from "@/configs/routes";

interface ToursSectionProps {
  data: Tours;
}

export default function ToursSection({ data }: ToursSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter tours based on selected filter and category
  // const filteredTours = useMemo(() => {
  //   return data.filter((tour) => {
  //     // First, apply category filter
  //     if (selectedCategory !== "all" && tour.category !== selectedCategory) {
  //       return false;
  //     }

  //     // Then, apply other filters
  //     switch (selectedFilter) {
  //       case "free-cancel":
  //         return tour.freeCancel;
  //       case "top-rated":
  //         return tour.rating >= 4.5;
  //       default:
  //         return true;
  //     }
  //   });
  // }, [selectedFilter, selectedCategory]);

  // // Handler for filter selection
  // const handleSelectFilter = (filterId: string) => {
  //   setSelectedFilter(filterId);
  // };

  // // Handler for category selection
  // const handleSelectCategory = (categoryId: string) => {
  //   setSelectedCategory(categoryId);
  // };

  return (
    <>
      <section className="mx-auto mb-16 hidden max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:flex md:max-w-4xl lg:max-w-6xl lg:px-8">
        <h1 className="text-3xl font-bold">Tất cả hoạt động ở Quy Nhơn</h1>

        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row">
            {/*Left section*/}
            <div className={`w-full lg:basis-[30%]`}>
              <div
                className={`h-[calc(100vh - 1rem)] sticky top-20 space-y-4 overflow-hidden px-12 transition-all duration-300 ease-in-out sm:px-0`}
              >
                {/*Tour Category*/}
                <TourMap />
                <TourCategory
                  selectedCategory={selectedCategory}
                  // onSelectCategory={handleSelectCategory}
                />
              </div>
            </div>

            {/*Right section*/}
            <div className="lg:basis-[70%]">
              <TourList
                tours={data}
                selectedFilter={selectedFilter}
                // onSelectFilter={handleSelectFilter}
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="mobile-tour"
        className="mx-auto mb-16 flex w-full max-w-2xl flex-col gap-6 p-4 md:hidden"
      >
        <h1 className="text-xl font-bold sm:text-3xl">
          Tất cả hoạt động ở Quy Nhơn
        </h1>
        <ScrollArea className="w-full rounded-md">
          {/* First row */}
          <div className="flex w-fit gap-4">
            {data.map((tour) => (
              <div key={tour.id} className="min-w-[250px] max-w-[300px] flex-1">
                <TourCard key={tour.id} tour={tour} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2.5" />
        </ScrollArea>
        <div className="w-full">
          <Button
            onClick={() => router.push(links.allTour.href)}
            variant="outline"
            className="w-full"
          >
            Xem {data.length} ở Quy Nhơn
          </Button>
        </div>
      </section>
    </>
  );
}
