"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ChoosingSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <section className="relative mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <Image
        className="absolute -right-20 top-0 max-md:hidden"
        width={153}
        height={166}
        alt=""
        src="/images/plus.png"
      />
      <div className="flex flex-wrap items-center justify-between">
        <div className="relative h-[420px] w-full md:h-[540px] lg:h-[600px] lg:w-1/3">
          <div className="absolute -top-2 h-full w-full overflow-hidden rounded-[50px] bg-gray-300 lg:-top-8 lg:left-8"></div>
          <div className="relative h-full w-full overflow-hidden rounded-[40px]">
            {isMounted && (
              <video
                className="h-full w-full object-fill object-center"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              >
                <source src="/videos/choosing.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:mt-0 lg:w-1/2">
          <h1 className="text-4xl font-bold text-core">
            Tại sao nên chọn chúng tôi?
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-24 rounded-lg bg-white p-4 drop-shadow">
              <Image
                className="h-full w-full object-cover object-center"
                src="/images/Guarantee.svg"
                width={50}
                height={50}
                priority
                alt=""
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Đáng tin cậy</h3>
              <p>
                Chúng tôi cam kết cung cấp dịch vụ bảo vệ chất lượng cao và đáng
                tin cậy nhất cho khách hàng.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 rounded-lg bg-white p-4 drop-shadow">
              <Image
                className="h-full w-full object-cover object-center"
                src="/images/task-completed.svg"
                width={50}
                height={50}
                priority
                alt=""
              />
            </div>

            <div>
              <h3 className="text-lg font-bold">Vô vàn lựa chọn</h3>
              <p>
                Tìm kiếm niềm vui với nhiều địa điểm tham quan, nhiều trải
                nghiệm thú vị
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 rounded-lg bg-white p-4 drop-shadow">
              <Image
                className="h-full w-full object-cover object-center"
                src="/images/price-tag.svg"
                width={50}
                height={50}
                priority
                alt=""
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chơi vui, giá tốt</h3>
              <p>Trải nghiệm chất lượng với giá tốt</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
