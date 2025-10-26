import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
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
                Platform terpercaya untuk merencanakan perjalanan wisata ke Kepulauan Sangihe.
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
                <li key="quick-tentang">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Tentang Kami
                  </Link>
                </li>
                <li key="quick-destinasi">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Destinasi
                  </Link>
                </li>
                <li key="quick-paket">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Paket Wisata
                  </Link>
                </li>
                <li key="quick-blog">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li key="support-faq">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li key="support-bantuan">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Bantuan
                  </Link>
                </li>
                <li key="support-privacy">
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li key="support-terms">
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
                  <span className="text-slate-300">Tahuna, Kepulauan Sangihe, Sulawesi Utara</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">© 2024 SANGIHETRIP. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer