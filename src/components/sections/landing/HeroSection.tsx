import Image from "next/image";
import { Dancing_Script } from "next/font/google";
import { Button } from "@/components/ui/button";
import { links } from "@/configs/routes";
import Link from "next/link";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { TextEffect } from "@/components/motion-primitives/text-effect";

const dancing = Dancing_Script({
  subsets: ["vietnamese"],
  weight: ["400"],
});

const heroImages = [
  {
    src: "/images/ky-co.jpg",
    alt: "hero",
  },
  {
    src: "/images/quynhon1.jpg",
    alt: "hero",
    className: "lg:h-[90%]",
    node: <div className="lg:h-[10%]"></div>,
  },
  {
    src: "/images/quynhon2.jpg",
    alt: "hero",
    className: "lg:h-[80%]",
    node: <div className="lg:h-[20%]"></div>,
  },
];

export default function HeroSection() {
  return (
    <section className="mx-auto mb-16 mt-24 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <div className="flex flex-wrap justify-between">
        <div className="mb-6 flex w-full flex-col justify-center max-lg:items-center sm:mb-12 lg:mb-0 lg:w-1/2 lg:pb-24 lg:pt-48">
          <h1
            className={`${dancing.className} mb-4 select-none text-center text-5xl font-bold text-black md:mb-8 md:text-7xl lg:text-left`}
          >
            Trọn niềm vui với những chuyến đi đáng nhớ
          </h1>
          <TextEffect
            per="char"
            preset="fade"
            className="mb-6 w-full select-none text-center text-sm leading-relaxed text-gray-500 md:max-w-md lg:text-left"
          >
            Bình Định – vùng đất võ huyền thoại với bãi biển trong xanh, Eo Gió
            hùng vĩ và tháp Chăm cổ kính. Cùng khám phá vẻ đẹp hoang sơ và tận
            hưởng những trải nghiệm tuyệt vời nơi đây!
          </TextEffect>
          <Button
            variant="core"
            className="rounded-x w-fit rounded-2xl py-6 text-base transition duration-300 ease-in-out hover:scale-105 sm:text-lg md:text-xl lg:py-8"
          >
            <Link href={links.tour.href}> Khám phá ngay</Link>
          </Button>
        </div>
        <div className="mb-12 w-full justify-center md:mb-16 lg:w-1/2">
          <div className="relative flex h-full w-full justify-between gap-4">
            {heroImages.map((image, index) => (
              <div key={index} className={`relative w-full rounded-2xl`}>
                {image.node}
                <Image
                  src={image.src}
                  className={`${image.className} size-full rounded-2xl object-cover outline outline-2 outline-core transition-transform hover:scale-105`}
                  priority
                  alt={image.alt}
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
