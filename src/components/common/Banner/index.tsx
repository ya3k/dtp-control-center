import Image from "next/image";
import React from "react";
import { Dancing_Script } from "next/font/google";

const dancing = Dancing_Script({
  subsets: ["vietnamese"],
  weight: ["400"],
});

export default function Banner({
  title1,
  title2,
}: {
  title1?: string;
  title2: string;
}) {
  return (
    <div className="relative mb-8 w-full overflow-hidden h-[calc(40vh)] md:h-[calc(60vh)] lg:h-[calc(80vh)]">

      <div className="absolute inset-0 animate-zoom-in-out">
        <Image
          src="/images/quynhonbanner.jpg"
          alt="Hero Image"
          fill
          priority
          className="size-full object-cover"
        />
      </div>

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center ${title1 ? "gap-4" : ""} bg-black bg-opacity-20`}
      >
        {title1 && (
          <h1 className={`text-base md:text-lg font-medium text-white`}>{title1}</h1>
        )}
        <h1 className={`text-3xl md:text-6xl font-bold text-white ${dancing.className}`}>
          {title2}
        </h1>
      </div>
    </div>
  );
}
