import React from "react";
// import { Tour } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { links } from "@/configs/routes";
import { Tour } from "@/types/tours";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  return (
    <Link href={`${links.tour.href}/${tour.id}`} className="group">
      <div
        className={`h-full transform animate-fade-up overflow-hidden rounded-xl border border-core bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
        id={`tour-${tour.id}`}
      >
        <div className="relative">
          <Image
            src={tour.thumbnailUrl}
            alt={tour.title}
            className="h-36 w-full object-cover"
            loading="lazy"
            width={300}
            height={300}
          />
        </div>
  
        <div className="p-3">
          <h3 title={tour.title} className="mb-2 line-clamp-2 h-10 text-sm font-semibold">
            {tour.title}
          </h3>
  
          <div className="mb-2 flex items-center text-xs">
            <div className="inline-flex items-center text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 font-medium">{tour.totalRating}</span>
              <span className="ml-1 text-gray-600">(100)</span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="text-gray-600">100+ Đã đặt</span>
            </div>
          </div>
  
          <div className="flex items-end justify-between">
            <div className="flex gap-2">
              <span className="text-xs text-gray-500">Từ</span>
              <div className="inline-flex items-center text-sm font-semibold text-core">
                $ {tour.onlyFromCost * 2}
                {tour.onlyFromCost && (
                  <span className="ml-2 text-xs text-gray-400 line-through">
                    ₫ {formatCurrency(tour.onlyFromCost)}
                  </span>
                )}
              </div>
            </div>
  
            <button className="bg-tour-primary rounded-lg px-2 py-1 text-xs font-medium text-white transition-all hover:bg-opacity-90">
              Đặt
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
