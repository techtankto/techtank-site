import { NextResponse } from "next/server";
import { createStaticClient } from "@/utils/supabase/static";

// Always hit Postgres on request so edge/CDN caching never masks an outage or
// skips the database activity needed to keep the free-tier project awake.
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

/**
 * Lightweight database health check used by the scheduled keepalive workflow.
 * Runs an anonymous single-column read against `contribution_tasks` and returns
 * only `{ ok }` so internal database details are never exposed to callers.
 */
export async function GET() {
  try {
    const supabase = createStaticClient();
    const { error } = await supabase.from("contribution_tasks").select("id").limit(1);

    if (error) {
      console.error("GET /api/health failed:", error.message);
      return NextResponse.json({ ok: false }, { status: 503, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("GET /api/health threw:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ ok: false }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
