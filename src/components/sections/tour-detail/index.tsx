"use client";
import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

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
import { TourData } from "@/types/tours";
import ServiceSection from "@/components/sections/tour-detail/ServiceSection";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";

const images = [
  "https://picsum.photos/id/1036/600/400",
  "https://picsum.photos/id/1043/600/400",
  "https://picsum.photos/id/1059/600/400",
];

export default function TourDetail({ data }: { data: TourData }) {
  const [showGallery, setShowGallery] = React.useState(false);

  return (
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
            <BreadcrumbPage>Tour Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Tour Tham Quan Địa Đạo Củ Chi Và Đồng Bằng Sông Cửu Long Bằng Xe
        Limousine
      </h1>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <span className="text-amber-500">★</span>
          <span className="ml-1 font-semibold">4.7</span>
        </div>
        <span className="text-muted-foreground">(1K+ Đánh giá)</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">10K+ Đã đặt</span>
      </div>
      <div className="relative grid h-[450px] auto-rows-auto grid-cols-4 gap-1 md:grid-cols-12">
        {/* Large image - spans 8 columns on medium screens and up */}
        <Button
          variant="outline"
          size="lg"
          className="absolute bottom-4 right-4 z-10 border border-black"
          onClick={() => setShowGallery(true)}
        >
          Thư viện ảnh
        </Button>
        <Card className="col-span-4 row-span-2 overflow-hidden md:col-span-8">
          <CardContent className="h-full p-0">
            <div className="relative size-full">
              <Image
                src={images[0]}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover object-center"
                width={500}
                height={500}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* First small image - spans 4 columns on medium screens and up */}
        <Card className="col-span-4 overflow-hidden md:col-span-4">
          <CardContent className="h-full p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={images[2]}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover object-center"
                width={400}
                height={400}
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Second small image - spans 4 columns on medium screens and up */}
        <Card className="col-span-4 overflow-hidden md:col-span-4">
          <CardContent className="relative h-full p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={images[1]}
                alt="Luxury van interior with plush white leather seats"
                className="size-full object-cover"
                width={400}
                height={400}
                priority
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="container">
        <div className="flex gap-6">
          {/* Tour Description */}
          <div className="basis-[70%] space-y-16">
            <Card className="">
              <CardContent className="relative h-48 space-y-4 overflow-hidden p-6">
                <p>
                  Vượt cầu Thị Nại - cầu vượt biển với chiều dài gần 2,5km, nghe
                  kể về những trận thủy chiến bi tráng giữa Champa và Đại Việt,
                  giữa Tây Sơn và nhà Nguyễn (Nguyễn Ánh) trong suốt 5 thế kỷ
                  Tận hưởng làn nước trong xanh mát lạnh tại Bãi tắm Kỳ Co hay
                  lặn ngắm thế giới san hô đầy sắc màu tại Bãi San Hô (Bãi Dứa)
                  Viếng Tịnh xá Ngọc Hoà - chiêm ngưỡng pho tượng Phật đôi Quan
                  thế Âm cao nhất Việt Nam với chiều cao 30m Tham quan Làng Chài
                  Nhơn Hải - tìm hiểu về cuộc sống thường ngày của người dân
                  làng chài, thưởng thức các món ăn hải sản tươi rói, được người
                  dân đánh bắt ngay trong ngày! Khám phá Đảo Hòn Khô - đi bộ
                  500m trên con đường xuyên biển tuyệt đẹp hay check-in cây cầu
                  quanh núi Chiêm ngưỡng bao quát vùng biển bao la rộng lớn tại
                  Eo Gió - một trong những nơi ngắm hoàng hôn đẹp nhất ở Việt
                  Nam
                </p>
                <div className="absolute bottom-0 left-0 right-0 flex h-[52px] items-center bg-gradient-to-t from-white to-transparent p-6 backdrop-blur-[6px] hover:underline">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="font-semibolds text-lg">Xem thêm</span>
                    </DialogTrigger>
                    <DialogContent className="max-w-[750px] p-10">
                      <DialogHeader>
                        <h1 className="text-xl font-bold">Điểm nổi bật</h1>
                      </DialogHeader>

                      <p className="text-base text-black">
                        Vượt cầu Thị Nại - cầu vượt biển với chiều dài gần
                        2,5km, nghe kể về những trận thủy chiến bi tráng giữa
                        Champa và Đại Việt, giữa Tây Sơn và nhà Nguyễn (Nguyễn
                        Ánh) trong suốt 5 thế kỷ Tận hưởng làn nước trong xanh
                        mát lạnh tại Bãi tắm Kỳ Co hay lặn ngắm thế giới san hô
                        đầy sắc màu tại Bãi San Hô (Bãi Dứa) Viếng Tịnh xá Ngọc
                        Hoà - chiêm ngưỡng pho tượng Phật đôi Quan thế Âm cao
                        nhất Việt Nam với chiều cao 30m Tham quan Làng Chài Nhơn
                        Hải - tìm hiểu về cuộc sống thường ngày của người dân
                        làng chài, thưởng thức các món ăn hải sản tươi rói, được
                        người dân đánh bắt ngay trong ngày! Khám phá Đảo Hòn Khô
                        - đi bộ 500m trên con đường xuyên biển tuyệt đẹp hay
                        check-in cây cầu quanh núi Chiêm ngưỡng bao quát vùng
                        biển bao la rộng lớn tại Eo Gió - một trong những nơi
                        ngắm hoàng hôn đẹp nhất ở Việt Nam
                      </p>
                    </DialogContent>
                  </Dialog>
                  <ChevronRight />
                </div>
              </CardContent>
            </Card>

            <ServiceSection />
          </div>

          {/* Tour price */}
          <div className="lg:basis-[30%]">
            <Card className="h-[calc(100vh - 1rem)] sticky top-20 h-fit">
              <CardContent className="space-y-4 px-6 py-6">
                <h1 className="text-2xl font-semibold">1,040,000 VND</h1>
                <Button variant="core" className="w-full text-lg" size="lg">
                  Chọn các gói dịch vụ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
