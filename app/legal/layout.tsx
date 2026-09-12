"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const legalDocs = [
  { name: "Code of Conduct", href: "/legal/code-of-conduct" },
  { name: "Terms of Service", href: "/legal/terms-of-service" },
  { name: "Privacy Policy", href: "/legal/privacy-policy" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-3">
            {/* Sub-navigation */}
            <div className="flex flex-wrap items-center justify-center gap-1">
              {legalDocs.map((doc) => {
                const isActive = pathname === doc.href;
                return (
                  <Button key={doc.href} variant="nav" size="sm" isActive={isActive} asChild>
                    <Link href={doc.href}>{doc.name}</Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:pb-16">
        <article className="prose prose-slate max-w-none">{children}</article>
      </div>
    </div>
  );
}
