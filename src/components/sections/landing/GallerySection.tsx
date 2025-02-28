import Masonry from "@/components/animation/Mansory";

const data = [
  { id: 1, image: "/images/gallery/landing1.png", height: 500 },
  { id: 2, image: "/images/gallery/landing2.jpeg", height: 400 },
  { id: 3, image: "/images/gallery/landing3.jpg", height: 400 },
  { id: 4, image: "/images/gallery/landing4.jpg", height: 400 },
  { id: 5, image: "/images/gallery/landing5.jpg", height: 400 },
  { id: 6, image: "/images/gallery/landing6.jpg", height: 400 },
  { id: 7, image: "/images/gallery/landing7.jpg", height: 300 },
  { id: 8, image: "/images/gallery/landing8.jpg", height: 400 },
  { id: 9, image: "/images/gallery/landing9.jpg", height: 300 },
  { id: 10, image: "/images/gallery/landing10.jpg", height: 500 },
];

export default function GallerySection() {
  return (
    <section className="mx-auto mb-16 max-w-2xl px-4 sm:pb-6 lg:max-w-6xl lg:px-8">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
        Hình ảnh của du khách
      </h1>
      <Masonry data={data} />
    </section>
  );
}
