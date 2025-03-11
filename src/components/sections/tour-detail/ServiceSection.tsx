"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServiceSection() {
  const [showPackage, setShowPackage] = React.useState(false);
  return (
    <div className="space-y-8">
      <h2 className="relative pl-3 text-3xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-1 before:-translate-y-1/2 before:bg-core before:content-['']">
        Các gói dịch vụ
      </h2>
      <Card className="bg-[#f5f5f5]">
        <CardContent className="space-y-6 px-10 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Vui lòng chọn ngày và gói dịch vụ
            </h3>
            <h3 className="underline">Xóa tất cả</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Xin chọn ngày đi tour</p>
            <Button className="rounded-lg" variant="core">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Xem trạng thái dịch vụ</span>
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Loại gói dịch vụ</p>
            <Button
              variant="ghost"
              className={cn(
                "rounded-lg border border-black py-6",
                `${showPackage ? "border-teal-500 bg-teal-50 text-teal-500 hover:bg-teal-50 hover:text-teal-500" : "hover:bg-teal-50"}`,
              )}
              onClick={() => setShowPackage(!showPackage)}
            >
              Tour ghép
            </Button>
          </div>
          <div className={cn("space-y-4", showPackage ? "block" : "hidden")}>
            <p className="text-sm">Số lượng</p>
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <h4 className="font-semibold">Người lớn</h4>
                  <span className="text-xs text-teal-700">Mua ít nhất</span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">1,040,000đ</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                    >
                      <Minus />
                    </Button>
                    <span>1</span>
                    <Button
                      variant="ghost"
                      className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <h4 className="font-semibold">Trẻ em (5-9)</h4>
                <div className="flex items-center gap-4">
                  <p className="font-medium">1,040,000đ</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                    >
                      <Minus />
                    </Button>
                    <span>1</span>
                    <Button
                      variant="ghost"
                      className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">1,040,000đ</h3>
              <div className="space-x-4">
                <Button className="rounded-xl bg-[#f8c246] p-6 text-base hover:bg-[#fbcc5e]">
                  Thêm vào giỏ hàng
                </Button>
                <Button className="rounded-xl bg-[#fc7a09] p-6 text-base hover:bg-[#ff9537]">
                  Đặt ngay
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
