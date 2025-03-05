import ExperienceSection from "@/components/sections/tour/ExperienceSection";
import NoteSection from "@/components/sections/tour/NoteSection";
import PopulationSection from "@/components/sections/tour/PopulationSection";
import ToursSection from "@/components/sections/tour/ToursSection";
import Banner from "@/components/common/Banner";

export default function Tour() {
  return (
    <>
      <Banner title1="Tour du lịch" title2="Quy Nhơn" />
      {/* <CategorySection /> */}
      <PopulationSection />
      <ToursSection />
      <ExperienceSection />
      <NoteSection />
    </>
  );
}
