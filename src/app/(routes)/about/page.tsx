import { Cloud, FlagTriangleLeft, SlidersHorizontal } from "lucide-react";
import Image from "next/image";

import SubscribeSection from "@/components/sections/landing/SubscribeSection";
import Banner from "@/components/common/Banner";
import TrackingToken from "@/components/common/TrackingToken";

export default function About() {
  return (
    <main className="pb-6 sm:pb-8 lg:pb-12">
      <Banner title2="Về chúng tôi" />

      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-6 sm:px-6 md:max-w-4xl lg:max-w-6xl">
        <div className="container mx-auto px-5 py-10 md:flex">
          <div className="px-8 py-6 md:w-1/2">
            <h2 className="text-2xl font-bold">
              Chúng tôi <span className="text-core">là ai ?</span>
            </h2>
            <p className="mt-4 text-black">
              Chúng tôi là một nền tảng web du lịch kết nối các công ty tour du
              lịch với người dùng, giúp quảng bá và cung cấp thông tin về các
              tour hấp dẫn.
            </p>
            <h2 className="mt-6 text-2xl font-bold">
              <span className="text-core">Sứ mệnh</span> của chúng tôi
            </h2>
            <p className="mt-4 text-black">
              Mang đến trải nghiệm đặt tour dễ dàng và thuận tiện, tạo điều kiện
              cho người dùng khám phá những hành trình thú vị và đa dạng khắp
              nơi trên thế giới. Hãy cùng chúng tôi khám phá những chuyến đi
              tuyệt vời!
            </p>
          </div>
          <div className="px-4 py-6 md:w-1/2">
            <Image
              src="/images/quynhon.jpg"
              alt="Hero Image"
              width={800}
              height={800}
              className="h-full w-full rounded shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mb-16 max-w-2xl px-5 sm:pb-6 lg:max-w-6xl">
        <div className="container mx-auto flex w-full flex-col items-center justify-end gap-8 px-8 py-10 md:flex-row lg:gap-4">
          <h1 className="text-3xl font-bold lg:w-1/3">
            Chúng tôi cung cấp dịch vụ tốt nhất
          </h1>
          <div className="flex flex-wrap justify-center gap-4 lg:w-2/3">
            <div className="h-44 w-full space-y-1 rounded-2xl border-b border-r border-core bg-white p-4 md:w-64">
              <div className="w-fit rounded-full bg-core p-3">
                <Cloud className="text-white" />
              </div>
              <h3 className="text-lg font-semibold">Tính toán thời tiết</h3>
              <p className="hidden md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="h-44 w-full space-y-1 rounded-2xl border-b border-r border-core bg-white p-4 md:w-64">
              <div className="w-fit rounded-full bg-core p-3">
                <FlagTriangleLeft className="text-white" />
              </div>
              <h3 className="text-lg font-semibold">Hướng dẫn viên tốt nhất</h3>
              <p className="hidden md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="h-44 w-full space-y-1 rounded-2xl border-b border-r border-core bg-white p-4 md:w-64">
              <div className="w-fit rounded-full bg-core p-3">
                <SlidersHorizontal className="text-white" />
              </div>
              <h3 className="text-lg font-semibold">Cá nhân hóa</h3>
              <p className="hidden md:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <TrackingToken />
          </div>
        </div>
      </div>

      <SubscribeSection />
    </main>
  );
}
