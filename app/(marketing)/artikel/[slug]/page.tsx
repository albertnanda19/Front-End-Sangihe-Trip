"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  Menu,
  Mail,
  MapPin,
  ThumbsUp,
  Reply,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample article data
const article = {
  id: 1,
  title:
    "Panduan Lengkap Wisata Kepulauan Sangihe: Surga Tersembunyi di Ujung Utara Indonesia",
  slug: "panduan-lengkap-wisata-sangihe",
  category: "Panduan Wisata",
  author: {
    name: "Maria Sondakh",
    avatar: "/placeholder.svg?height=60&width=60",
    bio: "Travel writer dan fotografer yang telah menjelajahi Nusantara selama 10 tahun",
    fullBio:
      "Maria Sondakh adalah seorang travel writer dan fotografer profesional yang telah mengabdikan hidupnya untuk mengeksplorasi keindahan Indonesia. Lahir dan besar di Manado, ia memiliki passion khusus untuk memperkenalkan destinasi-destinasi tersembunyi di Indonesia Timur. Dengan pengalaman lebih dari 10 tahun di industri pariwisata, Maria telah menulis untuk berbagai publikasi travel terkemuka dan memenangkan beberapa penghargaan fotografi travel.",
    followers: "12.5k",
    articles: 47,
  },
  publishDate: "15 Desember 2024",
  readingTime: "12 menit",
  featuredImage: "/placeholder.svg?height=500&width=1200",
  tags: [
    "Wisata Alam",
    "Pantai",
    "Gunung",
    "Budaya",
    "Kuliner",
    "Indonesia Timur",
    "Sulawesi Utara",
  ],
  content: `
Kepulauan Sangihe, yang terletak di ujung utara Indonesia, adalah salah satu destinasi wisata tersembunyi yang menawarkan keindahan alam yang luar biasa. Dengan kombinasi pantai vulkanik yang unik, gunung berapi aktif, budaya lokal yang kaya, dan kuliner khas yang menggugah selera, Sangihe menjadi destinasi yang sempurna untuk traveler yang mencari pengalaman autentik.

## Mengapa Sangihe Layak Dikunjungi?

Kepulauan Sangihe terdiri dari beberapa pulau utama: Sangihe, Siau, dan Tagulandang. Setiap pulau memiliki karakteristik dan daya tarik tersendiri yang membuat perjalanan Anda semakin berkesan.

### Keunikan Alam Sangihe

Salah satu hal yang membuat Sangihe istimewa adalah pasir pantainya yang berwarna kehitaman akibat aktivitas vulkanik. Kontras antara pasir vulkanik dengan air laut yang jernih berwarna biru kehijauan menciptakan pemandangan yang sangat memukau dan berbeda dari pantai-pantai pada umumnya.

## Destinasi Wajib Dikunjungi

### 1. Pantai Mahoro - Keindahan Pasir Vulkanik

Pantai Mahoro adalah destinasi yang wajib dikunjungi saat berada di Sangihe. Dengan pasir vulkaniknya yang unik dan air laut yang jernih, pantai ini menawarkan pengalaman berenang dan snorkeling yang tak terlupakan.

**Fasilitas yang tersedia:**
- Area parkir yang luas
- Warung makan dengan menu lokal
- Penyewaan alat snorkeling
- Gazebo untuk bersantai

### 2. Gunung Api Karangetang - Petualangan Mendaki

Bagi Anda yang menyukai petualangan, Gunung Api Karangetang di Pulau Siau adalah pilihan yang tepat. Gunung berapi aktif ini menawarkan trek pendakian yang menantang dengan pemandangan yang spektakuler.

**Tips Mendaki:**
- Gunakan guide lokal yang berpengalaman
- Bawa perlengkapan mendaki yang lengkap
- Cek kondisi cuaca sebelum mendaki
- Mulai pendakian dini hari

### 3. Desa Adat Bowongkali - Wisata Budaya

Untuk mengenal budaya lokal Sangihe, kunjungi Desa Adat Bowongkali. Di sini Anda dapat menyaksikan rumah tradisional, upacara adat, dan berinteraksi langsung dengan masyarakat lokal.

## Kuliner Khas Sangihe

Perjalanan ke Sangihe tidak lengkap tanpa mencicipi kuliner khasnya. Beberapa makanan yang wajib dicoba:

### Ikan Bakar Rica-Rica
Ikan segar yang dibakar dengan bumbu rica-rica khas Manado, memberikan cita rasa pedas yang menggugah selera.

### Kelapa Muda Segar
Kelapa muda langsung dari pohon dengan air yang segar dan daging yang lembut, sempurna untuk menghilangkan dahaga di cuaca tropis.

### Pisang Goroho
Pisang khas Sulawesi Utara yang dapat diolah menjadi berbagai makanan, mulai dari pisang goreng hingga kolak.

## Tips Perjalanan ke Sangihe

### Transportasi
- **Pesawat**: Terbang dari Jakarta/Surabaya ke Manado, lalu lanjut dengan pesawat kecil ke Naha (Sangihe)
- **Kapal**: Dari Pelabuhan Bitung ke Pelabuhan Tahuna (perjalanan sekitar 6-8 jam)

### Akomodasi
Pilihan akomodasi di Sangihe cukup beragam, mulai dari homestay hingga hotel berbintang. Untuk pengalaman yang lebih autentik, cobalah menginap di homestay yang dikelola masyarakat lokal.

### Budget Estimasi
- **Budget backpacker**: Rp 300.000 - 500.000/hari
- **Budget mid-range**: Rp 500.000 - 1.000.000/hari
- **Budget luxury**: Rp 1.000.000+/hari

## Waktu Terbaik Berkunjung

Waktu terbaik untuk mengunjungi Sangihe adalah pada musim kemarau (April - Oktober) ketika cuaca cerah dan aktivitas outdoor dapat dilakukan dengan optimal. Hindari musim hujan (November - Maret) karena dapat mengganggu aktivitas wisata.

## Kesimpulan

Kepulauan Sangihe menawarkan pengalaman wisata yang lengkap dengan kombinasi alam, budaya, dan kuliner yang autentik. Meskipun masih belum banyak dikenal wisatawan, justru inilah yang membuat Sangihe menjadi destinasi yang istimewa dan layak untuk dijelajahi.

Jangan lewatkan kesempatan untuk mengeksplorasi surga tersembunyi ini sebelum menjadi terlalu ramai. Rencanakan perjalanan Anda sekarang dan rasakan keajaiban Kepulauan Sangihe!
  `,
};

