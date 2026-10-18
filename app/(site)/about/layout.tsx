import { SectionNav } from "@/components/layout/section-nav";

const subNav = [
  { name: "TechTank", href: "/about" },
  { name: "Team", href: "/about/team" },
  { name: "FAQ", href: "/about/faq" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SectionNav label="About pages" items={subNav} />

      {children}
    </div>
  );
}
