"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/proposals", icon: "📄", label: "Proposals" },
  { href: "/proposals/new", icon: "➕", label: "New" },
  { href: "/clients", icon: "👥", label: "Clients" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-[#1e1e2e] bg-[#12121e] flex items-center justify-around z-40 safe-area-pb">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-2 text-xs transition-colors ${
              isActive ? "text-gold" : "text-[#888890]"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
