import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, MapPin, Star, Compass, BookOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: "default" | "minimal";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center py-8 px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4 max-w-sm">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <>
          {actionHref ? (
            <Link href={actionHref}>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-600"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );

  if (variant === "minimal") {
    return content;
  }

  return (
    <Card>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}

// Specialized Empty States
interface TripEmptyStateProps {
  variant?: "default" | "minimal";
}

export function EmptyTrips({ variant }: TripEmptyStateProps) {
  return (
    <EmptyState
      icon={MapPin}
      title="Belum Ada Rencana Perjalanan"
      description="Mulai rencanakan petualangan Anda di Kepulauan Sangihe. Buat rencana perjalanan pertama Anda sekarang!"
      actionLabel="Buat Rencana Baru"
      actionHref="/create-trip"
      variant={variant}
    />
  );
}

export function EmptyReviews({ variant }: TripEmptyStateProps) {
  return (
    <EmptyState
      icon={Star}
      title="Belum Ada Review"
      description="Bagikan pengalaman perjalanan Anda dengan menulis review untuk destinasi yang sudah dikunjungi."
      actionLabel="Tulis Review Pertama"
      actionHref="/destinasi"
      variant={variant}
    />
  );
}

export function EmptyDestinations({ variant }: TripEmptyStateProps) {
  return (
    <EmptyState
      icon={Compass}
      title="Jelajahi Destinasi"
      description="Belum ada rekomendasi destinasi. Mulai jelajahi tempat-tempat menakjubkan di Sangihe!"
      actionLabel="Lihat Destinasi"
      actionHref="/destinasi"
      variant={variant}
    />
  );
}

export function EmptyArticles({ variant }: TripEmptyStateProps) {
  return (
    <EmptyState
      icon={BookOpen}
      title="Belum Ada Artikel"
      description="Baca tips dan panduan perjalanan untuk pengalaman terbaik di Kepulauan Sangihe."
      actionLabel="Baca Artikel"
      actionHref="/artikel"
      variant={variant}
    />
  );
}
