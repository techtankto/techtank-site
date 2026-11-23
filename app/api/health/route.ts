import { NextResponse } from "next/server";
import { createStaticClient } from "@/utils/supabase/static";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;

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
