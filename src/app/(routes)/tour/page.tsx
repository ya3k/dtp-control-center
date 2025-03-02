import BannerSection from "@/components/sections/tour/BannerSection";
import CategorySection from "@/components/sections/tour/CategorySection";
import ExperienceSection from "@/components/sections/tour/ExperienceSection";
import NoteSection from "@/components/sections/tour/NoteSection";
import PopulationSection from "@/components/sections/tour/PopulationSection";
import TestimonialSection from "@/components/sections/tour/TestimonialSection";
import ToursSection from "@/components/sections/tour/ToursSection";

export default function Tour() {
  return (
    <div className="pb-6 sm:pb-8 lg:pb-12">
      <BannerSection />
      {/* <CategorySection /> */}
      <PopulationSection />
      <ToursSection />
      <ExperienceSection />
      <NoteSection />
    </div>
  );
}
