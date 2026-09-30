"use client";

import { Subnav } from "@/components/layout/subnav";

const subMenu = [
  { name: "Code of Conduct", href: "/legal/code-of-conduct" },
  { name: "Terms of Service", href: "/legal/terms-of-service" },
  { name: "Privacy Policy", href: "/legal/privacy-policy" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Sub-Nav */}
      <nav
        aria-labelledby="legal-nav-name"
        className="sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <span id="legal-nav-name" className="sr-only">
          Legal documents
        </span>
        <Subnav items={subMenu} />
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:pb-16">
        <article className="prose prose-slate max-w-none">{children}</article>
      </div>
    </div>
  );
}
