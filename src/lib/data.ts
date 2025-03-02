export interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  category: "tour1day" | "tourlongday";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  bookingCount: string;
  freeCancel?: boolean;
  latitude: number;
  longitude: number;  
  imageUrl: string;
}

export const tourData: Tour[] = [
  {
    id: "1",
    title: "Tour Ngày Tham Quan Kỳ Co, Eo Gió Và Hòn Khô",
    description:
      "Khám phá vẻ đẹp tự nhiên của Quy Nhơn với tour tham quan Kỳ Co, Eo Gió và Hòn Khô.",
    location: "Quy Nhơn",
    category: "tour1day",
    price: 1040000,
    originalPrice: 1110000,
    rating: 4.3,
    reviewCount: 23,
    bookingCount: "600+",
    freeCancel: false,
    latitude: 13.7563,
    longitude: 109.2217,
    imageUrl: "https://picsum.photos/id/1036/600/400",
  },
  {
    id: "2",
    title:
      "Tour Riêng Tham Quan Kỳ Co - Eo Gió và Lặn Ngắm San Hô đến từ Quy Nhơn",
    description:
      "Tận hưởng tour riêng để khám phá Kỳ Co, Eo Gió và lặn ngắm san hô.",
    location: "Quy Nhơn",
    category: "tour1day",
    price: 893750,
    originalPrice: 950000,
    rating: 5.0,
    reviewCount: 7,
    bookingCount: "100+",
    freeCancel: false,
    latitude: 13.758,
    longitude: 109.23,
    imageUrl: "https://picsum.photos/id/1043/600/400",
  },
  {
    id: "3",
    title:
      "Tour Riêng Tham Quan Phú Yên Trong Ngày Từ Quy Nhơn: Nhà Thờ Mằng Lăng và Gành Đá Đĩa",
    description:
      "Khám phá vẻ đẹp của Phú Yên với tour tham quan Nhà Thờ Mằng Lăng và Gành Đá Đĩa.",
    location: "Phú Yên",
    category: "tour1day",
    price: 808000,
    originalPrice: 850000,
    rating: 4.7,
    reviewCount: 6,
    bookingCount: "100+",
    freeCancel: false,
    latitude: 13.1,
    longitude: 109.3,
    imageUrl: "https://picsum.photos/id/1059/600/400",
  },
  {
    id: "4",
    title: "Tour Ngày Tham Quan và Khám Phá Thành Phố Quy Nhơn",
    description: "Khám phá thành phố Quy Nhơn với tour ngày đầy thú vị.",
    location: "Quy Nhơn",
    category: "tour1day",
    price: 712500,
    originalPrice: 750000,
    rating: 4.5,
    reviewCount: 15,
    bookingCount: "200+",
    freeCancel: true,
    latitude: 13.7765,
    longitude: 109.2237,
    imageUrl: "https://picsum.photos/id/1015/600/400",
  },
  {
    id: "5",
    title:
      "Tour Ngày Tham Quan Làng Nghề Xưa Bình Định - Khởi Hành từ Quy Nhơn",
    description:
      "Tham quan làng nghề truyền thống của Bình Định trong một ngày.",
    location: "Bình Định",
    category: "tour1day",
    price: 825000,
    originalPrice: 860000,
    rating: 4.6,
    reviewCount: 12,
    bookingCount: "150+",
    freeCancel: true,
    latitude: 13.8365,
    longitude: 109.164,
    imageUrl: "https://picsum.photos/id/1028/600/400",
  },
  {
    id: "6",
    title: "Tour Riêng Chèo SUP Nửa Ngày Khám Phá Quy Nhơn tại Cù Lao Xanh",
    description: "Trải nghiệm chèo SUP thú vị tại Cù Lao Xanh, Quy Nhơn.",
    location: "Quy Nhơn",
    category: "tour1day",
    price: 1812500,
    originalPrice: 1933300,
    rating: 4.8,
    reviewCount: 20,
    bookingCount: "250+",
    freeCancel: true,
    latitude: 13.612,
    longitude: 109.306,
    imageUrl: "https://picsum.photos/id/1029/600/400",
  },
  {
    id: "7",
    title: "Tour Tham Quan Bảo Tàng Quang Trung - Tây Sơn Hào Kiệt",
    description:
      "Tham quan Bảo Tàng Quang Trung và tìm hiểu về văn hóa lịch sử.",
    location: "Bình Định",
    category: "tour1day",
    price: 1005000,
    originalPrice: 1075000,
    rating: 4.4,
    reviewCount: 18,
    bookingCount: "180+",
    freeCancel: true,
    latitude: 13.566,
    longitude: 109.0999,
    imageUrl: "https://picsum.photos/id/1035/600/400",
  },
  {
    id: "8",
    title:
      "Tour Tham Quan Phú Yên: Mũi Điện, Bãi Xép, Ghành Đá Đĩa từ Quy Nhơn",
    description:
      "Khám phá vẻ đẹp của Phú Yên với tour tham quan Mũi Điện, Bãi Xép và Ghành Đá Đĩa.",
    location: "Phú Yên",
    category: "tour1day",
    price: 943750,
    originalPrice: 955000,
    rating: 4.9,
    reviewCount: 25,
    bookingCount: "300+",
    freeCancel: true,
    latitude: 13.0891,
    longitude: 109.2937,
    imageUrl: "https://picsum.photos/id/1039/600/400",
  },
  {
    id: "9",
    title: "Tour Phú Yên Khởi Hành Từ Quy Nhơn",
    description: "Hành trình khám phá Phú Yên từ thành phố Quy Nhơn.",
    location: "Phú Yên",
    category: "tour1day",
    price: 912500,
    originalPrice: 980000,
    rating: 4.5,
    reviewCount: 10,
    bookingCount: "200+",
    freeCancel: true,
    latitude: 13.1,
    longitude: 109.31,
    imageUrl: "https://picsum.photos/id/1041/600/400",
  },
  {
    id: "10",
    title:
      "Tour Riêng Khám Phá Tháp Chàm Bình Định: Huyền thoại và văn hóa Champa",
    description:
      "Khám phá di sản văn hóa Champa và những tháp cổ tại Bình Định.",
    location: "Bình Định",
    category: "tourlongday",
    price: 1812500,
    originalPrice: 1980000,
    rating: 4.0,
    reviewCount: 1,
    bookingCount: "Dịch vụ mới",
    freeCancel: false,
    latitude: 13.816,
    longitude: 109.158,
    imageUrl: "https://picsum.photos/id/1047/600/400",
  },
  {
    id: "11",
    title: "Tour 2 Ngày 1 Đêm Khám Phá Quy Nhơn - Phú Yên",
    description: "Trải nghiệm đáng nhớ 2 ngày 1 đêm tại Quy Nhơn và Phú Yên.",
    location: "Quy Nhơn & Phú Yên",
    category: "tourlongday",
    price: 2800000,
    originalPrice: 3000000,
    rating: 4.8,
    reviewCount: 32,
    bookingCount: "350+",
    freeCancel: true,
    latitude: 13.4,
    longitude: 109.25,
    imageUrl: "https://picsum.photos/id/1048/600/400",
  },
  {
    id: "12",
    title: "Tour 3 Ngày 2 Đêm Quy Nhơn - Tuy Hòa - Đà Nẵng",
    description: "Hành trình 3 ngày 2 đêm từ Quy Nhơn qua Tuy Hòa đến Đà Nẵng.",
    location: "Quy Nhơn - Đà Nẵng",
    category: "tourlongday",
    price: 4500000,
    originalPrice: 4800000,
    rating: 4.9,
    reviewCount: 28,
    bookingCount: "280+",
    freeCancel: true,
    latitude: 14.0583,
    longitude: 108.2772,
    imageUrl: "https://picsum.photos/id/1049/600/400",
  },
];

export const filters = [
  { id: "all", label: "Tất cả" },
  { id: "free-cancel", label: "Miễn phí hủy" },
  { id: "private-tour", label: "Tour riêng" },
  { id: "top-rated", label: "Đánh giá cao" },
];

export const categories = [
  { id: "all", label: "Tất cả" },
  { id: "tour1day", label: "Tour 1 Ngày" },
  { id: "tourlongday", label: "Tour Nhiều Ngày" },
];
