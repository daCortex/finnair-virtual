"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/crew", label: "Dashboard" },
  { href: "/crew/applications", label: "Applications" },
  { href: "/crew/pilots", label: "Pilots" },
  { href: "/crew/pireps", label: "PIREPs" },
  { href: "/crew/flights", label: "Flights" },
  { href: "/crew/stats", label: "Stats" },
  { href: "/crew/loa", label: "LOA" },
  { href: "/crew/reports", label: "Reports" },
  { href: "/crew/news", label: "News" },
];

export function CrewTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 border-b border-obsidian/40 px-6 lg:px-10">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`relative px-4 py-3 text-sm transition-colors ${
              active ? "text-cream" : "text-cream-faint hover:text-cream-dim"
            }`}
          >
            {t.label}
            {active && (
              <span className="absolute bottom-0 left-2 right-2 h-px bg-gold-soft" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
