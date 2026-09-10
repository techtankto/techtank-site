"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const subNav = [
  { name: "Overview", href: "/get-involved" },
  { name: "Speak or Facilitate", href: "/get-involved/speak-or-facilitate" },
  { name: "Host", href: "/get-involved/host" },
  { name: "Sponsor", href: "/get-involved/sponsor" },
  { name: "Organizer Team", href: "/get-involved/organizer" },
  { name: "Donate", href: "/donate" },
];

export default function GetInvolvedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Sticky Sub-Nav */}
      <nav className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            {/* Sub-navigation */}
            <div className="flex flex-wrap items-center justify-center gap-1">
              {subNav.map((item) => {
                const isActive =
                  item.href === "/get-involved" ? pathname === "/get-involved" : pathname.startsWith(item.href);

                return (
                  <Button key={item.name} variant="nav" size="sm" isActive={isActive} asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
