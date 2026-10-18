import { SectionNav } from "@/components/layout/section-nav";

const subMenu = [
  { name: "Code of Conduct", href: "/legal/code-of-conduct" },
  { name: "Terms of Service", href: "/legal/terms-of-service" },
  { name: "Privacy Policy", href: "/legal/privacy-policy" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Sub-Nav */}
      <SectionNav label="Legal documents" items={subMenu} />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:pb-16">
        <article className="prose prose-slate max-w-none">{children}</article>
      </div>
    </div>
  );
}
