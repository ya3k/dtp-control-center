import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function NoteSection() {
  return (
    <section className="mx-auto mb-16 flex max-w-2xl px-4 flex-col gap-6 sm:pb-6 lg:max-w-6xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Du lịch Quy Nhơn cần biết những gì ?
      </h1>
      <Card className="w-full">
        <CardContent className="px-12 py-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base md:text-lg">
                Quy Nhơn có gì chơi ?
              </AccordionTrigger>
              <AccordionContent>
                "Đặc sản" của Quy Nhơn là làn gió biển tươi mát cùng những bãi
                biển trong xanh. Du lịch Quy Nhơn không thể bỏ qua Kỳ Co, Eo
                Gió, khu du lịch sinh thái Hầm Hô, Bãi Xếp, Tuyệt Tình Cốc, Hòn
                Khô.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base md:text-lg">
                Đi Quy Nhơn mùa nào đẹp ?
              </AccordionTrigger>
              <AccordionContent>
                Quy Nhơn có 2 mùa rõ rệt là mùa mưa và mùa khô. Thời điểm thích
                hợp nhất để du lịch Quy Nhơn là từ Tháng 3 đến Tháng 9. Bạn nên
                tránh tham quan Quy Nhơn vào mùa mưa bão, thường kéo dài từ
                tháng 10 đến tháng 2 năm kế tiếp.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base md:text-lg">
                Đi Quy Nhơn nên ăn gì ?
              </AccordionTrigger>
              <AccordionContent>
                Thành phố Quy Nhơn có rất nhiều món ngon đặc sản đang chờ bạn
                thưởng thức. Món ngon Quy Nhơn gồm có bánh xèo tôm nhảy, bún cá,
                bánh hỏi cháo lòng, bún sứa, bánh ít lá gai...
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base md:text-lg">
                Tại sao gọi Quy Nhơn là xứ Nẫu ?
              </AccordionTrigger>
              <AccordionContent>
                "Nậu" ban đầu ý chỉ tổ chức quản lý một nhóm nhỏ cùng làm một
                nghề, khái niệm này được biến nghĩa dùng để gọi người đứng đầu
                trong đám người nào đó và sau này dùng để gọi đại từ nhân xưng
                ngôi thứ ba. Sau này, phương ngữ Phú Yên-Bình Định tỉnh lược đại
                từ danh xưng ngôi thứ ba (cả số ít và số nhiều) bằng cách thay
                từ gốc thanh hỏi. Và thế là “Nậu” được thay bằng “Nẩu” hoặc
                "Nẫu".
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
