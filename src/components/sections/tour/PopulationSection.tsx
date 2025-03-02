"use client";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const tours = [
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
    <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <h1 className="text-3xl font-bold">Vui chơi hết cỡ tại Quy Nhơn</h1>
      <Carousel className="w-full" opts={{ loop: true }}>
        <CarouselContent className="-ml-1">
          {tours.map((tour, index) => (
            <CarouselItem key={index} className="basis-1/2 pl-1 lg:basis-1/3">
              <div className="p-1 sm:p-2 md:p-4">
                <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105">
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
}
