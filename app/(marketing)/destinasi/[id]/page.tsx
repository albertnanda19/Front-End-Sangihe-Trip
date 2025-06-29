import Header from "@/app/_components/Header";
import DestinationDetailContent from "./_components/DestinationDetailContent";

export default function DestinationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as other pages */}
      <Header />
      <DestinationDetailContent id={params.id} />
    </div>
  );
}
