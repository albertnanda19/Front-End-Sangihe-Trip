import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  variant?: "inline" | "vertical";
  showLabel?: boolean;
}

export function ShareButtons({ 
  url, 
  title, 
  description, 
  variant = "inline",
  showLabel = true 
}: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = description || `Baca artikel menarik: ${title}`;

  const handleShare = (platform: "facebook" | "twitter" | "instagram") => {
    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
          "width=600,height=400"
        );
        break;
      case "instagram":
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success("Link berhasil disalin! Paste ke Instagram Story/Post Anda.");
        break;
    }
  };

  if (variant === "vertical") {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleShare("facebook")}
        >
          <Facebook className="w-4 h-4 mr-2" />
          Facebook
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleShare("twitter")}
        >
          <Twitter className="w-4 h-4 mr-2" />
          Twitter
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleShare("instagram")}
        >
          <Instagram className="w-4 h-4 mr-2" />
          Instagram
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {showLabel && <span className="text-sm text-slate-600">Bagikan:</span>}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
      >
        <Twitter className="w-4 h-4 mr-2" />
        Twitter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare("instagram")}
      >
        <Instagram className="w-4 h-4 mr-2" />
        Instagram
      </Button>
    </div>
  );
}
