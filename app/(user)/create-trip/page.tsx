"use client"

import { useState } from "react"
import { apiUrl } from "@/lib/api"
import { getCookie } from "@/lib/cookies"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Check, MapPin, Calendar, DollarSign, FileText } from "lucide-react"
import Link from "next/link"
import { BasicInfoStep } from "@/components/trip-planner/basic-info-step"
import { DestinationStep } from "@/components/trip-planner/destination-step"
import { ScheduleStep } from "@/components/trip-planner/schedule-step"
import { BudgetStep } from "@/components/trip-planner/budget-step"
import { ReviewStep } from "@/components/trip-planner/review-step"
import { TripSummaryCard } from "@/components/trip-planner/trip-summary-card"
import { SuccessPage } from "@/components/trip-planner/success-page"

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

export interface ScheduleDay {
  day: number
  items: Omit<ScheduleItem, 'id' | 'day'>[]
}

export interface TripData {
  // Basic Info
  tripName: string
  startDate: Date | null
  endDate: Date | null
  peopleCount: number
  tripType: string

  // Destinations
  selectedDestinations: Destination[]

  // Schedule
  schedule: ScheduleItem[]

  // Budget & Notes
  budget: {
    transport: number
    lodging: number
    food: number
    activities: number
  }
  notes: string
  packingList: string[]

  // Settings
  isPublic: boolean
}

const steps = [
  { id: 1, title: "Info Dasar", icon: FileText },
  { id: 2, title: "Pilih Destinasi", icon: MapPin },
  { id: 3, title: "Atur Jadwal", icon: Calendar },
  { id: 4, title: "Budget & Catatan", icon: DollarSign },
  { id: 5, title: "Review", icon: Check },
]

export default function CreateTripPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [tripData, setTripData] = useState<TripData>({
    tripName: "",
    startDate: null,
    endDate: null,
    peopleCount: 1,
    tripType: "",
    selectedDestinations: [],
    schedule: [],
    budget: {
      transport: 0,
      lodging: 0,
      food: 0,
      activities: 0,
    },
    notes: "",
    packingList: [],
    isPublic: false,
  })

  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 5) {
      // Clean invalid schedule items when moving to schedule step
      if (currentStep === 2) {
        const validDestinationIds = tripData.selectedDestinations.map(d => d.id)
        const cleanSchedule = tripData.schedule.filter((item: ScheduleItem) => 
          validDestinationIds.includes(item.destinationId)
        )
        if (cleanSchedule.length !== tripData.schedule.length) {
          updateTripData({ schedule: cleanSchedule })
        }
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      const accessToken = getCookie("access_token")
      if (!accessToken) throw new Error("Pengguna belum login")

      // --- Client-side validations ---
      if (tripData.selectedDestinations.length === 0) {
        setSubmitError("Anda belum memilih destinasi apa pun. Silakan pilih minimal satu destinasi.")
        setIsSubmitting(false)
        return
      }

      if (tripData.schedule.length === 0) {
        setSubmitError("Jadwal perjalanan tidak boleh kosong. Tambahkan minimal satu aktivitas.")
        setIsSubmitting(false)
        return
      }

      // Transform TripData to API payload
      const payload = {
        name: tripData.tripName,
        startDate: tripData.startDate ? format(tripData.startDate, "yyyy-MM-dd") : null,
        endDate: tripData.endDate ? format(tripData.endDate, "yyyy-MM-dd") : null,
        peopleCount: tripData.peopleCount,
        tripType: tripData.tripType,
        isPublic: tripData.isPublic,
        destinations: tripData.selectedDestinations.map((d: Destination) => d.id),
        schedule: tripData.schedule.reduce((acc: ScheduleDay[], item: ScheduleItem) => {
          const dayObj = acc.find((d) => d.day === item.day)
          
          if (!item.destinationId) {
            return acc
          }
          
          const entry = {
            destinationId: item.destinationId,
            startTime: item.startTime,
            endTime: item.endTime,
            activity: item.activity,
            notes: item.notes,
          }
          
          if (dayObj) {
            dayObj.items.push(entry)
          } else {
            acc.push({ day: item.day, items: [entry] })
          }
          return acc
        }, []),
        budget: tripData.budget,
        notes: tripData.notes,
        packingList: tripData.packingList,
      }

      console.log("=== DEBUG: Trip Data ===")
      console.log("tripData.selectedDestinations:", tripData.selectedDestinations)
      console.log("tripData.schedule:", tripData.schedule)
      console.log("=== DEBUG: Final Payload ===")
      console.log(JSON.stringify(payload, null, 2))

      const res = await fetch(apiUrl("/api/trips"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => null)
        let msg = "Gagal menyimpan rencana"
        if (errJson?.message) {
          msg = Array.isArray(errJson.message) ? errJson.message.join("\n") : errJson.message
        }
        throw new Error(msg)
      }

      setIsCompleted(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
      setSubmitError(msg)
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
            onComplete={handleComplete}
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

  if (isCompleted) {
    return <SuccessPage tripData={tripData} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/beranda" className="flex items-center text-slate-600 hover:text-sky-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali ke Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                  SANGIHETRIP
                </span>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-lg font-semibold text-slate-800">Buat Rencana Perjalanan</h1>
              <p className="text-sm text-slate-600">
                Langkah {currentStep} dari {steps.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              const Icon = step.icon

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "bg-white border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? "text-sky-600" : "text-gray-500"}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? "bg-green-500" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">{renderStep()}</div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TripSummaryCard tripData={tripData} />
          </div>
        </div>
      </div>
    </div>
  )
}
