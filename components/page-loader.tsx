import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoader({ message = "Memuat...", fullScreen = true }: PageLoaderProps) {
  const containerClass = fullScreen 
    ? "min-h-screen bg-gray-50 flex items-center justify-center" 
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-2 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
}
