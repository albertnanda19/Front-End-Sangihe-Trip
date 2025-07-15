"use client"

import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Articles from "./_components/Articles";
import Destinations from "./_components/Destinations";
import SearchDestination from "./_components/SearchDestination";
import Hero from "./_components/Hero";

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
      {hero && <Hero hero={hero} />}

      {/* Search Section */}
      {filters.length > 0 && <SearchDestination filters={filters} />}

      {/* Destinasi Unggulan */}
      {destinations.length > 0 && <Destinations destinations={destinations} />}

      {/* Artikel Terbaru */}
      {articles.length > 0 && <Articles articles={articles} />}

      <Footer />
    </div>
  );
}
