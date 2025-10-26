"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowLeft,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const popularDestinations = [
    {
      name: "Pantai Mahoro",
      location: "Pulau Sangihe",
      rating: 4.8,
      price: "Rp 150.000",
      image: "/placeholder.svg?height=200&width=300",
      href: "/destinations/pantai-mahoro",
    },
    {
      name: "Pulau Siau",
      location: "Kepulauan Sangihe",
      rating: 4.9,
      price: "Rp 200.000",
      image: "/placeholder.svg?height=200&width=300",
      href: "/destinations/pulau-siau",
    },
    {
      name: "Gunung Api Karangetang",
      location: "Pulau Siau",
      rating: 4.7,
      price: "Rp 300.000",
      image: "/placeholder.svg?height=200&width=300",
      href: "/destinations/gunung-karangetang",
    },
    {
      name: "Pantai Petta",
      location: "Pulau Sangihe",
      rating: 4.6,
      price: "Rp 120.000",
      image: "/placeholder.svg?height=200&width=300",
      href: "/destinations/pantai-petta",
    },
  ];

  const recentArticles = [
    {
      title: "10 Pantai Tersembunyi di Kepulauan Sangihe",
      excerpt:
        "Jelajahi pantai-pantai eksotis yang belum banyak dikunjungi wisatawan...",
      date: "15 Desember 2024",
      image: "/placeholder.svg?height=150&width=250",
      href: "/articles/pantai-tersembunyi-sangihe",
    },
    {
      title: "Kuliner Khas Sangihe yang Wajib Dicoba",
      excerpt:
        "Dari ikan bakar hingga kelapa muda, nikmati cita rasa autentik Sangihe...",
      date: "12 Desember 2024",
      image: "/placeholder.svg?height=150&width=250",
      href: "/articles/kuliner-khas-sangihe",
    },
    {
      title: "Panduan Lengkap Mendaki Gunung Karangetang",
      excerpt:
        "Tips aman dan persiapan untuk mendaki gunung api aktif yang menawan...",
      date: "10 Desember 2024",
      image: "/placeholder.svg?height=150&width=250",
      href: "/articles/panduan-mendaki-karangetang",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <span className="text-red-500">404 - Halaman Tidak Ditemukan</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Illustration */}
          <div className="mb-8">
            <div className="relative w-80 h-80 mx-auto mb-6">
              {/* Custom 404 Island Illustration */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-sky-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                {/* Island */}
                <div className="w-32 h-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full relative">
                  {/* Palm Trees */}
                  <div className="absolute -top-8 left-4">
                    <div className="w-2 h-8 bg-amber-700 rounded-full"></div>
                    <div className="absolute -top-2 -left-2 w-6 h-4 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="absolute -top-6 right-6">
                    <div className="w-2 h-6 bg-amber-700 rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-4 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* 404 Text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-8xl font-bold text-sky-300 opacity-50">
                  404
                </span>
              </div>
              {/* Confused Mascot */}
              <div className="absolute bottom-8 right-8">
                <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤔</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Messages */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Oops! Halaman Tidak Ditemukan
            </h1>
            <p className="text-xl text-slate-600 mb-2">
              Sepertinya Anda tersesat di lautan digital 🌊
            </p>
            <p className="text-lg text-slate-500">
              Halaman yang Anda cari mungkin telah dipindahkan atau tidak ada
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="mb-8">
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="mr-4 mb-4 border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SANGIHETRIP</span>
              </div>
              <p className="text-slate-300 mb-4">
                Platform terpercaya untuk merencanakan perjalanan wisata ke
                Kepulauan Sangihe.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link
                    href="/destinasi"
                    className="text-slate-300 hover:text-white"
                  >
                    Destinasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-trip"
                    className="text-slate-300 hover:text-white"
                  >
                    Paket Wisata
                  </Link>
                </li>
                <li>
                  <Link
                    href="/artikel"
                    className="text-slate-300 hover:text-white"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">info@sangihetrip.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-1" />
                  <span className="text-slate-300">
                    Tahuna, Kepulauan Sangihe, Sulawesi Utara
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 SANGIHETRIP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
