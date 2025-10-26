import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm text-slate-600 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-sky-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium line-clamp-1">
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
        </div>
      ))}
    </nav>
  );
}
