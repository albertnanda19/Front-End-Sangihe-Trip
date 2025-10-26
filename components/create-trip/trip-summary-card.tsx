"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, DollarSign, Cloud, Sun, CloudRain } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { id } from "date-fns/locale"
import type { TripData } from "@/app/(user)/create-trip/page"

interface TripSummaryCardProps {
  tripData: TripData
}

const weatherData = [
  { day: "Hari ini", temp: 28, condition: "Cerah", icon: Sun },
  { day: "Besok", temp: 26, condition: "Berawan", icon: Cloud },
  { day: "Lusa", temp: 24, condition: "Hujan", icon: CloudRain },
]

export function TripSummaryCard({ tripData }: TripSummaryCardProps) {
  const totalBudget = Object.values(tripData.budget).reduce((sum, value) => sum + value, 0)
  const tripDuration =
    tripData.startDate && tripData.endDate ? differenceInDays(tripData.endDate, tripData.startDate) + 1 : 0

  return (
    <div className="space-y-4 sticky top-24">
      {/* Trip Summary */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-800">Ringkasan Perjalanan</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {tripData.tripName && (
            <div>
              <h4 className="font-medium text-slate-800 mb-1">{tripData.tripName}</h4>
              <Badge variant="outline" className="text-xs">
                {tripData.tripType && tripData.tripType.charAt(0).toUpperCase() + tripData.tripType.slice(1)}
              </Badge>
            </div>
          )}

          <div className="space-y-3">
            {tripData.startDate && tripData.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                <div className="text-sm">
                  <p className="font-medium">
                    {format(tripData.startDate, "dd MMM", { locale: id })} -{" "}
                    {format(tripData.endDate, "dd MMM", { locale: id })}
                  </p>
                  <p className="text-slate-500">{tripDuration} hari</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <div className="text-sm">
                <p className="font-medium">{tripData.peopleCount} orang</p>
              </div>
            </div>

            {tripData.selectedDestinations.length > 0 && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <div className="text-sm">
                  <p className="font-medium">{tripData.selectedDestinations.length} destinasi</p>
                </div>
              </div>
            )}

            {totalBudget > 0 && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-purple-500" />
                <div className="text-sm">
                  <p className="font-medium">Rp {totalBudget.toLocaleString()}</p>
                  <p className="text-slate-500">
                    Rp {Math.round(totalBudget / tripData.peopleCount).toLocaleString()} per orang
                  </p>
                </div>
              </div>
            )}
          </div>

          {tripData.selectedDestinations.length > 0 && (
            <div className="pt-3 border-t">
              <h5 className="text-sm font-medium text-slate-700 mb-2">Destinasi Terpilih</h5>
              <div className="space-y-1">
                {tripData.selectedDestinations.slice(0, 3).map((dest, index) => (
                  <div key={dest.id} className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 bg-sky-500 text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="text-slate-600 truncate">{dest.name}</span>
                  </div>
                ))}
                {tripData.selectedDestinations.length > 3 && (
                  <p className="text-xs text-slate-500 ml-6">
                    +{tripData.selectedDestinations.length - 3} destinasi lainnya
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-800">Cuaca Sangihe</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherData.map((weather, index) => {
              const Icon = weather.icon
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-slate-600">{weather.day}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{weather.temp}°C</p>
                    <p className="text-xs text-slate-500">{weather.condition}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-800">Tips Perjalanan</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Bawa dokumen perjalanan lengkap</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Siapkan uang tunai untuk transaksi lokal</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Cek kondisi cuaca sebelum berangkat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
