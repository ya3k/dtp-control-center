import { Clock, MapPinned, Smile, Star, UsersRound } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import RotatingText from "@/components/animation/RotatingText";

export default function ActivitySection() {
  return (
    <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <h1 className="flex gap-2 text-4xl font-bold lg:gap-4 lg:text-6xl">
        <span className="pt-2">Các hoạt động</span>
        <RotatingText
          texts={["đặc sắc", "độc đáo", "hấp dẫn"]}
          mainClassName="text-core"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-130%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pt-2 pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-24">
        <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105">
          <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-200 lg:h-80">
            <Image
              src="/images/eo-gio.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              width={300}
              height={300}
            />
          </div>
          <div className="relative -top-4 left-4 flex w-fit items-center gap-2 rounded-full bg-white p-2 drop-shadow">
            <Star size={14} className="text-yellow-500" />
            <span className="text-sm">4.0(34)</span>
            <Smile size={14} className="text-yellow-500" />
          </div>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold md:text-sm">
                Tour Kỳ Co bằng đường bộ 1 ngày
              </p>
              <p className="text-sm md:text-xs text-gray-400 line-through">780.000đ</p>
              <div className="flex items-center justify-between">
                <p className="text-base md:text-sm text-core">Đặt từ hôm nay</p>
                <p className="text-xl md:text-lg font-bold text-red-500">700.000đ</p>
              </div>
              <div className="flex justify-between">
                <p className="flex items-center gap-2 text-sm">
                  <Clock size={16} /> 1 ngày
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <UsersRound size={16} />
                  5+
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPinned size={16} />
                  Quy Nhơn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105">
          <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-200 lg:h-80">
            <Image
              src="/images/thap-doi.jpg"
              alt=""
              className="h-full w-full object-cover object-center"
              width={300}
              height={300}
            />
          </div>
          <div className="relative -top-4 left-4 flex w-fit items-center gap-2 rounded-full bg-white p-2 drop-shadow">
            <Star size={14} className="text-yellow-500" />
            <span className="text-sm">4.0(34)</span>
            <Smile size={14} className="text-yellow-500" />
          </div>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-lg md:text-sm font-semibold">Tour Tháp Đôi</p>
              <p className="text-sm md:text-xs text-gray-400 line-through">780.000đ</p>
              <div className="flex items-center justify-between">
                <p className="text-base md:text-sm text-core">Đặt từ hôm nay</p>
                <p className="text-xl md:text-lg font-bold text-red-500">700.000đ</p>
              </div>
              <div className="flex justify-between">
                <p className="flex items-center gap-2 text-sm">
                  <Clock size={16} /> 1 ngày
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <UsersRound size={16} />
                  5+
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPinned size={16} />
                  Quy Nhơn
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
          <Card className="group relative transition-transform duration-300 ease-in-out hover:scale-105">
            <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-200 lg:h-80">
              <Image
                src="/images/doi-cat-phuong-mai.jpg"
                alt=""
                className="h-full w-full object-cover object-center"
                width={300}
                height={300}
              />
            </div>
            <div className="relative -top-4 left-4 flex w-fit items-center gap-2 rounded-full bg-white p-2 drop-shadow">
              <Star size={14} className="text-yellow-500" />
              <span className="text-sm">4.0(34)</span>
              <Smile size={14} className="text-yellow-500" />
            </div>
            <CardContent>
            <div className="flex flex-col gap-2">
              <p className="text-lg md:text-sm font-semibold">Tour trượt cát Phương Mai</p>
              <p className="text-sm md:text-xs text-gray-400 line-through">780.000đ</p>
              <div className="flex items-center justify-between">
                <p className="text-base md:text-sm text-core">Đặt từ hôm nay</p>
                <p className="text-xl md:text-lg font-bold text-red-500">700.000đ</p>
              </div>
              <div className="flex justify-between">
                <p className="flex items-center gap-2 text-sm">
                  <Clock size={16} /> 1 ngày
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <UsersRound size={16} />
                  5+
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <MapPinned size={16} />
                  Quy Nhơn
                </p>
              </div>
            </div>
            </CardContent>
          </Card>
        
      </div>
    </section>
  );
}
