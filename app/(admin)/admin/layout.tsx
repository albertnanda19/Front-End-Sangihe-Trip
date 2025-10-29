"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/site";
import { useAdminNavigation } from "@/hooks/admin/use-admin-navigation";
import { isAuthenticated, isAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Shield, Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { navItems, isActive } = useAdminNavigation();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/masuk");
      return;
    }

    if (!isAdmin()) {
      router.push("/beranda");
      return;
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={isActive(item.href) ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <Link href="/admin" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    {SITE_CONFIG.fullName}
                  </h1>
                  <Badge variant="secondary" className="text-xs hidden sm:inline-block">
                    ADMIN
                  </Badge>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-1">
                <NavItems />
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <span>{SITE_CONFIG.fullName} Admin</span>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 space-y-2">
                    <NavItems mobile />
                  </nav>
                </SheetContent>
              </Sheet>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>System Settings</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
