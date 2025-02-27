import ActivitySection from "@/components/sections/landing/ActivitySection";
import BookNextTourSection from "@/components/sections/landing/BookNextTourSection";
import ChoosingSection from "@/components/sections/landing/ChoosingSection";
import GallerySection from "@/components/sections/landing/GallerySection";

import HeroSection from "@/components/sections/landing/HeroSection";
import SubscribeSection from "@/components/sections/landing/SubscribeSection";


export default function Home() {
  return (
    <div className="pb-6 sm:pb-8 lg:pb-12">
      <HeroSection />
      <ChoosingSection />
      <ActivitySection />
      <BookNextTourSection />
      <GallerySection />
      <SubscribeSection />
    </div>
  );
}
