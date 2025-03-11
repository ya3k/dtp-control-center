import TourDetail from "@/components/sections/tour-detail";
import { TourData } from "@/types/tours";

async function fetchData(id: string) {
  const res = await fetch(
    `https://mock-api.autobot.site/api/@dtp/tour/f6a2f86c-549c-49d3-a894-b1e782e56df4`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  return data;
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data: TourData = await fetchData(id);
  console.log(data);

  return <TourDetail data={data} />;
}
