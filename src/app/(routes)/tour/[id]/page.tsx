/* eslint-disable @typescript-eslint/no-explicit-any */
import {tourApiRequest} from "@/apiRequests/tour";
import TourDetail from "@/components/sections/tour-detail";
import { TourDetail as Tour } from "@/types/tours";

async function fetchData(id: string) {
  const response: any = await tourApiRequest.getById(id);
  console.log("tour detail: ", response);
  if (response.status != 200) {
    throw new Error("Failed to fetch tour details");
  }
  return response.payload;
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data: Tour = await fetchData(id);
  console.log(data);

  return <TourDetail data={data} />;
}
