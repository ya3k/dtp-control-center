"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, WalletCards } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TourFilterProps {
  selectedFilter: string;
  onSelectFilter?: (filterId: string) => void;
  tourCount: number;
}

const MIN = 0;
const MAX = 100000000;

export default function TourFilter({
  selectedFilter,
  tourCount,
}: TourFilterProps) {
  const [values, setValues] = useState([MIN, MAX]);

  const handleFilter = (min: number, max: number) => {
    alert(`Min: ${min}, Max: ${max}`); // Replace with your filter logic
  };
  return (
    <div className="mb-4 animate-fade-in rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-semibold">
          Tìm thấy <span className="text-tour-primary">{tourCount}</span> kết
          quả
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-sm">
                Có thể đặt
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
              <div className="mt-2 flex justify-between">
                <Button variant="outline">
                  Reset
                </Button>
                <Button className="bg-core">
                  Choose
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-sm">
                Mức giá
                <WalletCards className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                  <h3>
                    Giá{" "}
                    <span className="font-semibold text-core">
                      {formatPrice(values[0])}
                    </span>{" "}
                    -{" "}
                    <span className="font-semibold text-core">
                      {formatPrice(values[1])}
                    </span>
                  </h3>
                </div>
                <Slider
                  value={values}
                  onValueChange={setValues}
                  min={MIN}
                  max={MAX}
                  step={10000}
                  
                />

                <div className="space-x-4">
                  <Button variant="core" onClick={() => handleFilter(values[0], values[1])}>
                    Lọc
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setValues([MIN, MAX])}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
                {/* <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setValues([MIN, MAX]);
                      setQueryParams(createQueryParams());
                      window.location.reload();
                    }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Xóa bộ lọc
                  </Button>
                </div> */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">Sắp xếp theo:</div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Đề xuất" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low-to-high">Giá từ thấp đến cao</SelectItem>
            <SelectItem value="high-to-low">Giá từ cao đến thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
