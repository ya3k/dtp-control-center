import Image from "next/image";

export default function BookNextTourSection() {
  return (
    <div className="mx-auto mb-8 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full lg:w-1/2">
          <h3 className="text-sm font font-semibold text-gray-600 md:text-base">
            Dễ dàng và nhanh chóng
          </h3>
          <h1 className="text-4xl md:text-6xl font-bold">Đặt tour với 3 bước đơn giản</h1>
          <div className="p-6 flex flex-col gap-10">
            <div className="flex items-center gap-4 justify-between">
              <h3 className="rounded-2xl bg-[#FFD65A] px-6 py-4 font-bold">1</h3>
              <div>
                <p className="font-bold">Chọn tour</p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
                  tortor tempus.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <h3 className="rounded-2xl bg-[#FF9D23] px-6 py-4 font-bold">2</h3>
              <div>
                <p className="font-bold">Thanh toán</p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
                  tortor tempus.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <h3 className="rounded-2xl bg-[#F93827] px-6 py-4 font-bold">3</h3>
              <div>
                <p className="font-bold">Tham gia tour vào ngày đã chọn</p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
                  tortor tempus.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 px-4">
          <Image
            className="h-full w-full object-cover object-center"
            width={500}
            height={500}
            alt=""
            src="/images/card-trip.png"
          />
        </div>
      </div>
    </div>
  );
}
