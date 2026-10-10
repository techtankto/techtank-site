import { SectionNav } from "@/components/layout/section-nav";

const subMenu = [
  { name: "Media Kit", href: "/resources/media-kit" },
  { name: "Design System", href: "/resources/design-system" },
];

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Sticky Sub-Nav */}
      <SectionNav label="Resources pages" items={subMenu} />

      {/* Page Content */}
      {children}
    </div>
  );
}
