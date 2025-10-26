"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { logout } from "@/lib/auth";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useUserProfile();

  const isActive = (href: string) => {
    if (href === "/beranda") return pathname === "/beranda";
    return pathname.startsWith(href);
  };

  const userName = profile?.name || "Pengguna";
  const userAvatar = profile?.avatar || "/placeholder.svg";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (shared) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHE TRIP
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/beranda"
                className={`font-medium transition-colors ${isActive("/beranda") ? "text-sky-600" : "text-slate-700 hover:text-sky-600"}`}
              >
                Dashboard
              </Link>
              <Link
                href="/my-trips"
                className={`font-medium transition-colors ${isActive("/my-trips") ? "text-sky-600" : "text-slate-700 hover:text-sky-600"}`}
              >
                Rencana Saya
              </Link>
              <Link
                href="/reviews"
                className={`font-medium transition-colors ${isActive("/reviews") ? "text-sky-600" : "text-slate-700 hover:text-sky-600"}`}
              >
                Review Saya
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative hidden sm:inline-flex" aria-label="Notifikasi">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{userName}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profil" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button onClick={() => logout("/beranda")} className="flex items-center w-full text-left">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Buka menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-2 flex flex-col">
              <Link
                href="/beranda"
                className={`py-2 ${isActive("/beranda") ? "text-sky-600 font-medium" : "text-slate-700"}`}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/my-trips"
                className={`py-2 ${isActive("/my-trips") ? "text-sky-600 font-medium" : "text-slate-700"}`}
                onClick={() => setMobileOpen(false)}
              >
                Rencana Saya
              </Link>
              <Link
                href="/reviews"
                className={`py-2 ${isActive("/reviews") ? "text-sky-600 font-medium" : "text-slate-700"}`}
                onClick={() => setMobileOpen(false)}
              >
                Review Saya
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main content container */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
