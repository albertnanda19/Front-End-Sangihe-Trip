export const SITE_CONFIG = {
  name: "SANGIHE TRIP",
  shortName: "S",
  fullName: "SANGIHETRIP",
  description: "Platform terpercaya untuk merencanakan perjalanan wisata ke Kepulauan Sangihe",
  tagline: "Jelajahi Keindahan Kepulauan Sangihe",
  url: "https://sangihetrip.com",
  
  contact: {
    phone: "+62 812-3456-7890",
    email: "info@sangihetrip.com",
    address: "Tahuna, Kepulauan Sangihe, Sulawesi Utara"
  },
  
  social: {
    facebook: "https://facebook.com/sangihetrip",
    instagram: "https://instagram.com/sangihetrip",
    twitter: "https://twitter.com/sangihetrip"
  },
  
  branding: {
    logoGradient: "bg-gradient-to-br from-sky-500 to-emerald-500",
    textGradient: "bg-gradient-to-r from-sky-600 to-emerald-600",
    primaryColor: "sky-600",
    secondaryColor: "emerald-600"
  },
  
  footer: {
    copyright: `© ${new Date().getFullYear()} SANGIHETRIP. All rights reserved.`
  }
} as const;

export const DEFAULT_IMAGES = {
  placeholder: "/placeholder.svg",
  defaultAvatar: "/placeholder.svg",
  defaultDestination: "/placeholder.svg",
  defaultArticle: "/placeholder.svg",
  logo: "/images/logo.png"
} as const;

export const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Destinasi", href: "/destinasi" },
  { label: "Artikel", href: "/artikel" }
] as const;

export const FOOTER_LINKS = {
  quickLinks: [
    { label: "Tentang Kami", href: "#" },
    { label: "Destinasi", href: "/destinasi" },
    { label: "Paket Wisata", href: "#" },
    { label: "Blog", href: "/artikel" }
  ],
  support: [
    { label: "FAQ", href: "#" },
    { label: "Bantuan", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" }
  ]
} as const;
