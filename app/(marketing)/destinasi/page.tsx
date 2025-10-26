import Header from "@/components/layout/header";
import DestinationContent from "./_components/DestinationContent";

export default function DestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as homepage */}
      <Header />

      <DestinationContent />
    </div>
  );
}
