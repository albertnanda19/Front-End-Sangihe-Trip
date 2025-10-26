import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_IMAGES } from "@/lib/constants/site";
import { ROUTES } from "@/lib/constants/routes";

interface DestinationCardProps {
  id: string;
  name: string;
  image?: string;
  category?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  price?: number | string;
  facilities?: string[];
  className?: string;
}

export function DestinationCard({ 
  id,
  name, 
  image, 
  category, 
  location,
  rating,
  reviews,
  price,
  className = "" 
}: DestinationCardProps) {
  const formattedPrice = typeof price === 'number' 
    ? `Rp ${price.toLocaleString('id-ID')}`
    : price;

  return (
    <Link href={ROUTES.destinationDetail(id)}>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 h-full group ${className}`}>
        <div className="relative h-48">
          <Image
            src={image || DEFAULT_IMAGES.defaultDestination}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {category && (
            <Badge className="absolute top-3 left-3 bg-sky-500">
              {category}
            </Badge>
          )}
          {rating && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {name}
          </h4>
          {location && (
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              {location}
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            {formattedPrice && (
              <span className="text-sky-600 font-semibold">{formattedPrice}</span>
            )}
            {reviews !== undefined && (
              <span className="text-xs text-slate-500">{reviews} ulasan</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
