/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
// import { useCartStore } from "@/store/client/cart-store";
// import { AddContactSheet } from "./add-contact-sheet";
import { Steps } from "./Steps";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/providers/CartProvider";
import { links } from "@/configs/routes";
import { formatCurrency, getTicketKind } from "@/lib/utils";
import envConfig from "@/configs/envConfig";
import { UserProfile } from "@/types/user";
import { sessionToken } from "@/lib/http";
import userApiRequest from "@/apiRequests/user";
import { toast } from "sonner";

// type Contact = {
//   id: string;
//   lastName: string;
//   firstName: string;
//   phone: string;
//   email: string;
// };

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  // const [isContactSheetOpen, setIsContactSheetOpen] = useState(false);
  // const selectedTour = getPaymentItem();
  const { paymentItem, removePaymentItem } = useCartStore((state) => state);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response: any = await userApiRequest.me();
        if (!response.payload.success) {
          console.error("Failed to fetch user info:", response);
          toast.error(response.payload.message);
          router.push(links.login.href);
        }
        // console.log(response);
        setUser(response.payload.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getUserInfo();
  }, []);

  console.log(user);

  // const handleAddContact = (contact: Contact) => {
  //   setIsContactSheetOpen(false);
  // };

  const handlePayment = async () => {
    const orderData = {
      tourScheduleId: paymentItem?.tourScheduleId,
      name: user?.name,
      phoneNumber: user?.phoneNumber,
      email: user?.email,
      voucherCode: "",
      tickets: paymentItem?.tickets.map((ticket) => ({
        ticketTypeId: ticket.ticketTypeId,
        quantity: ticket.quantity,
      })),
    };
    const response = await fetch(
      `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken.value}`,
        },
        body: JSON.stringify(orderData),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      console.error("Error creating order:", result.message);
      return;
    }
    console.log(result);

    alert(result);
    window.location.href = links.home.href;
    removePaymentItem();
    // router.push("/payment");
  };

  return (
    <>
      <Steps currentStep={2} />
      <div className="w-full bg-[#f5f5f5]">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="mt-8 flex flex-col gap-6 lg:flex-row">
            <Card className="mb-12 w-full pb-8 lg:w-2/3">
              <CardHeader className="p-4">
                <h3 className="text-xl font-bold text-core">Điền thông tin</h3>
              </CardHeader>
              <Separator />
              <div className="space-y-6">
                <h2 className="relative mt-6 pl-4 text-lg font-medium before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-2 before:-translate-y-1/2 before:bg-core before:content-['']">
                  Thông tin đơn hàng
                </h2>
                {/* Tour Information */}
                <div className="px-8">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={"/images/eo-gio.jpg"}
                            alt={""}
                            width={90}
                            height={90}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="mb-1 text-base font-medium">
                            {paymentItem?.tour.tour.title}
                          </h3>
                          <p className="mb-1 line-clamp-2 text-sm text-gray-600">
                            {paymentItem?.tour.tour.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {paymentItem?.day}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <h2 className="relative mt-6 pl-4 text-lg font-medium before:absolute before:left-0 before:top-1/2 before:mr-2 before:h-8 before:w-2 before:-translate-y-1/2 before:bg-core before:content-['']">
                  Thông tin liên lạc
                </h2>
                <p className="px-4 text-sm text-gray-600">
                  Chúng tôi sẽ thông báo mọi thay đổi về đơn hàng cho bạn
                </p>
                <div className="px-8">
                  <div className="flex w-full justify-between rounded-lg border border-gray-300 p-4">
                    {user === null ? (
                      <svg
                        className="mr-3 h-5 w-5 mx-auto animate-spin text-black"
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
                      <>
                        <div className="flex gap-2">
                          <p className="flex w-full flex-col gap-2 text-sm">
                            <span className="">Tên</span>
                            <span className="">Số điện thoại</span>
                            <span className="text-nowrap">
                              Email (để cập nhật thông tin đơn hàng của bạn)
                            </span>
                          </p>
                          <p className="flex w-full flex-col gap-2 text-sm">
                            <span className="font-semibold">{user.name}</span>
                            <span className="font-semibold">
                              {user.phoneNumber}
                            </span>
                            <span className="font-semibold">{user.email}</span>
                          </p>
                        </div>
                        <div
                          className="flex items-end"
                          // onClick={() => setIsContactSheetOpen(true)}
                        >
                          <p className="text-sm font-medium underline hover:cursor-pointer">
                            Chỉnh sửa
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-8 mt-8 rounded-2xl border border-[#ffd471] bg-[#FCF3DE] p-4">
                <p className="">
                  Vui lòng điền thông tin chính xác. Một khi đã gửi thông tin,
                  bạn sẽ không thay đổi được.
                </p>
              </div>

              <div className="mx-8 mt-8 flex justify-between">
                <p className="basis-2/3 text-sm">
                  Đơn hàng sẽ được gửi đi sau khi thanh toán. Bạn có thể chọn
                  phương thức thanh toán ở bước tiếp theo.
                </p>
                <Button
                  variant="core"
                  className="py-6 text-lg"
                  onClick={handlePayment}
                >
                  Thanh toán
                </Button>
              </div>

              {/* Contact Information */}
            </Card>

            {/* Payment Summary */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-6 space-y-6 px-4">
                <Card>
                  <CardContent className="space-y-4 py-4">
                    <p className="font-semibold">
                      {paymentItem?.tour.tour.title}
                    </p>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Ngày</p>
                      <p>{paymentItem?.day}</p>
                    </div>
                    <div className="flex w-full justify-between text-sm">
                      <p className="text-gray-500">Đơn vị</p>
                      <div className="text-end">
                        {paymentItem?.tickets.map((ticket) => (
                          <p key={ticket.ticketTypeId}>
                            {getTicketKind(ticket.ticketKind)} x{" "}
                            {ticket.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm">
                    <p className="text-gray-500">Tổng cộng</p>
                    <p className="font-medium">
                      ₫ {formatCurrency(paymentItem?.totalPrice ?? 0)}
                    </p>
                  </CardFooter>
                </Card>
                <Card>
                  <CardContent className="space-y-4 py-8">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Tổng cộng</p>
                      <p className="font-medium">
                        ₫ {formatCurrency(paymentItem?.totalPrice ?? 0)}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Số tiền phải thanh toán</p>
                      <p className="text-xl font-medium text-core">
                        ₫ {formatCurrency(paymentItem?.totalPrice ?? 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
{/* 
          <AddContactSheet
            open={isContactSheetOpen}
            user={user}
            onOpenChange={setIsContactSheetOpen}
            onSave={handleAddContact}
          /> */}
        </div>
      </div>
    </>
  );
}
