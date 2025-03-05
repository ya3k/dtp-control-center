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
    <div className="relative mb-8 h-[calc(100vh-420px)] w-full overflow-hidden sm:h-[calc(100vh-360px)] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-240px)]">

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
          <h1 className={`text-lg font-medium text-white`}>{title1}</h1>
        )}
        <h1 className={`text-6xl font-bold text-white ${dancing.className}`}>
          {title2}
        </h1>
      </div>
    </div>
  );
}
