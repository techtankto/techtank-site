import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";
/** Where a signed-in admin belongs. Keep in sync with the route under
 * `app/admin/` — a stale value here sends admins to a 404. */
const ADMIN_HOME = "/admin/tasks";

/** Everything under /admin except the login page requires a session. */
function isProtectedAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin") && pathname !== LOGIN_PATH;
}

/**
 * Refresh the Supabase session on every request and guard the admin
 * back office:
 *   - no session on a protected /admin path → redirect to /admin/login
 *   - a live session on /admin/login → bounce to the board
 * Admin *membership* (the `admins` table) is enforced by the RPC gate
 * and re-checked in the admin layout; this only checks "is there a
 * signed-in user".
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refresh session — do NOT remove this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedAdminPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_HOME;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
