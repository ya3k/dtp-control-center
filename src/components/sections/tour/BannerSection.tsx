import Image from "next/image";

export default function BannerSection() {
  return (
    <section className="relative mb-16">
      <Image
        width={500}
        height={500}
        alt=""
        src="/images/tour-qn.jpg"
        className="h-80 w-full object-center aspect-[16/9]"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
        <h1 className="text-4xl font-bold text-white">Tour Quy Nhơn</h1>
      </div>
    </section>
  );
}
