"use client";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
import {
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  Carousel as CarouselPrimitives,
} from "@/components/motion-primitives/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const tours = [
  {
    title: "Tour Riêng Tham Quan Quy Nhơn Trong Ngày",
    price: "808,000₫",
    originalPrice: "850,000₫",
    imageUrl: "/images/quynhon.jpg", // Replace with actual image path
  },
  {
    title: "Tour Riêng Tham Quan Kỳ Co - Eo Gió và Lặn Ngắm San Hô",
    price: "893,750₫",
    originalPrice: "950,000₫",
    imageUrl: "/images/quynhon1.jpg",
  },
  {
    title: "Tour Ngày Tham Quan Kỳ Co - Eo Gió Và Hòn Khô",
    price: "1,040,000₫",
    originalPrice: "1,110,000₫",
    imageUrl: "/images/quynhon2.jpg",
  },
  {
    title: "Tour Riêng Khám Phá Tháp Chàm Bình Định",
    price: "1,812,500₫",
    originalPrice: "1,900,000₫",
    imageUrl: "/images/thap-doi.jpg",
  },
  {
    title: "Tour Riêng Tham Quan Phú Yên Trong Ngày Từ Quy Nhơn: Nhần",
    price: "808,000₫",
    originalPrice: "850,000₫",
    imageUrl: "/images/quynhon.jpg", // Replace with actual image path
  },
  {
    title: "Tour Riêng Tham Quan Kỳ Co - Eo Gió và Lặn Ngắm San Hô",
    price: "893,750₫",
    originalPrice: "950,000₫",
    imageUrl: "/images/quynhon1.jpg",
  },
  {
    title: "Tour Ngày Tham Quan Kỳ Co - Eo Gió Và Hòn Khô",
    price: "1,040,000₫",
    originalPrice: "1,110,000₫",
    imageUrl: "/images/quynhon2.jpg",
  },
  {
    title: "Tour Riêng Khám Phá Tháp Chàm Bình Định",
    price: "1,812,500₫",
    originalPrice: "1,900,000₫",
    imageUrl: "/images/thap-doi.jpg",
  },
];

export default function PopulationSection() {
  return (
    <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
      <h1 className="text-xl font-bold sm:text-3xl">
        Vui chơi hết cỡ tại Quy Nhơn
      </h1>
      <ScrollArea className="w-full rounded-md md:hidden">
        <div className="flex w-fit gap-4">
          {tours.map((tour, index) => (
            <div key={index} className="min-w-[250px] max-w-[300px] flex-1">
              <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105 md:min-w-[250px] md:max-w-[300px]">
                <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl bg-gray-200">
                  <Image
                    src={tour.imageUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <CardContent className="sm:p-2 lg:p-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-600 sm:text-xs lg:text-sm">
                      Tour Quy Nhơn
                    </p>
                    <p
                      className="line-clamp-2 text-base font-semibold lg:text-lg"
                      title={tour.title}
                    >
                      {tour.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-black sm:text-sm lg:text-base">
                        {tour.price}
                      </p>
                      <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                        {tour.originalPrice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
      <CarouselPrimitives className="hidden w-full md:block">
        <CarouselContent>
          {tours.map((tour, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 p-1 pl-1 sm:p-2 md:p-4"
            >
              <Card className="group relative min-w-[200px] max-w-[250px] transition-transform duration-300 ease-in-out hover:scale-105 lg:min-w-[250px] lg:max-w-[300px]">
                <div className="aspect-square h-40 w-full overflow-hidden rounded-t-xl bg-gray-200">
                  <Image
                    src={tour.imageUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    width={300}
                    height={300}
                  />
                </div>
                <CardContent className="sm:p-2 lg:p-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-600 sm:text-xs lg:text-sm">
                      Tour Quy Nhơn
                    </p>
                    <p
                      className="line-clamp-2 text-base font-semibold lg:text-lg"
                      title={tour.title}
                    >
                      {tour.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-black sm:text-sm lg:text-base">
                        {tour.price}
                      </p>
                      <p className="hidden text-gray-500 line-through sm:block sm:text-sm lg:text-base">
                        {tour.originalPrice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation
          className="absolute -bottom-12 left-auto top-auto w-full justify-end gap-2"
          classNameButton="bg-zinc-800 *:stroke-zinc-50"
          alwaysShow
        />
      </CarouselPrimitives>
    </section>
  );
}
