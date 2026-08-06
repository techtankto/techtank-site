import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cookie-authenticated Supabase client for Server Components and
 * Server Actions. Carries the caller's admin session so the admin
 * RPCs run with their identity. `setAll` is wrapped in try/catch
 * because Server Components can't write cookies — the middleware
 * handles token refresh, so it's safe to ignore there.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Read-only in Server Components — middleware handles refreshes.
        }
      },
    },
  });
}
