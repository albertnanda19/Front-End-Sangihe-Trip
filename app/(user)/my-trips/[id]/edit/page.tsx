"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiUrl } from "@/lib/api"
import { getCookie } from "@/lib/cookies"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Check, MapPin, Calendar, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { BasicInfoStep } from "@/components/create-trip/basic-info-step"
import { DestinationStep } from "@/components/create-trip/destination-step"
import { ScheduleStep } from "@/components/create-trip/schedule-step"
import { BudgetStep } from "@/components/create-trip/budget-step"
import { ReviewStep } from "@/components/create-trip/review-step"
import { TripSummaryCard } from "@/components/create-trip/trip-summary-card"
import { toast } from "sonner"

export interface Destination {
  id: string
  name: string
  category?: string
  location?: string
  price?: number
  rating?: number
  imageUrl?: string
}

export interface ScheduleItem {
  id?: string
  day: number
  destinationId: string
  destinationName?: string
  startTime: string
  endTime: string
  activity: string
  notes?: string
}

export interface TripData {
  tripName: string
  startDate: Date | null
  endDate: Date | null
  peopleCount: number
  tripType: string
  selectedDestinations: Destination[]
  schedule: ScheduleItem[]
  budget: {
    transport: number
    lodging: number
    food: number
    activities: number
  }
  notes: string
  packingList: string[]
  isPublic: boolean
}

const steps = [
  { id: 1, title: "Info Dasar", icon: FileText },
  { id: 2, title: "Pilih Destinasi", icon: MapPin },
  { id: 3, title: "Atur Jadwal", icon: Calendar },
  { id: 4, title: "Budget & Catatan", icon: DollarSign },
  { id: 5, title: "Review", icon: Check },
]

export default function EditTripPage() {
  const params = useParams() as { id?: string }
  const id = params?.id
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const [tripData, setTripData] = useState<TripData>({
    tripName: "",
    startDate: null,
    endDate: null,
    peopleCount: 1,
    tripType: "",
    selectedDestinations: [],
    schedule: [],
    budget: { transport: 0, lodging: 0, food: 0, activities: 0 },
    notes: "",
    packingList: [],
    isPublic: false,
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(apiUrl(`/api/trip/${id}`), { cache: "no-store" })
        if (!res.ok) throw new Error("Gagal memuat data rencana")
        const json = await res.json()
        const data = json.data

        const selectedDestinations: Destination[] = (data.destinations || []).map((d: any) => ({
          id: d.id,
          name: d.name || d.title || "",
          imageUrl: d.image || undefined,
        }))

        const schedule: ScheduleItem[] = (data.schedule || []).flatMap((day: any) =>
          (day.items || []).map((it: any) => ({
            day: day.day,
            destinationId: it.destinationId,
            destinationName: it.destinationName || undefined,
            startTime: it.startTime,
            endTime: it.endTime,
            activity: it.activity,
            notes: it.notes || "",
          }))
        )

        if (!cancelled) {
          setTripData({
            tripName: data.name || "",
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            peopleCount: data.peopleCount || 1,
            tripType: data.tripType || "",
            selectedDestinations,
            schedule,
            budget: {
              transport: data.budget?.transport || 0,
              lodging: data.budget?.lodging || 0,
              food: data.budget?.food || 0,
              activities: data.budget?.activities || 0,
            },
            notes: data.notes || "",
            packingList: data.packingList || [],
            isPublic: Boolean(data.isPublic),
          })
          setLoaded(true)
        }
      } catch (err) {
        console.error(err)
        toast.error("Gagal memuat data rencana")
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }
  const goToStep = (step: number) => setCurrentStep(step)

  const handleSave = async () => {
    if (!id) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const accessToken = getCookie("access_token")
      if (!accessToken) throw new Error("Pengguna belum login")

      if (tripData.selectedDestinations.length === 0) {
        setSubmitError("Anda belum memilih destinasi. Tambahkan minimal satu destinasi.")
        setIsSubmitting(false)
        return
      }

      const payload: any = {
        name: tripData.tripName,
        startDate: tripData.startDate ? format(tripData.startDate, "yyyy-MM-dd") : null,
        endDate: tripData.endDate ? format(tripData.endDate, "yyyy-MM-dd") : null,
        peopleCount: tripData.peopleCount,
        tripType: tripData.tripType,
        isPublic: tripData.isPublic,
        destinations: tripData.selectedDestinations.map((d) => d.id),
        schedule: tripData.schedule.reduce((acc: any[], item) => {
          const dayObj = acc.find((d) => d.day === item.day)
          const entry = {
            destinationId: item.destinationId,
            startTime: item.startTime,
            endTime: item.endTime,
            activity: item.activity,
            notes: item.notes,
          }
          if (dayObj) dayObj.items.push(entry)
          else acc.push({ day: item.day, items: [entry] })
          return acc
        }, []),
        budget: tripData.budget,
        notes: tripData.notes,
        packingList: tripData.packingList,
      }

      const res = await fetch(apiUrl(`/api/users/me/trips/${id}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => null)
        const msg = errJson?.message || "Gagal menyimpan perubahan"
        throw new Error(Array.isArray(msg) ? msg.join("\n") : msg)
      }

      toast.success("Perubahan rencana berhasil disimpan")
      router.push(`/my-trips/${id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={tripData} updateData={updateTripData} onNext={nextStep} />
      case 2:
        return <DestinationStep data={tripData} updateData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <ScheduleStep data={tripData} updateData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <BudgetStep data={tripData} updateData={updateTripData} onNext={nextStep} onPrev={prevStep} />
      case 5:
        return (
          <ReviewStep
            data={tripData}
            updateData={updateTripData}
            onComplete={handleSave}
            onPrev={prevStep}
            onEdit={goToStep}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )
      default:
        return null
    }
  }

  if (!loaded) {
    return <p className="text-center text-slate-600">Memuat rencana...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/beranda" className="flex items-center text-slate-600 hover:text-sky-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">SANGIHETRIP</span>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-semibold text-slate-800">Edit Rencana Perjalanan</h1>
              <p className="text-sm text-slate-600">Langkah {currentStep} dari {steps.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const Icon = step.icon

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted ? "bg-green-500 border-green-500 text-white" : isActive ? "bg-sky-500 border-sky-500 text-white" : "bg-white border-gray-300 text-gray-400"}`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? "text-sky-600" : "text-gray-500"}`}>{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-300"}`} />}
                </div>
              )
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">{renderStep()}</div>
          <div className="lg:col-span-1">
            <TripSummaryCard tripData={tripData} />
            <div className="mt-4">
              <button onClick={() => router.push(`/my-trips/${id}`)} className="w-full text-left text-slate-600 hover:text-sky-600">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
