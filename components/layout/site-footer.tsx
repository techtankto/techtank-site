"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

/**
 * The global footer, hidden on the admin back office (including the
 * login page). Those screens have their own focused chrome, and
 * dropping the marketing footer lets the login card center cleanly in
 * the space below the header.
 */
export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Footer />;
}
