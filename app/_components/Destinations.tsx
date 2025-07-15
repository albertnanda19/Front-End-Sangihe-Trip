"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge, MapPin, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

import type { DestinationData } from "@/hooks/use-landing-page";

interface Props {
  destinations: DestinationData[];
}

const Destinations: React.FC<Props> = ({ destinations }) => {
  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Destinasi Unggulan</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Jelajahi keindahan alam dan budaya Kepulauan Sangihe yang menawan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card
              key={destination.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {destination.rating.toFixed(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-slate-800 mb-2">{destination.name}</h3>
                <div className="flex items-center text-slate-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{destination.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-emerald-600">{destination.price}</span>
                  <span className="text-sm text-slate-500">per orang</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-sky-500 hover:bg-sky-600">Lihat Detail</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;