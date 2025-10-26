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
  Star,
  ThumbsUp,
  Reply,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useArticleDetail } from "@/hooks/use-article-detail";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { Textarea } from "@/components/ui/textarea";

interface RelatedArticle {
  id: string;
  image?: string;
  title: string;
  category?: string;
  readingTime?: string;
  slug: string;
}

interface Comment {
  id: string;
  userName: string;
  userAvatar?: string;
  comment: string;
  content: string;
  date: string;
  helpful: number;
  likes: number;
  replies?: Comment[];
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, tableOfContents, relatedArticles, comments, loading, error } = useArticleDetail(slug);
  const isLoggedIn = useAuthStatus();
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    console.log({ rating, comment: newComment });
    setNewComment("");
    setRating(0);
  };

  const shareArticle = (platform: string) => {
    if (!article) return;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Memuat artikel...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-600">Artikel yang Anda cari tidak dapat ditemukan.</p>
          <Link href="/artikel" className="mt-4 inline-block text-sky-600 hover:underline">
            Kembali ke daftar artikel
          </Link>
        </div>
      </div>
    );
  }

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
                SANGIHE TRIP
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
                href="/destinasi"
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors"
              >
                Destinasi
              </Link>
              <Link
                href="/artikel"
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
          <Link href="/artikel" className="hover:text-sky-600">
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
              {article.featuredImage && (
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

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
                  {article.publishDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(article.publishDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{article.readingTime} menit</span>
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
            {article.tags && article.tags.length > 0 && (
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
            )}

            {/* Author Full Bio */}
            {article.author.fullBio && (
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
                        <span>{article.author.totalArticles} artikel</span>
                      </div>
                      <Button variant="outline">Follow</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Articles */}
            {relatedArticles && relatedArticles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Baca Juga</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(relatedArticles as RelatedArticle[]).map((relatedArticle) => (
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
            )}

            {/* Comments Section */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Komentar ({comments.length})
              </h3>

              {/* Login Notice */}
              {!isLoggedIn && (
                <Card className="mb-6 bg-sky-50 border-sky-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="font-medium text-sky-800">
                          Ingin berkomentar?
                        </p>
                        <p className="text-sm text-sky-600">
                          <Link href="/masuk" className="underline">
                            Login
                          </Link>{" "}
                          atau{" "}
                          <Link href="/daftar" className="underline">
                            daftar
                          </Link>{" "}
                          untuk bergabung dalam diskusi
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comment Form – hanya untuk pengguna login */}
              {isLoggedIn && (
                <Card className="mb-6 border-slate-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">Tulis Komentar &amp; Ulasan</h4>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      <span className="text-sm text-slate-600 mr-2">Rating:</span>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-5 h-5 cursor-pointer transition-colors ${
                            value <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                          }`}
                          onClick={() => setRating(value)}
                          fill={value <= rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>

                    {/* Textarea */}
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis komentar Anda..."
                      className="mb-4 min-h-[100px]"
                    />

                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                      Kirim Komentar
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Comments List */}
              {comments && comments.length > 0 ? (
                <div className="space-y-6">
                  {(comments as Comment[]).map((comment) => (
                    <div
                      key={comment.id}
                      className="border-b border-slate-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage
                            src={comment.userAvatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold">{comment.userName}</h5>
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
                                        reply.userAvatar || "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="text-xs">
                                      {reply.userName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h6 className="font-medium text-sm">
                                        {reply.userName}
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
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>Belum ada komentar untuk artikel ini.</p>
                  <p className="text-sm">Jadilah yang pertama berkomentar!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {tableOfContents && tableOfContents.length > 0 && (
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Daftar Isi</h3>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(tableOfContents as TocItem[]).map((item) => (
                      <button
                        key={item.id}
                        className="block w-full text-left text-sm text-slate-600 hover:text-sky-600 py-1"
                      >
                        {item.title}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

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
                    {article.author.bio && (
                      <p className="text-sm text-slate-600 mb-3">
                        {article.author.bio}
                      </p>
                    )}
                    <div className="flex justify-center gap-4 text-xs text-slate-500 mb-3">
                      <span>{article.author.followers} followers</span>
                      <span>{article.author.totalArticles} artikel</span>
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
