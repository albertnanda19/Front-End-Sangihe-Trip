import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGES } from "@/lib/constants/site";
import { ROUTES } from "@/lib/constants/routes";

interface ArticleCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  readingTime?: string;
  date?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  className?: string;
}

export function ArticleCard({ 
  slug,
  title, 
  excerpt,
  image, 
  category, 
  readingTime,
  date,
  author,
  className = "" 
}: ArticleCardProps) {
  return (
    <Link href={ROUTES.articleDetail(slug)}>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full ${className}`}>
        <div className="relative h-48">
          <Image
            src={image || DEFAULT_IMAGES.defaultArticle}
            alt={title}
            fill
            className="object-cover"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-sky-500">
              {category}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 line-clamp-2 hover:text-sky-600 transition-colors">
            {title}
          </h4>
          {excerpt && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{excerpt}</p>
          )}
          <div className="flex items-center justify-between text-sm text-slate-500">
            {readingTime && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {readingTime}
              </div>
            )}
            {date && (
              <span className="text-xs">{date}</span>
            )}
          </div>
          {author && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              {author.avatar && (
                <Image 
                  src={author.avatar} 
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-slate-600">{author.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
