import { createClient } from "@supabase/supabase-js";

/**
 * Anon Supabase client with no cookies or session, for public board
 * reads (the `get_public_contribution_task(s)` RPCs). RLS + the
 * SECURITY DEFINER read functions keep this safe for anonymous use.
 */
export function createStaticClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
