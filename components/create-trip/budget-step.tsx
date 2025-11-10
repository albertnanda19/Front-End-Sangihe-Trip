"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign, Plane, Plus, X } from "lucide-react"
import type { TripData } from "@/app/(user)/create-trip/page"

interface BudgetStepProps {
  data: TripData
  updateData: (data: Partial<TripData>) => void
  onNext: () => void
  onPrev: () => void
}

const defaultPackingItems = [
  "Pakaian sesuai cuaca",
  "Kamera/HP untuk foto",
  "Sunscreen & topi",
  "Obat-obatan pribadi",
  "Charger & power bank",
  "Dokumen perjalanan",
  "Uang tunai",
  "Sepatu yang nyaman",
]

export function BudgetStep({ data, updateData, onNext, onPrev }: BudgetStepProps) {
  const [customPackingItem, setCustomPackingItem] = useState("")

  const updateBudget = (category: keyof typeof data.budget, value: number) => {
    updateData({
      budget: {
        ...data.budget,
        [category]: value,
      },
    })
  }

  const totalBudget = Object.values(data.budget).reduce((sum, value) => sum + value, 0)
  const budgetPerPerson = data.peopleCount > 0 ? totalBudget / data.peopleCount : 0

  const addPackingItem = () => {
    if (customPackingItem.trim()) {
      const newPackingList = [...data.packingList, customPackingItem.trim()]
      updateData({ packingList: newPackingList })
      setCustomPackingItem("")
    }
  }

  const removePackingItem = (index: number) => {
    const newPackingList = data.packingList.filter((_, i) => i !== index)
    updateData({ packingList: newPackingList })
  }

  const toggleDefaultItem = (item: string, checked: boolean) => {
    if (checked) {
      const newPackingList = [...data.packingList, item]
      updateData({ packingList: newPackingList })
    } else {
      const newPackingList = data.packingList.filter((packingItem) => packingItem !== item)
      updateData({ packingList: newPackingList })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Budget & Catatan</h2>
              <p className="text-slate-600">Atur anggaran dan persiapan perjalanan Anda</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Budget Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Rincian Budget</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Transport */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-sky-500" />
                  Transportasi
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">Rp</span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={data.budget.transport || ""}
                    onChange={(e) => updateBudget("transport", Number.parseInt(e.target.value) || 0)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-slate-50 border rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-600">Total Budget</p>
                  <p className="text-lg font-bold text-slate-800">Rp {totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Per Orang</p>
                  <p className="text-lg font-bold text-emerald-600">Rp {budgetPerPerson.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Jumlah Orang</p>
                  <p className="text-lg font-bold text-sky-600">{data.peopleCount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Durasi</p>
                  <p className="text-lg font-bold text-purple-600">
                    {data.startDate && data.endDate
                      ? Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 0}{" "}
                    hari
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Pribadi</Label>
            <Textarea
              id="notes"
              placeholder="Tulis catatan, preferensi, atau hal penting lainnya untuk perjalanan ini..."
              value={data.notes}
              onChange={(e) => updateData({ notes: e.target.value })}
              rows={4}
            />
          </div>

          {/* Packing Checklist */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Daftar Packing</h3>

            {/* Default Items */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700">Item Umum</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {defaultPackingItems.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={data.packingList.includes(item)}
                      onCheckedChange={(checked) => toggleDefaultItem(item, checked as boolean)}
                    />
                    <Label htmlFor={item} className="text-sm">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Items */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700">Item Tambahan</h4>

              {/* Add Custom Item */}
              <div className="flex gap-2">
                <Input
                  placeholder="Tambah item packing..."
                  value={customPackingItem}
                  onChange={(e) => setCustomPackingItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPackingItem()}
                />
                <Button onClick={addPackingItem} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Custom Items List */}
              {data.packingList.filter((item) => !defaultPackingItems.includes(item)).length > 0 && (
                <div className="space-y-2">
                  {data.packingList
                    .filter((item) => !defaultPackingItems.includes(item))
                    .map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white border rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePackingItem(data.packingList.indexOf(item))}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Kembali
        </Button>
        <Button onClick={onNext} className="bg-sky-500 hover:bg-sky-600">
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}
