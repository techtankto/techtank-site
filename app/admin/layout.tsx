import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { signOutAdmin } from "./actions";

/**
 * Gate for the admin back office (server-side). The middleware already
 * bounces sessionless visitors on protected /admin paths to the login
 * page, so here:
 *   - no user  → render children bare (this is the /admin/login page).
 *   - user but not in `admins` → a "not authorized" screen with sign
 *     out (no redirect, so a stray non-admin account can't loop).
 *   - admin    → the back-office chrome around the page.
 * The SQL RPC gate is the real boundary; this is the UX layer.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  const { data: isAdmin } = await supabase.rpc("is_caller_admin");

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">Not authorized</h1>
        <p className="text-muted-foreground">This account doesn&rsquo;t have back-office access.</p>
        <form action={signOutAdmin}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/admin/tasks" className="font-display text-lg font-bold text-foreground">
            TechTank<span className="text-ring"> Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={signOutAdmin}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
