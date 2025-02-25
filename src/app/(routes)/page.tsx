import ActivitySection from "@/components/sections/landing/ActivitySection";
import BookNextTourSection from "@/components/sections/landing/BookNextTourSection";
import ChoosingSection from "@/components/sections/landing/ChoosingSection";
import HeroSection from "@/components/sections/landing/HeroSection";
import SubribeSection from "@/components/sections/landing/SubribeSection";
import TestimonialsSection from "@/components/sections/landing/TestimonialsSection";

export default function Home() {
  return (
    <div className="pb-6 sm:pb-8 lg:pb-12">
      <HeroSection />
      <ChoosingSection />
      <ActivitySection />
      <BookNextTourSection />
      <TestimonialsSection />
      <SubribeSection />
    </div>
  );
}
