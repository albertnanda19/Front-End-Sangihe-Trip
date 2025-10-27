import { usePathname } from "next/navigation";

export interface AdminNavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/beranda" },
  { label: "Users", href: "/admin/users" },
  { label: "Destinations", href: "/admin/destinations" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Analytics", href: "/admin/analytics" },
];

export function useAdminNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/beranda";
    }
    return pathname.startsWith(href);
  };

  const getActiveItem = () => {
    return ADMIN_NAV_ITEMS.find(item => isActive(item.href));
  };

  return {
    navItems: ADMIN_NAV_ITEMS,
    isActive,
    getActiveItem,
    currentPath: pathname,
  };
}