import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Chrome for the public site: persistent header and footer around every
 * page. The admin back office is a sibling route group with its own
 * layout, so this no longer needs a pathname check to stay off `/admin`.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
