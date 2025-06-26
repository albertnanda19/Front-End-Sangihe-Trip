"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3,
    },
  },
  open: {
    x: "0%",
    transition: {
      type: "tween",
      ease: "easeInOut",
      duration: 0.3,
    },
  },
};

const navLinks = [
  { href: "#", label: "Beranda" },
  { href: "#", label: "Destinasi" },
  { href: "#", label: "Artikel" },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 bg-slate-900/95 text-slate-50 z-50 p-6 flex flex-col shadow-xl md:right-0 md:left-auto md:h-full md:w-full md:max-w-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Menu
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-slate-200 hover:text-white font-medium text-lg transition-colors"
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Button className="w-full bg-white text-slate-800 hover:bg-slate-200 font-semibold">
              Masuk
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
