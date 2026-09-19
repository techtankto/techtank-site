"use client";

import { Subnav } from "@/components/layout/subnav";

const subMenu = [
  { name: "Overview", href: "/get-involved" },
  { name: "Speak or Facilitate", href: "/get-involved/speak-or-facilitate" },
  { name: "Host", href: "/get-involved/host" },
  { name: "Sponsor", href: "/get-involved/sponsor" },
  { name: "Organizer Team", href: "/get-involved/organizer" },
  { name: "Donate", href: "/donate" },
];

export default function GetInvolvedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Sticky Sub-Nav */}
      <nav
        aria-labelledby="get-involved-nav-name"
        className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <span id="get-involved-nav-name" className="sr-only">
          Get involved pages
        </span>
        <Subnav items={subMenu} />
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
