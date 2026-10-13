import { SectionNav } from "@/components/layout/section-nav";

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
      <SectionNav label="Get involved pages" items={subMenu} />

      {/* Page Content */}
      {children}
    </div>
  );
}