const tableOfContents = [
  { id: "mengapa-sangihe", title: "Mengapa Sangihe Layak Dikunjungi?" },
  { id: "destinasi-wajib", title: "Destinasi Wajib Dikunjungi" },
  { id: "kuliner-khas", title: "Kuliner Khas Sangihe" },
  { id: "tips-perjalanan", title: "Tips Perjalanan ke Sangihe" },
  { id: "waktu-terbaik", title: "Waktu Terbaik Berkunjung" },
  { id: "kesimpulan", title: "Kesimpulan" },
];

const relatedArticles = [
  {
    id: 2,
    title: "10 Kuliner Khas Sangihe yang Wajib Dicoba",
    image: "/placeholder.svg?height=200&width=300",
    category: "Kuliner",
    readingTime: "8 menit",
  },
  {
    id: 3,
    title: "Tips Mendaki Gunung Karangetang dengan Aman",
    image: "/placeholder.svg?height=200&width=300",
    category: "Tips Perjalanan",
    readingTime: "15 menit",
  },
  {
    id: 4,
    title: "Budaya Unik Suku Sangihe: Tradisi yang Masih Lestari",
    image: "/placeholder.svg?height=200&width=300",
    category: "Budaya Lokal",
    readingTime: "10 menit",
  },
];

const comments = [
  {
    id: 1,
    user: {
      name: "Andi Traveler",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "2 hari yang lalu",
    content:
      "Artikel yang sangat informatif! Saya sudah pernah ke Sangihe dan memang benar-benar surga tersembunyi. Pantai Mahoro memang luar biasa indah.",
    likes: 12,
    replies: [
      {
        id: 11,
        user: {
          name: "Maria Sondakh",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        date: "1 hari yang lalu",
        content:
          "Terima kasih! Senang mendengar Anda sudah merasakan keindahan Sangihe. Semoga artikel ini bisa membantu traveler lain untuk mengeksplorasi destinasi ini.",
        likes: 5,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Sarah Explorer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "3 hari yang lalu",
    content:
      "Wah, jadi pengen banget ke Sangihe setelah baca artikel ini. Kira-kira budget 5 hari 4 malam berapa ya untuk 2 orang?",
    likes: 8,
    replies: [],
  },
];

export default function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [activeSection, setActiveSection] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");

  const shareArticle = (platform: string) => {
    const url = window.location.href;
    const text = `Baca artikel menarik: ${article.title}`;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${url}`
        );
        break;
      case "instagram":
        navigator.clipboard.writeText(`${text} ${url}`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as other pages */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                SANGIHETRIP
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/destinations"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Destinasi
              </Link>
              <Link
                href="#"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Rencana Perjalanan
              </Link>
              <Link
                href="/articles"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Artikel
              </Link>
              <Button
                variant="outline"
                className="border-sky-500 text-sky-600 hover:bg-sky-50"
              >
                Login
              </Button>
            </nav>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link href="/" className="hover:text-sky-600">
            Beranda
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/articles" className="hover:text-sky-600">
            Artikel
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium line-clamp-1">
            {article.title}
          </span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-8">
              {/* Featured Image */}
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={article.featuredImage || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Category & Title */}
              <Badge className="bg-sky-500 mb-4">{article.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Author & Meta Info */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={article.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {article.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {article.author.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {article.author.bio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600 md:ml-auto">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{article.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{article.readingTime}</span>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-sm text-slate-600">Bagikan:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle("facebook")}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle("twitter")}
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticle("instagram")}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-slate-700 leading-relaxed space-y-6">
                {article.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("##")) {
                    return (
                      <h2
                        key={index}
                        className="text-2xl font-bold text-slate-800 mt-8 mb-4"
                      >
                        {paragraph.replace("## ", "")}
                      </h2>
                    );
                  } else if (paragraph.startsWith("###")) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-semibold text-slate-800 mt-6 mb-3"
                      >
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  } else if (
                    paragraph.startsWith("**") &&
                    paragraph.endsWith("**")
                  ) {
                    return (
                      <div
                        key={index}
                        className="bg-sky-50 border-l-4 border-sky-500 p-4 my-6"
                      >
                        <p className="font-semibold text-sky-800">
                          {paragraph.replace(/\*\*/g, "")}
                        </p>
                      </div>
                    );
                  } else if (paragraph.includes("- **")) {
                    // Handle bullet points with bold headers
                    const lines = paragraph.split("\n");
                    return (
                      <ul key={index} className="space-y-2 ml-4">
                        {lines.map((line, lineIndex) => {
                          if (line.startsWith("- **")) {
                            const [title, ...rest] = line
                              .replace("- **", "")
                              .split("**:");
                            return (
                              <li key={lineIndex} className="list-disc">
                                <strong>{title}</strong>: {rest.join("")}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl p-6 text-white my-8">
                <h3 className="text-xl font-bold mb-3">
                  Siap Menjelajahi Sangihe?
                </h3>
                <p className="mb-4">
                  Rencanakan perjalanan Anda ke Kepulauan Sangihe sekarang dan
                  rasakan keajaiban surga tersembunyi ini!
                </p>
                <Button className="bg-white text-sky-600 hover:bg-white/90">
                  <MapPin className="w-4 h-4 mr-2" />
                  Lihat Destinasi Sangihe
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="hover:bg-sky-50 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Author Full Bio */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={article.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {article.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {article.author.name}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {article.author.fullBio}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span>{article.author.followers} followers</span>
                      <span>{article.author.articles} artikel</span>
                    </div>
                    <Button variant="outline">Follow</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">Baca Juga</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card
                    key={relatedArticle.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={relatedArticle.image || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-sky-500">
                        {relatedArticle.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h4>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {relatedArticle.readingTime}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Komentar ({comments.length})
              </h3>

              {/* Login Notice */}
              <Card className="mb-6 bg-sky-50 border-sky-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-sky-600" />
                    <div>
                      <p className="font-medium text-sky-800">
                        Ingin berkomentar?
                      </p>
                      <p className="text-sm text-sky-600">
                        <Link href="#" className="underline">
                          Login
                        </Link>{" "}
                        atau{" "}
                        <Link href="#" className="underline">
                          daftar
                        </Link>{" "}
                        untuk bergabung dalam diskusi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-slate-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={comment.user.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-semibold">{comment.user.name}</h5>
                          <span className="text-sm text-slate-500">
                            {comment.date}
                          </span>
                        </div>

                        <p className="text-slate-700 mb-3">{comment.content}</p>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-sky-600"
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-500 hover:text-sky-600"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Balas
                          </Button>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={
                                      reply.user.avatar || "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="text-xs">
                                    {reply.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h6 className="font-medium text-sm">
                                      {reply.user.name}
                                    </h6>
                                    <span className="text-xs text-slate-500">
                                      {reply.date}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-700 mb-2">
                                    {reply.content}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-slate-500 hover:text-sky-600"
                                  >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Daftar Isi</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      className="block w-full text-left text-sm text-slate-600 hover:text-sky-600 py-1"
                    >
                      {item.title}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Share Buttons */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan Artikel
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => shareArticle("facebook")}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => shareArticle("twitter")}
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => shareArticle("instagram")}
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </Button>
                </CardContent>
              </Card>

              {/* Author Bio */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage
                        src={article.author.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {article.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="font-semibold mb-2">
                      {article.author.name}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {article.author.bio}
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-slate-500 mb-3">
                      <span>{article.author.followers} followers</span>
                      <span>{article.author.articles} artikel</span>
                    </div>
                    <Button size="sm" className="w-full">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="bg-gradient-to-br from-sky-500 to-emerald-500 text-white">
                <CardHeader>
                  <h3 className="font-semibold flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Newsletter
                  </h3>
                  <p className="text-sky-100 text-sm">
                    Dapatkan artikel terbaru langsung di email Anda
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-sky-600 hover:bg-white/90">
                    Berlangganan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
