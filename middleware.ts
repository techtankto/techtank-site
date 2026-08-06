import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on the admin back office only. The public board and the rest
  // of the marketing site need no session handling.
  matcher: ["/admin/:path*"],
};
