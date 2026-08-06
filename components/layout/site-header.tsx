"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";

/**
 * The global marketing header, hidden on the admin back office. Admin
 * pages render their own header, and the login screen is deliberately
 * chrome-free, so the public nav never doubles up there.
 */
export function SiteHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Header />;
}
