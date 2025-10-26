import Header from "@/components/layout/header";
import DestinationDetailContent from "./_components/DestinationDetailContent";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15: params is a Promise in server components
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      <DestinationDetailContent id={id} />
    </div>
  );
}
