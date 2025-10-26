import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEFAULT_IMAGES } from "@/lib/constants/site";

interface AuthorInfo {
  name: string;
  avatar?: string;
  bio?: string;
  fullBio?: string;
  followers?: number;
  totalArticles?: number;
}

interface AuthorCardProps {
  author: AuthorInfo;
  variant?: "compact" | "full";
  showFollowButton?: boolean;
  className?: string;
}

export function AuthorCard({ 
  author, 
  variant = "compact",
  showFollowButton = true,
  className = "" 
}: AuthorCardProps) {
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={author.avatar || DEFAULT_IMAGES.defaultAvatar} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-slate-800">{author.name}</h3>
          {author.bio && (
            <p className="text-sm text-slate-600">{author.bio}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={author.avatar || DEFAULT_IMAGES.defaultAvatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{author.name}</h3>
            {author.fullBio && (
              <p className="text-slate-600 mb-4">{author.fullBio}</p>
            )}
            {(author.followers !== undefined || author.totalArticles !== undefined) && (
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                {author.followers !== undefined && <span>{author.followers} followers</span>}
                {author.totalArticles !== undefined && <span>{author.totalArticles} artikel</span>}
              </div>
            )}
            {showFollowButton && (
              <Button variant="outline">Follow</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sidebar variant for author bio
export function AuthorCardSidebar({ author, showFollowButton = true }: AuthorCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src={author.avatar || DEFAULT_IMAGES.defaultAvatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h4 className="font-semibold mb-2">{author.name}</h4>
          {author.bio && (
            <p className="text-sm text-slate-600 mb-3">{author.bio}</p>
          )}
          {(author.followers !== undefined || author.totalArticles !== undefined) && (
            <div className="flex justify-center gap-4 text-xs text-slate-500 mb-3">
              {author.followers !== undefined && <span>{author.followers} followers</span>}
              {author.totalArticles !== undefined && <span>{author.totalArticles} artikel</span>}
            </div>
          )}
          {showFollowButton && (
            <Button size="sm" className="w-full">Follow</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
