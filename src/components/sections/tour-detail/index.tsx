/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ServiceSection from "@/components/sections/tour-detail/ServiceSection";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import GallerySection from "@/components/sections/tour-detail/GallerySection";
import {TourDetail as Tour} from "@/types/tours";

export default function TourDetail({ data }: { data: Tour }) {

  const handleServiceRef = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <>
      <div className="mx-auto mb-16 mt-24 h-[2000px] max-w-2xl space-y-6 px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tour">Tour Quy Nhơn</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tour">
                {data.tour.companyName || "companyName"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.tour.title || "title"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {data.tour.title}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-amber-500">★</span>
            <span className="ml-1 font-semibold">
              {data.tour.avgStar || "5"}
            </span>
          </div>
          <span className="text-muted-foreground">(1K+ Đánh giá)</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">10K+ Đã đặt</span>
        </div>
        <GallerySection data={data}/>
        <div className="container">
          <div className="flex gap-6">
            {/* Tour Description */}
            <div className="basis-[70%] space-y-16">
              <Card className="">
                <CardContent className="relative h-48 space-y-4 overflow-hidden p-6">
                  <p>{data.tour.description || "description"}</p>
                  <div className="absolute bottom-0 left-0 right-0 flex h-[52px] items-center justify-between bg-gradient-to-t from-white to-transparent p-6 backdrop-blur-[6px] hover:underline">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold">
                            Xem thêm
                          </span>
                          <ChevronRight />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[750px] p-10">
                        <DialogHeader>
                          <h1 className="text-xl font-bold">Điểm nổi bật</h1>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] w-full rounded-md p-4">
                          <ul className="list-disc space-y-2 pl-4 text-base text-muted-foreground">
                            {data.tour.description
                              .split(".")
                              .map((sentence) => sentence.trim())
                              .filter((sentence) => sentence)
                              .map((sentence, index) => (
                                <li
                                  className="text-base text-black"
                                  key={index}
                                >
                                  {sentence}
                                </li>
                              ))}
                          </ul>
                          <ScrollBar />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                    <Image
                      src={"/images/best-price.png"}
                      alt="best-price"
                      width={30}
                      height={30}
                    />
                  </div>
                </CardContent>
              </Card>

              <ServiceSection data={data}/>
            </div>

            {/* Tour price */}
            <div className="lg:basis-[30%]">
              <Card className="h-[calc(100vh - 1rem)] sticky top-20 h-fit">
                <CardContent className="space-y-4 px-6 py-6">
                  <h1 className="text-2xl font-semibold">{data.tour.onlyFromCost}₫</h1>
                  <Button
                    onClick={(e) => handleServiceRef(e, "tour-detail-service")}
                    variant="core"
                    className="w-full text-lg"
                    size="lg"
                  >
                    Chọn các gói dịch vụ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden" id="mobile-tourdetail"></div>
    </>
  );
}
