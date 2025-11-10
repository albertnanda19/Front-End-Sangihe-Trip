"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { format, addDays, differenceInDays } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import type { TripData, ScheduleItem } from "@/app/(user)/create-trip/page"
import { Input } from "@/components/ui/input"

interface DestinationActivity {
  name: string
  startTime: string
  endTime: string
}

interface ScheduleStepProps {
  data: TripData
  updateData: (data: Partial<TripData>) => void
  onNext: () => void
  onPrev: () => void
}

const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

export function ScheduleStep({ data, updateData, onNext, onPrev }: ScheduleStepProps) {
  const [selectedDay, setSelectedDay] = useState(1)
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [destinationActivities, setDestinationActivities] = useState<Record<string, DestinationActivity[]>>({})
  const [loadingActivities, setLoadingActivities] = useState(false)
  
  const [newActivity, setNewActivity] = useState({
    destinationId: "",
    startTime: "",
    endTime: "",
    activity: "",
    activityName: "",
    notes: "",
  })

  useEffect(() => {
    const fetchActivities = async (destinationId: string) => {
      if (!destinationId || destinationActivities[destinationId]) return

      const destination = data.selectedDestinations.find((dest) => dest.id === destinationId)
      if (!destination?.slug) {
        console.warn('No slug found for destination:', destinationId)
        return
      }

      setLoadingActivities(true)
      try {
        const response = await fetch(`http://localhost:8000/api/destination/id/${destination.slug}`)
        if (response.ok) {
          const result = await response.json()
          if (result.data?.activities && Array.isArray(result.data.activities)) {
            setDestinationActivities(prev => ({
              ...prev,
              [destinationId]: result.data.activities
            }))
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoadingActivities(false)
      }
    }

    if (newActivity.destinationId) {
      fetchActivities(newActivity.destinationId)
    }
  }, [newActivity.destinationId, destinationActivities, data.selectedDestinations])

  const tripDays = data.startDate && data.endDate ? differenceInDays(data.endDate, data.startDate) + 1 : 0

  const getDayDate = (dayNumber: number) => {
    if (!data.startDate) return null
    return addDays(data.startDate, dayNumber - 1)
  }

  const getDaySchedule = (day: number) => {
    return data.schedule.filter((item: ScheduleItem) => item.day === day)
  }

  const addActivity = () => {
    if (!newActivity.destinationId || !newActivity.startTime || !newActivity.endTime || !newActivity.activityName) {
      alert("Harap lengkapi semua field yang wajib diisi")
      return
    }

    console.log("Adding activity with destinationId:", newActivity.destinationId)
    console.log("Selected destinations:", data.selectedDestinations)

    const newActivityItem: ScheduleItem = {
      id: Date.now().toString(),
      destinationId: newActivity.destinationId,
      day: selectedDay,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      activity: newActivity.activity || newActivity.activityName,
      activityName: newActivity.activityName,
      notes: newActivity.notes,
    }

    console.log("Created activity item:", newActivityItem)

    const newSchedule = [...data.schedule, newActivityItem]
    updateData({ schedule: newSchedule })
    setShowAddActivity(false)
    
    setNewActivity({
      destinationId: "",
      startTime: "",
      endTime: "",
      activity: "",
      activityName: "",
      notes: "",
    })
  }

  const removeActivity = (activityId: string) => {
    const newSchedule = data.schedule.filter((item: ScheduleItem) => item.id !== activityId)
    updateData({ schedule: newSchedule })
  }

  const getDestinationById = (id: string) => {
    return data.selectedDestinations.find((dest) => dest.id === id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Atur Jadwal</h2>
              <p className="text-slate-600">Susun itinerary harian untuk perjalanan Anda</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => {
              const dayDate = getDayDate(day)
              const daySchedule = getDaySchedule(day)

              return (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  className={`flex-shrink-0 h-auto p-3 flex flex-col items-center gap-1 ${
                    selectedDay === day ? "bg-sky-500 hover:bg-sky-600" : ""
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <span className="text-sm font-medium">Hari {day}</span>
                  {dayDate && <span className="text-xs opacity-80">{format(dayDate, "dd MMM", { locale: id })}</span>}
                  {daySchedule.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {daySchedule.length} aktivitas
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Selected Day Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Hari {selectedDay} -{" "}
                {getDayDate(selectedDay) && format(getDayDate(selectedDay)!, "EEEE, dd MMMM yyyy", { locale: id })}
              </h3>
              <Button onClick={() => setShowAddActivity(true)} className="bg-sky-500 hover:bg-sky-600">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Aktivitas
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {getDaySchedule(selectedDay).length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada aktivitas untuk hari ini</p>
                  <p className="text-sm">Klik &quot;Tambah Aktivitas&quot; untuk memulai</p>
                </div>
              ) : (
                getDaySchedule(selectedDay)
                  .sort((a: ScheduleItem, b: ScheduleItem) => a.startTime.localeCompare(b.startTime))
                  .map((activity: ScheduleItem) => {
                    const destination = getDestinationById(activity.destinationId)

                    return (
                      <div key={activity.id} className="flex items-center gap-4 p-4 bg-white border rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-medium text-slate-800">{activity.startTime}</div>
                          <div className="text-xs text-slate-500">-</div>
                          <div className="text-sm font-medium text-slate-800">{activity.endTime}</div>
                        </div>

                        <div className="w-px h-16 bg-slate-200" />

                        <div className="flex items-center gap-3 flex-1">
                          {destination && (
                            <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={destination.imageUrl || "/placeholder.svg"}
                                alt={destination.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800">{activity.activity}</h4>
                            {destination && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <MapPin className="w-3 h-3" />
                                <span>{destination.name}</span>
                              </div>
                            )}
                            {activity.notes && <p className="text-sm text-slate-500 mt-1">{activity.notes}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => activity.id && removeActivity(activity.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>

          {/* Add Activity Form */}
          {showAddActivity && (
            <Card className="border-sky-200 bg-sky-50">
              <CardHeader>
                <h4 className="font-semibold text-sky-800">Tambah Aktivitas Baru</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Destinasi *</label>
                  <Select 
                    value={newActivity.destinationId} 
                    onValueChange={(value) => setNewActivity(prev => ({ 
                      ...prev, 
                      destinationId: value,
                      activityName: "", // Reset activity when destination changes
                      startTime: "",
                      endTime: ""
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih destinasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.selectedDestinations.map((dest) => (
                        <SelectItem key={dest.id} value={dest.id}>
                          {dest.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newActivity.destinationId && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Aktivitas *</label>
                      {loadingActivities ? (
                        <div className="text-sm text-slate-500">Memuat aktivitas...</div>
                      ) : destinationActivities[newActivity.destinationId]?.length > 0 ? (
                        <Select 
                          value={newActivity.activityName} 
                          onValueChange={(value) => {
                            const selectedActivity = destinationActivities[newActivity.destinationId]?.find(
                              act => act.name === value
                            )
                            setNewActivity(prev => ({
                              ...prev,
                              activityName: value,
                              activity: value,
                              startTime: selectedActivity?.startTime || prev.startTime,
                              endTime: selectedActivity?.endTime || prev.endTime
                            }))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih aktivitas" />
                          </SelectTrigger>
                          <SelectContent>
                            {destinationActivities[newActivity.destinationId].map((act) => (
                              <SelectItem key={act.name} value={act.name}>
                                {act.name} ({act.startTime} - {act.endTime})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-slate-500 p-3 bg-slate-100 rounded">
                          Tidak ada aktivitas tersedia untuk destinasi ini.
                        </div>
                      )}
                    </div>

                    {newActivity.activityName && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Waktu Mulai *</label>
                            <Select value={newActivity.startTime} onValueChange={(value) => setNewActivity(prev => ({ ...prev, startTime: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih waktu" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Waktu Selesai *</label>
                            <Select value={newActivity.endTime} onValueChange={(value) => setNewActivity(prev => ({ ...prev, endTime: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih waktu" />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Nama Custom (opsional)</label>
                          <Input
                            placeholder="Kosongkan jika menggunakan nama aktivitas default"
                            value={newActivity.activity === newActivity.activityName ? "" : newActivity.activity}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, activity: e.target.value || prev.activityName }))}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Anda bisa mengubah nama aktivitas sesuai kebutuhan
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-2 block">Catatan</label>
                          <Input
                            placeholder="Catatan tambahan (opsional)"
                            value={newActivity.notes}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="flex gap-2">
                  <Button onClick={() => setShowAddActivity(false)} variant="outline">
                    Batal
                  </Button>
                  <Button
                    onClick={addActivity}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    Tambah Aktivitas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Kembali
        </Button>
        <Button 
          onClick={onNext} 
          className="bg-sky-500 hover:bg-sky-600"
          disabled={data.schedule.length === 0}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
