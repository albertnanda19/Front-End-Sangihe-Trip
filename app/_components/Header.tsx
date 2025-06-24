"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-30">
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
            <Link href="/" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">
              Beranda
            </Link>
            <Link href="/destinasi" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">
              Destinasi
            </Link>
            {/* <Link href="/" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">
              Rencana Perjalanan
            </Link> */}
            <Link href="/artikel" className="text-slate-700 hover:text-sky-600 font-medium transition-colors">
              Artikel
            </Link>
            <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
              Login
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
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