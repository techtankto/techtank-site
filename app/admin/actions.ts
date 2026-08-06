"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function signOutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
