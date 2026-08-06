"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client, memoized as a singleton. The only client-
 * side auth surface in the app is the admin login form (send/verify
 * the email login code), so this is deliberately minimal.
 */
let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }
  return client;
}
