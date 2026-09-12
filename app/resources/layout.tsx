"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const resourcesNav = [
  { name: "Media Kit", href: "/resources/media-kit" },
  { name: "Design System", href: "/resources/design-system" },
];

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      {/* Sticky Sub-Nav */}
      <nav
        aria-labelledby="resources-nav-name"
        className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <span id="resources-nav-name" className="sr-only">
          Resources pages
        </span>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            <div className="flex flex-wrap items-center justify-center gap-1">
              {resourcesNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button key={item.href} variant="nav" size="sm" isActive={isActive} asChild>
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
