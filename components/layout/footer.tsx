import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SITE_CONFIG, FOOTER_LINKS } from '@/lib/constants/site'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 ${SITE_CONFIG.branding.logoGradient} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold">{SITE_CONFIG.shortName}</span>
                </div>
                <span className="text-xl font-bold">{SITE_CONFIG.fullName}</span>
              </div>
              <p className="text-slate-300 mb-4">
                {SITE_CONFIG.description}
              </p>
              <div className="flex space-x-4">
                <a href={SITE_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href={SITE_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </a>
                <a href={SITE_CONFIG.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">{SITE_CONFIG.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="text-slate-300">{SITE_CONFIG.contact.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-1" />
                  <span className="text-slate-300">{SITE_CONFIG.contact.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">{SITE_CONFIG.footer.copyright}</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer