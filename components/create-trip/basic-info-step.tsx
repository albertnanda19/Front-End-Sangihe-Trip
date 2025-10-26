"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, MapPin } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { TripData } from "@/app/(user)/create-trip/page"

interface BasicInfoStepProps {
  data: TripData
  updateData: (data: Partial<TripData>) => void
  onNext: () => void
}

const tripTypes = [
  { value: "solo", label: "Solo Travel", icon: "👤" },
  { value: "couple", label: "Pasangan", icon: "💑" },
  { value: "family", label: "Keluarga", icon: "👨‍👩‍👧‍👦" },
  { value: "friends", label: "Teman-teman", icon: "👥" },
  { value: "group", label: "Grup Besar", icon: "🎭" },
]

export function BasicInfoStep({ data, updateData, onNext }: BasicInfoStepProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!data.tripName.trim()) {
      newErrors.tripName = "Nama perjalanan harus diisi"
    }

    if (!data.startDate) {
      newErrors.startDate = "Tanggal mulai harus dipilih"
    }

    if (!data.endDate) {
      newErrors.endDate = "Tanggal selesai harus dipilih"
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      newErrors.endDate = "Tanggal selesai harus setelah tanggal mulai"
    }

    if (data.peopleCount < 1) {
      newErrors.peopleCount = "Jumlah orang minimal 1"
    }

    if (!data.tripType) {
      newErrors.tripType = "Tipe perjalanan harus dipilih"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Informasi Dasar</h2>
            <p className="text-slate-600">Mulai dengan memberikan informasi dasar tentang perjalanan Anda</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trip Name */}
        <div className="space-y-2">
          <Label htmlFor="tripName">Nama Perjalanan *</Label>
          <Input
            id="tripName"
            placeholder="Contoh: Eksplorasi Pulau Sangihe"
            value={data.tripName}
            onChange={(e) => updateData({ tripName: e.target.value })}
            className={errors.tripName ? "border-red-500" : ""}
          />
          {errors.tripName && <p className="text-sm text-red-500">{errors.tripName}</p>}
        </div>

        {/* Date Range */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tanggal Mulai *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.startDate && "text-muted-foreground",
                    errors.startDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.startDate ? format(data.startDate, "PPP", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.startDate || undefined}
                  onSelect={(date) => updateData({ startDate: date || null })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tanggal Selesai *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.endDate && "text-muted-foreground",
                    errors.endDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.endDate ? format(data.endDate, "PPP", { locale: id }) : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.endDate || undefined}
                  onSelect={(date) => updateData({ endDate: date || null })}
                  disabled={(date) => date < (data.startDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
          </div>
        </div>

        {/* People Count */}
        <div className="space-y-2">
          <Label htmlFor="peopleCount">Jumlah Orang *</Label>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-slate-400" />
            <Input
              id="peopleCount"
              type="number"
              min="1"
              max="50"
              value={data.peopleCount}
              onChange={(e) => updateData({ peopleCount: Number.parseInt(e.target.value) || 1 })}
              className={`max-w-32 ${errors.peopleCount ? "border-red-500" : ""}`}
            />
            <span className="text-slate-600">orang</span>
          </div>
          {errors.peopleCount && <p className="text-sm text-red-500">{errors.peopleCount}</p>}
        </div>

        {/* Trip Type */}
        <div className="space-y-2">
          <Label>Tipe Perjalanan *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tripTypes.map((type) => (
              <Button
                key={type.value}
                variant={data.tripType === type.value ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  data.tripType === type.value ? "bg-sky-500 hover:bg-sky-600" : ""
                }`}
                onClick={() => updateData({ tripType: type.value })}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </Button>
            ))}
          </div>
          {errors.tripType && <p className="text-sm text-red-500">{errors.tripType}</p>}
        </div>

        {/* Duration Info */}
        {data.startDate && data.endDate && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <h4 className="font-medium text-sky-800 mb-2">Informasi Perjalanan</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-sky-600">Durasi:</span>
                <span className="ml-2 font-medium">
                  {Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))} hari
                </span>
              </div>
              <div>
                <span className="text-sky-600">Total Peserta:</span>
                <span className="ml-2 font-medium">{data.peopleCount} orang</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleNext} className="bg-sky-500 hover:bg-sky-600 px-8">
            Selanjutnya
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
