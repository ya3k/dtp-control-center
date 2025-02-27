
import { Button } from "@/components/ui/button";

export default function SubscribeSection() {
  return (

    <section
      className="flex h-auto min-h-80 items-center bg-[url(/images/subscribe.jpg)] bg-cover bg-center bg-no-repeat"
    >
      <div className="flex h-full w-full flex-col justify-between gap-6 p-6 md:p-12 lg:p-20">
        <p className="self-center text-[4vw] md:text-[3vw] lg:text-[2vw] font-bold uppercase text-white drop-shadow-2xl">
          Đăng ký để nhận thông tin mới nhất
        </p>
        <input
          className="w-[80%] md:w-[50%] lg:w-[30vw] self-center rounded-full px-4 py-3"
          type="text"
          placeholder="Nhập Email"
        />
        <Button className="self-center bg-red-500 py-3 md:py-4 lg:py-6 px-6 md:px-8 lg:px-12 ">Đăng ký</Button>
      </div>
    </section>
  );
}
