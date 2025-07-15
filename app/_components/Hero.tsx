"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { HeroData } from "@/hooks/use-landing-page";

interface HeroProps {
  hero: HeroData;
}

const Hero: React.FC<HeroProps> = ({ hero }) => {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden z-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/70 to-emerald-900/50">
        {hero.backgroundImage && (
          <Image
            src={hero.backgroundImage}
            alt={hero.title}
            fill
            className="object-cover -z-10"
          />
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {hero.title}{" "}
          <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
            {hero.highlight}
          </span>
        </h1>
        {hero.subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-sky-100 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        )}
        {hero.ctas?.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hero.ctas.map((cta) => (
              <Button
                key={cta.label}
                size="lg"
                variant={cta.type === "outline" ? "outline" : "default"}
                className={
                  cta.type === "outline"
                    ? "border-white  hover:text-slate-500 text-slate-900 px-8 py-3 text-lg"
                    : "cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
                }
                asChild
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
