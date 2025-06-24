import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden z-0">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/70 to-emerald-900/50">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Pantai Sangihe"
            fill
            className="object-cover -z-10"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Rencanakan Perjalananmu ke{" "}
            <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Surga Tropis Sangihe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-sky-100 max-w-2xl mx-auto">
            Temukan destinasi tersembunyi, budaya lokal, dan kuliner khas di kepulauan yang memukau
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
              Mulai Rencana
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white  hover:text-slate-500 text-slate-900 px-8 py-3 text-lg"
            >
              Lihat Destinasi
            </Button>
          </div>
        </div>
      </section>
  )
}

export default Hero