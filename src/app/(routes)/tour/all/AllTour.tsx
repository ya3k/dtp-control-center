"use client";
import { ArrowDownUp, CalendarIcon, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { links } from "@/configs/routes";
import { cn, formatCurrency, formatPrice } from "@/lib/utils";
import TourCard from "@/components/cards/TourCard";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";

const MIN = 0;
const MAX = 100000000;

export default function AllTour() {
  const [values, setValues] = React.useState([MIN, MAX]);
  const handleFilter = (min: number, max: number) => {
    alert(`Min: ${min}, Max: ${max}`); // Replace with your filter logic
  };
  return (
    <main className="mx-auto mb-16 mt-24 max-w-2xl space-y-6 px-4 sm:pb-6">
      <div aria-label="filter" className="space-y-4">
        <div className="flex gap-2 px-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="basis-1/2">
                <CalendarIcon className="h-4 w-4 opacity-50" />
                <span> Ngày</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
              <div className="mt-2 flex justify-between">
                <Button variant="outline">Xóa</Button>
                <Button className="bg-core">Chọn</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover></Popover>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="basis-1/2">
                <SlidersHorizontal className="h-4 w-4 opacity-50" />
                <span>Lọc</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto min-h-fit w-full max-w-2xl px-6">
              <DrawerHeader className="mb-4 text-xl font-semibold">
                Lọc
              </DrawerHeader>
              <div className="mb-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Danh mục</h3>
                  <div className="flex flex-wrap gap-4">
                    {["Tour", "Khách sạn", "Nhà hàng"].map((item, index) => (
                      <Button
                        variant="outline"
                        key={index}
                        className={cn(
                          "rounded-lg py-4",
                          `${false ? "border-teal-500 bg-teal-50 text-teal-500 hover:bg-teal-50 hover:text-teal-500" : "hover:bg-teal-50"}`,
                        )}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Giá</h3>
                  <div className="flex items-center justify-between">
                    <h3>
                      <span className="font-semibold text-core">
                        {formatPrice(values[0])}
                      </span>{" "}
                      -{" "}
                      <span className="font-semibold text-core">
                        {formatPrice(values[1])}
                      </span>
                    </h3>
                  </div>
                  <Slider
                    value={values}
                    onValueChange={setValues}
                    min={MIN}
                    max={MAX}
                    step={10000}
                  />
                </div>
              </div>
              <DrawerFooter>
                <div className="flex justify-between">
                  <Button variant="outline">Xóa</Button>
                  <Button variant="core">Hiện 11 kết quả</Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">15 kết quả</div>
          <Button variant="ghost">
            <ArrowDownUp className="h4-w-4 mr-auto opacity-50" />
            Nên đặt
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {Array.from({ length: 10 }, (_, index) => (
          <Link
            href={`${links.tour.href}/${index}`}
            key="index"
            className="group"
          >
            <div
              className={`h-full overflow-hidden rounded-xl border border-core bg-white transition-all duration-300`}
              id={`tour-${index}`}
            >
              <div className="relative">
                <Image
                  src="/images/quynhon.jpg"
                  alt=""
                  className="h-60 w-full object-cover sm:h-96"
                  loading="lazy"
                  width={300}
                  height={300}
                />
              </div>

              <div className="p-3">
                <h3
                  title=""
                  className="line-clamp-2 h-10 text-base font-semibold"
                >
                  Tour Eo Gió
                </h3>

                <div className="mb-2 flex items-center text-xs">
                  <div className="inline-flex items-center text-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 font-medium">0</span>
                    <span className="ml-1 text-gray-600">(100)</span>
                    <span className="mx-1 text-gray-400">•</span>
                    <span className="text-gray-600">100+ Đã đặt</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500">Từ</span>
                    <div className="inline-flex items-center text-sm font-semibold text-core">
                      $ {700000 * 2}
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        ₫ {formatCurrency(700000)}
                      </span>
                    </div>
                  </div>

                  <button className="bg-tour-primary rounded-lg px-2 py-1 text-xs font-medium text-white transition-all hover:bg-opacity-90">
                    Đặt
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
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
    </main>
  );
}
