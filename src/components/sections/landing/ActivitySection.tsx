import { Clock, MapPinned, Smile, Star, UsersRound } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import RotatingText from "@/components/animation/RotatingText";
import { InView } from "@/components/ui/in-view";

const activities = [
  {
    title: "Tour Kỳ Co bằng đường bộ 1 ngày",
    imageUrl: "/images/eo-gio.jpg",
    rating: 4.0,
    reviews: 34,
    price: 700000,
    originalPrice: 780000,
    duration: "1 ngày",
    participants: "5+",
    location: "Quy Nhơn",
  },
  {
    title: "Tour Tháp Đôi",
    imageUrl: "/images/thap-doi.jpg",
    rating: 4.0,
    reviews: 34,
    price: 700000,
    originalPrice: 780000,
    duration: "1 ngày",
    participants: "5+",
    location: "Quy Nhơn",
  },
  {
    title: "Tour trượt cát Phương Mai",
    imageUrl: "/images/doi-cat-phuong-mai.jpg",
    rating: 4.0,
    reviews: 34,
    price: 700000,
    originalPrice: 780000,
    duration: "1 ngày",
    participants: "5+",
    location: "Quy Nhơn",
  },
];

export default function ActivitySection() {
  return (
    <>
      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        viewOptions={{ margin: "0px 0px -200px 0px", once: true }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
          <h1 className="flex gap-2 text-2xl font-bold md:text-4xl lg:gap-4 lg:text-6xl">
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

          <InView
            viewOptions={{ once: true, margin: "0px 0px -250px 0px" }}
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.09,
                },
              },
            }}
          >
            <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-24">
              {activities.map((activity, index) => (
                <>
                  <Card
                    key={index}
                    className="group relative transition-transform duration-300 ease-in-out hover:scale-105"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-200 lg:h-80">
                      <Image
                        src={activity.imageUrl}
                        alt=""
                        className="h-full w-full object-cover object-center"
                        width={300}
                        height={300}
                      />
                    </div>
                    <div className="relative -top-4 left-4 flex w-fit items-center gap-2 rounded-full bg-white p-2 drop-shadow">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-sm">
                        {activity.rating}({activity.reviews})
                      </span>
                      <Smile size={14} className="text-yellow-500" />
                    </div>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-semibold md:text-sm">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-400 line-through md:text-xs">
                          {activity.originalPrice.toLocaleString("vi-VN")}đ
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-base text-core md:text-sm">
                            Đặt từ hôm nay
                          </p>
                          <p className="text-xl font-bold text-red-500 md:text-lg">
                            700.000đ
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <p className="flex items-center gap-2 text-sm">
                            <Clock size={16} /> {activity.duration}
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <UsersRound size={16} />
                            5+
                          </p>
                          <p className="flex items-center gap-2 text-sm">
                            <MapPinned size={16} />
                            {activity.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ))}
            </div>
          </InView>
        </section>
      </InView>
    </>
  );
}
