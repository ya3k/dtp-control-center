import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section>
      <div>
        <div>
          <h1>Trọn niềm vui với những chuyến đi đáng nhớ</h1>
          <p>Bình Định – vùng đất võ huyền thoại với bãi biển trong xanh, Eo Gió hùng vĩ và tháp Chăm cổ kính. Cùng khám phá vẻ đẹp hoang sơ và tận hưởng những trải nghiệm tuyệt vời nơi đây!</p>
          <button>Khám phá ngay</button>
        </div>
        <Button variant="default" size="lg" className="bg-core rounded-xl">Khám phá ngay</Button>
      </div>
      <div>
        <Image src="/images/ky-co.jpg" alt="hero" width={500} height={500} />
        <Image src="/images/quynhon1.jpg" alt="hero" width={500} height={500} />
        <Image src="/images/quynhon2.jpg" alt="hero" width={500} height={500} />
      </div>
    </section>
  )
}
