"use client";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { InView } from "@/components/ui/in-view";
import Image from "next/image";
import { useEffect, useState } from "react";

const chooses = [
  {
    src: "/images/guarantee.png",
    alt: "guarantee",
    title: "Đáng tin cậy",
    content: `Chúng tôi cam kết cung cấp dịch vụ bảo vệ chất lượng cao và đáng
              tin cậy nhất cho khách hàng.`,
  },
  {
    src: "/images/task-complete.png",
    alt: "options",
    title: "Vô vàn lựa chọn",
    content: `Tìm kiếm niềm vui với nhiều địa điểm tham quan, nhiều trải
              nghiệm thú vị`,
  },
  {
    src: "/images/best-price.png",
    alt: "best-price",
    title: "Chơi vui, giá tốt",
    content: `Trải nghiệm chất lượng với giá tốt`,
  },
];

export default function ChoosingSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      viewOptions={{ margin: "0px 0px -200px 0px", once: true }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
        <div className="flex items-center justify-between max-lg:flex-wrap-reverse">
          <div className="relative h-[420px] w-full md:h-[540px] lg:h-[600px] lg:w-1/3">
            {isMounted && (
              <div className="absolute -top-2 h-full w-full overflow-hidden rounded-[50px] bg-gray-300 lg:-top-8 lg:left-8"></div>
            )}
            <div className="relative h-full w-full overflow-hidden rounded-[40px]">
              {isMounted && (
                <>
                  <BorderTrail
                    className="bg-linear-to-l from-teal-400 via-teal-500 to-teal-700"
                    size={400}
                  />
                  <video
                    className="h-full w-full object-fill object-center"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/videos/choosing.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </>
              )}
            </div>
          </div>

          <div className="mb-16 flex flex-col gap-8 lg:mt-0 lg:w-1/2">
            <h1 className="text-xl font-bold text-core md:text-4xl">
              Tại sao nên chọn chúng tôi?
            </h1>
            <div className="flex">
              {chooses.map((choose, index) => (
                <div
                  key={index}
                  className="flex basis-1/3 flex-col items-center p-2"
                >
                  <div className="space-y-2">
                    <Image
                      className="h-10 w-10 object-cover object-center"
                      src={choose.src}
                      width={50}
                      height={50}
                      priority
                      alt={choose.alt}
                    />
                    <h3 className="text-xs font-bold sm:text-sm md:text-lg">
                      {choose.title}
                    </h3>
                    <p className="text-xs md:text-sm">{choose.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </InView>
  );
}
