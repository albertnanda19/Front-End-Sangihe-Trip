import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants/site";
import { ROUTES } from "@/lib/constants/routes";

interface SiteLogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SiteLogo({ showText = true, size = "md", className = "" }: SiteLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <Link href={ROUTES.home} className={`flex items-center space-x-2 ${className}`}>
      <div className={`${SITE_CONFIG.branding.logoGradient} rounded-lg flex items-center justify-center ${sizeClasses[size]}`}>
        <span className="text-white font-bold">{SITE_CONFIG.shortName}</span>
      </div>
      {showText && (
        <span className={`font-bold ${SITE_CONFIG.branding.textGradient} bg-clip-text text-transparent ${textSizeClasses[size]}`}>
          {SITE_CONFIG.name}
        </span>
      )}
    </Link>
  );
}
