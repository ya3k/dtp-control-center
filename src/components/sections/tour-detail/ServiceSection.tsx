/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Calendar, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatDateToDDMMYYYY, getTicketKind } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import useServiceSectionStore from "@/store/client/tour-detail-service-store";
import { TourDetail } from "@/types/tours";
import tourApiRequest from "@/apiRequests/tour";
import { toast } from "sonner";
import { useCartStore } from "@/providers/CartProvider";

export default function ServiceSection({ data }: { data: TourDetail }) {
  const [loading, setLoading] = React.useState(false);
  const {
    showPackage,
    calendarOpen,
    date,
    ticketSchedule,
    selectedDayTickets,
    ticketQuantities,
    totalPrice,
    setTicketSchedule,
    setCalendarOpen,
    handleDateSelect,
    handleConfirmDateSelection,
    handleQuantityChange,
    clearAll,
    togglePackage,
  } = useServiceSectionStore();

  const addToCart = useCartStore((state) => state.addToCart);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        clearAll();
        setTicketSchedule([]);
        setLoading(true);
        const response: any = await tourApiRequest.getScheduleTicketByTourId(
          data.tour.id,
        );

        if (!response.payload.success) {
          throw new Error("Failed to fetch ticket schedule");
        }
        setTicketSchedule(response?.payload?.data);
      } catch (error) {
        console.error("Error fetching ticket schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = () => {
    if (!date || selectedDayTickets.length === 0) {
      toast.warning("Vui lòng chọn ngày và số lượng vé");
      return;
    }

      // Check if at least one ticket has quantity > 0
  const hasSelectedTickets = Object.values(ticketQuantities).some(qty => qty > 0);
  
  if (!hasSelectedTickets) {
    toast.warning("Vui lòng chọn ít nhất một vé");
    return;
  }

    // Find the current selected day data
    const selectedDay = ticketSchedule.find(
      (day) => new Date(day.day).toDateString() === date.toDateString(),
    );

    if (!selectedDay) return;

    // Get the tourScheduleId from the first ticket (they all share the same schedule ID)
    const tourScheduleId = selectedDayTickets[0]?.tourScheduleId || "";

    const formattedDate = formatDateToDDMMYYYY(selectedDay.day);
    // Add to cart
    addToCart(
      data,
      tourScheduleId,
      formattedDate,
      selectedDayTickets,
      ticketQuantities,
    );

    toast.success("Đã thêm vào giỏ hàng");
  };

  console.log(ticketSchedule);

  const availableDates = React.useMemo(() => {
    return ticketSchedule.map((day) => new Date(day.day));
  }, [ticketSchedule]);

  const isDateAvailable = React.useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (
        date >= today &&
        availableDates.some(
          (availableDate) =>
            availableDate.toDateString() === date.toDateString(),
        )
      );
    },
    [availableDates],
  );

  return (
    <div id="tour-detail-service" className="space-y-8">
      <h2 className="relative pl-3 text-3xl font-bold before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-1 before:-translate-y-1/2 before:bg-core before:content-['']">
        Các gói dịch vụ
      </h2>
      <Card className="bg-[#f5f5f5]">
        <CardContent className="space-y-6 px-10 py-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Vui lòng chọn ngày và gói dịch vụ
            </h3>
            <h3 className="underline hover:cursor-pointer" onClick={() => {clearAll();}}>
              Xóa tất cả
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Xin chọn ngày đi tour</p>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  disabled={ticketSchedule.length === 0}
                  className="rounded-lg"
                  variant="core"
                >
                  {loading ? (
                    <svg
                      className="mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Calendar className="mr-1 h-4 w-4" />
                  )}
                  <span>Xem trạng thái dịch vụ</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <CalendarComponent
                  mode="single"
                  disabled={(date) => !isDateAvailable(date)}
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="mt-2 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDateSelect(undefined);
                    }}
                  >
                    Xóa
                  </Button>
                  <Button
                    disabled={!date}
                    variant="core"
                    onClick={handleConfirmDateSelection}
                  >
                    Chọn
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Loại gói dịch vụ</p>
            <Button
              variant="ghost"
              className={cn(
                "rounded-lg border border-black py-6",
                `${showPackage ? "border-teal-500 bg-teal-50 text-teal-500 hover:bg-teal-50 hover:text-teal-500" : "hover:bg-teal-50"}`,
              )}
              onClick={togglePackage}
              disabled={!date}
            >
              Tour ghép
            </Button>
          </div>
          <div className={cn("space-y-4", showPackage ? "block" : "hidden")}>
            <p className="text-sm">Số lượng</p>
            {selectedDayTickets.map((ticket) => (
              <Card key={ticket.ticketTypeId}>
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <h4 className="font-semibold">
                      {getTicketKind(ticket.ticketKind)}
                    </h4>
                    <span className="text-xs text-teal-700">
                      Còn {ticket.availableTicket} vé
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{ticket.netCost}₫</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                        onClick={() =>
                          handleQuantityChange(
                            ticket.ticketTypeId,
                            ticket.netCost,
                            false,
                          )
                        }
                        disabled={!ticketQuantities[ticket.ticketTypeId]}
                      >
                        <Minus />
                      </Button>
                      <span>{ticketQuantities[ticket.ticketTypeId] || 0}</span>
                      <Button
                        variant="ghost"
                        className="bg-[#f5f5f5] px-4 py-5 text-black hover:bg-slate-200"
                        onClick={() =>
                          handleQuantityChange(
                            ticket.ticketTypeId,
                            ticket.netCost,
                            true,
                          )
                        }
                        disabled={
                          ticketQuantities[ticket.ticketTypeId] >=
                          ticket.availableTicket
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{formatCurrency(totalPrice)}₫</h3>
              <div className="space-x-4">
                <Button
                  onClick={() => {
                    handleAddToCart();
                  }}
                  className="rounded-xl bg-[#f8c246] p-6 text-base hover:bg-[#fbcc5e]"
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button className="rounded-xl bg-[#fc7a09] p-6 text-base hover:bg-[#ff9537]">
                  Đặt ngay
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
