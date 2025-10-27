"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - shared across admin pages */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SANGIHETRIP</h1>
                  <Badge variant="secondary" className="text-xs">
                    ADMIN
                  </Badge>
                </div>
              </div>

              <nav className="hidden md:flex space-x-6">
                <Button asChild variant="ghost" className="text-blue-600 bg-blue-50">
                  <Link href="/admin">Dashboard</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/users">Users</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/destinations">Destinations</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/articles">Articles</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/reviews">Reviews</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/admin/analytics">Analytics</Link>
                </Button>
              </nav>
            </div>

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
      </header>

      <main>{children}</main>
    </div>
  );
}
