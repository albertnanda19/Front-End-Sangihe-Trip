"use client"

import React from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  HeroSection, 
  ArticlesSection, 
  DestinationsSection, 
  SearchSection 
} from "@/components/homepage";

import { useLandingPage } from "@/hooks/use-landing-page";

export default function HomePage() {
  const { hero, filters, destinations, articles, loading, error } = useLandingPage();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      {hero && <HeroSection hero={hero} />}

      {/* Search Section */}
      {filters.length > 0 && <SearchSection filters={filters} />}

      {/* Destinasi Unggulan */}
      {destinations.length > 0 && <DestinationsSection destinations={destinations} />}

      {/* Artikel Terbaru */}
      {articles.length > 0 && <ArticlesSection articles={articles} />}

      <Footer />
    </div>
  );
}
