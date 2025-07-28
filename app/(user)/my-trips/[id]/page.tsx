"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Header from "@/app/_components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar as CalendarIcon, Globe } from "lucide-react";
import Link from "next/link";

interface TripDetail {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
  isPublic: boolean;
  destinations: { id: string; name: string }[];
  // other fields omitted since not displayed if empty
}

export default function DetailTripPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/trip/${id}`), {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Gagal memuat detail perjalanan");
        const json = await res.json();
        setTrip(json.data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const getTripTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      solo: "Solo",
      couple: "Pasangan",
      family: "Keluarga",
      friends: "Teman",
      group: "Grup",
    };
    return map[type] || type;
  };

  const getTripTypeColor = (type: string) => {
    switch (type) {
      case "solo":
        return "bg-emerald-500";
      case "couple":
        return "bg-pink-500";
      case "family":
        return "bg-sky-500";
      case "group":
      case "friends":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-slate-600">Memuat detail perjalanan...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : !trip ? (
          <p className="text-center text-slate-600">Perjalanan tidak ditemukan</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-slate-800">{trip.name}</h1>
              <Link href={`/trip/${trip.id}/edit`}>
                <Button variant="outline">Edit Perjalanan</Button>
              </Link>
            </div>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${getTripTypeColor(trip.tripType)} text-white`}>
                    {getTripTypeLabel(trip.tripType)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {trip.isPublic ? "Publik" : "Privat"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {format(new Date(trip.startDate), "dd MMM yyyy", { locale: localeId })} - {format(new Date(trip.endDate), "dd MMM yyyy", { locale: localeId })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4" />
                  <span>{trip.peopleCount} orang</span>
                </div>
                {trip.destinations?.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4" />
                    <span>{trip.destinations.length} destinasi</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
