"use client";

import { Subnav } from "@/components/layout/subnav";

const subNav = [
  { name: "TechTank", href: "/about" },
  { name: "Team", href: "/about/team" },
  { name: "FAQ", href: "/about/faq" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <nav
        aria-labelledby="about-nav-name"
        className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <span id="about-nav-name" className="sr-only">
          About pages
        </span>
        <Subnav items={subNav} />
      </nav>

      {children}
    </div>
  );
}
