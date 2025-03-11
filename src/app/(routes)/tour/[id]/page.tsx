import tourApiRequest from "@/apiRequests/tour";
import TourDetail from "@/components/sections/tour-detail";
import { TourDetail as Tour } from "@/types/tours";

async function fetchData(id: string) {
  const response = await tourApiRequest.getById(id);
  return response.payload;
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data: Tour = await fetchData(id);

  return <TourDetail data={data} />;
}
