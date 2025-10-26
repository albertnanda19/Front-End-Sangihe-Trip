"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Edit, Calendar, Users, DollarSign, Clock, Globe, Lock } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import type { TripData, ScheduleItem } from "@/app/(user)/create-trip/page"

interface ReviewStepProps {
  data: TripData
  updateData: (data: Partial<TripData>) => void
  onComplete: () => void
  onPrev: () => void
  onEdit: (step: number) => void
  isSubmitting?: boolean
  submitError?: string | null
}

export function ReviewStep({ data, updateData, onComplete, onPrev, onEdit, isSubmitting, submitError }: ReviewStepProps) {
  const totalBudget = Object.values(data.budget).reduce((sum, value) => sum + value, 0)
  const tripDuration =
    data.startDate && data.endDate
      ? Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const getTripTypeLabel = (type: string) => {
    const types = {
      solo: "Solo Travel",
      couple: "Pasangan",
      family: "Keluarga",
      friends: "Teman-teman",
      group: "Grup Besar",
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Review Rencana Perjalanan</h2>
              <p className="text-slate-600">Periksa kembali semua detail sebelum menyimpan</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Trip Overview */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{data.tripName}</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <div>
                  <p className="text-sm text-slate-600">Tanggal</p>
                  <p className="font-medium">
                    {data.startDate && format(data.startDate, "dd MMM", { locale: id })} -{" "}
                    {data.endDate && format(data.endDate, "dd MMM yyyy", { locale: id })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-600">Durasi</p>
                  <p className="font-medium">{tripDuration} hari</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-slate-600">Peserta</p>
                  <p className="font-medium">
                    {data.peopleCount} orang ({getTripTypeLabel(data.tripType)})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-slate-600">Budget</p>
                  <p className="font-medium">Rp {totalBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">1. Informasi Dasar</h3>
              <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Nama Perjalanan</p>
                    <p className="font-medium">{data.tripName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tipe Perjalanan</p>
                    <p className="font-medium">{getTripTypeLabel(data.tripType)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tanggal Perjalanan</p>
                    <p className="font-medium">
                      {data.startDate &&
                        data.endDate &&
                        `${format(data.startDate, "dd MMMM yyyy", { locale: id })} - ${format(data.endDate, "dd MMMM yyyy", { locale: id })}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Jumlah Peserta</p>
                    <p className="font-medium">{data.peopleCount} orang</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Destinations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">2. Destinasi Terpilih</h3>
              <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {data.selectedDestinations.map((destination, index) => (
                    <div key={destination.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                      <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="relative w-16 h-12 rounded overflow-hidden">
                        <Image
                          src={destination.imageUrl || "/placeholder.svg"}
                          alt={destination.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{destination.name}</h4>
                        <p className="text-sm text-slate-600">{destination.location}</p>
                      </div>
                      <Badge variant="outline">{destination.category}</Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-600">
                          {destination.price === 0 || !destination.price ? "Gratis" : `Rp ${destination.price.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">3. Jadwal Perjalanan</h3>
              <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                {data.schedule.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Belum ada jadwal yang dibuat</p>
                ) : (
                  <div className="space-y-4">
                    {Array.from({ length: tripDuration }, (_, i) => i + 1).map((day) => {
                      const daySchedule = data.schedule.filter((item: ScheduleItem) => item.day === day)
                      if (daySchedule.length === 0) return null

                      return (
                        <div key={day} className="bg-white rounded-lg p-4">
                          <h4 className="font-medium text-slate-800 mb-3">Hari {day}</h4>
                          <div className="space-y-2">
                            {daySchedule.map((activity: ScheduleItem) => (
                              <div key={activity.id} className="flex items-center gap-3 text-sm">
                                <span className="text-slate-600">
                                  {activity.startTime} - {activity.endTime}
                                </span>
                                <span className="font-medium">{activity.activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Budget Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">4. Budget & Catatan</h3>
              <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
            <Card className="bg-slate-50">
              <CardContent className="p-4 space-y-4">
                {/* Budget Breakdown */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Rincian Budget</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-600">Transportasi</p>
                      <p className="font-medium">Rp {data.budget.transport.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-600">Akomodasi</p>
                      <p className="font-medium">Rp {data.budget.lodging.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-600">Makanan</p>
                      <p className="font-medium">Rp {data.budget.food.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg text-center">
                      <p className="text-sm text-slate-600">Aktivitas</p>
                      <p className="font-medium">Rp {data.budget.activities.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800">Total Budget:</span>
                      <span className="text-xl font-bold text-emerald-600">Rp {totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-slate-600">Per orang:</span>
                      <span className="font-medium">
                        Rp {Math.round(totalBudget / data.peopleCount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {data.notes && (
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Catatan</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-slate-700">{data.notes}</p>
                    </div>
                  </div>
                )}

                {/* Packing List */}
                {data.packingList.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Daftar Packing ({data.packingList.length} item)</h4>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        {data.packingList.slice(0, 6).map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-sm text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                      {data.packingList.length > 6 && (
                        <p className="text-sm text-slate-500 mt-2">+{data.packingList.length - 6} item lainnya</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Pengaturan Privasi</h3>
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {data.isPublic ? (
                      <Globe className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-600" />
                    )}
                    <div>
                      <Label htmlFor="privacy" className="font-medium">
                        {data.isPublic ? "Rencana Publik" : "Rencana Pribadi"}
                      </Label>
                      <p className="text-sm text-slate-600">
                        {data.isPublic
                          ? "Rencana ini dapat dilihat dan diikuti oleh pengguna lain"
                          : "Hanya Anda yang dapat melihat rencana ini"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="privacy"
                    checked={data.isPublic}
                    onCheckedChange={(checked) => updateData({ isPublic: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Kembali
        </Button>
        <Button 
          onClick={onComplete} 
          className="bg-green-500 hover:bg-green-600 px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Simpan Rencana Perjalanan
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
