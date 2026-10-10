"use client";

import { Subnav } from "@/components/layout/subnav";

const subMenu = [
  { name: "Media Kit", href: "/resources/media-kit" },
  { name: "Design System", href: "/resources/design-system" },
];

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
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
        <Subnav items={subMenu} />
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
