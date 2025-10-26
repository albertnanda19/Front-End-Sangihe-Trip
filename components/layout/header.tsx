"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { deleteCookie } from "@/lib/cookies";
import { SiteLogo } from "@/components/site-logo";
import { NAV_ITEMS } from "@/lib/constants/site";
import { ROUTES } from "@/lib/constants/routes";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAuthStatus();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    window.dispatchEvent(new Event("auth-change"));
    router.push(ROUTES.home);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <SiteLogo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Authentication Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="text-sky-600 hover:bg-sky-50"
                    onClick={() => router.push(ROUTES.dashboard)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-sky-500 text-sky-600 hover:bg-sky-50 cursor-pointer"
                  onClick={() => router.push(ROUTES.login)}
                >
                  Masuk
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </>
  );
};

export default Header;
