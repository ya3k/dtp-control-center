export default async function TourDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const {id} = await params;
  return <div className="h-screen  mt-24">TourDetail: {id}</div>;
}
