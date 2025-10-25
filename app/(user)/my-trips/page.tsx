"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiUrl } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Users, Calendar as CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react";

interface Trip {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
  destinationCount: number;
  coverImage: string | null;
  totalBudget: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MyTripPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrips() {
      try {
        const token = getCookie("access_token");
        if (!token) {
          setError("Pengguna belum login");
          setLoading(false);
          return;
        }
        const res = await fetch(apiUrl("/api/users/me/trips"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Gagal memuat data perjalanan");
        }
        const json = await res.json();
        setTrips(json.data?.data ?? []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  const handleDelete = async (id: string) => {
    const prev = trips;
    setTrips((t) => t.filter((x) => x.id !== id));
    try {
      const token = getCookie("access_token");
      if (!token) throw new Error("Pengguna belum login");
      const res = await fetch(apiUrl(`/api/users/me/trips/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let msg = "Gagal menghapus perjalanan";
        try {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } catch {}
        throw new Error(msg);
      }
    } catch (err) {
      setTrips(prev);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setDeletingId(null);
    }
  };

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
    <div>
      {/* Top bar: title & action */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Daftar Perjalanan</h2>
          {trips.length > 0 && (
            <p className="text-sm text-slate-600">{trips.length} perjalanan</p>
          )}
        </div>
        <Link href="/create-trip">
          <Button className="bg-sky-500 hover:bg-sky-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Buat Perjalanan
          </Button>
        </Link>
      </div>
      {loading ? (
        <p className="text-center text-slate-600">Memuat perjalanan...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : trips.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <Image
            src="/placeholder.svg?height=120&width=180"
            alt="No trips"
            width={180}
            height={120}
            className="mx-auto mb-6 opacity-50"
          />
          <p className="text-lg font-medium mb-3">Anda belum memiliki perjalanan.</p>
          <Link href="/create-trip">
            <Button className="bg-sky-500 hover:bg-sky-600">Buat Perjalanan Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden group">
              {trip.coverImage ? (
                <Image
                  src={trip.coverImage}
                  alt={trip.name}
                  width={400}
                  height={240}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-slate-500 text-sm">
                  Tidak ada gambar
                </div>
              )}
              <CardHeader className="pb-2">
                <h3 className="font-semibold text-slate-800 truncate">{trip.name}</h3>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {format(new Date(trip.startDate), "dd MMM yyyy", { locale: id })} - {format(
                      new Date(trip.endDate),
                      "dd MMM yyyy",
                      { locale: id }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  <span>{trip.peopleCount} orang</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destinationCount} destinasi</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between items-center gap-3 pt-0 px-6 pb-4">
                <Badge className={`${getTripTypeColor(trip.tripType)} text-white`}>
                  {getTripTypeLabel(trip.tripType)}
                </Badge>
                <div className="flex items-center gap-2 ml-auto">
                  <Link href={`/my-trips/${trip.id}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus perjalanan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Perjalanan akan dihapus permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setDeletingId(trip.id);
                            handleDelete(trip.id);
                          }}
                        >
                          Ya, hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
