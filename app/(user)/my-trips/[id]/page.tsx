"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Users, 
  Calendar as CalendarIcon, 
  Globe, 
  Clock,
  DollarSign,
  FileText,
  Package,
  CheckCircle2
} from "lucide-react";
// import Link from "next/link";

interface ScheduleItem {
  destinationId: string;
  destinationName?: string;
  startTime: string;
  endTime: string;
  activity: string;
  notes?: string;
}

interface ScheduleDay {
  day: number;
  items: ScheduleItem[];
}

interface Budget {
  transport?: number;
  lodging?: number;
  food?: number;
  activities?: number;
}

interface TripDetail {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
  isPublic: boolean;
  destinations: Array<{ id: string; name: string }>;
  schedule: ScheduleDay[];
  budget: Budget;
  notes: string;
  packingList: string[];
  createdAt: string;
  updatedAt?: string;
  slug?: string;
  coverImage?: string | null;
  totalBudget?: number;
}

export default function DetailTripPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-slate-600">Memuat detail perjalanan...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : !trip ? (
          <p className="text-center text-slate-600">Perjalanan tidak ditemukan</p>
        ) : (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{trip.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={`${getTripTypeColor(trip.tripType)} text-white`}>
                    {getTripTypeLabel(trip.tripType)}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {trip.isPublic ? "Publik" : "Privat"}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/my-trips/${trip.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Hapus</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus perjalanan?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus perjalanan ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={async () => {
                          setIsDeleting(true);
                          try {
                            const token = getCookie("access_token");
                            const res = await fetch(apiUrl(`/api/users/me/trips/${trip.id}`), {
                              method: "DELETE",
                              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                            });
                            if (!res.ok) {
                              const body = await res.json().catch(() => null);
                              const msg = body?.message || "Gagal menghapus perjalanan";
                              throw new Error(msg);
                            }
                            toast.success("Perjalanan berhasil dihapus");
                            router.push("/my-trips");
                          } catch (err: unknown) {
                            const message = err instanceof Error ? err.message : "Gagal menghapus perjalanan";
                            toast.error(message);
                            console.error(err);
                          } finally {
                            setIsDeleting(false);
                          }
                        }}
                      >
                        {isDeleting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menghapus...
                          </span>
                        ) : (
                          "Ya, hapus"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarIcon className="w-4 h-4 text-slate-500" />
                  <span>
                    {format(new Date(trip.startDate), "dd MMM yyyy", { locale: localeId })} - {format(new Date(trip.endDate), "dd MMM yyyy", { locale: localeId })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{trip.peopleCount} orang</span>
                </div>
                {trip.destinations && trip.destinations.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{trip.destinations.length} destinasi</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule Card */}
            {trip.schedule && trip.schedule.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Jadwal Perjalanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {trip.schedule.map((scheduleDay) => (
                    <div key={scheduleDay.day} className="border-l-2 border-sky-500 pl-4">
                      <h3 className="font-semibold text-slate-900 mb-3">Hari {scheduleDay.day}</h3>
                      <div className="space-y-3">
                        {scheduleDay.items.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-sky-600">
                                {item.startTime} - {item.endTime}
                              </span>
                              {item.destinationName && (
                                <Badge variant="outline" className="text-xs">
                                  {item.destinationName}
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-900 font-medium">{item.activity}</p>
                            {item.notes && (
                              <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Budget Card */}
            {trip.budget && Object.keys(trip.budget).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Budget Perjalanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trip.budget.transport !== undefined && trip.budget.transport > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Transportasi</span>
                      <span className="font-semibold text-slate-900">
                        Rp {trip.budget.transport.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {trip.budget.lodging !== undefined && trip.budget.lodging > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Akomodasi</span>
                      <span className="font-semibold text-slate-900">
                        Rp {trip.budget.lodging.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {trip.budget.food !== undefined && trip.budget.food > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Makanan</span>
                      <span className="font-semibold text-slate-900">
                        Rp {trip.budget.food.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {trip.budget.activities !== undefined && trip.budget.activities > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">Aktivitas</span>
                      <span className="font-semibold text-slate-900">
                        Rp {trip.budget.activities.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  {trip.totalBudget && trip.totalBudget > 0 && (
                    <>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-slate-900">Total</span>
                        <span className="text-emerald-600">
                          Rp {trip.totalBudget.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notes Card */}
            {trip.notes && trip.notes.trim() !== "" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Catatan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-wrap">{trip.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Packing List Card */}
            {trip.packingList && trip.packingList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Packing List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {trip.packingList.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
  );
}
