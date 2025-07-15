"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Image from "next/image";
import React from "react";

import type { ArticleData } from "@/hooks/use-landing-page";

interface Props {
  articles: ArticleData[];
}

const Articles: React.FC<Props> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Artikel Terbaru</h2>
          <p className="text-xl text-slate-600">
            Tips dan panduan perjalanan untuk pengalaman terbaik di Sangihe
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center text-slate-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(article.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;