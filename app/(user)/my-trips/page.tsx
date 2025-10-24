"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiUrl } from "@/lib/api";
import { getCookie } from "@/lib/cookies";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/use-user-profile";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useUserProfile();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHE TRIP
              </span>
            </div>

            {/* Desktop Navigation (Dashboard-only) */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/beranda" className="text-sky-600 font-medium">
                Dashboard
              </Link>
              <Link
                href="/my-trips"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Rencana Saya
              </Link>
              <Link
                href="/beranda#reviews"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Review Terbaru
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{(profile?.name || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{profile?.name || "Pengguna"}</p>
                      {profile?.joinDate && (
                        <p className="text-xs text-slate-500">
                          Member sejak {new Date(profile.joinDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Top bar: title & action */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              Daftar Perjalanan
            </h2>
            {trips.length > 0 && (
              <p className="text-sm text-slate-600">
                {trips.length} perjalanan
              </p>
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
            <p className="text-lg font-medium mb-3">
              Anda belum memiliki perjalanan.
            </p>
            <Link href="/create-trip">
              <Button className="bg-sky-500 hover:bg-sky-600">
                Buat Perjalanan Pertama
              </Button>
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
                  <h3 className="font-semibold text-slate-800 truncate">
                    {trip.name}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {format(new Date(trip.startDate), "dd MMM yyyy", {
                        locale: id,
                      })}{" "}
                      -{" "}
                      {format(new Date(trip.endDate), "dd MMM yyyy", {
                        locale: id,
                      })}
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
                <CardFooter className="justify-between pt-0 px-6 pb-4">
                  <Badge
                    className={`${getTripTypeColor(trip.tripType)} text-white`}
                  >
                    {getTripTypeLabel(trip.tripType)}
                  </Badge>
                  <Link href={`/my-trips/${trip.id}`}>
                    <Button size="sm" variant="outline">
                      Lihat Detail
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
