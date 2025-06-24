import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {  Star, MapPin, Calendar, Phone, Mail, Facebook, Instagram, Twitter, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "./_components/Header"
import Footer from "./_components/Footer"
import Articles from "./_components/Articles"
import Destinations from "./_components/Destinations"
import SearchDestination from "./_components/SearchDestination"
import Hero from "./_components/Hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Search Section */}
      <SearchDestination />

      {/* Destinasi Unggulan */}
      <Destinations />

      {/* Artikel Terbaru */}
      <Articles />

      {/* Footer */}
      <Footer />
    </div>
  )
}
