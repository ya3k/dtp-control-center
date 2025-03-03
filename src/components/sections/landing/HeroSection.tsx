import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <div className="flex flex-wrap justify-between">
        <div className="mb-6 flex w-full flex-col justify-center max-lg:items-center sm:mb-12 lg:mb-0 lg:w-1/2 lg:pb-24 lg:pt-48">
          <h1 className="mb-4 select-none text-4xl font-bold text-black text-center sm:text-5xl md:mb-8 md:text-6xl lg:text-left">
            Trọn niềm vui với những chuyến đi đáng nhớ
          </h1>
          <p className="mb-6 w-full select-none leading-relaxed text-gray-500 text-center md:max-w-md lg:text-left xl:text-sm">
            Bình Định – vùng đất võ huyền thoại với bãi biển trong xanh, Eo Gió
            hùng vĩ và tháp Chăm cổ kính. Cùng khám phá vẻ đẹp hoang sơ và tận
            hưởng những trải nghiệm tuyệt vời nơi đây!
          </p>
          <Button
            variant="default"
            className="w-fit text-base rounded-xl bg-core py-8 sm:text-lg md:text-xl"
          >
            Khám phá ngay
          </Button>
        </div>
        <div className="mb-12 w-full justify-center md:mb-16 lg:w-1/2">
          <div className="relative flex justify-between w-full gap-4 h-full">
            <div>
                <Image
                  src="/images/ky-co.jpg"
                  className="h-full w-full rounded-2xl object-cover outline outline-2 outline-core transition-transform hover:scale-105"
                  alt="hero"
                  priority
                  width={300}
                  height={300}
                />
            </div>
            <div className="">
              <div className="lg:h-[10%]"></div>
              <Image
                src="/images/quynhon1.jpg"
                className="h-full lg:h-[90%] w-full rounded-2xl object-cover outline outline-2 outline-core transition-transform hover:scale-105"
                alt="hero"
                priority
                width={300}
                height={300}
              />
            </div>
            <div className="">
              <div className="lg:h-[20%]"></div>
              <Image
                className="h-full lg:h-[80%] w-full rounded-2xl object-cover outline outline-2 outline-core transition-transform hover:scale-105"
                src="/images/quynhon2.jpg"
                alt="hero"
                priority
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
