"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, DollarSign, GripVertical, X, Map } from "lucide-react"
import { apiUrl } from "@/lib/api"
import Image from "next/image"
import type { TripData } from "@/app/(user)/create-trip/page"

interface DestinationStepProps {
  data: TripData
  updateData: (data: Partial<TripData>) => void
  onNext: () => void
  onPrev: () => void
}

interface Destination {
  id: string
  name: string
  category: string
  rating: number
  price: number | null
  imageUrl: string
  location: string
  description: string
}

const INITIAL_CATEGORIES = ["Semua"]

export function DestinationStep({ data, updateData, onNext, onPrev }: DestinationStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [showMap, setShowMap] = useState(false)

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES)

  // Fetch destinations once on mount
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(apiUrl("/api/all-destination"))
        if (!res.ok) throw new Error("Gagal memuat destinasi")
        const json = await res.json()
        const items: Destination[] = (json?.data || []).map((d: any) => ({
          id: d.id,
          name: d.name,
          category: d.category,
          rating: d.rating,
          price: d.price ?? 0,
          imageUrl: d.image || "/placeholder.svg",
          location: d.location,
          description: d.description,
        }))

        if (!cancelled) {
          setDestinations(items)
          const cats = Array.from(new Set(items.map((i) => i.category))).sort()
          setCategories(["Semua", ...cats])
        }
      } catch (err) {
        console.error(err)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Semua" || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const isSelected = (destinationId: string) => {
    return data.selectedDestinations.some((dest) => dest.id === destinationId)
  }

  const toggleDestination = (destination: Destination) => {
    const isCurrentlySelected = isSelected(destination.id)

    if (isCurrentlySelected) {
      const newSelected = data.selectedDestinations.filter((dest) => dest.id !== destination.id)
      // Clean up schedule items that reference removed destination
      const cleanSchedule = data.schedule.filter((item: any) => item.destinationId !== destination.id)
      updateData({ 
        selectedDestinations: newSelected,
        schedule: cleanSchedule
      })
    } else {
      const newSelected = [...data.selectedDestinations, destination]
      updateData({ selectedDestinations: newSelected })
    }
  }

  const removeDestination = (destinationId: string) => {
    const newSelected = data.selectedDestinations.filter((dest) => dest.id !== destinationId)
    // Clean up schedule items that reference removed destination
    const cleanSchedule = data.schedule.filter((item: any) => item.destinationId !== destinationId)
    updateData({ 
      selectedDestinations: newSelected,
      schedule: cleanSchedule
    })
  }

  const reorderDestinations = (fromIndex: number, toIndex: number) => {
    const newSelected = [...data.selectedDestinations]
    const [removed] = newSelected.splice(fromIndex, 1)
    newSelected.splice(toIndex, 0, removed)
    updateData({ selectedDestinations: newSelected })
  }

  const canProceed = data.selectedDestinations.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Pilih Destinasi</h2>
              <p className="text-slate-600">Pilih tempat-tempat yang ingin Anda kunjungi</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Cari destinasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowMap(!showMap)} className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              {showMap ? "Sembunyikan Peta" : "Lihat Peta"}
            </Button>
          </div>

          {/* Map View */}
          {showMap && (
            <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">Peta Destinasi Sangihe</p>
                <p className="text-sm text-slate-500">Klik pin untuk melihat detail destinasi</p>
              </div>
            </div>
          )}

          {/* Destination Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDestinations.map((destination) => (
              <Card
                key={destination.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected(destination.id) ? "ring-2 ring-sky-500 bg-sky-50" : ""
                }`}
                onClick={() => toggleDestination(destination)}
              >
                <div className="relative">
                  <div className="relative h-32 overflow-hidden rounded-t-lg">
                    <Image
                      src={destination.imageUrl || "/placeholder.svg"}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-emerald-500">{destination.category}</Badge>
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={isSelected(destination.id)}
                        onChange={() => {}} // Handled by card click
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1">{destination.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{destination.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{destination.rating}</span>
                    </div>
                    <div className="flex items-center text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {!destination.price || destination.price === 0
                          ? "Gratis"
                          : `${destination.price?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  {/* Durasi dihapus karena tidak tersedia pada data API */}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Destinations */}
      {data.selectedDestinations.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800">
              Destinasi Terpilih ({data.selectedDestinations.length})
            </h3>
            <p className="text-sm text-slate-600">Seret untuk mengatur urutan kunjungan</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.selectedDestinations.map((destination, index) => (
                <div
                  key={destination.id}
                  className="flex items-center gap-4 p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="cursor-move">
                    <GripVertical className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-3 flex-1">
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
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDestination(destination.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Kembali
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="bg-sky-500 hover:bg-sky-600">
          Selanjutnya ({data.selectedDestinations.length} destinasi)
        </Button>
      </div>
    </div>
  )
}

