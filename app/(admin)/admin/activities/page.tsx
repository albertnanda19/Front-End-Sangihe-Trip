"use client";

import { useAdminList } from "@/hooks/admin/use-admin-list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  RefreshCw,
  Clock,
  User,
  Globe,
  Monitor,
  Search,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

type ActivityAction = 'create' | 'update' | 'delete' | 'login' | 'register';
type EntityType = 'auth' | 'user' | 'destination' | 'review' | 'article' | 'trip_plan';
type ActorRole = 'user' | 'admin';

interface ActivityItem {
  id: string;
  action: ActivityAction;
  entityType: EntityType;
  actorRole: ActorRole;
  entityId: string;
  entityName: string;
  userId: string;
  userName: string;
  userEmail: string;
  details: string;
  timestamp: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

const getActionDisplayName = (action: ActivityAction): string => {
  switch (action) {
    case "create": return "Create";
    case "update": return "Update";
    case "delete": return "Delete";
    case "login": return "Login";
    case "register": return "Register";
    default: return action;
  }
};

const getTypeDisplayName = (entityType: EntityType): string => {
  switch (entityType) {
    case "auth": return "Auth";
    case "user": return "User";
    case "destination": return "Destination";
    case "article": return "Article";
    case "review": return "Review";
    case "trip_plan": return "Trip Plan";
    default: return entityType;
  }
};

const getActorRoleBadge = (role: ActorRole): { label: string; variant: "default" | "secondary" } => {
  switch (role) {
    case "admin":
      return { label: "Admin", variant: "default" };
    case "user":
      return { label: "User", variant: "secondary" };
    default:
      return { label: role, variant: "secondary" };
  }
};

const formatValueData = (data: Record<string, unknown>) => {
  return Object.entries(data).map(([key, value]) => (
    <div key={key} className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 last:border-b-0 min-w-0">
      <span className="text-sm font-medium text-gray-700 capitalize flex-shrink-0 min-w-0 flex-1 max-w-48">
        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
      </span>
      <span className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-1 rounded break-words min-w-0 flex-1 max-w-96" title={String(value)}>
        {String(value)}
      </span>
    </div>
  ));
};

export default function AdminActivitiesPage() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedAction, setSelectedAction] = useState<string | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const {
    items,
    meta,
    loading,
    error,
    search,
    page,
    setSearchAndFetch,
    setFilter,
    setPage,
    resetFilters,
    refresh,
  } = useAdminList<ActivityItem>({
    endpoint: "/api/admin/activities",
    searchFields: ["entityName", "userName", "userEmail"],
    pageSize: 10,
  });

  const actionOptions = [
    { value: "register", label: "Register", group: "Auth Actions" },
    { value: "login", label: "Login", group: "Auth Actions" },
    { value: "create", label: "Create", group: "Generic Actions" },
    { value: "update", label: "Update", group: "Generic Actions" },
    { value: "delete", label: "Delete", group: "Generic Actions" },
  ];

  const entityTypeOptions = [
    { value: "auth", label: "Auth" },
    { value: "user", label: "User" },
    { value: "destination", label: "Destination" },
    { value: "review", label: "Review" },
    { value: "article", label: "Article" },
    { value: "trip_plan", label: "Trip Plan" },
  ];

  const handleActionChange = (action: string) => {
    if (action === "all") {
      setSelectedAction(undefined);
      setFilter("action", undefined);
    } else {
      setSelectedAction(action);
      setFilter("action", action);
    }
  };

  const handleDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setDateFrom(from);
    setDateTo(to);

    if (from) {
      setFilter("dateFrom", format(from, "yyyy-MM-dd"));
    } else {
      setFilter("dateFrom", undefined);
    }
    
    if (to) {
      setFilter("dateTo", format(to, "yyyy-MM-dd"));
    } else {
      setFilter("dateTo", undefined);
    }
  };

  const clearDateRange = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilter("dateFrom", undefined);
    setFilter("dateTo", undefined);
  };

  const resetAllFilters = () => {
    setSelectedAction(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
    resetFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Aktivitas Admin</h1>
          <p className="text-sm text-gray-600">Log aktivitas dan perubahan yang dilakukan admin dan user.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pencarian & Filter</CardTitle>
              <CardDescription>Filter aktivitas berdasarkan berbagai kriteria yang tersedia.</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic Search */}
            <div className="flex flex-col lg:flex-row gap-3 items-end">
              <div className="w-full flex-1 min-w-0">
                <Label htmlFor="search" className="text-sm font-medium">Pencarian Global</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Cari nama entitas, nama user, atau email user..."
                    value={search}
                    onChange={(e) => setSearchAndFetch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setSearchAndFetch(search);
                      }
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetAllFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Reset Semua
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Action Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tipe Aksi</Label>
                    <Select value={selectedAction || "all"} onValueChange={handleActionChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih aksi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Aksi</SelectItem>
                        {["Auth Actions", "Generic Actions"].map((group) => (
                          <div key={group}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {group}
                            </div>
                            {actionOptions
                              .filter(option => option.group === group)
                              .map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Entity Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tipe Entitas</Label>
                    <Select onValueChange={(v) => setFilter("entityType", v === "all" ? undefined : v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe entitas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        {entityTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium">Rentang Tanggal</Label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-start text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Dari"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={(date) => handleDateRangeChange(date, dateTo)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-start text-sm">
                            <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {dateTo ? format(dateTo, "dd/MM/yyyy") : "Sampai"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={(date) => handleDateRangeChange(dateFrom, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {(dateFrom || dateTo) && (
                        <Button variant="ghost" size="icon" onClick={clearDateRange} className="flex-shrink-0">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User ID Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-sm font-medium">ID User</Label>
                    <Input
                      id="userId"
                      placeholder="Masukkan ID user spesifik"
                      onChange={(e) => setFilter("userId", e.target.value || undefined)}
                    />
                  </div>

                  {/* Entity ID Filter */}
                  <div className="space-y-2">
                    <Label htmlFor="entityId" className="text-sm font-medium">ID Entitas</Label>
                    <Input
                      id="entityId"
                      placeholder="Masukkan ID entitas spesifik"
                      onChange={(e) => setFilter("entityId", e.target.value || undefined)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log Aktivitas</CardTitle>
          <CardDescription>
            {loading ? "Memuat..." : `${meta ? meta.total : items.length} aktivitas`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Aktivitas</TableHead>
                  <TableHead className="w-32">Role</TableHead>
                  <TableHead className="w-40">Entitas</TableHead>
                  <TableHead className="hidden sm:table-cell">Detail</TableHead>
                  <TableHead className="w-48 hidden md:table-cell">Pengguna</TableHead>
                  <TableHead className="w-32 hidden lg:table-cell">IP & Browser</TableHead>
                  <TableHead className="w-32 text-center">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="text-xs w-fit">
                          {getActionDisplayName(activity.action)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {getTypeDisplayName(activity.entityType)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActorRoleBadge(activity.actorRole).variant} className="text-xs w-fit">
                        {getActorRoleBadge(activity.actorRole).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{activity.entityName}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs text-gray-500 cursor-help truncate max-w-32">
                              ID: {activity.entityId.length > 12 ? `${activity.entityId.slice(0, 12)}...` : activity.entityId}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{activity.entityId}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-sm max-w-xs">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate cursor-help">
                              {activity.details}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p className="text-sm">{activity.details}</p>
                          </TooltipContent>
                        </Tooltip>
                        {(activity.oldValues || activity.newValues) && (
                          <div className="mt-1 text-xs text-gray-500">
                            <Dialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <div className="cursor-pointer flex items-center gap-1 hover:bg-gray-100 p-1 rounded transition-colors">
                                      <span className="text-blue-600">📝</span>
                                      <span className="truncate">
                                        {activity.oldValues && activity.newValues 
                                          ? `${Object.keys(activity.oldValues).join(', ')} → ${Object.keys(activity.newValues).join(', ')}`
                                          : activity.oldValues 
                                            ? `Changed: ${Object.keys(activity.oldValues).join(', ')}`
                                            : activity.newValues 
                                              ? `Added: ${Object.keys(activity.newValues).join(', ')}`
                                              : ''
                                        }
                                      </span>
                                    </div>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Klik untuk melihat detail perubahan</p>
                                </TooltipContent>
                              </Tooltip>
                              <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                                <DialogHeader className="sticky top-0 bg-white border-b pb-4">
                                  <DialogTitle className="flex items-center gap-2">
                                    <span>📝</span>
                                    Detail Perubahan Data
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  {activity.oldValues && (
                                    <div>
                                      <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                                        🔴 Nilai Sebelum
                                      </p>
                                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        {formatValueData(activity.oldValues)}
                                      </div>
                                    </div>
                                  )}
                                  {activity.newValues && (
                                    <div>
                                      <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                                        🟢 Nilai Sesudah
                                      </p>
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        {formatValueData(activity.newValues)}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="text-sm font-medium">{activity.userName || "—"}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">{activity.userEmail || "—"}</span>
                        <span className="text-xs text-gray-400 ml-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                ID: {activity.userId.length > 12 ? `${activity.userId.slice(0, 12)}...` : activity.userId}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{activity.userId}</p>
                            </TooltipContent>
                          </Tooltip>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-xs space-y-1">
                        {activity.ipAddress && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{activity.ipAddress}</span>
                          </div>
                        )}
                        {activity.userAgent && (
                          <div className="flex items-center gap-1">
                            <Monitor className="h-3 w-3" />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="truncate max-w-32 cursor-help">
                                  {activity.userAgent.split(' ').slice(0, 3).join(' ')}...
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p className="text-xs">{activity.userAgent}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(activity.timestamp).toLocaleDateString('id-ID')}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 text-center sm:text-left">
              {meta ? `Menampilkan halaman ${meta.page} dari ${meta.totalPages}` : ""}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={loading || (meta ? meta.page <= 1 : page <= 1)}
              >
                Sebelumnya
              </Button>

              {/* Page numbers - responsive */}
              {meta && meta.totalPages > 1 && (
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    let pnum;
                    if (meta.totalPages <= 5) {
                      pnum = i + 1;
                    } else {
                      const half = Math.floor(5 / 2);
                      const start = Math.max(1, meta.page - half);
                      const end = Math.min(meta.totalPages, start + 4);
                      pnum = start + i;
                      if (pnum > end) return null;
                    }
                    return (
                      <Button
                        key={i}
                        size="sm"
                        variant={pnum === meta.page ? "default" : "ghost"}
                        onClick={() => setPage(pnum)}
                      >
                        {pnum}
                      </Button>
                    );
                  }).filter(Boolean)}
                </div>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={loading || (meta ? meta.page >= meta.totalPages : false)}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}