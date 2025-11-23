"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import type { HeroData, ArticleData, DestinationData } from "@/hooks/use-landing-page";

interface HeroSectionProps {
  hero: HeroData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
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

interface ArticlesSectionProps {
  articles: ArticleData[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Artikel Terbaru</h2>
          <p className="text-xl text-slate-600">
            Tips dan panduan perjalanan untuk pengalaman terbaik di Sangihe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(article.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

interface DestinationsSectionProps {
  destinations: DestinationData[];
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({ destinations }) => {
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
                    src={(destination.images && destination.images.length > 0 ? destination.images[0].image_url : "/placeholder.svg")}
                    alt={destination.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-md flex items-center gap-1 text-sm font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    {destination.rating.toFixed(1)}
                  </div>
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

interface SearchSectionProps {
  filters: string[];
}

export const SearchSection: React.FC<SearchSectionProps> = ({ filters }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Cari destinasi wisata..."
              className="pl-12 py-4 text-lg border-2 border-sky-200 focus:border-sky-500 rounded-xl"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={filter.toLowerCase() === "semua" ? "default" : "outline"}
                className={
                  filter.toLowerCase() === "semua"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "border-sky-200 text-slate-600 hover:bg-sky-50"
                }
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
