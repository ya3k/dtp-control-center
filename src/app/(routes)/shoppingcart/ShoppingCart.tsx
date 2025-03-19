"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, Check, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { links } from "@/configs/routes";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/providers/CartProvider";
import { getTicketKind, isDateInPast } from "@/lib/utils";

export default function ShoppingCart() {
  const router = useRouter();
  const {
    cart,
    selectedItems,
    selectAll,
    paymentItem,
    removeFromCart,
    updateQuantity,
    selectItem,
    removeSelectedItems,
    selectForPayment,
    removePaymentItem,
    getTotalPricePaymentItem,
    toggleSelectAll,
  } = useCartStore((state) => state);

  console.log("cart", cart);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleCheckout = () => {
    if (paymentItem) {
      router.push(`${links.checkout.href}/${paymentItem.tourScheduleId}`);
    }
  };

  return (
    <div className="container mx-auto mb-16 mt-24 max-w-2xl space-y-6 px-4 sm:pb-6 lg:max-w-7xl lg:px-8">
      {cart.length === 0 ? (
        <div className="flex">
          <div className="mx-auto">
            <Image
              width={200}
              height={200}
              alt=""
              src={"/images/empty-cart.svg"}
            />
            <h3 className="mt-6 text-center text-xl font-medium text-gray-500">
              Giỏ hàng đang trống
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart items */}
          <div className="w-full space-y-4 lg:w-3/4">
            <Card>
              <CardContent className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={(checked) =>
                        toggleSelectAll(checked as boolean)
                      }
                      className="data-[state=checked]:border-core data-[state=checked]:bg-core"
                    />
                    <Label htmlFor="select-all" className="text-sm font-medium">
                      Tất cả
                    </Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeSelectedItems}
                    disabled={selectedItems.length === 0}
                    className="text-sm"
                  >
                    Xóa dịch vụ đã chọn
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="mb-6">
              <div className="space-y-4 p-0">
                {cart.map((item) => {
                  const isExpired = isDateInPast(item.day);
                  return (
                    <Card key={item.tourScheduleId}>
                      <CardContent className="flex gap-4 p-8">
                        <div className="flex items-start">
                          <Checkbox
                            id={`item-${item.tourScheduleId}`}
                            checked={selectedItems.includes(
                              item.tourScheduleId,
                            )}
                            onCheckedChange={(checked) =>
                              selectItem(
                                item.tourScheduleId,
                                checked as boolean,
                              )
                            }
                            className="data-[state=checked]:border-core data-[state=checked]:bg-core"
                          />
                        </div>
                        <div className="flex w-full">
                          <div className="flex basis-[70%] gap-6">
                            <div className="flex-shrink-0">
                              <Image
                                src={
                                  item.tour.tourDestinations[0].imageUrls[0] ||
                                  "/images/eo-gio.jpg"
                                }
                                alt={""}
                                width={100}
                                height={100}
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-base font-medium">
                                {item.tour.tour.title}
                              </h3>
                              <p className="line-clamp-2 text-sm text-gray-600">
                                {item.tour.tour.description}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.day}
                              </p>
                            </div>
                          </div>

                          <div className="flex basis-[30%] flex-col items-end gap-4">
                            {item.tickets.map((ticket) => (
                              <div
                                key={ticket.ticketTypeId}
                                className="flex items-center gap-2"
                              >
                                <span className="text-nowrap text-sm">
                                  {getTicketKind(ticket.ticketKind)} -{" "}
                                  {ticket.netCost}₫
                                </span>
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-md"
                                    onClick={() =>
                                      updateQuantity(
                                        item.tourScheduleId,
                                        ticket.ticketTypeId,
                                        "decrease",
                                      )
                                    }
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">
                                    {ticket.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-md"
                                    onClick={() =>
                                      updateQuantity(
                                        item.tourScheduleId,
                                        ticket.ticketTypeId,
                                        "increase",
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <div className="flex items-center">
                              {isExpired ? (
                                <div className="flex items-center text-sm text-red-500">
                                  <AlertTriangle className="mr-1 h-4 w-4" />
                                  Đã hết hạn
                                </div>
                              ) : (
                                <Button
                                  variant={
                                    paymentItem?.tourScheduleId ===
                                    item.tourScheduleId
                                      ? "core"
                                      : "outline"
                                  }
                                  size="sm"
                                  className={`rounded-full ${paymentItem?.tourScheduleId === item.tourScheduleId ? "" : "text-gray-500"}`}
                                  onClick={() => {
                                    if (paymentItem?.tourScheduleId === item.tourScheduleId) {
                                      // If this item is already selected, remove it
                                      removePaymentItem();
                                    } else {
                                      // Otherwise, select this item
                                      selectForPayment(item.tourScheduleId);
                                    }
                                  }}
                                >
                                  {paymentItem?.tourScheduleId ===
                                  item.tourScheduleId ? (
                                    <span className="flex items-center gap-1">
                                      <Check className="h-4 w-4" /> Đã chọn
                                    </span>
                                  ) : (
                                    "Chọn thanh toán"
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-4 flex items-center justify-between border-t p-4 pt-0">
                        <div className="flex gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-500"
                            disabled={isExpired}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-500"
                            onClick={() => removeFromCart(item.tourScheduleId)}
                          >
                            Xóa
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            ₫ {formatPrice(item.totalPrice)}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment summary - sticky */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-24">
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="font-medium">Tổng tiền</h3>
                  {!paymentItem && (
                    <p className="text-sm text-orange-500">
                      Vui lòng chọn một tour để thanh toán
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">
                    ₫{" "}
                    {paymentItem
                      ? formatPrice(getTotalPricePaymentItem())
                      : "0.00"}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    variant="core"
                    className="w-full py-6 text-lg font-medium"
                    disabled={!paymentItem}
                    onClick={handleCheckout}
                  >
                    Thanh toán
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
