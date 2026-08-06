import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Client that acts as the calling user by forwarding their JWT, so
 * `auth.uid()` inside SECURITY DEFINER functions is the real caller.
 * Preferred over the service role: authorisation stays in SQL instead
 * of being re-implemented (and eventually mis-implemented) here.
 */
export function createCallerClient(authHeader: string) {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });
}
