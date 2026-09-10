"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const subNav = [
  { name: "TechTank", href: "/about" },
  { name: "Team", href: "/about/team" },
  { name: "FAQ", href: "/about/faq" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <nav
        aria-labelledby="about-nav-name"
        className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <span id="about-nav-name" className="sr-only">
          About pages
        </span>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            <div className="flex flex-wrap items-center justify-center gap-1">
              {subNav.map((item) => {
                const isActive = item.href === "/about" ? pathname === "/about" : pathname.startsWith(item.href);

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

      {children}
    </div>
  );
}
