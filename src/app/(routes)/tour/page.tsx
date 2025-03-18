import ExperienceSection from "@/components/sections/tour/ExperienceSection";
import NoteSection from "@/components/sections/tour/NoteSection";
import PopulationSection from "@/components/sections/tour/PopulationSection";
import ToursSection from "@/components/sections/tour/ToursSection";
import Banner from "@/components/common/Banner";
import {tourApiRequest} from "@/apiRequests/tour";
import { TourList } from "@/types/tours";

async function getData() {
  const response = await tourApiRequest.getAll();
  return response.payload;
}

export default async function Tour() {
  const data: TourList = await getData();
  // console.log("data", data);

  return (
    <>
      <Banner title1="Tour du lịch" title2="Quy Nhơn" />
      {/* <CategorySection /> */}
      <PopulationSection />
     <ToursSection data={data} />
      <ExperienceSection />
      <NoteSection />
    </>
  );
}
