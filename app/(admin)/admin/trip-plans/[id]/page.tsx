"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface TripPlanDetail {
  id: string;
  name: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  peopleCount: number;
  tripType: string;
  destinations: Array<{
    id: string;
    name: string;
  }>;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
  packingList: string[];
  schedule: Array<{
    day: number;
    items: Array<{
      destinationId: string;
      destinationName: string;
      startTime: string;
      endTime: string;
      activity: string;
      activityName?: string;
      notes?: string;
    }>;
  }>;
  created_at: string;
  updated_at: string;
}

const getTripTypeDisplayName = (tripType?: string): string => {
  switch (tripType) {
    case "solo": return "Solo";
    case "couple": return "Pasangan";
    case "family": return "Keluarga";
    case "friends": return "Teman-teman";
    case "group": return "Grup Besar";
    default: return tripType ?? "-";
  }
};

const getStatusDisplayName = (status?: string): string => {
  switch (status) {
    case "draft": return "Draft";
    case "published": return "Dipublikasi";
    case "completed": return "Selesai";
    case "cancelled": return "Dibatalkan";
    default: return status ?? "-";
  }
};

const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "draft": return "secondary";
    case "published": return "default";
    case "completed": return "outline";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
};

export default function TripPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlanDetail | null>({
    // Mock data - akan diganti dengan API nanti
    id: "1",
    name: "Liburan ke Sangihe",
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com"
    },
    status: "published",
    peopleCount: 4,
    tripType: "family",
    destinations: [
      { id: "1", name: "Pantai Barat" },
      { id: "2", name: "Gunung Awu" }
    ],
    startDate: "2025-12-20",
    endDate: "2025-12-25",
    budget: 5000000,
    notes: "Jangan lupa bawa sunblock dan kamera",
    packingList: [
      "Pakaian",
      "Sunblock",
      "Kamera",
      "Obat-obatan",
      "Charger"
    ],
    schedule: [
      {
        day: 1,
        items: [
          {
            destinationId: "1",
            destinationName: "Pantai Barat",
            startTime: "09:00",
            endTime: "12:00",
            activity: "Snorkeling",
            activityName: "Snorkeling",
            notes: "Bawa peralatan snorkeling sendiri"
          },
          {
            destinationId: "1",
            destinationName: "Pantai Barat",
            startTime: "13:00",
            endTime: "15:00",
            activity: "Makan Siang",
            notes: "Di warung Bu Haji"
          }
        ]
      },
      {
        day: 2,
        items: [
          {
            destinationId: "2",
            destinationName: "Gunung Awu",
            startTime: "06:00",
            endTime: "12:00",
            activity: "Hiking",
            activityName: "Hiking",
            notes: "Start pagi untuk menghindari panas"
          }
        ]
      }
    ],
    created_at: "2025-11-01T10:00:00",
    updated_at: "2025-11-05T14:30:00"
  });

  useEffect(() => {
    // TODO: Fetch trip plan detail from API
    console.log("Fetch trip plan:", id);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="text-center">Memuat data...</div>
      </div>
    );
  }

  if (!tripPlan) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="text-center">Trip plan tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/trip-plans")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Trip Plans
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tripPlan.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(tripPlan.status)}>
                {getStatusDisplayName(tripPlan.status)}
              </Badge>
              <Badge variant="outline">
                {getTripTypeDisplayName(tripPlan.tripType)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Nama:</span>
                  <p className="font-medium">
                    {tripPlan.user.firstName} {tripPlan.user.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">{tripPlan.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Mulai</p>
                    <p className="font-medium">
                      {format(new Date(tripPlan.startDate), "dd MMMM yyyy", { locale: localeId })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Berakhir</p>
                    <p className="font-medium">
                      {format(new Date(tripPlan.endDate), "dd MMMM yyyy", { locale: localeId })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Jumlah Orang</p>
                  <p className="font-medium">{tripPlan.peopleCount} orang</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="font-medium text-lg">
                    Rp {tripPlan.budget.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {tripPlan.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Catatan</p>
                    <p className="font-medium">{tripPlan.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destinations */}
          <Card>
            <CardHeader>
              <CardTitle>Destinasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tripPlan.destinations.map((dest, index) => (
                  <div key={dest.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {index + 1}. {dest.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Perjalanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tripPlan.schedule.map((day) => (
                  <div key={day.day}>
                    <h3 className="font-semibold text-lg mb-3">Hari {day.day}</h3>
                    <div className="space-y-3">
                      {day.items.map((item, index) => (
                        <div key={index} className="border-l-4 border-sky-500 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                          <div className="mb-1">
                            <p className="font-medium text-lg">{item.activity}</p>
                            {item.activityName && item.activityName !== item.activity && (
                              <p className="text-sm text-gray-500">
                                Aktivitas: {item.activityName}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>{item.destinationName}</span>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Packing List */}
          {tripPlan.packingList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daftar Bawaan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tripPlan.packingList.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Dibuat</p>
                <p className="font-medium">
                  {format(new Date(tripPlan.created_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terakhir Diupdate</p>
                <p className="font-medium">
                  {format(new Date(tripPlan.updated_at), "dd MMM yyyy HH:mm", { locale: localeId })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
